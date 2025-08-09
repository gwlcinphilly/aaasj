
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, GraduationCap, Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FeaturedEvents() {
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

  const featuredEvents = [
    {
      id: 1,
      title: "2026 AAASJ Community Service Scholarship",
      deadline: "September 15, 2025",
      type: "Scholarship Application",
      description: "Awards up to $1,000 for Gold level, $500 for Silver, and $300 for Bronze. Open to high school juniors and seniors demonstrating academic excellence and community service.",
      keyPoints: [
        "Up to $1,000 award",
        "High school juniors & seniors",
        "Academic excellence required",
        "Community service focus"
      ],
      icon: GraduationCap,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-400/20",
      link: "/scholarship",
      buttonText: "Apply Now",
      buttonStyle: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: 2,
      title: "Mid-autumn & Wellness Festival",
      date: "October 4, 2025",
      time: "11:30 AM - 3:30 PM",
      location: "Cherry Hill Mall (Near Barnes & Noble)",
      description: "Join us for a celebration of culture, wellness, and community! Enjoy traditional moon cakes, cultural performances, wellness activities, and family fun.",
      keyPoints: [
        "Cultural performances",
        "Traditional moon cakes", 
        "Wellness activities",
        "Family-friendly event"
      ],
      icon: Users,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-400/20", 
      link: "/events",
      buttonText: "Learn More",
      buttonStyle: "bg-orange-500 hover:bg-orange-600"
    }
  ]

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
                          Deadline: {event.deadline}
                        </div>
                      )}
                      {event.date && (
                        <div className="flex items-center text-orange-400 text-sm mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          {event.date}
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
