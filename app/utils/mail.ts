import { UserLeaveReport } from '@/app/types'

/**
 * Generates the HTML email template with conditional styling for negative values
 * and a clickable direct link to the leave usage chart.
 */
export const generateEmailTemplate = (data: UserLeaveReport, chartUrl: string) => {
  const { user, stats } = data

  // Extracting data from the stats interface
  const annualTaken = stats.leaveTaken['Annual Leave'] || 0
  const annualRemaining = stats.balance['Annual Leave'] || 0
  const sickTaken = stats.leaveTaken['Sick Leave'] || 0
  const sickRemaining = stats.balance['Sick Leave'] || 0
  const wfhTaken = stats.leaveTaken.WFH || 0

  // Senior Logic: Helper to determine text color based on balance
  const getStatusColor = (value: number) => (value < 0 ? '#ef4444' : '#666')

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
      <h2 style="color: #111; margin-top: 0;">Leave Usage Summary</h2>
      <p>Dear ${user.name},</p>
      
      <p>You are receiving this email as part of our monthly HR automation workflow. Below is your personalized leave record as of <strong>August 2025</strong>:</p>
      
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 5px;"><strong>Annual Leave Taken:</strong> ${annualTaken} hours</li>
        <li style="color: ${getStatusColor(annualRemaining)}; margin-bottom: 15px; font-size: 14px;">
            &rarr; Remaining Annual Leave: <strong>${annualRemaining.toFixed(1)} hours</strong>
            ${annualRemaining < 0 ? '<span style="font-weight: bold;">(Overdrawn)</span>' : ''}
        </li>
        
        <li style="margin-bottom: 5px;"><strong>Full Paid Sick Leave Taken:</strong> ${sickTaken} hours</li>
        <li style="color: ${getStatusColor(sickRemaining)}; margin-bottom: 15px; font-size: 14px;">
            &rarr; Remaining Full Paid Sick Leave: <strong>${sickRemaining.toFixed(1)} hours</strong>
            ${sickRemaining < 0 ? '<span style="font-weight: bold;">(Overdrawn)</span>' : ''}
        </li>
        
        <li style="margin-bottom: 5px;"><strong>WFH Taken:</strong> ${wfhTaken} hours</li>
      </ul>

      <div style="margin-top: 25px; padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
        <p style="font-size: 13px; color: #6b7280; margin-bottom: 10px;">Visual Breakdown (Click to enlarge)</p>
        <a href="${chartUrl}" target="_blank" style="text-decoration: none; display: block;">
          <img src="${chartUrl}" alt="Leave Usage Chart" style="width: 100%; max-width: 500px; height: auto; border-radius: 4px; border: 1px solid #e5e7eb;" />
          <p style="margin-top: 12px; color: #2563eb; font-size: 14px; font-weight: 600;">View High-Resolution Report &rarr;</p>
        </a>
      </div>

      <p style="margin-top: 25px; border-top: 1px solid #eee; pt: 20px; font-size: 14px;">
        If you have any questions or notice any discrepancies, please reach out to the HR department.
      </p>
      
      <p style="font-size: 14px;">Thanks and wishing you a smooth month ahead!</p>
    </div>
  `
}
