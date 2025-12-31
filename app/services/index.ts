import type { UserLeaveReport, SendMailResponse, ApiErrorResponse } from '@types'

export const apiServices = {
  //  Query leave data service
  async getLeaveData(): Promise<UserLeaveReport[]> {
    const res = await fetch('/api/fetch-leave-summary')
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Failed to fetch data')
    return json.data
  },

  // Send Mail service
  async sendLeaveMail(report: UserLeaveReport): Promise<SendMailResponse> {
    const res = await fetch('/api/send-leave-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    })

    const json = await res.json()

    if (!res.ok) {
      // This catches 400, 500, and our custom 502 Chart error
      const errorData = json as ApiErrorResponse
      throw new Error(errorData.error || 'Failed to send email')
    }

    return json as SendMailResponse
  },
}
