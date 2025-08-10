import type { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

// Add a GET endpoint for testing SMTP configuration
export async function GET() {
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
  const SCHOLARSHIP_EMAIL_TO = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
  const SCHOLARSHIP_EMAIL_FROM = process.env.SCHOLARSHIP_EMAIL_FROM || SMTP_USER

  const config = {
    SMTP_HOST: SMTP_HOST ? 'SET' : 'MISSING',
    SMTP_PORT: SMTP_PORT || 'MISSING',
    SMTP_USER: SMTP_USER ? 'SET' : 'MISSING',
    SMTP_PASS: SMTP_PASS ? 'SET' : 'MISSING',
    SMTP_SECURE,
    SCHOLARSHIP_EMAIL_TO,
    SCHOLARSHIP_EMAIL_FROM: SCHOLARSHIP_EMAIL_FROM || 'MISSING',
    isConfigured: !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS)
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

    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_SECURE = process.env.SMTP_SECURE === 'true'

    console.log('SMTP Configuration Check:')
    console.log('- SMTP_HOST:', SMTP_HOST ? 'SET' : 'MISSING')
    console.log('- SMTP_PORT:', SMTP_PORT || 'MISSING')
    console.log('- SMTP_USER:', SMTP_USER ? 'SET' : 'MISSING')
    console.log('- SMTP_PASS:', SMTP_PASS ? 'SET' : 'MISSING')
    console.log('- SMTP_SECURE:', SMTP_SECURE)

    // Check if SMTP is configured
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.log('=== SMTP NOT CONFIGURED - LOGGING APPLICATION ONLY ===')
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
      
      const missingVars = []
      if (!SMTP_HOST) missingVars.push('SMTP_HOST')
      if (!SMTP_PORT) missingVars.push('SMTP_PORT')
      if (!SMTP_USER) missingVars.push('SMTP_USER')
      if (!SMTP_PASS) missingVars.push('SMTP_PASS')
      
      return new Response(JSON.stringify({ 
        ok: true, 
        messageId: 'logged-only',
        message: `Application received and logged. Email will be sent when SMTP is configured. Missing variables: ${missingVars.join(', ')}`
      }), { status: 200 })
    }

    console.log('SMTP configured, creating transporter...')
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    console.log('Transporter created, verifying connection...')
    try {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      throw new Error(`SMTP verification failed: ${verifyError}`)
    }

    const emailTo = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
    const emailFrom = process.env.SCHOLARSHIP_EMAIL_FROM || SMTP_USER

    console.log('Email configuration:')
    console.log('- To:', emailTo)
    console.log('- From:', emailFrom)
    console.log('- Reply-To:', email || 'not set')

    console.log('Sending email...')
    const info = await transporter.sendMail({
      from: `"${studentName}" <${emailFrom}>`,
      to: emailTo,
      subject: `2026 AAASJ Scholarship Application - ${studentName || 'Applicant'}`,
      text: textBody,
      attachments,
      replyTo: email || undefined,
    })

    console.log('Email sent successfully!')
    console.log('- Message ID:', info.messageId)
    console.log('- Response:', info.response)
    console.log('- Accepted recipients:', info.accepted)
    console.log('- Rejected recipients:', info.rejected)
    console.log('- Pending recipients:', info.pending)

    console.log('=== SCHOLARSHIP SUBMISSION SUCCESS ===')
    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), { status: 200 })
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
