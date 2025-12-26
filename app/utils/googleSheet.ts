import 'server-only'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

export interface EmployeeRow {
  staffId: string
  chineseName: string
  englishName: string
  email: string
  managers: string[]
  onboardDate: string
  yearsOfService: number
  annualLeaveQuota: number
  sickLeaveQuota: number
}

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
]

export const normalizeEmail = (email: any): any => {
  if (typeof email !== 'string') {
    return email
  }
  return email.trim().toLowerCase()
}

const formattedKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: formattedKey,
  scopes: SCOPES,
})

export const getLeaveData = async (sheetName: string = 'StaffList'): Promise<EmployeeRow[]> => {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, jwt)
    await doc.loadInfo()

    // Using sheet title as discussed for better stability
    const sheet = doc.sheetsByTitle['Leave Data']

    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found.`)
      return []
    }

    const rows = await sheet.getRows()

    return rows.map((row) => {
      // 1. Gather raw manager values (Let them be undefined/null if empty)
      const rawManagers = [
        row.get('Manager 1'),
        row.get('Manager 2'),
        row.get('Manager 3'),
        row.get('Manager 4'),
      ]

      const cleanManagers = rawManagers
        .map(normalizeEmail)
        .filter((email): email is string => typeof email === 'string' && email.trim().length > 0)

      return {
        staffId: row.get('Staff ID') || '',
        chineseName: row.get('Chinese name') || '',
        englishName: row.get('English Name') || '',
        // 3. Use the same helper for the employee email
        email: normalizeEmail(row.get('Email')) || '',

        managers: cleanManagers,

        onboardDate: row.get('Onboard Date') || '',
        yearsOfService: parseFloat(row.get('Years of Service') || '0'),
        annualLeaveQuota: parseFloat(row.get('Annual Leave Quota') || '0'),
        sickLeaveQuota: parseFloat(row.get('Sick Leave Quota') || '0'),
      }
    })
  } catch (error) {
    console.error('Failed to fetch Google Sheet:', error)
    return []
  }
}

export function convertToLookupObject(list: EmployeeRow[]): Record<string, EmployeeRow> {
  return list.reduce(
    (acc, row) => {
      // Ensure the key is consistent
      const key = row.email.toLowerCase().trim()

      if (key) {
        acc[key] = row
      }

      return acc
    },
    {} as Record<string, EmployeeRow>
  )
}
