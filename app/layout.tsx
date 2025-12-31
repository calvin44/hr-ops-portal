// app/layout.tsx
import './globals.css'
import { Metadata } from 'next'
import { Providers } from './providers'
import { Sidebar } from '@/app/components/Sidebar'

/**
 * The metadata object tells Next.js what to put in the HTML <head>.
 * This controls the browser tab's appearance.
 */
export const metadata: Metadata = {
  // Title of the application
  title: {
    default: 'HR Portal',
    template: '%s | HR Portal',
  },
  description: 'Employee Management System',

  // Icon configuration
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="text-foreground bg-background h-screen w-screen overflow-hidden antialiased"
      >
        <Providers>
          {/* Main Layout Shell */}
          <div className="flex h-full w-full gap-8 p-8">
            <Sidebar />
            <main className="h-full flex-1 overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
