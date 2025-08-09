
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock, ExternalLink, Heart, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events - AAASJ',
  description: 'Join our community events including AAPI festivals, 5K runs, advocacy campaigns, and cultural celebrations. Everyone is welcome!',
}

const upcomingEvents = [
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
]

const pastEvents = [
  {
    id: 3,
    title: "4th Annual AAPI Heritage Month Festival",
    date: "May 21, 2024",
    location: "Cherry Hill West High School",
    description: "Successful cultural celebration with over 600 community members attending, featuring traditional performances, food vendors, and cultural displays.",
    image: "/images/aaasj_header_bg.png",
    category: "Festival",
    attendees: 600
  },
  {
    id: 4,
    title: "Community Service Day",
    date: "November 12, 2024", 
    location: "Various locations in South Jersey",
    description: "Volunteers came together to serve local food banks, community centers, and support families in need throughout South Jersey.",
    image: "/images/aaasj_header_bg.png",
    category: "Service",
    attendees: 85
  },
  {
    id: 5,
    title: "Leon Chen Scholarship Award Ceremony",
    date: "March 25, 2024",
    location: "Cherry Hill, NJ",
    description: "Annual scholarship award ceremony recognizing outstanding Asian American students for their academic achievements and community service contributions.",
    image: "/images/aaasj_logo.png",
    category: "Scholarship",
    attendees: 120
  },
  {
    id: 6,
    title: "Community Service Day",
    date: "November 12, 2023",
    location: "Various locations in Cherry Hill",
    description: "Volunteers came together to serve local food banks and community centers.",
    image: "https://imgs.search.brave.com/nS0QOlg7w0I1TkFcx0c8C85jZbSLzTx4RLcRN-088VM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI3/MjcxNTA1OS9waG90/by9kZWxpdmVyeS1w/ZXJzb24tdXNpbmct/ZmFjZW1hc2stZGVs/aXZlcnMtcGFja2Fn/ZS10by1hLXJlc2lk/ZW5jZS13b21hbi5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/LUJuQjd3NGNwbnlj/WjJoRGxhNnpNOVB3/eGNOWmV4cUVUbGZ4/eDl2dHg5az0",
    category: "Service",
    attendees: 80
  }
]

const campaigns = [
  {
    title: "Stop Asian Hate Campaign",
    locations: ["Rowan University", "Philadelphia", "Cherry Hill", "Princeton"],
    description: "Ongoing advocacy campaign to raise awareness and combat anti-Asian discrimination",
    icon: Heart
  }
]

export default function EventsPage() {
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
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                    {event.category}
                  </Badge>
                </div>
                <CardContent className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <Clock className="w-4 h-4 text-orange-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <MapPin className="w-4 h-4 text-orange-400" />
                      {event.location}
                    </div>
                  </div>
                  <p className="opacity-90 mb-6 leading-relaxed">{event.description}</p>
                  {event.link ? (
                    <Link href={event.link}>
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white btn-hover">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </Link>
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
        </div>
      </section>

      {/* Ongoing Campaigns */}
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

      {/* Past Events */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Past <span className="gradient-text">Events</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <Card key={event.id} className="bg-white/10 backdrop-blur-sm border-white/20 card-hover">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-500 text-white">
                    {event.category}
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
                      {event.location}
                    </div>
                    {event.attendees && (
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Users className="w-4 h-4 text-orange-400" />
                        {event.attendees} attendees
                      </div>
                    )}
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Reminder */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Please Mark the <span className="gradient-text">Date</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            We want to see you again! Join our community for upcoming events and be part of something special.
          </p>
          <Link href="/contact">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg btn-hover">
              <Calendar className="w-5 h-5 mr-2" />
              View Event Calendar
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
