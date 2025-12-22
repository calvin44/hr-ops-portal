export interface UserLeaveProfile {
  userName: string
  totalHours: number
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

// Represents a custom field in Asana task
interface AsanaCustomField {
  gid: string
  name: string
  type?: string // sometimes missing
  display_value?: string // the value as string for chart / display
  text_value?: string // optional text
  number_value?: number // optional numeric value
  enum_value?: {
    gid: string
    name: string
    color?: string
    enabled?: boolean
    resource_type?: string
  }
}

// Represents a single Asana task
export interface AsanaTask {
  gid: string
  custom_fields: AsanaCustomField[]
  // optional fields
  name?: string
  completed?: boolean
  due_on?: string
  created_at?: string
  modified_at?: string
  assignee?: { gid: string; name: string }
  [key: string]: any // for any other fields from fetch
}
