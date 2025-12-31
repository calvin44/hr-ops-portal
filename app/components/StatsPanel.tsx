'use client'

import {
  Card,
  CardBody,
  Progress,
  Skeleton,
  Chip,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserLeaveReport } from '@types'
import { useMemo } from 'react'
import { AlertCircle, ChevronRight, PieChart } from 'lucide-react'

interface StatsPanelProps {
  userInfo?: UserLeaveReport
  isLoading: boolean
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ userInfo, isLoading }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const stats = useMemo(() => {
    if (!userInfo) return null

    const getQuotaStats = (type: 'Annual Leave' | 'Sick Leave', quotaDays: number) => {
      const total = quotaDays * 8
      const remainder = userInfo.stats.remainder[type] || 0
      const used = total - remainder
      return {
        used,
        total,
        percentage: total > 0 ? (used / total) * 100 : 0,
        isOver: remainder < 0,
      }
    }

    const otherEntries = Object.entries(userInfo.stats.leaveTaken)
      .filter(([key, value]) => key !== 'Annual Leave' && key !== 'Sick Leave' && value > 0)
      .map(([name, hours]) => ({ name, hours }))

    return {
      totalLeaveTaken: Object.values(userInfo.stats.leaveTaken).reduce((a, b) => a + b, 0),
      annual: getQuotaStats('Annual Leave', userInfo.user.annualLeaveQuota),
      sick: getQuotaStats('Sick Leave', userInfo.user.sickLeaveQuota),
      others: otherEntries,
      otherTotal: otherEntries.reduce((sum, item) => sum + item.hours, 0),
    }
  }, [userInfo])

  const showSkeleton = isLoading || !userInfo || !stats

  return (
    <>
      <Card shadow="none" className="border-divider h-dashboard-card overflow-hidden">
        <CardBody className="flex flex-col p-8">
          {/* Section 1: Header Summary */}
          <div className="mb-8 shrink-0">
            <div className="mb-1 flex items-center gap-2">
              <PieChart size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-slate-800">Leave Stats</h2>
            </div>
            <p className="text-tiny text-default-400 mb-6 font-black tracking-[0.2em] uppercase">
              Overview
            </p>

            <div className="bg-primary/5 border-primary/10 flex items-center justify-between rounded-2xl border p-4">
              <span className="text-default-600 text-small font-bold">Total Hours Taken</span>
              {showSkeleton ? (
                <Skeleton className="h-8 w-20 rounded-lg" />
              ) : (
                <div className="flex flex-col items-end">
                  <span className="text-primary text-2xl font-black">{stats.totalLeaveTaken}h</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Quota Utilization Progress */}
          <div className="flex-1 space-y-8">
            {[
              { label: 'Annual Leave', data: stats?.annual, color: 'primary' },
              { label: 'Sick Leave', data: stats?.sick, color: 'warning' },
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex items-end justify-between px-1">
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <span className="text-tiny text-default-400 font-mono font-bold">
                    {showSkeleton ? '-- / --' : `${item.data?.used} / ${item.data?.total} hrs`}
                  </span>
                </div>
                <Progress
                  size="md"
                  radius="full"
                  value={showSkeleton ? 0 : Math.min(item.data?.percentage || 0, 100)}
                  // If quota is exceeded, force color to Danger (Red)
                  color={!showSkeleton && item.data?.isOver ? 'danger' : (item.color as any)}
                  className="h-2.5 shadow-inner"
                />
                {!showSkeleton && item.data?.isOver && (
                  <div className="text-danger flex animate-pulse items-center gap-1 px-1 text-[10px] font-bold">
                    <AlertCircle size={10} /> Quota Exceeded
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Section 3: Non-Quota Breakdown Toggle */}
          <div className="border-divider mt-auto border-t pt-6">
            <Button
              onPress={onOpen}
              isDisabled={showSkeleton || stats.others.length === 0}
              variant="flat"
              fullWidth
              className="text-default-700 bg-default-100 hover:bg-default-200 h-12 rounded-xl font-bold transition-colors"
              endContent={<ChevronRight size={16} />}
            >
              Other Leaves ({stats?.otherTotal || 0}h)
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Drill-down Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        motionProps={{
          variants: {
            enter: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
            exit: { y: 20, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
          },
        }}
      >
        <ModalContent className="rounded-portal">
          {(_) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-8 pt-8">
                <h2 className="text-2xl font-black">Breakdown</h2>
                <p className="text-tiny text-default-400 font-bold tracking-widest uppercase">
                  Non-quota records for {userInfo?.user.name}
                </p>
              </ModalHeader>
              <ModalBody className="px-8 pb-10">
                <div className="space-y-3">
                  <AnimatePresence>
                    {stats?.others.map((leave, index) => (
                      <motion.div
                        key={leave.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-divider flex items-center justify-between rounded-2xl border bg-slate-50 p-4"
                      >
                        <span className="text-sm font-bold text-slate-700">{leave.name}</span>
                        <Chip variant="flat" color="primary" size="sm" className="px-2 font-black">
                          {leave.hours} hrs
                        </Chip>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
