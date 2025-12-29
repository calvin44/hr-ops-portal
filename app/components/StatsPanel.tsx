'use client'

import {
  Card,
  CardBody,
  Divider,
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
import { UserLeaveReport } from '@types'
import { useMemo } from 'react'

interface StatsPanelProps {
  userInfo?: UserLeaveReport
  isLoading: boolean
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ userInfo, isLoading }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const stats = useMemo(() => {
    if (!userInfo) return null

    /**
     * Helper to transform raw leave hours into quota utilization metrics.
     * Logic assumes 8-hour work days for quota conversion.
     */
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

    /**
     * Filters and maps leave types that do not have a defined quota (e.g. Compassionate).
     * Only displays types that have been utilized (> 0 hours).
     */
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
      {/* Container has a fixed height (h-120) to maintain visual 
          alignment with the adjacent ChartSection across all user selections. 
      */}
      <Card shadow="none" className="border-default-200 h-120 overflow-hidden rounded-2xl">
        <CardBody className="flex flex-col p-6">
          {/* Summary Header */}
          <div className="mb-6 shrink-0">
            <h1 className="mb-4 text-2xl font-bold">Leave Stats</h1>
            <div className="flex items-center justify-between">
              <span className="text-default-500 text-small font-medium">Total Taken</span>
              {showSkeleton ? (
                <Skeleton className="h-7 w-20 rounded-lg" />
              ) : (
                <span className="text-primary text-xl font-bold">{stats.totalLeaveTaken} hrs</span>
              )}
            </div>
            <Divider className="mt-4 opacity-50" />
          </div>

          {/* Core Quota Bars: Fixed to the top section of the card */}
          <div className="mb-8 shrink-0 space-y-6">
            <h3 className="text-default-400 text-tiny font-bold tracking-widest uppercase">
              Utilization
            </h3>
            {[
              { label: 'Annual Leave', data: stats?.annual, color: 'primary' },
              { label: 'Sick Leave', data: stats?.sick, color: 'warning' },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-small flex justify-between font-semibold">
                  <span>{item.label}</span>
                  <span className="text-tiny text-default-400 font-mono">
                    {showSkeleton ? '--/--' : `${item.data?.used}/${item.data?.total}`}
                  </span>
                </div>
                <Progress
                  size="md"
                  radius="sm"
                  value={showSkeleton ? 0 : Math.min(item.data?.percentage || 0, 100)}
                  color={!showSkeleton && item.data?.isOver ? 'danger' : (item.color as any)}
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {/* Non-Quota Summary Footer: Pushed to the bottom using mt-auto 
              to ensure consistent button placement. 
          */}
          <div className="mt-auto flex flex-col gap-4">
            <div className="bg-default-50 border-default-100 rounded-2xl border-1 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-default-700 text-sm font-bold">Other Leaves</h4>
                  <p className="text-tiny text-default-400">Non-quota accumulated hours</p>
                </div>
                {showSkeleton ? (
                  <Skeleton className="h-8 w-12 rounded-lg" />
                ) : (
                  <span className="text-default-600 text-lg font-black">{stats.otherTotal}h</span>
                )}
              </div>
            </div>

            <Button
              onPress={onOpen}
              isDisabled={showSkeleton || stats.others.length === 0}
              variant="flat"
              fullWidth
              className="text-default-600 font-bold"
            >
              View Breakdown
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Detailed drill-down for non-quota leave types */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="center"
        className="max-w-md"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl">Leave Breakdown</h2>
                <p className="text-tiny text-default-400 font-normal">
                  Details for {userInfo?.user.name}
                </p>
              </ModalHeader>
              <ModalBody className="pb-8">
                <div className="space-y-3">
                  {stats?.others.map((leave) => (
                    <div
                      key={leave.name}
                      className="bg-default-50 border-default-100 flex items-center justify-between rounded-xl border-1 p-4"
                    >
                      <span className="text-small text-default-700 font-bold">{leave.name}</span>
                      <Chip variant="shadow" color="primary" size="sm" className="font-bold">
                        {leave.hours} hrs
                      </Chip>
                    </div>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
