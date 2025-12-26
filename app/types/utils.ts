export interface LeaveTypeHours {
  'Annual Leave'?: number
  WFH?: number
  'Sick Leave'?: number
  'Personal Leave'?: number
  Others?: number
}

interface ChartConfig {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

interface RemainderSummary extends Pick<LeaveTypeHours, 'Annual Leave' | 'Sick Leave'> {}

export interface UserLeaveProfile {
  userName: string
  leaveTaken: LeaveTypeHours
  chartData: {
    labels: string[]
    datasets: Dataset[]
  }
}

export interface Dataset {
  label: string
  data: number[]
  backgroundColor: string
}

export interface TransformedTaskData {
  userName: string
  leaveTaken: LeaveTypeHours
  chartData: ChartConfig
}

interface UserProfile {
  name: string
  staffId: string
  chineseName: string
  email: string
  yearsOfService: number
  annualLeaveQuota: number
  sickLeaveQuota: number
}

export interface FinalReportItem {
  user: UserProfile
  stats: {
    leaveTaken: LeaveTypeHours
    remainder: RemainderSummary
  }
  chartConfig: ChartConfig
}
