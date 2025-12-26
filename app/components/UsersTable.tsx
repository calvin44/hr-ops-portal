'use client'

import { useMemo } from 'react'
import { Card, CardBody, Selection, Skeleton } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMounted } from '@customHooks'
import { PageFade } from '@components'
import { UserLeaveReport } from '@types'

interface UsersTableProps {
  userInfo: UserLeaveReport[]
  selectUser: (keys: Selection) => void
  selectedUserIndex: number | null
  isLoading: boolean
}

export const UsersTable: React.FC<UsersTableProps> = ({
  userInfo,
  selectUser,
  selectedUserIndex,
  isLoading,
}) => {
  const mounted = useMounted()

  const gridTemplate = 'grid-cols-[1fr_2fr_1.5fr_1fr_1.5fr_1.5fr]'
  const minWidth = 'min-w-[900px]' // Added to prevent stacking

  const sortedUserInfo = useMemo(() => {
    return [...userInfo].sort((a, b) => a.user.name.localeCompare(b.user.name))
  }, [userInfo])

  if (!mounted) return null

  return (
    <PageFade className="flex h-full min-h-0 flex-col">
      <Card shadow="none" className="h-full border-none p-6">
        <div className="border-default-100 mb-2 flex shrink-0 items-center justify-between border-b p-3">
          <h1 className="text-2xl font-bold">Employee Lists</h1>
        </div>

        <CardBody className="relative h-full overflow-hidden p-0">
          <div className="h-full overflow-x-auto overflow-y-auto">
            {/* 1. Header (Always visible for context) */}
            <div
              className={`grid ${gridTemplate} ${minWidth} text-small text-default-500 sticky top-0 z-20 bg-white px-4 py-3 font-semibold`}
            >
              <span>Staff Id</span>
              <span>Name</span>
              <span>Chinese Name</span>
              <span>Years of Services</span>
              <span>Annual Leave</span>
              <span>Sick Leave</span>
            </div>

            <div className="flex flex-col gap-1 pb-4">
              {isLoading ? (
                /* 2. Skeleton Rows */
                [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`grid ${gridTemplate} ${minWidth} items-center px-4 py-3`}
                  >
                    <Skeleton className="h-4 w-12 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-lg" />
                    <Skeleton className="h-4 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-8 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-lg" />
                    <Skeleton className="h-4 w-12 rounded-lg" />
                  </div>
                ))
              ) : sortedUserInfo.length === 0 ? (
                /* 3. Empty State */
                <div className="text-default-400 py-20 text-center">No employees found.</div>
              ) : (
                /* 4. Data Rows */
                <AnimatePresence>
                  {sortedUserInfo.map((item, index) => {
                    const isSelected = selectedUserIndex === index

                    return (
                      <div
                        key={item.user.staffId} // Use ID as key, not index
                        onClick={() => selectUser(new Set([String(index)]))}
                        className="group relative cursor-pointer outline-none"
                        role="button"
                        tabIndex={0}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="active-row-highlight"
                            className="bg-primary/10 absolute inset-0 z-0 rounded-xl"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}

                        <div
                          className={`grid ${gridTemplate} ${minWidth} relative z-10 items-center px-4 py-3`}
                        >
                          <span className="text-default-500 truncate font-medium">
                            {item.user.staffId}
                          </span>
                          <span className="text-small text-default-400 truncate">
                            {item.user.name}
                          </span>
                          <span className="text-small text-default-400 truncate">
                            {item.user.chineseName}
                          </span>
                          <span className="text-small font-bold">{item.user.yearsOfService}</span>
                          <span className="text-small font-bold">{item.user.annualLeaveQuota}</span>
                          <span className="text-small font-bold">{item.user.sickLeaveQuota}</span>
                        </div>
                      </div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </PageFade>
  )
}
