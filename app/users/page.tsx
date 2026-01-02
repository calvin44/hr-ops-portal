'use client'

import { Card, CardHeader, CardBody, Input, Button, Chip, Skeleton, Tooltip } from '@heroui/react'
import { UserPlus, CheckCircle, AlertCircle, Users as UsersIcon, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllowedEmails, addAllowedEmail, removeAllowedEmail } from '@lib/firestore'
import { validateEmailDomain } from '@/app/utils/emailValidation'
import { useAuth } from '@context'

export default function UsersPage() {
  const { user } = useAuth()
  const [allowedEmails, setAllowedEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Get current user's email (normalized for comparison)
  const currentUserEmail = user?.email?.trim().toLowerCase() || null

  // Fetch allowed emails on mount
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true)
      try {
        const emails = await getAllowedEmails()
        setAllowedEmails(emails)
      } catch (error) {
        console.error('Error fetching allowed emails:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmails()
  }, [])

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Validate email on input change
  const handleEmailChange = (value: string) => {
    setNewEmail(value)
    setValidationError(null)
    setSuccessMessage(null)

    // Validate on blur or when user stops typing
    if (value.trim()) {
      const validation = validateEmailDomain(value)
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid email')
      }
    }
  }

  // Handle adding email
  const handleAddEmail = async () => {
    // Clear previous messages
    setValidationError(null)
    setSuccessMessage(null)

    // Validate email
    const validation = validateEmailDomain(newEmail)
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid email')
      return
    }

    setIsAdding(true)

    try {
      const result = await addAllowedEmail(newEmail)

      if (result.success) {
        // Refresh the emails list
        const updatedEmails = await getAllowedEmails()
        setAllowedEmails(updatedEmails)
        setNewEmail('')
        setSuccessMessage(result.message)
      } else {
        setValidationError(result.message)
      }
    } catch (error) {
      console.error('Error adding email:', error)
      setValidationError('Failed to add email. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !validationError && newEmail.trim()) {
      handleAddEmail()
    }
  }

  // Handle deleting email
  const handleDeleteEmail = async (email: string) => {
    // Prevent user from deleting themselves
    const normalizedEmail = email.trim().toLowerCase()
    if (currentUserEmail && normalizedEmail === currentUserEmail) {
      setValidationError(
        'You cannot delete your own account. Please ask another admin to remove you.'
      )
      return
    }

    setIsDeleting(email)
    setSuccessMessage(null)
    setValidationError(null)

    try {
      const result = await removeAllowedEmail(email)

      if (result.success) {
        // Refresh the emails list
        const updatedEmails = await getAllowedEmails()
        setAllowedEmails(updatedEmails)
        setSuccessMessage(result.message)
      } else {
        setValidationError(result.message)
      }
    } catch (error) {
      console.error('Error deleting email:', error)
      setValidationError('Failed to delete email. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card className="rounded-portal h-full w-full border-none bg-white" shadow="none">
      <CardHeader className="flex flex-col items-start gap-4 px-8 pt-8 pb-4">
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">User Management</h1>
            <p className="text-default-400 text-xs font-medium">
              Manage allowed admin users for the HR Portal
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="gap-6 overflow-y-auto px-8 pb-8">
        {/* Add Email Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Input
              label="Email Address"
              placeholder="user@iscoollab.com"
              value={newEmail}
              onValueChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (newEmail.trim()) {
                  const validation = validateEmailDomain(newEmail)
                  if (!validation.isValid) {
                    setValidationError(validation.error || 'Invalid email')
                  }
                }
              }}
              isInvalid={!!validationError}
              errorMessage={validationError || undefined}
              description="Only @iscoollab.com domain emails are allowed"
              classNames={{
                input: 'font-mono',
                label: 'font-bold',
              }}
              endContent={
                <div className="flex items-center gap-2">
                  {newEmail && !validationError && <CheckCircle className="text-success h-4 w-4" />}
                  {validationError && <AlertCircle className="text-danger h-4 w-4" />}
                </div>
              }
              className="flex-1"
            />
            <Button
              color="primary"
              onPress={handleAddEmail}
              isLoading={isAdding}
              isDisabled={!newEmail.trim() || !!validationError}
              startContent={!isAdding && <UserPlus className="h-4 w-4" />}
              className="h-14 rounded-xl px-6 font-bold shadow-lg"
            >
              Add User
            </Button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-success-50 border-success-200 flex items-center gap-2 rounded-xl border p-3"
              >
                <CheckCircle className="text-success h-4 w-4" />
                <span className="text-success-700 text-sm font-bold">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Allowed Users List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="text-primary h-5 w-5" />
            <h2 className="text-xl font-bold text-slate-800">Allowed Users</h2>
            <Chip variant="flat" color="primary" size="sm" className="ml-auto font-bold">
              {allowedEmails.length} {allowedEmails.length === 1 ? 'user' : 'users'}
            </Chip>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          ) : allowedEmails.length === 0 ? (
            <div className="bg-default-50 border-default-200 flex flex-col items-center justify-center rounded-2xl border py-12 text-center">
              <UsersIcon className="text-default-300 mb-4 h-12 w-12" />
              <h3 className="text-default-700 mb-2 text-lg font-bold">No users found</h3>
              <p className="text-default-400 text-sm">Add your first allowed user above</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {allowedEmails.map((email, index) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card shadow="none" className="border-divider bg-slate-50">
                      <CardBody className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                            <UsersIcon className="text-primary h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{email}</p>
                            <p className="text-tiny text-default-400 font-medium">Allowed Admin</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Chip variant="flat" color="success" size="sm" className="font-bold">
                            Active
                          </Chip>
                          <Tooltip
                            content={
                              currentUserEmail && email.toLowerCase() === currentUserEmail
                                ? 'You cannot delete your own account'
                                : 'Remove user'
                            }
                            placement="top"
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              color="danger"
                              size="sm"
                              onPress={() => handleDeleteEmail(email)}
                              isLoading={isDeleting === email}
                              isDisabled={
                                currentUserEmail !== null &&
                                email.toLowerCase() === currentUserEmail
                              }
                              className="hover:bg-danger-100 h-8 min-w-8 cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
