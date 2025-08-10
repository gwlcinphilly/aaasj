
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar, Award, FileText, Users, DollarSign, Mail, Clock, X } from 'lucide-react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'

export default function ScholarshipForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
    academicAwards: '',
    volunteerWork: '',
    groupsClubs: '',
    question1: '',
    question2: '',
    question3: ''
  })

  const [wordCounts, setWordCounts] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
  })

  const [uploads, setUploads] = useState<File[]>([])

  // Application deadline (local time)
  const applicationDeadline = useMemo(() => new Date('2025-09-15T23:59:59'), [])

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const isPastDeadline = useMemo(() => Date.now() >= applicationDeadline.getTime(), [applicationDeadline])

  useEffect(() => {
    if (isPastDeadline) return

    const tick = () => {
      const now = new Date().getTime()
      const diff = applicationDeadline.getTime() - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [applicationDeadline, isPastDeadline])

  const countWords = (text: string) => {
    return (text.trim().match(/\b\w+\b/g) || []).length
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (field === 'question1' || field === 'question2' || field === 'question3') {
      const wc = countWords(value)
      setWordCounts(prev => ({ ...prev, [field]: wc }))
    }
  }

  const handleFilesSelected = (filesList: FileList | null) => {
    if (!filesList) return
    const incoming = Array.from(filesList)

    // Validate types and sizes
    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/heic',
    ])

    const maxFileSizeMb = 10
    const maxTotalSizeMb = 4

    const nextUploads: File[] = [...uploads]

    for (const file of incoming) {
      if (!allowedTypes.has(file.type)) {
        toast.error(`Unsupported file type: ${file.name}`)
        continue
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        toast.error(`File too large (> ${maxFileSizeMb}MB): ${file.name}`)
        continue
      }
      nextUploads.push(file)
    }

    const totalSize = nextUploads.reduce((sum, f) => sum + f.size, 0)
    if (totalSize > maxTotalSizeMb * 1024 * 1024) {
      toast.error(`Total attachments exceed ${maxTotalSizeMb}MB. Please remove some files.`)
      return
    }

    setUploads(nextUploads)
  }

  const removeUploadAt = (idx: number) => {
    setUploads(prev => prev.filter((_, i) => i !== idx))
  }

  function generateApplicationPdf(): { blob: Blob; filename: string } {
    const doc = new jsPDF({ unit: 'pt' })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginX = 48
    const marginY = 48
    let cursorY = marginY

    const ensurePage = (additionalHeight = 0) => {
      if (cursorY + additionalHeight > pageHeight - marginY) {
        doc.addPage()
        cursorY = marginY
      }
    }

    const writeLine = (
      text: string,
      lineHeight = 14,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      fontSize = 11,
      x = marginX
    ) => {
      doc.setFont('helvetica', fontStyle)
      doc.setFontSize(fontSize)
      ensurePage(lineHeight)
      doc.text(text, x, cursorY)
      cursorY += lineHeight
    }

    const writeWrapped = (
      text: string,
      wrapWidth: number,
      lineHeight = 14,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      fontSize = 11,
      x = marginX
    ) => {
      const lines = doc.splitTextToSize(text || '-', wrapWidth)
      for (const line of lines) {
        writeLine(line, lineHeight, fontStyle, fontSize, x)
      }
    }

    const addHeading = (text: string) => {
      writeLine(text, 24, 'bold', 18)
    }

    const addSubheading = (text: string) => {
      writeLine(text, 18, 'bold', 12)
    }

    const addParagraph = (text: string) => {
      writeWrapped(text, pageWidth - marginX * 2, 14, 'normal', 11)
      cursorY += 2
    }

    const addKeyValue = (key: string, value: string) => {
      // Write key label
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      ensurePage(14)
      doc.text(`${key}:`, marginX, cursorY)

      // Write value, wrapped to the remaining width
      const valueX = marginX + 80
      const wrapped = doc.splitTextToSize(value || '-', pageWidth - valueX - marginX)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      for (const line of wrapped) {
        ensurePage(14)
        doc.text(line, valueX, cursorY)
        cursorY += 14
      }
    }

    // Header
    addHeading('2026 AAASJ Community Service Scholarship Application')
    writeLine(`Generated: ${new Date().toLocaleString()}`, 16, 'normal', 10)

    // Student Profile
    addSubheading('Student Profile')
    addKeyValue('Student Name', formData.studentName)
    addKeyValue('Email', formData.email)
    addKeyValue('Phone', formData.phone)
    addKeyValue('Address', `${formData.address || ''}`)
    addKeyValue('City', formData.city)
    addKeyValue('State', formData.state)
    addKeyValue('Zip', formData.zip)
    cursorY += 8

    // Academics & Activities
    addSubheading('Academic Awards / Achievements')
    addParagraph(formData.academicAwards)

    addSubheading('Volunteer Work / Community Service')
    addParagraph(formData.volunteerWork)

    addSubheading('Groups / Clubs / Organizations')
    addParagraph(formData.groupsClubs)

    // Essay Questions
    addSubheading('Essay Questions')
    addParagraph('1) What do you believe are the most pressing issues or needs in the Asian American community in South Jersey?')
    addParagraph(formData.question1)

    addParagraph('2) What have you done to help/address these issues/needs?')
    addParagraph(formData.question2)

    addParagraph('3) Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey.')
    addParagraph(formData.question3)

    // Footer note
    writeLine('', 6)
    writeWrapped(
      'Note: Please attach your most recent high school transcript and this PDF when emailing your application to scholarship@aaa-sj.org.',
      pageWidth - marginX * 2,
      12,
      'italic',
      10
    )

    const filename = `AAASJ_Scholarship_Application_${formData.studentName || 'Applicant'}.pdf`

    // Create a blob for server upload only (no browser download)
    const blob = doc.output('blob')

    return { blob, filename }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.studentName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isPastDeadline) {
      toast.error('The application deadline has passed. Submissions are closed.')
      return
    }

    // Essay word limits: 500 words max each
    if (wordCounts.question1 > 500 || wordCounts.question2 > 500 || wordCounts.question3 > 500) {
      toast.error('Please keep each essay answer under 500 words')
      return
    }

    // Build server payload
    const { blob: pdfBlob, filename: pdfFilename } = generateApplicationPdf()

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value)
    })
    // Attach generated PDF
    formDataToSend.append('generatedPdf', pdfBlob, pdfFilename)
    // Attach uploads
    uploads.forEach((file) => formDataToSend.append('files', file, file.name))

    try {
      const res = await fetch('/api/scholarship/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || 'Submission failed')
      }

      toast.success('Application submitted! We have emailed your application to scholarship@aaa-sj.org.')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Could not submit application. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            2026 AAASJ <span className="gradient-text">Scholarship</span> Application
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Community Service Scholarship supporting Asian American students in South Jersey
          </p>
          
          {/* Deadline / Countdown */}
          {!isPastDeadline ? (
            <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">Application Deadline</span>
                </div>
                <p className="text-white text-2xl font-bold text-center">September 15, 2025</p>
                <p className="text-white/90 mt-2 text-center">
                  Time remaining: 
                  <span className="font-semibold ml-2">
                    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                  </span>
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-red-500/20 backdrop-blur-sm border-red-400/30 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 text-red-300 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">Applications Closed</span>
                </div>
                <p className="text-white text-center">
                  The deadline for the 2026 scholarship has passed. Please check back next year.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Award Information */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-400/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Gold Award</h3>
              <p className="text-yellow-400 text-2xl font-bold mb-1">$1,000</p>
              <p className="text-white/80 text-sm">1 recipient</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-400/20 backdrop-blur-sm border-gray-300/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Silver Awards</h3>
              <p className="text-gray-300 text-2xl font-bold mb-1">$500</p>
              <p className="text-white/80 text-sm">2 recipients</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-600/20 backdrop-blur-sm border-amber-500/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Bronze Awards</h3>
              <p className="text-amber-500 text-2xl font-bold mb-1">$300</p>
              <p className="text-white/80 text-sm">3 recipients</p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              Requirements & Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/90 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Eligibility:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Current high school junior or senior</li>
                  <li>Must attend awards ceremony (March 2026)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Evaluation Based On:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Academic achievements</li>
                  <li>Extracurricular activities</li>
                  <li>Community service & civic engagement</li>
                  <li>Contributions to AAPI community in South Jersey</li>
                </ul>
              </div>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-center text-white">
                <Mail className="w-4 h-4 inline mr-2" />
                Submit completed application to: <strong>scholarship@aaa-sj.org</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Student Profile & Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName" className="text-white">Student Name *</Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-white">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-white">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NJ"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="zip" className="text-white">Zip Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) => handleInputChange('zip', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">Cell Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(___) ___-____"
                  className="bg-white/10 border-white/20 text-white placeholder-white/50"
                  required
                />
              </div>

              {/* Academic & Activities Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="academicAwards" className="text-white">Academic Awards or Achievements</Label>
                  <Textarea
                    id="academicAwards"
                    value={formData.academicAwards}
                    onChange={(e) => handleInputChange('academicAwards', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="List any academic honors, awards, achievements..."
                  />
                </div>

                <div>
                  <Label htmlFor="volunteerWork" className="text-white">Volunteer Work or Community Service Projects</Label>
                  <Textarea
                    id="volunteerWork"
                    value={formData.volunteerWork}
                    onChange={(e) => handleInputChange('volunteerWork', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="Describe your volunteer and community service experience..."
                  />
                </div>

                <div>
                  <Label htmlFor="groupsClubs" className="text-white">Groups, Clubs, or Organizations</Label>
                  <Textarea
                    id="groupsClubs"
                    value={formData.groupsClubs}
                    onChange={(e) => handleInputChange('groupsClubs', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="List organizations you belong to and any leadership positions..."
                  />
                </div>
              </div>

              {/* Essay Questions */}
              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-bold text-white border-b border-white/20 pb-2">Essay Questions</h3>
                
                <div>
                  <Label htmlFor="question1" className="text-white block mb-2">
                    1. What do you believe are the most pressing issues or needs in the Asian American community in South Jersey?
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Up to 500 words</Badge>
                  </Label>
                  <Textarea
                    id="question1"
                    value={formData.question1}
                    onChange={(e) => handleInputChange('question1', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Share your thoughts on the challenges and needs..."
                  />
                  <p className={`${wordCounts.question1 > 500 ? 'text-red-400' : 'text-white/60'} text-sm mt-1`}>
                    {wordCounts.question1} / 500 words
                  </p>
                </div>

                <div>
                  <Label htmlFor="question2" className="text-white block mb-2">
                    2. What have you done to help/address these issues/needs?
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Up to 500 words</Badge>
                  </Label>
                  <Textarea
                    id="question2"
                    value={formData.question2}
                    onChange={(e) => handleInputChange('question2', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Describe your efforts and contributions..."
                  />
                  <p className={`${wordCounts.question2 > 500 ? 'text-red-400' : 'text-white/60'} text-sm mt-1`}>
                    {wordCounts.question2} / 500 words
                  </p>
                </div>

                <div>
                  <Label htmlFor="question3" className="text-white block mb-2">
                    3. Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey.
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Up to 500 words</Badge>
                  </Label>
                  <Textarea
                    id="question3"
                    value={formData.question3}
                    onChange={(e) => handleInputChange('question3', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Share your achievements and contributions..."
                  />
                  <p className={`${wordCounts.question3 > 500 ? 'text-red-400' : 'text-white/60'} text-sm mt-1`}>
                    {wordCounts.question3} / 500 words
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label className="text-white">Attachments (PDF, DOC, DOCX, images) — up to 25MB total</Label>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="bg-white/10 border-white/20 text-white file:text-white"
                />
                {uploads.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {uploads.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-sm text-white/90 bg-white/5 rounded p-2">
                        <span className="truncate mr-2">{file.name}</span>
                        <button type="button" onClick={() => removeUploadAt(idx)} className="text-white/70 hover:text-white flex items-center gap-1">
                          <X className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Important Note */}
              <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-400/30">
                <CardContent className="p-4">
                  <p className="text-blue-200 text-sm">
                    <FileText className="w-4 h-4 inline mr-2" />
                    <strong>Important:</strong> A PDF of your application will be generated and attached, along with any files you upload. All components must be received by September 15, 2025.
                  </p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isPastDeadline}
                className={`w-full text-white py-4 text-lg font-semibold btn-hover ${isPastDeadline ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                <Mail className="w-5 h-5 mr-2" />
                {isPastDeadline ? 'Applications Closed' : 'Submit Application via Email'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
