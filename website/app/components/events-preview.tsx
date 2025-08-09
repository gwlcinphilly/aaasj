
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const featuredEvents = [
  {
    id: 1,
    title: "2026 AAASJ Community Service Scholarship Application",
    date: "Deadline: September 15, 2025",
    time: "Apply Now", 
    location: "Online Application",
    description: "Apply for our community service scholarship! Awards up to $1,000 for Gold level, $500 for Silver, and $300 for Bronze. Open to high school juniors and seniors demonstrating academic excellence and community service.",
    image: "/images/event_flyer_1.png",
    category: "Scholarship",
    status: "upcoming",
    link: "/scholarship"
  },
  {
    id: 2,
    title: "Mid-autumn & Wellness Festival",
    date: "October 4, 2025",
    time: "11:30 AM - 3:30 PM", 
    location: "Hung Fa Supermarket Parking Lot",
    description: "Celebrate Mid-autumn Festival with our community! Traditional foods, wellness activities, cultural performances, and family-friendly entertainment. Rain date: October 5, 2025.",
    image: "/images/event_flyer_2.png",
    category: "Festival",
    status: "upcoming"
  },
  {
    id: 3,
    title: "5th Annual AAPI Heritage Month Festival",
    date: "May 18, 2025",
    time: "12:00 PM - 3:30 PM", 
    location: "Cherry Hill West High School, 2101 Chapel Ave",
    description: "Join us for our annual celebration of Asian American and Pacific Islander heritage with cultural performances, food, music, crafts, and community activities. Free admission for the public!",
    image: "/images/event_flyer_2.png",
    category: "Festival",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Leon Chen Community Service Scholarship Dinner",
    date: "March 22, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "TBD - South Jersey",
    description: "Annual scholarship dinner honoring community service and supporting Asian American students in South Jersey. Join us for an evening of recognition and celebration.",
    image: "/images/event_flyer_1.png",
    category: "Scholarship",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Community Service Day 2024",
    date: "November 12, 2024",
    location: "Various locations in South Jersey",
    description: "Volunteers came together to serve local food banks, community centers, and support families in need throughout South Jersey.",
    image: "/images/aaasj_header_bg.png",
    category: "Service",
    status: "completed",
    attendees: 85
  }
]

export default function EventsPreview() {
  const [isVisible, setIsVisible] = useState(false)
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
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className={`absolute top-4 right-4 ${
                    event.status === 'upcoming' ? 'bg-orange-500' : 'bg-blue-500'
                  } text-white`}>
                    {event.category}
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
                      {event.location}
                    </div>
                    {event.attendees && (
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Users className="w-4 h-4 text-orange-400 flex-shrink-0" />
                        {event.attendees} attended
                      </div>
                    )}
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
                          Apply Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
