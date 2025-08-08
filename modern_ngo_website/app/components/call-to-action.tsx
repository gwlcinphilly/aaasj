
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, Heart, Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CallToAction() {
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
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Our <span className="gradient-text">Community</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Be part of a growing movement that represents, unites, and amplifies Asian American 
            voices in South Jersey. Everyone is welcome to make a difference together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scholarship">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 btn-hover">
                <Calendar className="w-5 h-5 mr-2" />
                Apply for Scholarship
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 btn-hover">
                <Users className="w-5 h-5 mr-2" />
                Mid-autumn Festival
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
              <CardContent className="p-8 text-center text-white">
                <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Attend Events</h3>
                <p className="opacity-90 mb-6 leading-relaxed">
                  Join our AAPI festivals, 5K runs, and community gatherings. 
                  Connect with neighbors and celebrate our shared heritage.
                </p>
                <Link href="/events">
                  <Button variant="outline" className="border-orange-400/50 text-orange-400 hover:bg-orange-400 hover:text-white">
                    View Events
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
              <CardContent className="p-8 text-center text-white">
                <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Volunteer</h3>
                <p className="opacity-90 mb-6 leading-relaxed">
                  Help organize events, support community service projects, 
                  and contribute your skills to meaningful causes.
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="border-orange-400/50 text-orange-400 hover:bg-orange-400 hover:text-white">
                    Get Involved
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
              <CardContent className="p-8 text-center text-white">
                <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">Advocate</h3>
                <p className="opacity-90 mb-6 leading-relaxed">
                  Support our advocacy campaigns, raise awareness about important issues, 
                  and help build bridges between communities.
                </p>
                <Link href="/about">
                  <Button variant="outline" className="border-orange-400/50 text-orange-400 hover:bg-orange-400 hover:text-white">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border-orange-400/30">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Building Bridges, <span className="gradient-text">Creating Unity</span>
              </h3>
              <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                Since 2019, we've been working to represent and safeguard the interests of 
                Asian Americans in South Jersey while fostering collaboration with all communities. 
                Together, we can create positive change and build a more inclusive future.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  501(c)(3) Non-Profit
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  Volunteer-Driven
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  Community Focused
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  Everyone Welcome
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
