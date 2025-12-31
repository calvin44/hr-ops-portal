'use client'

import { Card, CardBody, Selection, Skeleton } from '@heroui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserLeaveReport } from '@types'

interface UsersTableProps {
  sortedUserInfo: UserLeaveReport[]
  selectUser: (keys: Selection) => void
  selectedUserId: string | null
  isLoading: boolean
}

export const UsersTable: React.FC<UsersTableProps> = ({
  sortedUserInfo,
  selectUser,
  selectedUserId,
  isLoading,
}) => {
  const gridTemplate = 'grid-cols-[0.8fr_2fr_1.5fr_1fr_1fr_1fr]'
  const minWidth = 'min-w-[950px]'

  return (
    // Updated to match the Sidebar: bg-white, shadow-xl, no border
    <Card shadow="none" className="rounded-portal h-full overflow-hidden bg-white">
      <div className="flex shrink-0 items-center justify-between px-8 py-6">
        <h1 className="text-xl font-bold text-slate-800">Employee Management</h1>
        <span className="text-tiny text-primary bg-primary/10 rounded-full px-3 py-1 font-bold">
          {sortedUserInfo.length} Members
        </span>
      </div>

      <CardBody className="relative h-full overflow-hidden p-0">
        {/* We add 'isolate' here to create a new stacking context for animations */}
        <div className="isolate h-full overflow-x-auto overflow-y-auto">
          {/* Sticky Header: Increased z-index and removed border for a cleaner look */}
          <div
            className={`grid ${gridTemplate} ${minWidth} text-default-400 sticky top-0 z-30 bg-white/90 px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md`}
          >
            <span>Staff ID</span>
            <span>Name</span>
            <span>Chinese Name</span>
            <span>Service (Y)</span>
            <span>Annual (D)</span>
            <span>Sick (D)</span>
          </div>

          <div className="flex flex-col px-4 pb-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`grid ${gridTemplate} ${minWidth} items-center gap-4 px-4 py-4`}
                    >
                      <Skeleton className="h-4 w-12 rounded" />
                      <Skeleton className="h-4 w-40 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-4 w-8 rounded" />
                      <Skeleton className="h-4 w-8 rounded" />
                      <Skeleton className="h-4 w-8 rounded" />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="data-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  // This ensures the layout animations are scoped to this container
                  layout
                >
                  {sortedUserInfo.map((item) => {
                    const isSelected = selectedUserId === item.id

                    return (
                      <div
                        key={item.id}
                        onClick={() => selectUser(new Set([item.id]))}
                        className="group relative mb-1 cursor-pointer outline-none"
                      >
                        {/* THE FIX: We use a simpler transition for the highlight 
                            to prevent it from jittering during scroll 
                        */}
                        {isSelected && (
                          <motion.div
                            layoutId="active-row-bg"
                            className="bg-primary/10 absolute inset-0 z-0 rounded-2xl"
                            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          />
                        )}

                        <div
                          className={`grid ${gridTemplate} ${minWidth} relative z-10 items-center px-4 py-4 transition-all duration-200 ${
                            isSelected ? 'translate-x-1' : ''
                          }`}
                        >
                          <span className="text-default-400 font-mono text-xs">
                            {item.user.staffId}
                          </span>
                          <span className="text-sm font-bold text-slate-700">{item.user.name}</span>
                          <span className="text-default-500 text-sm">
                            {item.user.chineseName || '—'}
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {item.user.yearsOfService}
                          </span>
                          <span className="text-primary text-sm font-bold">
                            {item.user.annualLeaveQuota}
                          </span>
                          <span className="text-warning text-sm font-bold">
                            {item.user.sickLeaveQuota}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
