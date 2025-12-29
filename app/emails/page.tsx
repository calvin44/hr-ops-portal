'use client'

import { Card, CardHeader, CardBody, User, Button, Chip, Skeleton } from '@heroui/react'
import { MailPlus, Send, Check, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { apiServices } from '@services'
import { UserLeaveReport } from '@types'

export default function EmailsPage() {
  const [userData, setUserData] = useState<UserLeaveReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [isSendingAll, setIsSendingAll] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await apiServices.getLeaveData()
        const sortedData = [...data].sort((a, b) => a.user.name.localeCompare(b.user.name))
        setUserData(sortedData)
      } catch (err) {
        console.error('Fetch Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // 2. Updated Send Handler with UI feedback
  const handleSendMail = async (reportId: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setSentIds((prev) => {
      const next = new Set(prev)
      next.add(reportId)
      return next
    })
  }

  const handleSendAll = async () => {
    setIsSendingAll(true)
    for (const report of userData) {
      if (!sentIds.has(report.id)) {
        await handleSendMail(report.id)
      }
    }
    setIsSendingAll(false)
  }

  return (
    <Card className="h-full w-full" shadow="none">
      <CardHeader className="flex items-center justify-between px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex gap-2">
          {sentIds.size > 0 && (
            <Button
              variant="light"
              size="sm"
              onPress={() => setSentIds(new Set())}
              startContent={<RotateCcw className="h-3 w-3" />}
            >
              Reset
            </Button>
          )}
          <Button
            color="primary"
            onPress={handleSendAll}
            isLoading={isSendingAll}
            isDisabled={isLoading || userData.length === 0 || sentIds.size === userData.length}
            startContent={!isSendingAll && <MailPlus className="h-4 w-4" />}
          >
            {sentIds.size === userData.length ? 'All Sent' : 'Send All Mail'}
          </Button>
        </div>
      </CardHeader>

      <CardBody className="gap-3 p-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} shadow="none" className="border-default-200 w-full rounded-xl p-4">
              <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar Skeleton */}
                  <Skeleton className="flex h-10 w-10 rounded-full" />

                  <div className="flex flex-col gap-2">
                    {/* Name Skeleton */}
                    <Skeleton className="h-3 w-32 rounded-lg" />
                    {/* Email/Description Skeleton */}
                    <Skeleton className="h-2 w-48 rounded-lg" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Staff ID Skeleton */}
                  <Skeleton className="h-3 w-16 rounded-lg" />
                  {/* Button Skeleton */}
                  <Skeleton className="h-10 w-28 rounded-xl" />
                </div>
              </CardBody>
            </Card>
          ))
        ) : userData.length > 0 ? (
          userData.map((report) => {
            const isSent = sentIds.has(report.id)

            return (
              <Card
                key={report.id}
                shadow="none"
                className={`border-default-200 w-full rounded-xl border-1 transition-all duration-300 ${
                  isSent
                    ? 'bg-success-50/30 border-success-200 opacity-80'
                    : 'hover:border-primary-200 bg-slate-50/50'
                }`}
              >
                <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <User
                      name={report.user.name}
                      description={report.user.email}
                      avatarProps={{
                        showFallback: true,
                        name: report.user.name,
                        color: isSent ? 'success' : 'default',
                        className: `font-bold uppercase shrink-0 transition-colors ${
                          isSent
                            ? 'bg-success-100 text-success-600'
                            : 'bg-primary-100 text-primary-600'
                        }`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    {isSent && (
                      <Chip
                        color="success"
                        variant="flat"
                        size="sm"
                        startContent={<Check className="h-3 w-3" />}
                        className="border-none font-medium"
                      >
                        Sent
                      </Chip>
                    )}

                    <Button
                      size="md"
                      variant={isSent ? 'light' : 'flat'}
                      color={isSent ? 'success' : 'primary'}
                      className="font-bold"
                      onPress={() => handleSendMail(report.id)}
                      isDisabled={isSent}
                      startContent={
                        isSent ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />
                      }
                    >
                      {isSent ? 'Delivered' : 'Send Mail'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )
          })
        ) : (
          <div className="border-default-100 text-default-300 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed italic">
            No employee records found
          </div>
        )}
      </CardBody>
    </Card>
  )
}
