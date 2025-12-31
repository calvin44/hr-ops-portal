'use client'

import { HeroUIProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { AuthProvider } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {/* HeroUIProvider needs the navigate prop for Next.js Link consistency */}
      <HeroUIProvider navigate={router.push}>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  )
}
