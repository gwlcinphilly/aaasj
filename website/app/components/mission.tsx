
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Users, Target, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const missionPoints = [
  {
    icon: Target,
    title: "Represent & Safeguard",
    description: "We advocate for the interests and rights of Asian Americans throughout South Jersey, ensuring our community's voice is heard in local government and institutions."
  },
  {
    icon: Users,
    title: "Facilitate Communication",
    description: "Building bridges between Asian Americans and governing bodies including school boards, city councils, mayor's offices, and New Jersey state government."
  },
  {
    icon: Heart,
    title: "Foster Collaboration",
    description: "Developing meaningful relationships between Asian Americans and other ethnic groups to create a more unified and understanding community."
  }
]

export default function Mission() {
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
    <section ref={sectionRef} className="py-20 px-4 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="gradient-text">Mission</span>
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            To represent and safeguard the interests of Asian Americans in the South Jersey 
            community through advocacy, cultural celebration, and community building.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missionPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <point.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{point.title}</h3>
                  <p className="text-white/80 leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Community Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm border-orange-400/30">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-400/30 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="w-12 h-12 bg-orange-400/30 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="w-12 h-12 bg-orange-400/30 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Everyone is Welcome
                </h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  While our primary focus is serving the Asian American community in South Jersey, 
                  our doors are open to anyone who shares our values and goals. We believe in the 
                  power of unity, collaboration, and working together to build a stronger, more 
                  inclusive community for all.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
