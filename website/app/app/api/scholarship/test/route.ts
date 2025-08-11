import { Resend } from 'resend'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.SCHOLARSHIP_EMAIL_FROM || 'noreply@aaasj.org',
      to: process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org',
      subject: 'Test Email from AAASJ Website',
      text: 'This is a test email to verify Resend is working correctly.',
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      messageId: data?.id,
      message: 'Test email sent successfully!' 
    })
  } catch (error: any) {
    return Response.json({ 
      error: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}
