'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { auth, db } from '@lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { Spinner, Button, Card, CardBody } from '@heroui/react'
import { ShieldCheck, AlertCircle, ArrowLeft, UserX } from 'lucide-react'
import { motion, AnimatePresence, Transition } from 'framer-motion'
import { getAllowedEmails } from '@lib/firestore'

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

  // Subscribes to Firebase Auth state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  // Defensive real-time security watcher to handle multi-tab/cache stability
  useEffect(() => {
    if (!user) return

    const userEmail = user.email?.trim().toLowerCase()
    if (!userEmail) return

    const configRef = doc(db, 'config', 'allowedEmails')

    const unsubscribe = onSnapshot(
      configRef,
      (snapshot) => {
        // Ignore local "optimistic" updates to prevent race conditions
        if (snapshot.metadata.hasPendingWrites) return

        const data = snapshot.data()
        const allowedEmails = (data?.emails || [])
          .map((e: string) => e.trim().toLowerCase())
          .filter((e: string) => e.length > 0)

        // AUTHORITATIVE CHECK:
        // isMissing: The user definitely shouldn't be here (doc gone or email removed)
        // isSyncing: A safe-guard for new tabs; if data is only from cache and empty, wait for server
        const isMissing = !snapshot.exists() || !allowedEmails.includes(userEmail)
        const isSyncing = snapshot.metadata.fromCache && allowedEmails.length === 0

        if (isMissing && !isSyncing) {
          setIsDenied(true)
          signOut(auth)
        }
      },
      (error) => console.error('Security Watcher Error:', error)
    )

    return () => unsubscribe()
  }, [user])

  const login = async () => {
    setIsLoggingIn(true)
    setError(null)
    setIsDenied(false)
    const provider = new GoogleAuthProvider()

    try {
      const allowedEmails = await getAllowedEmails()

      if (allowedEmails.length === 0) {
        setError('Security configuration missing. Contact Admin.')
        setIsLoggingIn(false)
        return
      }

      const result = await signInWithPopup(auth, provider)
      const email = result.user.email?.trim().toLowerCase()

      if (!email || !allowedEmails.includes(email)) {
        await signOut(auth)
        setIsDenied(true)
        return
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.')
      } else {
        setError(err.message || 'Unauthorized access.')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = () => {
    setIsDenied(false)
    signOut(auth)
  }

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
                      Access Restricted
                    </h1>
                    <p className="text-default-500 mb-8 leading-relaxed font-medium">
                      Your account does not have permission to view this portal. Please contact HR
                      if you believe this is an error.
                    </p>
                    <Button
                      color="default"
                      variant="flat"
                      size="lg"
                      onPress={() => setIsDenied(false)}
                      className="h-14 w-full font-bold"
                      startContent={<ArrowLeft size={18} />}
                    >
                      Return to Login
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
                      Secure identification required to manage employee records.
                    </p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-colors ${
                          error.includes('cancelled')
                            ? 'bg-default-100 text-default-600 border-default-200'
                            : 'bg-danger-50 text-danger-600 border-danger-100 animate-pulse'
                        }`}
                      >
                        <AlertCircle size={14} />
                        {error}
                      </motion.div>
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
                            alt="Google"
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
