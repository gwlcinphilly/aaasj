
import { Metadata } from 'next'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, MapPin, Award, Heart, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - AAASJ',
  description: 'Learn about the Asian American Alliance in South Jersey, our mission, history, and dedicated board members serving the community since 2019.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">AAASJ</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Representing, uniting, and amplifying Asian American voices in South Jersey since 2019
          </p>
        </div>
      </section>

      {/* Mission & History */}
      <section className="py-16 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-orange-400" />
                Our Mission
              </h2>
              <p className="text-lg mb-6 opacity-90 leading-relaxed">
                To represent and safeguard the interests of Asian Americans in the South Jersey community through advocacy, cultural celebration, and community building.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <p className="opacity-90">Facilitate communication between Asian Americans and governing bodies including BOE, city councils, mayor's office, and NJ state government</p>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <p className="opacity-90">Develop collaborative relationships between Asian Americans and other ethnic groups</p>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <p className="opacity-90">Promote cultural understanding and celebrate Asian American heritage</p>
                </div>
              </div>
            </div>
            <div className="aspect-video bg-white/5 rounded-xl overflow-hidden relative">
              <Image
                src="https://cdn.abacus.ai/images/3b911994-430b-4a50-b7d2-1194f8cba493.png"
                alt="AAASJ community celebration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Organization Facts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Organization <span className="gradient-text">Facts</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-center text-white">
                <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Established</h3>
                <p className="text-3xl font-bold gradient-text mb-2">2019</p>
                <p className="text-sm opacity-80">January 2019</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-center text-white">
                <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Status</h3>
                <p className="text-lg font-bold gradient-text mb-2">501(c)(3)</p>
                <p className="text-sm opacity-80">Non-profit</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-center text-white">
                <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Location</h3>
                <p className="text-lg font-bold gradient-text mb-2">Cherry Hill</p>
                <p className="text-sm opacity-80">New Jersey</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-center text-white">
                <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Operations</h3>
                <p className="text-lg font-bold gradient-text mb-2">Volunteer</p>
                <p className="text-sm opacity-80">Driven</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Board & Leadership */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Leadership & <span className="gradient-text">Board</span>
          </h2>
          <p className="text-center text-white/80 mb-12 max-w-3xl mx-auto">
            Our board comprises dedicated professionals from diverse backgrounds including accountants, lawyers, professors, and engineers, all committed to serving our community.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <div className="w-20 h-20 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accountants</h3>
                <p className="opacity-80 mb-3">Two certified public accountants serve as treasurers</p>
                <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                  Financial Oversight
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <div className="w-20 h-20 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Legal Professionals</h3>
                <p className="opacity-80 mb-3">Experienced lawyers providing legal guidance</p>
                <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                  Legal Counsel
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
              <CardContent className="p-6 text-white text-center">
                <div className="w-20 h-20 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Educators & Engineers</h3>
                <p className="opacity-80 mb-3">Professors and engineers bringing diverse expertise</p>
                <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                  Strategic Planning
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values & Community */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
              <p className="opacity-90">Everyone is welcome in our community, regardless of background</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unity</h3>
              <p className="opacity-90">Building bridges between communities and fostering collaboration</p>
            </div>
            <div className="text-white">
              <div className="w-16 h-16 bg-orange-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="opacity-90">Striving for the highest standards in community service and advocacy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
