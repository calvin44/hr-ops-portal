// components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Listbox, ListboxItem } from '@heroui/react'
import { LayoutDashboard, Mail, LogOut, Bell, Users } from 'lucide-react'
import { ROUTES } from '@config'
import { useAuth } from '@context'

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const iconClasses =
    'w-5 h-5 text-default-500 group-data-[hover=true]:text-foreground transition-colors'

  return (
    <aside className="rounded-portal flex h-full w-72 flex-col justify-between overflow-hidden bg-white px-4 py-8">
      <div>
        <Link
          href={ROUTES.home}
          className="mb-10 flex cursor-pointer items-center gap-3 px-4 text-inherit transition-opacity hover:opacity-80"
        >
          <div className="bg-primary shadow-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">HR Portal</span>
        </Link>

        <h1 className="text-default-400 pb-4 pl-4 text-[10px] font-black tracking-[0.2em] uppercase">
          Main Menu
        </h1>

        <Listbox
          aria-label="Main Menu"
          variant="flat"
          color="primary"
          // Use 'rounded-xl' for items because they are nested.
          // Inner items should always have a smaller radius than the parent container.
          itemClasses={{
            base: 'px-4 h-12 rounded-xl gap-4 mb-2 data-[hover=true]:bg-primary/5 transition-all',
            title: 'text-sm font-bold text-default-600 group-data-[hover=true]:text-primary',
          }}
        >
          <ListboxItem
            key="home"
            href={ROUTES.home}
            as={Link}
            className={pathname === ROUTES.home ? 'bg-primary/10' : ''}
            startContent={
              <LayoutDashboard
                className={pathname === ROUTES.home ? 'text-primary h-5 w-5' : iconClasses}
              />
            }
          >
            <span className={pathname === ROUTES.home ? 'text-primary font-bold' : ''}>
              Dashboard
            </span>
          </ListboxItem>

          <ListboxItem
            key="emails"
            href={ROUTES.emails}
            as={Link}
            className={pathname === ROUTES.emails ? 'bg-primary/10' : ''}
            startContent={
              <Mail className={pathname === ROUTES.emails ? 'text-primary h-5 w-5' : iconClasses} />
            }
          >
            <span className={pathname === ROUTES.emails ? 'text-primary font-bold' : ''}>
              Mail Users
            </span>
          </ListboxItem>

          <ListboxItem
            key="users"
            href={ROUTES.users}
            as={Link}
            className={pathname === ROUTES.users ? 'bg-primary/10' : ''}
            startContent={
              <Users className={pathname === ROUTES.users ? 'text-primary h-5 w-5' : iconClasses} />
            }
          >
            <span className={pathname === ROUTES.users ? 'text-primary font-bold' : ''}>Users</span>
          </ListboxItem>
        </Listbox>
      </div>

      <div className="px-2">
        <Listbox variant="flat" aria-label="Utility Menu">
          <ListboxItem
            key="logout"
            className="group text-danger hover:bg-danger-50 h-12 rounded-xl transition-colors"
            color="danger"
            onPress={logout}
            startContent={<LogOut className="text-danger h-5 w-5" />}
          >
            <span className="font-bold">Log Out</span>
          </ListboxItem>
        </Listbox>
      </div>
    </aside>
  )
}
