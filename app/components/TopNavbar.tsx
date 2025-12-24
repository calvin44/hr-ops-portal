'use client'

import { Card, User } from '@heroui/react'

export function TopNavbar() {
  return (
    // changed flex-col to flex-row and added items-center
    <Card
      shadow="none"
      className="sticky top-0 z-50 w-full flex-row items-center justify-between px-6 py-8"
    >
      {/* LEFT SECTION: Title or Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* TODO: Replace name with username */}
        <p className="text-default-500 text-sm">Welcome back, Jane</p>
      </div>

      {/* RIGHT SECTION: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <User
          avatarProps={{
            isBordered: true,
            src: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            size: 'md',
          }}
          className="cursor-pointer"
          classNames={{
            // 1. Controls the gap between Avatar and Text
            base: 'gap-4 transition-transform hover:opacity-80',

            // 2. Your text sizing from before
            name: 'text-lg font-bold',
            description: 'text-sm font-medium text-default-500',
          }}
          description="Admin"
          name="Jane Doe"
        />
      </div>
    </Card>
  )
}
