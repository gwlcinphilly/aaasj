
'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, MapPin, Users, Calendar, Send, ExternalLink, Heart } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    interest: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Thank you for your message! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '', interest: 'general' })
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Connect with the Asian American Alliance in South Jersey. Everyone is welcome!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-4"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-4"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="interest" className="text-white mb-2 block">
                      I'm interested in...
                    </Label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white"
                    >
                      <option value="general" className="text-black">General Information</option>
                      <option value="volunteer" className="text-black">Volunteering</option>
                      <option value="events" className="text-black">Upcoming Events</option>
                      <option value="partnership" className="text-black">Partnership Opportunities</option>
                      <option value="board" className="text-black">Board Information</option>
                      <option value="advocacy" className="text-black">Advocacy Programs</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-white mb-2 block">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-4"
                      placeholder="Brief subject line"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-white mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-4"
                      placeholder="Tell us how we can help or how you'd like to get involved..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 btn-hover"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Organization Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Asian American Alliance in South Jersey</h3>
                    <p className="opacity-90 mb-3">501(c)(3) Non-profit Organization</p>
                    <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                      Established 2019
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Our Community</h3>
                    <p className="opacity-90">Serving South Jersey</p>
                    <p className="opacity-90">Registered in Cherry Hill, NJ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-400" />
                  Get Involved
                </h3>
                <div className="space-y-3">
                  <Link href="/events">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-white/20 text-white hover:bg-orange-400/20"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Join Upcoming Events
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-white/20 text-white hover:bg-orange-400/20"
                    onClick={() => {
                      document.getElementById('interest')?.focus()
                      const select = document.getElementById('interest') as HTMLSelectElement
                      if (select) select.value = 'volunteer'
                    }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Volunteer Opportunities
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-white/20 text-white hover:bg-orange-400/20"
                    onClick={() => {
                      document.getElementById('interest')?.focus()
                      const select = document.getElementById('interest') as HTMLSelectElement
                      if (select) select.value = 'partnership'
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Partnership Inquiries
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Message */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border-orange-400/30 card-hover">
              <CardContent className="p-6 text-white text-center">
                <Heart className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Everyone is Welcome</h3>
                <p className="opacity-90">
                  While our primary focus is serving the Asian American community, 
                  we welcome anyone who shares our goals and values of unity, 
                  advocacy, and community building.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Engagement */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Connect with Our <span className="gradient-text">Community</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Attend Events</h3>
                <p className="opacity-90 mb-4">Join our festivals, runs, and community gatherings</p>
                <Link href="/events">
                  <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Volunteer</h3>
                <p className="opacity-90 mb-4">Help us serve and support our community</p>
                <Button 
                  variant="outline" 
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                  onClick={() => {
                    document.getElementById('interest')?.focus()
                    const select = document.getElementById('interest') as HTMLSelectElement
                    if (select) select.value = 'volunteer'
                  }}
                >
                  Get Involved
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <Heart className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Advocate</h3>
                <p className="opacity-90 mb-4">Support our advocacy and awareness campaigns</p>
                <Link href="/about">
                  <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
