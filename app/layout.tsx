'use client'

import './globals.css'
import { Sidebar } from '@components'
import { Providers } from '@/app/providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-background text-foreground h-screen w-screen overflow-hidden"
      >
        <Providers>
          <div className="flex h-full w-full gap-8 bg-slate-50 p-8">
            {/* Sidebar */}
            <Sidebar />
            {/* Main View */}
            <div className="h-full flex-1 overflow-y-auto">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
