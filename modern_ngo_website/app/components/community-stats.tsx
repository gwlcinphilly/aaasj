
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Users, MapPin, Award, Heart, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
  {
    icon: Calendar,
    number: 5,
    suffix: '+',
    label: 'Years Serving Community',
    description: 'Since 2019'
  },
  {
    icon: Award,
    number: 501,
    prefix: '',
    suffix: '(c)(3)',
    label: 'Non-Profit Status',
    description: 'IRS Approved'
  },
  {
    icon: MapPin,
    number: 1,
    suffix: '',
    label: 'Primary Location',
    description: 'Cherry Hill, NJ'
  },
  {
    icon: Users,
    number: 1000,
    suffix: '+',
    label: 'Community Members',
    description: 'Growing daily'
  },
  {
    icon: Heart,
    number: 50,
    suffix: '+',
    label: 'Events Hosted',
    description: 'Festivals & Runs'
  },
  {
    icon: Target,
    number: 3,
    suffix: '',
    label: 'Active Campaigns',
    description: 'Stop Asian Hate'
  }
]

export default function CommunityStats() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedNumbers, setAnimatedNumbers] = useState<{ [key: number]: number }>({})
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
    if (isVisible) {
      stats.forEach((stat, index) => {
        let start = 0
        const end = stat.number
        const duration = 2000
        const increment = end / (duration / 16)

        const timer = setInterval(() => {
          start += increment
          if (start >= end) {
            setAnimatedNumbers(prev => ({ ...prev, [index]: end }))
            clearInterval(timer)
          } else {
            setAnimatedNumbers(prev => ({ ...prev, [index]: Math.ceil(start) }))
          }
        }, 16)

        return () => clearInterval(timer)
      })
    }
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Proudly serving the Asian American community in South Jersey with 
            dedication, transparency, and a commitment to positive change.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <stat.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-bold gradient-text mb-2 animate-count-up">
                      {stat.prefix && <span className="text-2xl mr-1">{stat.prefix}</span>}
                      {animatedNumbers[index] || 0}
                      {stat.suffix}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                    <p className="text-sm text-white/70">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Impact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border-orange-400/30">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Professional <span className="gradient-text">Leadership</span>
                  </h3>
                  <p className="text-white/90 leading-relaxed mb-6">
                    Our board comprises dedicated professionals including certified public 
                    accountants serving as treasurers, experienced lawyers, professors, 
                    and engineers - all committed to transparent and effective community service.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-white/10 rounded-full text-sm">
                      Financial Transparency
                    </div>
                    <div className="px-4 py-2 bg-white/10 rounded-full text-sm">
                      Legal Compliance
                    </div>
                    <div className="px-4 py-2 bg-white/10 rounded-full text-sm">
                      Strategic Planning
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text mb-1">2</div>
                      <div className="text-sm text-white/80">CPA Treasurers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text mb-1">10+</div>
                      <div className="text-sm text-white/80">Board Members</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
