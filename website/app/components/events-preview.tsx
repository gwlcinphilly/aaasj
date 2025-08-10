
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

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

export default function EventsPreview() {
  const [isVisible, setIsVisible] = useState(false)
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

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

  // Get featured events (upcoming events, limited to 5)
  const featuredEvents = events
    .filter(event => event.status === 'upcoming')
    .slice(0, 5)

  return (
    <section ref={sectionRef} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Community <span className="gradient-text">Events</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Join us for festivals, runs, advocacy campaigns, and community service projects. 
            Everyone is welcome to be part of our growing community!
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-white/70 py-12">
            <p className="text-xl">Loading events...</p>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center text-white/70 py-12">
            <p className="text-xl">No upcoming events at the moment.</p>
            <p className="mt-2">Check back soon for new events!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={event.image || '/images/aaasj_header_bg.png'}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className={`absolute top-4 right-4 ${
                      event.status === 'upcoming' ? 'bg-orange-500' : 'bg-blue-500'
                    } text-white`}>
                      {event.category || 'Event'}
                    </Badge>
                  </div>
                  <CardContent className="p-6 text-white flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        {event.date} {event.time && `• ${event.time}`}
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        {event.location || 'Location TBD'}
                      </div>
                    </div>
                    <p className="opacity-80 text-sm leading-relaxed mb-4 flex-1">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className={`${
                        event.status === 'upcoming' 
                          ? 'border-orange-400/50 text-orange-400' 
                          : 'border-blue-400/50 text-blue-400'
                      }`}>
                        {event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </Badge>
                      {event.link && (
                        <Link href={event.link}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            {event.link === '/scholarship' ? 'Apply Now' : 'Learn More'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/events">
            <Button size="lg" className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 btn-hover">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Event Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Please Mark the <span className="gradient-text">Date</span>
              </h3>
              <p className="text-white/90 text-lg leading-relaxed">
                We want to see you again! Our community events bring people together to celebrate, 
                serve, and advocate for positive change. Join us and be part of something meaningful.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
