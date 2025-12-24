'use client'

import { Card, CardHeader, CardBody, User, Button } from '@heroui/react'
import { MailPlus, Send } from 'lucide-react'
import { PageFade } from '@components'

const emails = [
  {
    id: 1,
    name: 'Tony Reichert',
    subject: 'Project Update: HeroUI',
    time: '2m ago',
    status: 'unread',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: 2,
    name: 'Zoey Lang',
    subject: 'Design System Meeting',
    time: '1h ago',
    status: 'read',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 3,
    name: 'Jane Fisher',
    subject: 'Lunch on Friday?',
    time: '3h ago',
    status: 'read',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
  },
  {
    id: 4,
    name: 'William Howard',
    subject: 'New feature request',
    time: '1d ago',
    status: 'read',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026024d',
  },
]

export default function EmailsPage() {
  return (
    <PageFade>
      <Card className="h-full w-full" shadow="none">
        <CardHeader className="flex items-center justify-between px-6 pt-6 pb-2">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Button color="primary" startContent={<MailPlus className="h-4 w-4" />}>
            Send All Mail
          </Button>
        </CardHeader>
        <CardBody className="gap-3 p-6">
          {emails.map((email) => (
            <Card shadow="none" className={'border-default-200 w-full rounded-xl bg-slate-50'}>
              <CardBody className="flex flex-row items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-4">
                  <User
                    name={email.name}
                    description={email.subject}
                    avatarProps={{
                      src: email.avatar,
                    }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-small text-default-400">{email.time}</span>
                  <Button
                    size="lg"
                    variant="flat"
                    color="primary"
                    startContent={<Send className="h-4 w-4" />}
                  >
                    Send Mail
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    </PageFade>
  )
}
