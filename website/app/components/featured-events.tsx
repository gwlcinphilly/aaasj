
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, GraduationCap, Users, ArrowRight } from 'lucide-react'
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

export default function FeaturedEvents() {
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

  // Get featured events (upcoming events, limited to 2)
  const featuredEvents = events
    .filter(event => event.status === 'upcoming')
    .slice(0, 2)
    .map(event => {
      const isScholarship = event.category?.toLowerCase().includes('scholarship') || 
                           event.title.toLowerCase().includes('scholarship')
      
      return {
        id: event.id,
        title: event.title,
        deadline: event.date,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description || '',
        keyPoints: isScholarship ? [
          "Up to $1,000 award",
          "High school juniors & seniors", 
          "Academic excellence required",
          "Community service focus"
        ] : [
          "Cultural performances",
          "Community activities",
          "Family-friendly event",
          "Free admission"
        ],
        icon: isScholarship ? GraduationCap : Users,
        iconColor: isScholarship ? "text-blue-400" : "text-orange-400",
        iconBg: isScholarship ? "bg-blue-400/20" : "bg-orange-400/20",
        link: event.link || "/events",
        buttonText: isScholarship ? "Apply Now" : "Learn More",
        buttonStyle: isScholarship ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"
      }
    })

  if (loading) {
    return (
      <section ref={sectionRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white/70 py-12">
            <p className="text-xl">Loading featured opportunities...</p>
          </div>
        </div>
      </section>
    )
  }

  if (featuredEvents.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-white/70 py-12">
            <p className="text-xl">No featured opportunities at the moment.</p>
            <p className="mt-2">Check back soon for new events!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured <span className="gradient-text">Opportunities</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Don't miss out on these exciting opportunities to connect, learn, and grow with our community.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
                <CardContent className="p-8">
                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 ${event.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <event.icon className={`w-8 h-8 ${event.iconColor}`} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {event.title}
                      </h3>
                      {event.deadline && (
                        <div className="flex items-center text-orange-400 text-sm mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.deadline}
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center text-orange-400 text-sm mb-2">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.time}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center text-orange-400 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Key Points */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Key Highlights:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center text-white/80 text-sm">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={event.link}>
                    <Button 
                      className={`w-full ${event.buttonStyle} text-white font-semibold py-3 btn-hover`}
                    >
                      {event.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
