export interface AsanaEnumOption {
  gid: string
  name: string
  color: string
  enabled: boolean
  resource_type: string
}

export interface AsanaCustomField {
  gid: string
  name: string
  display_value: string | null
  enum_value?: AsanaEnumOption | null
  [key: string]: any
}

export interface AsanaTask {
  gid: string
  custom_fields: AsanaCustomField[]
}

export interface AsanaUser {
  name: string
  email: string
  photo: { image_128x128: string }
}

export type AsanaApiResponse = AsanaTask[]
