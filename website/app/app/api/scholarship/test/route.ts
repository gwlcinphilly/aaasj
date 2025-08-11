import { Resend } from 'resend'

export const runtime = 'nodejs'

export async function GET() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const SCHOLARSHIP_EMAIL_TO = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
  const SCHOLARSHIP_EMAIL_FROM = process.env.SCHOLARSHIP_EMAIL_FROM || 'noreply@aaasj.org'

  const debugInfo = {
    apiKeyExists: !!RESEND_API_KEY,
    apiKeyLength: RESEND_API_KEY ? RESEND_API_KEY.length : 0,
    apiKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 10) + '...' : 'N/A',
    emailTo: SCHOLARSHIP_EMAIL_TO,
    emailFrom: SCHOLARSHIP_EMAIL_FROM,
    timestamp: new Date().toISOString()
  }

  if (!RESEND_API_KEY) {
    return Response.json({
      error: 'RESEND_API_KEY not found',
      debugInfo
    }, { status: 400 })
  }

  try {
    const resend = new Resend(RESEND_API_KEY)
    
    // Test with a simple email
    const { data, error } = await resend.emails.send({
      from: SCHOLARSHIP_EMAIL_FROM,
      to: SCHOLARSHIP_EMAIL_TO,
      subject: 'Resend API Test',
      text: 'This is a test email to verify Resend API connectivity.',
    })

    if (error) {
      return Response.json({
        error: 'Resend API error',
        errorDetails: error,
        debugInfo
      }, { status: 500 })
    }

    return Response.json({
      success: true,
      messageId: data?.id,
      debugInfo
    })

  } catch (error: any) {
    return Response.json({
      error: 'Exception occurred',
      errorMessage: error?.message,
      errorStack: error?.stack,
      debugInfo
    }, { status: 500 })
  }
}
