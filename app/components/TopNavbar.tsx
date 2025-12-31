'use client'

import { Card, User } from '@heroui/react'
import { useAuth } from '@context'

export function TopNavbar() {
  const { user } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin'

  return (
    <Card shadow="none" className="w-full flex-row items-center justify-between px-6 py-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Portal Overview</h1>
        <p className="text-default-500 text-xs font-medium">
          Logged in as{' '}
          <span className="text-primary decoration-primary/30 font-bold underline underline-offset-4">
            {displayName}
          </span>
        </p>
      </div>

      <User
        as="button"
        avatarProps={{
          isBordered: true,
          src: user?.photoURL || undefined,
          name: displayName.charAt(0).toUpperCase(),
          color: 'primary',
          size: 'sm',
        }}
        classNames={{
          name: 'text-sm font-bold',
          description: 'text-[10px] font-bold text-default-400 uppercase tracking-widest',
        }}
        description="Administrator"
        name={displayName}
      />
    </Card>
  )
}
