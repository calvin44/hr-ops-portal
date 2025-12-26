'use client'

import { Card, CardBody, Snippet } from '@heroui/react'
import { UserLeaveReport } from '@types'

interface ChartSectionProps {
  selectedUserInfo: UserLeaveReport
}
export const ChartSection: React.FC<ChartSectionProps> = ({ selectedUserInfo }) => {
  return (
    <Card shadow="none" className="h-100">
      <CardBody className="flex h-full flex-col p-6">
        <div className="mb-2 flex items-center justify-between py-2">
          <h1 className="text-2xl font-bold">Leave Summary Graph</h1>
        </div>

        {/* TODO: Replace with real data chart */}
        <div className="bg-default-50/50 dark:bg-default-100/20 border-default-200 flex h-full w-full flex-1 items-center justify-center rounded-2xl border-2 border-dashed py-3">
          <div className="text-default-400 flex flex-col items-center text-center">
            <Snippet
              hideSymbol
              variant="bordered"
              classNames={{
                pre: 'whitespace-pre-wrap text-left',
              }}
            >
              {JSON.stringify(selectedUserInfo, null, 2)}
            </Snippet>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
