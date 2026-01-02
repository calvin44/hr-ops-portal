import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@lib/firebase'

/**
 * Fetches the list of allowed admin emails from Firestore
 * @returns Promise<string[]> Array of allowed email addresses, or empty array on error
 */
export async function getAllowedEmails(): Promise<string[]> {
  try {
    const configRef = doc(db, 'config', 'allowedEmails')
    const configSnap = await getDoc(configRef)

    if (!configSnap.exists()) {
      console.warn('Firestore document /config/allowedEmails does not exist')
      return []
    }

    const data = configSnap.data()
    const emails = data?.emails

    if (!Array.isArray(emails)) {
      console.warn('Firestore document /config/allowedEmails does not contain emails array')
      return []
    }

    // Normalize emails (lowercase, trim) for consistent comparison
    return emails
      .filter((email): email is string => typeof email === 'string' && email.trim().length > 0)
      .map((email) => email.trim().toLowerCase())
  } catch (error) {
    console.error('Error fetching allowed emails from Firestore:', error)
    return []
  }
}

/**
 * Adds an email to the allowed emails list in Firestore
 * @param email - Email address to add (will be normalized)
 * @returns Promise with success status and message
 */
export interface AddEmailResult {
  success: boolean
  message: string
}

export async function addAllowedEmail(email: string): Promise<AddEmailResult> {
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return {
        success: false,
        message: 'Email cannot be empty',
      }
    }

    const configRef = doc(db, 'config', 'allowedEmails')
    const configSnap = await getDoc(configRef)

    let currentEmails: string[] = []

    if (configSnap.exists()) {
      const data = configSnap.data()
      currentEmails = (data?.emails || []).map((e: string) => e.trim().toLowerCase())
    }

    // Check if email already exists
    if (currentEmails.includes(normalizedEmail)) {
      return {
        success: false,
        message: 'This email is already in the allowed list',
      }
    }

    // Add email to array
    const updatedEmails = [...currentEmails, normalizedEmail]

    // Update or create document
    if (configSnap.exists()) {
      await updateDoc(configRef, {
        emails: updatedEmails,
      })
    } else {
      await setDoc(configRef, {
        emails: updatedEmails,
      })
    }

    return {
      success: true,
      message: 'Email added successfully',
    }
  } catch (error) {
    console.error('Error adding email to Firestore:', error)
    return {
      success: false,
      message: 'Failed to add email. Please try again.',
    }
  }
}

/**
 * Removes an email from the allowed emails list in Firestore
 * @param email - Email address to remove (will be normalized)
 * @returns Promise with success status and message
 */
export interface RemoveEmailResult {
  success: boolean
  message: string
}

export async function removeAllowedEmail(email: string): Promise<RemoveEmailResult> {
  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return {
        success: false,
        message: 'Email cannot be empty',
      }
    }

    const configRef = doc(db, 'config', 'allowedEmails')
    const configSnap = await getDoc(configRef)

    if (!configSnap.exists()) {
      return {
        success: false,
        message: 'No allowed emails found',
      }
    }

    const data = configSnap.data()
    const currentEmails = (data?.emails || []).map((e: string) => e.trim().toLowerCase())

    // Check if email exists
    if (!currentEmails.includes(normalizedEmail)) {
      return {
        success: false,
        message: 'Email not found in allowed list',
      }
    }

    // Remove email from array
    const updatedEmails = currentEmails.filter((e: string) => e !== normalizedEmail)

    // Update document
    await updateDoc(configRef, {
      emails: updatedEmails,
    })

    return {
      success: true,
      message: 'Email removed successfully',
    }
  } catch (error) {
    console.error('Error removing email from Firestore:', error)
    return {
      success: false,
      message: 'Failed to remove email. Please try again.',
    }
  }
}
