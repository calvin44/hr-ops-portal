import { UserLeaveProfile } from '@/app/types'

export const AsanaService = {
  async getLeaveData(): Promise<UserLeaveProfile[]> {
    const res = await fetch('/api/fetch-asana')
    const json = await res.json()

    if (!json.success) {
      throw new Error(json.error || 'Failed to fetch data')
    }

    return json.data
  },
}
