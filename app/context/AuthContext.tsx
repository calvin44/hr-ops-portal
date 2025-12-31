'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { auth } from '@lib/firebase'
import { Spinner, Button, Card, CardBody } from '@heroui/react'
import { ShieldCheck, AlertCircle, ArrowLeft, UserX } from 'lucide-react'
import { motion, AnimatePresence, Transition } from 'framer-motion'

// Unified Spring Transition for all "Portal" animations
const portalSpring: Transition = { type: 'spring', stiffness: 300, damping: 30 }

interface AuthContextType {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDenied, setIsDenied] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const login = async () => {
    setIsLoggingIn(true)
    setError(null)
    setIsDenied(false)
    const provider = new GoogleAuthProvider()
    const ALLOWED_EMAILS = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS?.split(',') || []

    try {
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email

      if (!email || !ALLOWED_EMAILS.includes(email)) {
        await signOut(auth)
        setIsDenied(true)
        return
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Unauthorized access.')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = () => signOut(auth)

  if (loading) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        <Spinner size="lg" label="Establishing Secure Connection..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-background relative flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Unifying the background with the new portal design tokens */}
        <div className="bg-primary-500/10 absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={portalSpring}
        >
          <Card className="rounded-portal mx-4 w-full max-w-md border-none bg-white/80 shadow-2xl backdrop-blur-xl">
            <CardBody className="overflow-hidden p-8 text-center sm:p-12">
              <AnimatePresence mode="wait">
                {isDenied ? (
                  <motion.div
                    key="denied"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                  >
                    <div className="bg-danger-100 rounded-portal mx-auto mb-8 flex h-20 w-20 items-center justify-center shadow-xl">
                      <UserX className="text-danger h-10 w-10" />
                    </div>
                    <h1 className="mb-3 text-3xl leading-tight font-black text-slate-900">
                      Access Denied
                    </h1>
                    <p className="text-default-500 mb-8 leading-relaxed font-medium">
                      This email is not registered. Please contact the system admin for access.
                    </p>
                    <Button
                      color="default"
                      variant="flat"
                      size="lg"
                      onPress={() => setIsDenied(false)}
                      className="h-14 w-full font-bold"
                      startContent={<ArrowLeft size={18} />}
                    >
                      Try Different Account
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                  >
                    <div className="bg-primary rounded-portal shadow-primary/40 mx-auto mb-8 flex h-20 w-20 items-center justify-center shadow-2xl">
                      <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="mb-3 text-4xl font-black text-slate-900">HR Portal</h1>
                    <p className="text-default-500 mb-8 leading-relaxed font-medium">
                      Secure identification required to <br /> manage employee records.
                    </p>
                    {error && (
                      <div className="bg-danger-50 text-danger-600 border-danger-100 mb-6 flex animate-pulse items-center gap-2 rounded-xl border p-3 text-xs font-bold">
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}
                    <Button
                      color="primary"
                      size="lg"
                      onPress={login}
                      isLoading={isLoggingIn}
                      className="h-14 w-full font-bold shadow-lg"
                      startContent={
                        !isLoggingIn && (
                          <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            className="h-5 w-5 rounded-full bg-white p-0.5"
                          />
                        )
                      }
                    >
                      Sign in with Google
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
