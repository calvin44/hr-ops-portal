import type { AsanaTask, AsanaUser, UserLeaveReport, TransformedTaskData } from '@/app/types'
import { convertToLookupObject, getLeaveData, normalizeEmail } from './googleSheet'
import { v4 as uuidv4 } from 'uuid'

const FIELD_NAMES = {
  LEAVE_DATE: 'Leave Date',
  LEAVE_TYPE: 'Leave Type',
  HOURS: 'Hours Taken',
  USER_NAME: 'Name',
}

const COLOR_MAP: Record<string, string> = {
  'Annual Leave': '#36a2eb',
  'Sick Leave': '#ff9f40',
  'Personal Leave': '#4bc0c0',
  WFH: '#ff6384',
  default: '#9966ff',
}

export function transformAsanaData(asanaData: AsanaTask[]): TransformedTaskData[] {
  // Structure: User -> Date (YYYY-MM-DD) -> Leave Type -> Hours
  const userMap: Record<string, Record<string, Record<string, number>>> = {}
  const userTypes: Record<string, Set<string>> = {}

  // Parse and Group Data (Logic remains the same)
  asanaData.forEach((task) => {
    const getValByName = (targetName: string) => {
      const field = task.custom_fields?.find(
        (f: any) => f.name.trim().toLowerCase() === targetName.trim().toLowerCase()
      )
      return field?.display_value
    }

    const name = getValByName(FIELD_NAMES.USER_NAME)
    const dateStr = getValByName(FIELD_NAMES.LEAVE_DATE)
    const hoursStr = getValByName(FIELD_NAMES.HOURS)
    const type = getValByName(FIELD_NAMES.LEAVE_TYPE) || 'Other'

    if (!name || !dateStr || !hoursStr) return

    const hours = parseFloat(hoursStr) || 0
    const dateKey = dateStr.substring(0, 10)

    if (!userMap[name]) userMap[name] = {}
    if (!userMap[name][dateKey]) userMap[name][dateKey] = {}
    if (!userTypes[name]) userTypes[name] = new Set()

    const currentTotal = userMap[name][dateKey][type] || 0
    userMap[name][dateKey][type] = currentTotal + hours

    userTypes[name].add(type)
  })

  // Build Charts and Calculate Totals per Type
  return Object.keys(userMap).map((user) => {
    const dates = Object.keys(userMap[user]).sort()
    const types = Array.from(userTypes[user])

    // Container for our new specific totals
    const totalsByType: Record<string, number> = {}

    const datasets = types.map((type) => {
      const dataPoints = dates.map((date) => {
        return userMap[user][date][type] || 0
      })

      // Sum the hours for this specific type
      const typeTotal = dataPoints.reduce((sum, val) => sum + val, 0)
      totalsByType[type] = typeTotal

      return {
        label: type,
        data: dataPoints,
        backgroundColor: COLOR_MAP[type] || COLOR_MAP['default'],
      }
    })

    return {
      userName: user,
      leaveTaken: totalsByType,
      chartData: {
        labels: dates,
        datasets: datasets,
      },
    }
  })
}

export async function mergeUsersWithData(
  taskData: TransformedTaskData[],
  asanaUsers: AsanaUser[]
): Promise<UserLeaveReport[]> {
  const leaveData = await getLeaveData()
  const lookupLeaveData = convertToLookupObject(leaveData)
  return taskData.map((record) => {
    const matchedUser = asanaUsers.find(
      (u) => u.name.trim().toLowerCase() === record.userName.trim().toLowerCase()
    )

    const matchedUserEmail = normalizeEmail(matchedUser?.email || '')
    const { staffId, chineseName, email, yearsOfService, annualLeaveQuota, sickLeaveQuota } =
      lookupLeaveData[matchedUserEmail]

    return {
      id: uuidv4(),
      user: {
        name: record.userName,
        staffId,
        chineseName,
        email,
        yearsOfService,
        annualLeaveQuota,
        sickLeaveQuota,
      },
      stats: {
        leaveTaken: record.leaveTaken,
        remainder: {
          'Annual Leave': annualLeaveQuota * 8 - (record.leaveTaken['Annual Leave'] ?? 0),
          'Sick Leave': sickLeaveQuota * 8 - (record.leaveTaken['Sick Leave'] ?? 0),
        },
      },
      chartConfig: record.chartData,
    }
  })
}
