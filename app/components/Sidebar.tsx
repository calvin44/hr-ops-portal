'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Listbox, ListboxItem } from '@heroui/react'
import { LayoutDashboard, Mail, LogOut, Bell } from 'lucide-react'
import { ROUTES } from '@config'

export function Sidebar() {
  const pathname = usePathname() // Get current route (e.g., "/emails")

  const iconClasses =
    'w-5 h-5 text-default-500 group-data-[hover=true]:text-foreground transition-colors'

  return (
    <aside className="bg-background flex h-full w-72 flex-col justify-between rounded-2xl px-4 py-6">
      {/* TOP SECTION */}
      <div>
        <Link
          href={ROUTES.home}
          className="mb-8 flex cursor-pointer items-center gap-3 px-2 text-inherit transition-opacity hover:opacity-80"
        >
          <div className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg">
            <Bell />
          </div>
          <span className="text-medium font-bold">Leave Dashboard</span>
        </Link>

        <h1 className="pb-2 pl-2 text-slate-400">Features</h1>
        <Listbox
          aria-label="Main Menu"
          variant="flat"
          color="primary"
          itemClasses={{
            base: 'px-3 h-11 rounded-medium gap-3 mb-1 data-[hover=true]:bg-default-100/80 transition-all',
            title:
              'text-small font-medium text-default-600 group-data-[hover=true]:text-foreground',
          }}
        >
          {/* HOME LINK */}
          <ListboxItem
            key="home"
            aria-label="Home Navigation"
            href="/"
            as={Link}
            className={pathname === ROUTES.home ? 'bg-primary/10 text-primary' : ''}
            startContent={
              <LayoutDashboard
                className={pathname === ROUTES.home ? 'text-primary h-5 w-5' : iconClasses}
              />
            }
          >
            <span className={pathname === ROUTES.home ? 'text-primary font-medium' : ''}>Home</span>
          </ListboxItem>

          {/* EMAILS LINK */}
          <ListboxItem
            key="emails"
            aria-label="Email Navigation"
            href="/emails"
            as={Link}
            className={pathname === ROUTES.emails ? 'bg-primary/10 text-primary' : ''}
            startContent={
              <Mail className={pathname === ROUTES.emails ? 'text-primary h-5 w-5' : iconClasses} />
            }
          >
            <span className={pathname === ROUTES.emails ? 'text-primary font-medium' : ''}>
              Emails
            </span>
          </ListboxItem>
        </Listbox>
      </div>

      {/* BOTTOM SECTION */}
      <Listbox variant="flat" aria-label="list-container">
        <ListboxItem
          key="logout"
          aria-label="Sidebar Navigation"
          className="group text-danger h-11"
          color="danger"
          startContent={<LogOut className="text-danger h-5 w-5" />}
        >
          Log Out
        </ListboxItem>
      </Listbox>
    </aside>
  )
}
