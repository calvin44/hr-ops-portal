'use client'

import './globals.css'
import { ThemeProvider } from 'next-themes'
import { HeroUIProvider } from '@heroui/react'
import { Sidebar } from '@components'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-background text-foreground h-screen w-screen overflow-hidden"
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <HeroUIProvider>
            <div className="flex h-full w-full gap-8 bg-slate-50 p-8">
              {/* Sidebar */}
              <Sidebar />
              {/* Main View */}
              <div className="h-full flex-1 overflow-y-auto">{children}</div>
            </div>
          </HeroUIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
