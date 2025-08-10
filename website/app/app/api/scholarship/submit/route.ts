import type { NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

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

    // Assemble attachments
    const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []

    // Generated PDF
    const generatedPdf = formData.get('generatedPdf') as unknown as File | null
    if (generatedPdf && typeof generatedPdf.arrayBuffer === 'function') {
      const buf = Buffer.from(await generatedPdf.arrayBuffer())
      attachments.push({ filename: (generatedPdf as any).name || 'application.pdf', content: buf, contentType: generatedPdf.type || 'application/pdf' })
    }

    // User uploads (multiple 'files')
    const files = formData.getAll('files') as unknown as File[]
    for (const f of files) {
      if (!f || typeof (f as any).arrayBuffer !== 'function') continue
      const buf = Buffer.from(await f.arrayBuffer())
      attachments.push({ filename: (f as any).name || 'attachment', content: buf, contentType: f.type || undefined })
    }

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

    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_SECURE = process.env.SMTP_SECURE === 'true'

    // Check if SMTP is configured
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      // If SMTP not configured, just return success but log the application
      console.log('=== SCHOLARSHIP APPLICATION (SMTP NOT CONFIGURED) ===')
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
        message: 'Application received and logged. Email will be sent when SMTP is configured.'
      }), { status: 200 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    const emailTo = process.env.SCHOLARSHIP_EMAIL_TO || 'scholarship@aaa-sj.org'
    const emailFrom = process.env.SCHOLARSHIP_EMAIL_FROM || SMTP_USER

    const info = await transporter.sendMail({
      from: `"${studentName}" <${emailFrom}>`,
      to: emailTo,
      subject: `2026 AAASJ Scholarship Application - ${studentName || 'Applicant'}`,
      text: textBody,
      attachments,
      replyTo: email || undefined,
    })

    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), { status: 200 })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ message: error?.message || 'Internal Server Error' }), { status: 500 })
  }
}
