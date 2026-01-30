import nodemailer from 'nodemailer'
import type { ApiErrorResponse, SendMailResponse, UserLeaveReport } from '@/app/types'
import { generateEmailTemplate } from '@/app/utils/mail'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Capture and Validate Environment Variables
  const GMAIL_USER = process.env.GMAIL_USER
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD
  const TEST_EMAIL = process.env.TEST_EMAIL_RECEIVER
  const isDev = process.env.NODE_ENV === 'development'

  if (!GMAIL_USER || !GMAIL_PASS) {
    return NextResponse.json<ApiErrorResponse>({ error: 'Mailer not configured.' }, { status: 500 })
  }

  if (isDev && !TEST_EMAIL) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'TEST_EMAIL_RECEIVER missing.' },
      { status: 500 }
    )
  }

  try {
    const body = (await req.json()) as UserLeaveReport
    const { chartConfig, user } = body

    if (!chartConfig || !user) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Missing data in request body' },
        { status: 400 }
      )
    }

    // Prepare the QuickChart configuration
    const qcConfig = {
      type: 'bar',
      data: {
        labels: chartConfig.labels.map((l: string) => l.replace(/-/g, '/')),
        datasets: chartConfig.datasets.map((ds: any) => ({
          ...ds,
          borderRadius: 6,
        })),
      },
      options: {
        title: {
          display: true,
          text: `Leave Usage Summary - ${user.name}`,
        },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true } }],
        },
      },
    }

    // Generate the Publicly Accessible QuickChart URL
    const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify(qcConfig)
    )}&width=600&height=400&version=2`

    // Pre-flight check
    try {
      const checkRes = await fetch(chartUrl, { method: 'HEAD' })
      if (!checkRes.ok) throw new Error(`Status: ${checkRes.status}`)
    } catch (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: 'Chart Generation Failed', details: { error, url: chartUrl } },
        { status: 502 }
      )
    }

    // Generate HTML Template
    const mailHtml = generateEmailTemplate(body, chartUrl)

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    })

    // Recipient Redirection Logic (Dev vs Prod)
    const finalTo = isDev ? (TEST_EMAIL as string) : user.email
    const finalCc = isDev ? [TEST_EMAIL as string] : user.managers || []

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
    const finalSubject = isDev
      ? `[TEST] ${currentMonth} Leave Summary - ${user.name}`
      : `${currentMonth} Leave Summary - ${user.name}`

    // Send the Email
    const mailInfo = await transporter.sendMail({
      from: `"Leave Summary Automation" <${GMAIL_USER}>`,
      to: finalTo,
      cc: finalCc,
      subject: finalSubject,
      html: mailHtml,
    })

    return NextResponse.json<SendMailResponse>({
      success: true,
      messageId: mailInfo.messageId,
      sentTo: finalTo,
      mode: isDev ? 'development' : 'production',
    })
  } catch (error: any) {
    console.error('Email API Error:', error)
    return NextResponse.json<ApiErrorResponse>({ error: error.message }, { status: 500 })
  }
}
