'use client'

import { Card, CardHeader, CardBody, User, Button, Chip, Skeleton, Progress } from '@heroui/react'
import { Send, Check, RotateCcw, Mails, Inbox } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { apiServices } from '@services'
import { UserLeaveReport } from '@types'

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0 },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}

export default function EmailsPage() {
  const [userData, setUserData] = useState<UserLeaveReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sendingIds, setSendingIds] = useState<Set<string>>(new Set())
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [isSendingAll, setIsSendingAll] = useState(false)

  /**
   * Browser Guard
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSendingAll) {
        e.preventDefault()
        return ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isSendingAll])

  /**
   * Data Initialization (Fixed Double Fetch)
   */
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await apiServices.getLeaveData()

        // Only update state if the component is still mounted
        if (isMounted) {
          const sortedData = [...data].sort((a, b) => a.user.name.localeCompare(b.user.name))
          setUserData(sortedData)
        }
      } catch (err) {
        if (isMounted) console.error('Fetch Error:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()

    // Cleanup function sets flag to false when effect re-runs or component unmounts
    return () => {
      isMounted = false
    }
  }, [])

  /**
   * Single Email Logic
   */
  const handleSendMail = async (report: UserLeaveReport) => {
    if (sentIds.has(report.id) || sendingIds.has(report.id)) return

    setSendingIds((prev) => new Set(prev).add(report.id))

    try {
      await apiServices.sendLeaveMail(report)
      setSentIds((prev) => new Set(prev).add(report.id))
    } catch (err) {
      console.error('Send Error:', err)
    } finally {
      setSendingIds((prev) => {
        const next = new Set(prev)
        next.delete(report.id)
        return next
      })
    }
  }

  /**
   * Batch Send Logic
   */
  const handleSendAll = async () => {
    setIsSendingAll(true)
    const pendingReports = userData.filter((report) => !sentIds.has(report.id))

    for (const report of pendingReports) {
      await handleSendMail(report)
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    setIsSendingAll(false)
  }

  const batchProgress = useMemo(
    () => (userData.length > 0 ? (sentIds.size / userData.length) * 100 : 0),
    [sentIds.size, userData.length]
  )

  return (
    <Card className="rounded-portal h-full w-full border-none bg-white" shadow="none">
      <CardHeader className="flex flex-col items-start gap-4 px-8 pt-8 pb-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Email Dispatch</h1>
            <p className="text-default-400 text-xs font-medium">
              Manage and monitor employee leave notifications
            </p>
          </div>

          <div className="flex items-center gap-3">
            {sentIds.size > 0 && !isSendingAll && (
              <Button
                variant="flat"
                size="sm"
                onPress={() => setSentIds(new Set())}
                startContent={<RotateCcw className="h-3 w-3" />}
                className="font-bold"
              >
                Reset Status
              </Button>
            )}

            <Button
              color="primary"
              onPress={handleSendAll}
              isLoading={isSendingAll}
              isDisabled={isLoading || userData.length === 0 || sentIds.size === userData.length}
              startContent={!isSendingAll && <Mails className="h-4 w-4" />}
              className="shadow-primary/20 h-12 rounded-xl px-6 font-bold shadow-lg"
            >
              {sentIds.size === userData.length
                ? 'All Delivered'
                : sentIds.size > 0
                  ? `Send Remaining (${userData.length - sentIds.size})`
                  : 'Send Batch'}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isSendingAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full pt-2"
            >
              <Progress
                value={batchProgress}
                color="primary"
                size="sm"
                radius="full"
                label={`Progress: ${sentIds.size} / ${userData.length} sent`}
                className="max-w-full"
                classNames={{
                  label: 'text-tiny font-bold text-primary uppercase tracking-wider',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardBody className="gap-3 overflow-y-auto px-8 pb-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-3"
            >
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} disableAnimation className="h-20 w-full rounded-2xl" />
              ))}
            </motion.div>
          ) : userData.length > 0 ? (
            <motion.div
              key="data-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {userData.map((report) => {
                const isSent = sentIds.has(report.id)
                const isSending = sendingIds.has(report.id)

                return (
                  <motion.div key={report.id} variants={itemVariants}>
                    <Card
                      shadow="none"
                      className={`transition-all duration-300 ${
                        isSent ? 'bg-success-50/20 opacity-80' : 'bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                        <User
                          name={report.user.name}
                          description={report.user.email}
                          avatarProps={{
                            showFallback: true,
                            name: report.user.name,
                            color: isSent ? 'success' : 'primary',
                            className: 'font-bold',
                          }}
                        />

                        <div className="flex items-center gap-4">
                          {isSent && (
                            <Chip
                              color="success"
                              variant="flat"
                              size="sm"
                              startContent={<Check className="h-3 w-3" />}
                              className="text-success-600 border-none font-bold"
                            >
                              Sent
                            </Chip>
                          )}

                          <Button
                            size="md"
                            variant={isSent ? 'light' : 'flat'}
                            color={isSent ? 'success' : 'primary'}
                            className="rounded-xl font-bold"
                            isLoading={isSending}
                            isDisabled={isSent || isSendingAll}
                            onPress={() => handleSendMail(report)}
                            startContent={
                              isSent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />
                            }
                          >
                            {isSent ? 'Delivered' : 'Send Mail'}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-default-50 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <Inbox className="text-default-300 h-10 w-10" />
              </div>
              <h3 className="text-default-700 text-lg font-bold">All caught up!</h3>
              <p className="text-default-400 text-sm">No leave reports pending action.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  )
}
