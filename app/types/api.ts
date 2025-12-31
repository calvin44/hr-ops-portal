export interface SendMailResponse {
  success: true
  messageId: string
  sentTo: string
  mode: 'development' | 'production'
}

export interface ApiErrorResponse {
  error: string
  details?: unknown
}
