'use client'

import { TopNavbar, ChartSection, StatsPanel, UsersTable } from '@/app/components'
import { useState } from 'react'
import { Selection } from '@heroui/react'

export default function Home() {
  const mockData = [
    {
      name: 'Tony Reichert',
      email: 'tony@example.com',
      manager: 'Jane',
      totalHours: '120',
      leaveType: ['Sick', 'WFH', 'Other'],
    },
    {
      name: 'Zoey Lang',
      email: 'zoey@example.com',
      manager: 'Tony',
      totalHours: '150',
      leaveType: ['Sick', 'WFH', 'Annual'],
    },
    {
      name: 'Jane Fisher',
      email: 'jane@example.com',
      manager: 'Zoey',
      totalHours: '100',
      leaveType: ['Annual'],
    },
    {
      name: 'Jane Fisher',
      email: 'jane@example.com',
      manager: 'Zoey',
      totalHours: '100',
      leaveType: ['Annual'],
    },
    {
      name: 'Jane Fisher',
      email: 'jane@example.com',
      manager: 'Zoey',
      totalHours: '100',
      leaveType: ['Annual'],
    },
    {
      name: 'Jane Fisher',
      email: 'jane@example.com',
      manager: 'Zoey',
      totalHours: '100',
      leaveType: ['Annual'],
    },
    {
      name: 'Jane Fisher',
      email: 'jane@example.com',
      manager: 'Zoey',
      totalHours: '100',
      leaveType: ['Annual'],
    },
  ]

  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const handleSelectionChange = (keys: Selection) => {
    // Hero ui will return data in set
    if (!(keys instanceof Set)) return

    // Handle change - valid data
    const selectedValue = Array.from(keys)[0]
    if (selectedValue) {
      setSelectedIndex(Number(selectedValue))
    }
  }

  return (
    <div className="flex h-full flex-col gap-8">
      <TopNavbar />

      <div className="grid shrink-0 grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSection selectedUserInfo={mockData[selectedIndex]} />
        </div>

        <div className="lg:col-span-1">
          <StatsPanel />
        </div>
      </div>

      <UsersTable
        userInfo={mockData}
        selectedUserIndex={selectedIndex}
        selectUser={handleSelectionChange}
      />
    </div>
  )
}
