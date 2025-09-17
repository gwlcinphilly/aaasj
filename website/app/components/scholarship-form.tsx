
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar, Award, FileText, Users, DollarSign, Mail, Clock, X, Check } from 'lucide-react'
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
  const [isApplicationSaved, setIsApplicationSaved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Application deadline (local time)
  const applicationDeadline = useMemo(() => new Date('2025-09-30T23:59:59'), [])

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

  // Helper function to check if a file is a duplicate
  const isDuplicateFile = (newFile: File, existingFiles: File[]): boolean => {
    return existingFiles.some(existingFile => 
      existingFile.name === newFile.name && 
      existingFile.size === newFile.size &&
      existingFile.type === newFile.type
    )
  }

  // Helper function to remove duplicates from file array
  const removeDuplicateFiles = (files: File[]): File[] => {
    const seen = new Set<string>()
    return files.filter(file => {
      const key = `${file.name}-${file.size}-${file.type}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
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
      'image/webp'
    ])

    const maxSize = 25 * 1024 * 1024 // 25MB
    let totalSize = uploads.reduce((sum, file) => sum + file.size, 0)

    const validFiles = incoming.filter(file => {
      if (!allowedTypes.has(file.type)) {
        toast.error(`${file.name} is not a supported file type`)
        return false
      }
      if (isDuplicateFile(file, uploads)) {
        toast.error(`${file.name} is already uploaded`)
        return false
      }
      if (totalSize + file.size > maxSize) {
        toast.error(`${file.name} would exceed the 25MB total size limit`)
        return false
      }
      totalSize += file.size
      return true
    })

    if (validFiles.length > 0) {
      setUploads(prev => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added successfully`)
    }
  }

  const removeUploadAt = (idx: number) => {
    setUploads(prev => prev.filter((_, i) => i !== idx))
  }

  function generateApplicationPdf(): { blob: Blob; filename: string } {
    const doc = new jsPDF()
    const marginX = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - 2 * marginX
    let currentY = 20

    const ensurePage = (additionalHeight = 0) => {
      if (currentY + additionalHeight > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        currentY = 20
      }
      return currentY
    }

    const writeLine = (
      text: string,
      lineHeight = 14,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      fontSize = 11,
      x = marginX
    ) => {
      const y = ensurePage(lineHeight)
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', fontStyle)
      doc.text(text, x, y)
      currentY = y + lineHeight
      return currentY
    }

    const writeWrapped = (
      text: string,
      wrapWidth: number,
      lineHeight = 14,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      fontSize = 11,
      x = marginX
    ) => {
      const y = ensurePage()
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', fontStyle)
      const lines = doc.splitTextToSize(text, wrapWidth)
      const totalHeight = lines.length * lineHeight
      ensurePage(totalHeight)
      doc.text(lines, x, y)
      currentY = y + totalHeight
      return currentY
    }

    const addHeading = (text: string) => {
      return writeLine(text, 20, 'bold', 16)
    }

    const addSubheading = (text: string) => {
      return writeLine(text, 16, 'bold', 12)
    }

    const addParagraph = (text: string) => {
      return writeWrapped(text, contentWidth, 12, 'normal', 11)
    }

    const addKeyValue = (key: string, value: string) => {
      const y = ensurePage(12)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(key + ':', marginX, y)
      doc.setFont('helvetica', 'normal')
      const valueLines = doc.splitTextToSize(value, contentWidth - 50)
      doc.text(valueLines, marginX + 50, y)
      currentY = y + Math.max(12, valueLines.length * 12)
      return currentY
    }

    // Title
    addHeading('2026 AAASJ Community Service Scholarship Application')
    writeLine('', 10)

    // Student Profile
    addSubheading('STUDENT PROFILE')
    writeLine('', 8)
    addKeyValue('Student Name', formData.studentName)
    addKeyValue('Address', formData.address)
    addKeyValue('City', formData.city)
    addKeyValue('State', formData.state)
    addKeyValue('Zip', formData.zip)
    addKeyValue('Email', formData.email)
    addKeyValue('Phone', formData.phone)
    writeLine('', 8)

    // Academic Awards
    addSubheading('Academic Awards/Achievements')
    writeLine('', 8)
    addParagraph(formData.academicAwards || 'None provided')
    writeLine('', 8)

    // Volunteer Work
    addSubheading('Volunteer Work/Community Service')
    writeLine('', 8)
    addParagraph(formData.volunteerWork || 'None provided')
    writeLine('', 8)

    // Groups/Clubs
    addSubheading('Groups/Clubs/Organizations')
    writeLine('', 8)
    addParagraph(formData.groupsClubs || 'None provided')
    writeLine('', 8)

    // Essay Questions
    addSubheading('ESSAY QUESTIONS')
    writeLine('', 8)

    addSubheading('1. What do you believe are the most pressing issues or needs in the Asian American community in South Jersey?')
    writeLine('', 8)
    addParagraph(formData.question1 || 'No response provided')
    writeLine('', 8)

    addSubheading('2. What have you done to help/address these issues/needs?')
    writeLine('', 8)
    addParagraph(formData.question2 || 'No response provided')
    writeLine('', 8)

    addSubheading('3. Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey.')
    writeLine('', 8)
    addParagraph(formData.question3 || 'No response provided')

    // Generate filename with specific format
    const sanitizedName = formData.studentName.replace(/\s+/g, '_')
    const sanitizedEmail = formData.email.replace(/[@.]/g, '_')
    const filename = `2026_scholarship_${sanitizedName}_${sanitizedEmail}.pdf`

    // Create a blob for server upload only (no browser download)
    const blob = doc.output('blob')

    return { blob, filename }
  }

  const handleSaveApplication = async () => {
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

    // Generate PDF and add to attachments
    const { blob: pdfBlob, filename: pdfFilename } = generateApplicationPdf()
    
    // Create a File object from the blob
    const pdfFile = new File([pdfBlob], pdfFilename, { type: 'application/pdf' })
    
    // Add to uploads if not already present, or replace if it exists
    if (!isDuplicateFile(pdfFile, uploads)) {
      setUploads(prev => [pdfFile, ...prev])
    } else {
      // Replace existing PDF (update to latest version)
      setUploads(prev => {
        const newUploads = prev.filter(file => !(file.name === pdfFilename && file.type === 'application/pdf'))
        return [pdfFile, ...newUploads]
      })
    }

    setIsApplicationSaved(true)
    toast.success('Application saved! Your generated PDF has been added to attachments.')
  }

  const handleSubmitEmail = async () => {
    if (!isApplicationSaved) {
      toast.error('Please save your application first')
      return
    }

    console.log('=== SUBMITTING SCHOLARSHIP APPLICATION ===')
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })
      
      // Remove any duplicates as a final safeguard before sending
      const deduplicatedUploads = removeDuplicateFiles(uploads)
      if (deduplicatedUploads.length < uploads.length) {
        console.log(`Removed ${uploads.length - deduplicatedUploads.length} duplicate file(s) before sending`)
      }
      
      // Only attach deduplicated uploads (which already includes the saved PDF)
      deduplicatedUploads.forEach((file) => formDataToSend.append('files', file, file.name))
      console.log('Attaching files:', deduplicatedUploads.map(f => f.name))

      console.log('Sending to /api/scholarship/submit...')
      const res = await fetch('/api/scholarship/submit', {
        method: 'POST',
        body: formDataToSend,
      })

      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error('API Error:', err)
        throw new Error(err?.message || 'Submission failed')
      }

      const result = await res.json()
      console.log('API Success:', result)

      toast.success('Application submitted! We have emailed your application to scholarship@aaa-sj.org.')
    } catch (error: any) {
      console.error('Submission error:', error)
      toast.error(error?.message || 'Could not submit application. Please try again later.')
    } finally {
      setIsSubmitting(false)
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
                <p className="text-white text-2xl font-bold text-center">September 30, 2025</p>
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

        {/* Application Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Award className="w-6 h-6" />
              Application Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSaveApplication(); }}>
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName" className="text-white block mb-2">
                    Student Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white block mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white block mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white block mb-2">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-white block mb-2">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    placeholder="City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="state" className="text-white block mb-2">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      placeholder="NJ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-white block mb-2">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      placeholder="08000"
                    />
                  </div>
                </div>
              </div>

              {/* Academic & Activities */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="academicAwards" className="text-white block mb-2">
                    Academic Awards/Achievements
                  </Label>
                  <Textarea
                    id="academicAwards"
                    value={formData.academicAwards}
                    onChange={(e) => handleInputChange('academicAwards', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="List any academic awards, honors, or achievements..."
                  />
                </div>

                <div>
                  <Label htmlFor="volunteerWork" className="text-white block mb-2">
                    Volunteer Work/Community Service
                  </Label>
                  <Textarea
                    id="volunteerWork"
                    value={formData.volunteerWork}
                    onChange={(e) => handleInputChange('volunteerWork', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="Describe your volunteer work and community service activities..."
                  />
                </div>

                <div>
                  <Label htmlFor="groupsClubs" className="text-white block mb-2">
                    Groups/Clubs/Organizations
                  </Label>
                  <Textarea
                    id="groupsClubs"
                    value={formData.groupsClubs}
                    onChange={(e) => handleInputChange('groupsClubs', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px]"
                    placeholder="List any groups, clubs, or organizations you're involved with..."
                  />
                </div>
              </div>

              {/* Essay Questions */}
              <div className="space-y-6">
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
                    <div className="text-xs text-white/70 mb-2">
                      {uploads.length} file{uploads.length !== 1 ? 's' : ''} uploaded 
                      ({(uploads.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)).toFixed(1)}MB total)
                    </div>
                    {uploads.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex items-center justify-between text-sm text-white/90 bg-white/5 rounded p-2">
                        <div className="truncate mr-2">
                          <span>{file.name}</span>
                          <span className="text-white/50 ml-2">({(file.size / (1024 * 1024)).toFixed(1)}MB)</span>
                        </div>
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
                    <strong>Important:</strong> A PDF of your application will be generated and attached, along with any files you upload. Duplicate files are automatically detected and removed. All components must be received by September 15, 2025.
                  </p>
                </CardContent>
              </Card>

              {/* Step 1: Save Application Button */}
              <Button 
                type="submit" 
                disabled={isPastDeadline}
                className={`w-full text-white py-4 text-lg font-semibold btn-hover ${isPastDeadline ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                <FileText className="w-5 h-5 mr-2" />
                {isPastDeadline ? 'Applications Closed' : 'Save Application'}
              </Button>
            </form>

            {/* Step 2: Submit Email Button (only shown after saving) */}
            {isApplicationSaved && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400 bg-green-500/20 p-3 rounded">
                  <Check className="w-5 h-5" />
                  <span>Application saved! Your generated PDF has been added to attachments.</span>
                </div>
                
                <Button 
                  onClick={handleSubmitEmail}
                  disabled={isPastDeadline || isSubmitting}
                  className={`w-full text-white py-4 text-lg font-semibold btn-hover ${isPastDeadline || isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Submit Application via Email'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
