'use client'

import { Card, CardBody, Divider, Progress } from '@heroui/react'

export function StatsPanel() {
  return (
    <Card shadow="none" className="h-100">
      <CardBody className="p-6">
        {/* Top Stats */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <div className="bg-primary h-3 w-3 rounded-full" />
              WISE
            </span>
            <span className="font-bold">$4,532.19</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-default-500">Groceries</span>
            <span className="font-bold">$55.00</span>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center justify-between">
            <span className="text-default-500">Feb 17, 2024</span>
            <span className="text-lg font-bold">Projected</span>
          </div>
        </div>

        {/* Accounts List */}
        <div>
          <h3 className="mb-4 font-semibold">Select Accounts</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Cash & Checking</span>
                <span>80%</span>
              </div>
              <Progress value={80} color="primary" size="sm" aria-label="Cash & Checking" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Real Estate</span>
                <span>45%</span>
              </div>
              <Progress value={45} color="warning" size="sm" aria-label="Real Estate" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
