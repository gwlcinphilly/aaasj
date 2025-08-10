import type { NextRequest } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)

// Add a GET endpoint for testing email configuration
export async function GET() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const SCHOLARSHIP_EMAIL_TO = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
  const SCHOLARSHIP_EMAIL_FROM = process.env.SCHOLARSHIP_EMAIL_FROM || 'noreply@aaasj.org'

  const config = {
    RESEND_API_KEY: RESEND_API_KEY ? 'SET' : 'MISSING',
    SCHOLARSHIP_EMAIL_TO,
    SCHOLARSHIP_EMAIL_FROM,
    isConfigured: !!RESEND_API_KEY
  }

  return Response.json(config)
}

export async function POST(request: NextRequest) {
  console.log('=== SCHOLARSHIP SUBMISSION START ===')
  console.log('Timestamp:', new Date().toISOString())
  
  try {
    const formData = await request.formData()
    console.log('Form data received successfully')

    const studentName = String(formData.get('studentName') || '')
    const email = String(formData.get('email') || '')
    const phone = String(formData.get('phone') || '')
    const address = String(formData.get('address') || '')
    const city = String(formData.get('city') || '')
    const state = String(formData.get('state') || '')
    const zip = String(formData.get('zip') || '')

    const academicAwards = String(formData.get('academicAwards') || '')
    const volunteerWork = String(formData.get('volunteerWork') || '')
    const groupsClubs = String(formData.get('groupsClubs') || '')
    const question1 = String(formData.get('question1') || '')
    const question2 = String(formData.get('question2') || '')
    const question3 = String(formData.get('question3') || '')

    console.log('Form data extracted:')
    console.log('- Student Name:', studentName)
    console.log('- Email:', email)
    console.log('- Phone:', phone)
    console.log('- Address:', `${address}, ${city}, ${state} ${zip}`)
    console.log('- Academic Awards length:', academicAwards.length)
    console.log('- Volunteer Work length:', volunteerWork.length)
    console.log('- Groups/Clubs length:', groupsClubs.length)
    console.log('- Question 1 length:', question1.length)
    console.log('- Question 2 length:', question2.length)
    console.log('- Question 3 length:', question3.length)

    // Assemble attachments
    const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []

    // Generated PDF
    const generatedPdf = formData.get('generatedPdf') as unknown as File | null
    if (generatedPdf && typeof generatedPdf.arrayBuffer === 'function') {
      const buf = Buffer.from(await generatedPdf.arrayBuffer())
      attachments.push({ filename: (generatedPdf as any).name || 'application.pdf', content: buf, contentType: generatedPdf.type || 'application/pdf' })
      console.log('Generated PDF attached:', (generatedPdf as any).name || 'application.pdf', 'Size:', buf.length, 'bytes')
    } else {
      console.log('No generated PDF found or invalid format')
    }

    // User uploads (multiple 'files')
    const files = formData.getAll('files') as unknown as File[]
    console.log('User files found:', files.length)
    for (const f of files) {
      if (!f || typeof (f as any).arrayBuffer !== 'function') {
        console.log('Skipping invalid file:', f)
        continue
      }
      const buf = Buffer.from(await f.arrayBuffer())
      attachments.push({ filename: (f as any).name || 'attachment', content: buf, contentType: f.type || undefined })
      console.log('File attached:', (f as any).name || 'attachment', 'Size:', buf.length, 'bytes', 'Type:', f.type)
    }

    console.log('Total attachments:', attachments.length)

    const textBody = `2026 AAASJ Community Service Scholarship Application\n\n` +
`STUDENT PROFILE:\n` +
`Student Name: ${studentName}\n` +
`Address: ${address}\n` +
`City: ${city}\n` +
`State: ${state}\n` +
`Zip: ${zip}\n` +
`Email: ${email}\n` +
`Phone: ${phone}\n\n` +
`Academic Awards/Achievements:\n${academicAwards}\n\n` +
`Volunteer Work/Community Service:\n${volunteerWork}\n\n` +
`Groups/Clubs/Organizations:\n${groupsClubs}\n\n` +
`ESSAY QUESTIONS:\n\n` +
`1. What do you believe are the most pressing issues or needs in the Asian American community in South Jersey?\n${question1}\n\n` +
`2. What have you done to help/address these issues/needs?\n${question2}\n\n` +
`3. Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey.\n${question3}\n\n`

    console.log('Email body prepared, length:', textBody.length, 'characters')

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const SCHOLARSHIP_EMAIL_TO = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
    const SCHOLARSHIP_EMAIL_FROM = process.env.SCHOLARSHIP_EMAIL_FROM || 'noreply@aaasj.org'

    console.log('Resend Configuration Check:')
    console.log('- RESEND_API_KEY:', RESEND_API_KEY ? 'SET' : 'MISSING')
    console.log('- SCHOLARSHIP_EMAIL_TO:', SCHOLARSHIP_EMAIL_TO)
    console.log('- SCHOLARSHIP_EMAIL_FROM:', SCHOLARSHIP_EMAIL_FROM)

    // Check if Resend is configured
    if (!RESEND_API_KEY) {
      console.log('=== RESEND NOT CONFIGURED - LOGGING APPLICATION ONLY ===')
      console.log('Student:', studentName)
      console.log('Email:', email)
      console.log('Phone:', phone)
      console.log('Address:', `${address}, ${city}, ${state} ${zip}`)
      console.log('Academic Awards:', academicAwards)
      console.log('Volunteer Work:', volunteerWork)
      console.log('Groups/Clubs:', groupsClubs)
      console.log('Question 1:', question1)
      console.log('Question 2:', question2)
      console.log('Question 3:', question3)
      console.log('Attachments:', attachments.length)
      console.log('=== END APPLICATION LOG ===')
      
      return new Response(JSON.stringify({ 
        ok: true, 
        messageId: 'logged-only',
        message: 'Application received and logged. Email will be sent when Resend API key is configured.'
      }), { status: 200 })
    }

    console.log('Resend configured, sending email...')

    // Convert attachments to Resend format
    const resendAttachments = attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content.toString('base64'),
      contentType: attachment.contentType || 'application/octet-stream'
    }))

    const { data, error } = await resend.emails.send({
      from: SCHOLARSHIP_EMAIL_FROM,
      to: SCHOLARSHIP_EMAIL_TO,
      replyTo: email,
      subject: `2026 AAASJ Scholarship Application - ${studentName || 'Applicant'}`,
      text: textBody,
      attachments: resendAttachments,
    })

    if (error) {
      console.error('Resend email error:', error)
      throw new Error(`Email sending failed: ${error.message}`)
    }

    console.log('Email sent successfully!')
    console.log('- Message ID:', data?.id)
    console.log('- Response:', data)

    console.log('=== SCHOLARSHIP SUBMISSION SUCCESS ===')
    return new Response(JSON.stringify({ ok: true, messageId: data?.id }), { status: 200 })
  } catch (error: any) {
    console.error('=== SCHOLARSHIP SUBMISSION ERROR ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    console.error('Full error object:', JSON.stringify(error, null, 2))
    console.error('=== END ERROR LOG ===')
    
    return new Response(JSON.stringify({ message: error?.message || 'Internal Server Error' }), { status: 500 })
  }
}
