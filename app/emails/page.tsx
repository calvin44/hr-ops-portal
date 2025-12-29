'use client'

import { Card, CardHeader, CardBody, User, Button, Skeleton } from '@heroui/react'
import { MailPlus, Send } from 'lucide-react'
import { PageFade } from '@components'
import { useEffect, useState } from 'react'
import { apiServices } from '@services'
import { UserLeaveReport } from '@types'

export default function EmailsPage() {
  const [userData, setUserData] = useState<UserLeaveReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await apiServices.getLeaveData()
        const sortedData = [...data].sort((a, b) => a.user.name.localeCompare(b.user.name))
        setUserData(sortedData)
      } catch (err) {
        console.error('Fetch Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSendMail = (user: UserLeaveReport['user']) => {
    console.log(`Sending report to ${user.email}...`)
  }

  const handleSendAll = () => {
    console.log(`Batch sending to ${userData.length} members...`)
  }

  return (
    <PageFade>
      <Card className="h-full w-full" shadow="none">
        <CardHeader className="flex items-center justify-between px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button
            color="primary"
            onPress={handleSendAll}
            isDisabled={isLoading || userData.length === 0}
            startContent={<MailPlus className="h-4 w-4" />}
          >
            Send All Mail
          </Button>
        </CardHeader>

        <CardBody className="gap-3 p-6">
          {isLoading ? (
            // Render 4 skeleton cards while loading
            [...Array(4)].map((_, i) => (
              <Card key={i} shadow="none" className="border-default-200 w-full rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="flex h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-32 rounded-lg" />
                      <Skeleton className="h-3 w-48 rounded-lg" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
              </Card>
            ))
          ) : userData.length > 0 ? (
            userData.map((report) => (
              <Card
                key={report.id}
                shadow="none"
                className="border-default-200 hover:border-primary-200 w-full rounded-xl border-1 bg-slate-50/50 transition-colors"
              >
                <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <User
                      name={report.user.name}
                      description={report.user.email}
                      avatarProps={{
                        showFallback: true,
                        name: report.user.name,
                        color: 'default',
                        className: 'bg-primary-100 text-primary-600 font-bold uppercase shrink-0',
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-tiny text-default-400 font-mono">
                      ID: {report.user.staffId}
                    </span>
                    <Button
                      size="md"
                      variant="flat"
                      color="primary"
                      className="font-bold"
                      onPress={() => handleSendMail(report.user)}
                      startContent={<Send className="h-4 w-4" />}
                    >
                      Send Mail
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <div className="border-default-100 text-default-300 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed italic">
              No employee records found
            </div>
          )}
        </CardBody>
      </Card>
    </PageFade>
  )
}
