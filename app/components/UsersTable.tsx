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
  /**
   * Layout Constants
   * We use a fixed grid template to ensure columns align perfectly
   * between the header and the data rows.
   */
  const gridTemplate = 'grid-cols-[0.8fr_2fr_1.5fr_1fr_1fr_1fr]'
  const minWidth = 'min-w-[950px]'

  return (
    <Card shadow="none" className="h-full overflow-hidden rounded-2xl p-0">
      {/* Table Title and Metadata Summary */}
      <div className="flex shrink-0 items-center justify-between px-6 py-4">
        <h1 className="text-default-800 text-xl font-bold">Employee Management</h1>
        <span className="text-tiny text-default-400 bg-default-100 rounded px-2 py-1 font-mono">
          {sortedUserInfo.length} Members
        </span>
      </div>

      <CardBody className="relative h-full overflow-hidden p-0">
        <div className="h-full overflow-x-auto overflow-y-auto">
          {/* Sticky Header: backdrop-blur provides a premium feel during scroll */}
          <div
            className={`grid ${gridTemplate} ${minWidth} text-tiny text-default-500 sticky top-0 z-20 bg-white/80 px-6 py-3 font-bold tracking-wider uppercase backdrop-blur-md`}
          >
            <span>Staff ID</span>
            <span>Name</span>
            <span>Chinese Name</span>
            <span>Service (Y)</span>
            <span>Annual (D)</span>
            <span>Sick (D)</span>
          </div>

          <div className="flex flex-col px-2 py-2">
            {/* AnimatePresence (mode="wait") orchestrates the smooth cross-fade 
                between the Skeleton state and the actual Data state.
            */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`grid ${gridTemplate} ${minWidth} items-center px-4 py-4`}
                    >
                      <Skeleton className="h-4 w-12 rounded-md" />
                      <Skeleton className="h-4 w-40 rounded-md" />
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-4 w-8 rounded-md" />
                      <Skeleton className="h-4 w-8 rounded-md" />
                      <Skeleton className="h-4 w-8 rounded-md" />
                    </div>
                  ))}
                </motion.div>
              ) : sortedUserInfo.length === 0 ? (
                <motion.div
                  key="empty-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-default-400 flex flex-col items-center gap-2 py-32 text-center"
                >
                  <p className="text-medium text-default-300 font-medium">No records found</p>
                </motion.div>
              ) : (
                <motion.div
                  key="data-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Inner AnimatePresence (initial={false}) allows row re-ordering 
                      to animate without a "flash" on the first mount.
                  */}
                  <AnimatePresence mode="popLayout" initial={false}>
                    {sortedUserInfo.map((item) => {
                      const isSelected = selectedUserId === item.id

                      return (
                        <div
                          key={item.id}
                          onClick={() => selectUser(new Set([item.id]))}
                          className="group relative mb-1 cursor-pointer outline-none"
                          role="button"
                          tabIndex={0}
                        >
                          {/* Row Background: Selection vs Hover logic */}
                          <div
                            className={`absolute inset-0 rounded-xl transition-colors duration-200 ${
                              isSelected ? 'bg-primary/10' : 'group-hover:bg-default-100/50'
                            }`}
                          />

                          {/* layoutId Spring: This enables the "sliding" effect 
                              where the highlight moves smoothly between rows.
                          */}
                          {isSelected && (
                            <motion.div
                              layoutId="active-row-highlight"
                              className="absolute inset-0 z-0 rounded-xl shadow-sm"
                              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            />
                          )}

                          <div
                            className={`grid ${gridTemplate} ${minWidth} relative z-10 items-center px-4 py-4 transition-transform active:scale-[0.995]`}
                          >
                            <span className="text-default-400 font-mono text-xs">
                              {item.user.staffId}
                            </span>
                            <span className="text-small text-default-700 font-semibold">
                              {item.user.name}
                            </span>
                            <span className="text-small text-default-500">
                              {item.user.chineseName || '—'}
                            </span>
                            <span className="text-small text-default-600 font-medium">
                              {item.user.yearsOfService}
                            </span>
                            <span className="text-small text-primary-600 font-bold">
                              {item.user.annualLeaveQuota}
                            </span>
                            <span className="text-small text-warning-600 font-bold">
                              {item.user.sickLeaveQuota}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
