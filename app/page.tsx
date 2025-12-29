'use client'

import { TopNavbar, ChartSection, StatsPanel, UsersTable } from '@/app/components'
import { useEffect, useMemo, useState } from 'react'
import { Selection } from '@heroui/react'
import { apiServices } from '@services'
import { UserLeaveReport } from '@types'

export default function Home() {
  const [userData, setUserData] = useState<UserLeaveReport[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sortedUserData = useMemo(() => {
    return [...userData].sort((a, b) => a.user.name.localeCompare(b.user.name))
  }, [userData])

  const selectedUser = useMemo(() => {
    if (sortedUserData.length === 0) return undefined

    // If no selection yet, default to the first sorted item
    if (!selectedUserId) return sortedUserData[0]
    return sortedUserData.find((u) => u.id === selectedUserId) || sortedUserData[0]
  }, [sortedUserData, selectedUserId])

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
      setSelectedUserId(String(selectedValue))
    }
  }

  return (
    <div className="flex h-full flex-col gap-8 overflow-hidden">
      <TopNavbar />
      <div className="grid shrink-0 grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSection selectedUserInfo={selectedUser} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <StatsPanel userInfo={selectedUser} isLoading={isLoading} />
        </div>
      </div>

      <UsersTable
        isLoading={isLoading}
        sortedUserInfo={sortedUserData}
        selectedUserId={selectedUser?.id || null}
        selectUser={handleSelectionChange}
      />
    </div>
  )
}
