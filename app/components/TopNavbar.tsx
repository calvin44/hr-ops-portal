'use client'

import { Card, User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { useAuth } from '@context'
import { LogOut, UserCircle } from 'lucide-react'

export function TopNavbar() {
  const { user, logout } = useAuth()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin'

  return (
    <Card shadow="none" className="w-full flex-row items-center justify-between px-6 py-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Portal Overview</h1>
        <p className="text-default-500 text-xs font-medium">
          Logged in as{' '}
          <span className="text-primary decoration-primary/30 font-bold underline underline-offset-4">
            {displayName}
          </span>
        </p>
      </div>

      <Dropdown placement="bottom-end" backdrop="blur">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: user?.photoURL || undefined,
              name: displayName.charAt(0).toUpperCase(),
              color: 'primary',
              size: 'sm',
            }}
            className="transition-transform hover:opacity-80"
            classNames={{
              name: 'text-sm font-bold',
              description: 'text-[10px] font-bold text-default-400 uppercase tracking-widest',
            }}
            description="Administrator"
            name={displayName}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" startContent={<UserCircle size={16} />}>
            My Account
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            className="text-danger"
            startContent={<LogOut size={16} />}
            onPress={logout}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Card>
  )
}
