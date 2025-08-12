'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock, ExternalLink, Heart } from 'lucide-react'

type EventItem = {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  image?: string
  category?: string
  status: 'upcoming' | 'past'
  link?: string
}

const campaigns = [
  {
    title: 'Stop Asian Hate Campaign',
    locations: ['Rowan University', 'Philadelphia', 'Cherry Hill', 'Princeton'],
    description: 'Ongoing advocacy campaign to raise awareness and combat anti-Asian discrimination',
    icon: Heart,
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        if (!res.ok) throw new Error('Failed to fetch events')
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Separate upcoming and past events
  const upcomingEvents = events.filter(event => event.status === 'upcoming')
  const pastEvents = events.filter(event => event.status === 'past')

  // Group past events by year (descending)
  const pastByYear = pastEvents.reduce<Record<string, EventItem[]>>((acc, ev) => {
    const match = ev.date.match(/\b(20\d{2})\b/)
    const year = match ? match[1] : 'Other'
    if (!acc[year]) acc[year] = []
    acc[year].push(ev)
    return acc
  }, {})
  const years = Object.keys(pastByYear).sort((a, b) => Number(b) - Number(a))

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Loading events...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Community <span className="gradient-text">Events</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join our community celebrations, festivals, scholarships, and service projects. Everyone is welcome!
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Upcoming <span className="gradient-text">Events</span>
          </h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              <p className="text-xl">No upcoming events at the moment.</p>
              <p className="mt-2">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image 
                      src={event.image || '/pictures/aaasj_header_bg.png'} 
                      alt={event.title} 
                      fill 
                      className="object-cover" 
                    />
                    <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                      {event.category || 'Event'}
                    </Badge>
                  </div>
                  <CardContent className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        {event.date}
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2 text-sm opacity-90">
                          <Clock className="w-4 h-4 text-orange-400" />
                          {event.time}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        {event.location || 'Location TBD'}
                      </div>
                    </div>
                    <p className="opacity-90 mb-6 leading-relaxed">{event.description}</p>
                    {event.link ? (
                      <Link href={event.link}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white btn-hover">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {event.link === '/scholarship' ? 'Apply Now' : 'Learn More'}
                        </Button>
                      </Link>
                    ) : event.registrationDisabled ? (
                      <Button 
                        className="w-full bg-gray-500 text-white cursor-not-allowed" 
                        disabled
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Registration Coming Soon
                      </Button>
                    ) : (
                      <Link href="/contact">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white btn-hover">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Register for Event
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events grouped by year */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Past <span className="gradient-text">Events</span>
          </h2>
          {pastEvents.length === 0 ? (
            <div className="text-center text-white/70 py-12">
              <p className="text-xl">No past events to display.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {years.map((year) => (
                <div key={year}>
                  <h3 className="text-2xl font-bold text-white mb-6">{year}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastByYear[year].map((event) => (
                      <Card key={event.id} className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <Image 
                            src={event.image || '/pictures/aaasj_header_bg.png'} 
                            alt={event.title} 
                            fill 
                            className="object-cover" 
                          />
                          <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                            {event.category || 'Event'}
                          </Badge>
                        </div>
                        <CardContent className="p-6 text-white">
                          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center gap-2 text-sm opacity-90">
                              <Calendar className="w-4 h-4 text-orange-400" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-90">
                              <MapPin className="w-4 h-4 text-orange-400" />
                              {event.location || 'Location TBD'}
                            </div>
                          </div>
                          <p className="text-sm opacity-80 leading-relaxed">{event.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ongoing Campaigns (after Past Events) */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Advocacy <span className="gradient-text">Campaigns</span>
          </h2>
          {campaigns.map((campaign, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 card-hover mb-8">
              <CardContent className="p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <campaign.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{campaign.title}</h3>
                    <p className="opacity-90 mb-4 leading-relaxed">{campaign.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.locations.map((location, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
