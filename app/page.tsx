'use client'

import { TopNavbar, ChartSection, StatsPanel, UsersTable } from '@/app/components'
import { useEffect, useState } from 'react'
import { Selection } from '@heroui/react'
import { apiServices } from '@services'
import { UserLeaveReport } from '@types'

export default function Home() {
  const [userData, setUserData] = useState<UserLeaveReport[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await apiServices.getLeaveData()
        setUserData(data)
      } catch (err) {
        console.error('Fetch Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSelectionChange = (keys: Selection) => {
    if (!(keys instanceof Set)) return
    const selectedValue = Array.from(keys)[0]
    if (selectedValue !== undefined) {
      setSelectedIndex(Number(selectedValue))
    }
  }

  return (
    <div className="flex h-full flex-col gap-8 overflow-hidden">
      <TopNavbar />

      <div className="grid shrink-0 grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* We pass a fallback or null if data is still loading */}
          <ChartSection selectedUserInfo={userData[selectedIndex]} />
        </div>

        <div className="lg:col-span-1">
          <StatsPanel />
        </div>
      </div>

      <UsersTable
        isLoading={isLoading}
        userInfo={userData}
        selectedUserIndex={selectedIndex}
        selectUser={handleSelectionChange}
      />
    </div>
  )
}
