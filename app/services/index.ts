import type { UserLeaveReport } from '@/app/types/utils'

export const apiServices = {
  async getLeaveData(): Promise<UserLeaveReport[]> {
    const res = await fetch('/api/fetch-leave-summary')
    const json = await res.json()

    if (!json.success) {
      throw new Error(json.error || 'Failed to fetch data')
    }
    return json.data
  },
}
