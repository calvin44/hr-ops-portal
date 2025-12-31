export interface LeaveUsage {
  'Annual Leave'?: number
  WFH?: number
  'Sick Leave'?: number
  'Personal Leave'?: number
  Others?: number
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor: string
}

export interface ChartConfig {
  labels: string[]
  datasets: ChartDataset[]
}

export interface LeaveBalance extends Pick<LeaveUsage, 'Annual Leave' | 'Sick Leave'> {}

export interface Employee {
  name: string
  staffId: string
  chineseName: string
  email: string
  yearsOfService: number
  annualLeaveQuota: number
  sickLeaveQuota: number
  managers: string[]
}

export interface UserLeaveReport {
  id: string
  user: Employee
  stats: {
    leaveTaken: LeaveUsage
    balance: LeaveBalance
  }
  chartConfig: ChartConfig
}

export interface StaffLeaveAnalytics {
  userName: string
  leaveTaken: LeaveUsage
  chartData: ChartConfig
}
