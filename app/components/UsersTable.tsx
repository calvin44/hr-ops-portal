'use client'

import { Card, CardBody, Chip, ChipProps, Selection } from '@heroui/react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useMounted } from '@customHooks'
import { PageFade } from '@components'

// --- Types & Constants ---
type ChipColor = NonNullable<ChipProps['color']>
const CHIP_COLORS: ChipColor[] = ['primary', 'secondary', 'success', 'warning']

interface UserInfo {
  name: string
  leaveType: string[]
  totalHours: string
  email: string
  manager: string
}

interface UsersTableProps {
  userInfo: UserInfo[]
  selectUser: (keys: Selection) => void
  selectedUserIndex: number | null
}

export const UsersTable: React.FC<UsersTableProps> = ({
  userInfo,
  selectUser,
  selectedUserIndex,
}) => {
  const mounted = useMounted()
  if (!mounted) return null

  const getChipColor = (index: number): ChipColor => {
    return CHIP_COLORS[index % CHIP_COLORS.length]
  }

  // --- Grid Column Definitions ---
  // We use CSS Grid to ensure columns align perfectly like a table
  // Adjust '1.5fr', '1fr' etc. based on your content width needs
  const gridTemplate = 'grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr]'
  const headerClass = `grid ${gridTemplate} px-4 py-3 text-small text-default-500 font-semibold bg-white sticky top-0 z-20`
  const rowClass = `grid ${gridTemplate} px-4 py-3 relative z-10 items-center`

  return (
    <PageFade className="flex h-full min-h-0 flex-col">
      <Card shadow="none" className="h-full border-none p-6">
        {/* Header Section */}
        <div className="border-default-100 mb-2 flex shrink-0 items-center justify-between border-b p-3">
          <h1 className="text-2xl font-bold">Employee Lists</h1>
        </div>

        <CardBody className="relative h-full overflow-hidden p-0">
          <div className="h-full overflow-y-auto">
            {/* 1. The Table Header (Now a Grid Div) */}
            <div className={headerClass}>
              <span>Name</span>
              <span>Email</span>
              <span>Manager</span>
              <span>Total Hours</span>
              <span>Leave Type</span>
            </div>

            {/* 2. The Body (Divs instead of Tr) */}
            <div className="flex flex-col gap-1 pb-4">
              <AnimatePresence>
                {userInfo.map((item, index) => {
                  const isSelected = selectedUserIndex === index

                  return (
                    <div
                      key={index}
                      onClick={() => selectUser(new Set([String(index)]))}
                      className="group relative cursor-pointer outline-none"
                      role="button"
                      tabIndex={0}
                    >
                      {/* --- THE MAGIC GLIDING BACKGROUND --- */}
                      {isSelected && (
                        <motion.div
                          layoutId="active-row-highlight"
                          className="bg-primary/10 absolute inset-0 rounded-xl"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* The Row Content */}
                      <div className={rowClass}>
                        <span className="text-default-500 truncate font-medium">{item.name}</span>
                        <span className="text-default-400 text-small truncate">{item.email}</span>
                        <span className="text-default-400 text-small truncate">{item.manager}</span>
                        <span className="text-small font-bold">{item.totalHours}</span>

                        <div className="flex flex-wrap gap-1">
                          {item.leaveType.map((leave, i) => (
                            <Chip size="sm" variant="flat" color={getChipColor(i)} key={i}>
                              {leave}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </CardBody>
      </Card>
    </PageFade>
  )
}
