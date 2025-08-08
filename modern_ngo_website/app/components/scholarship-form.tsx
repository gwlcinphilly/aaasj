
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar, Award, FileText, Users, DollarSign, Mail, Clock } from 'lucide-react'
import { toast } from 'sonner'

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

  const [charCounts, setCharCounts] = useState({
    question1: 0,
    question2: 0,
    question3: 0
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Update character counts for essay questions
    if (field === 'question1' || field === 'question2' || field === 'question3') {
      setCharCounts(prev => ({ ...prev, [field]: value.length }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.studentName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check essay word limits (approximately 100 words = 500 characters)
    if (charCounts.question1 > 600 || charCounts.question2 > 600 || charCounts.question3 > 600) {
      toast.error('Please keep essay answers under 100 words each')
      return
    }

    // Create email body
    const emailBody = `
2026 AAASJ Community Service Scholarship Application

STUDENT PROFILE:
Student Name: ${formData.studentName}
Address: ${formData.address}
City: ${formData.city}
State: ${formData.state}
Zip: ${formData.zip}
Email: ${formData.email}
Phone: ${formData.phone}

Academic Awards/Achievements:
${formData.academicAwards}

Volunteer Work/Community Service:
${formData.volunteerWork}

Groups/Clubs/Organizations:
${formData.groupsClubs}

ESSAY QUESTIONS:

1. What do you believe are the most pressing issues or needs in the Asian American community in South Jersey? (Less than 100 words)
${formData.question1}

2. What have you done to help/address these issues/needs? (Less than 100 words)
${formData.question2}

3. Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey. (Less than 100 words)
${formData.question3}

Note: High school transcript will be attached separately as required.
    `.trim()

    // Create mailto link
    const subject = '2026 AAASJ Community Service Scholarship Application - ' + formData.studentName
    const mailtoLink = `mailto:scholarship@aaa-sj.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
    
    // Open email client
    window.location.href = mailtoLink
    
    toast.success('Email client opened! Please attach your transcript and send the application.')
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
          
          {/* Deadline Alert */}
          <Card className="bg-orange-500/20 backdrop-blur-sm border-orange-400/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 text-orange-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold text-lg">Application Deadline</span>
              </div>
              <p className="text-white text-2xl font-bold">September 15, 2025</p>
            </CardContent>
          </Card>
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
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Less than 100 words</Badge>
                  </Label>
                  <Textarea
                    id="question1"
                    value={formData.question1}
                    onChange={(e) => handleInputChange('question1', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Share your thoughts on the challenges and needs..."
                  />
                  <p className={`text-sm mt-1 ${charCounts.question1 > 600 ? 'text-red-400' : 'text-white/60'}`}>
                    {Math.round(charCounts.question1 / 5)} words (~{charCounts.question1} characters)
                  </p>
                </div>

                <div>
                  <Label htmlFor="question2" className="text-white block mb-2">
                    2. What have you done to help/address these issues/needs?
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Less than 100 words</Badge>
                  </Label>
                  <Textarea
                    id="question2"
                    value={formData.question2}
                    onChange={(e) => handleInputChange('question2', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Describe your efforts and contributions..."
                  />
                  <p className={`text-sm mt-1 ${charCounts.question2 > 600 ? 'text-red-400' : 'text-white/60'}`}>
                    {Math.round(charCounts.question2 / 5)} words (~{charCounts.question2} characters)
                  </p>
                </div>

                <div>
                  <Label htmlFor="question3" className="text-white block mb-2">
                    3. Please share any past community services, contributions, and achievements you have made to the Asian American community in South Jersey.
                    <Badge variant="outline" className="ml-2 border-orange-400/50 text-orange-400">Less than 100 words</Badge>
                  </Label>
                  <Textarea
                    id="question3"
                    value={formData.question3}
                    onChange={(e) => handleInputChange('question3', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[120px]"
                    placeholder="Share your achievements and contributions..."
                  />
                  <p className={`text-sm mt-1 ${charCounts.question3 > 600 ? 'text-red-400' : 'text-white/60'}`}>
                    {Math.round(charCounts.question3 / 5)} words (~{charCounts.question3} characters)
                  </p>
                </div>
              </div>

              {/* Important Note */}
              <Card className="bg-blue-500/20 backdrop-blur-sm border-blue-400/30">
                <CardContent className="p-4">
                  <p className="text-blue-200 text-sm">
                    <FileText className="w-4 h-4 inline mr-2" />
                    <strong>Important:</strong> Remember to attach your most recent high school transcript when emailing this application. All components must be received by September 15, 2025.
                  </p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold btn-hover"
              >
                <Mail className="w-5 h-5 mr-2" />
                Submit Application via Email
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
