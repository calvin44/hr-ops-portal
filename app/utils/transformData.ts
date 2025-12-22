import type { AsanaTask, UserLeaveProfile } from '@/app/types'

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

export function transformAsanaData(asanaData: AsanaTask[]): UserLeaveProfile[] {
  // Structure: User -> Date (YYYY-MM-DD) -> Leave Type -> Hours
  const userMap: Record<string, Record<string, Record<string, number>>> = {}
  const userTypes: Record<string, Set<string>> = {}

  asanaData.forEach((task) => {
    // Helper: Find custom field value by name (case-insensitive)
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

    // Extract YYYY-MM-DD to group by specific day
    const dateKey = dateStr.substring(0, 10)

    if (!userMap[name]) userMap[name] = {}
    if (!userMap[name][dateKey]) userMap[name][dateKey] = {}
    if (!userTypes[name]) userTypes[name] = new Set()

    // Aggregate hours for this specific day and type
    const currentTotal = userMap[name][dateKey][type] || 0
    userMap[name][dateKey][type] = currentTotal + hours

    userTypes[name].add(type)
  })

  // Convert map to Chart.js structure
  return Object.keys(userMap).map((user) => {
    // Sort dates chronologically for X-axis
    const dates = Object.keys(userMap[user]).sort()
    const types = Array.from(userTypes[user])

    const datasets = types.map((type) => {
      // Map hours to the sorted dates, filling 0 for missing days
      const dataPoints = dates.map((date) => {
        return userMap[user][date][type] || 0
      })

      return {
        label: type,
        data: dataPoints,
        backgroundColor: COLOR_MAP[type] || COLOR_MAP['default'],
      }
    })

    const totalHours = datasets.reduce((sum, ds) => sum + ds.data.reduce((a, b) => a + b, 0), 0)

    return {
      userName: user,
      totalHours,
      chartData: {
        labels: dates,
        datasets: datasets,
      },
    }
  })
}
