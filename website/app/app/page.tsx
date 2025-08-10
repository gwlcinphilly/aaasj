
import Hero from '@/components/hero'
import Mission from '@/components/mission'
import FeaturedEvents from '@/components/featured-events'
import EventsPreview from '@/components/events-preview'
import CommunityStats from '@/components/community-stats'
import SharedPhotos from '@/components/shared-photos'
import CallToAction from '@/components/call-to-action'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Mission />
      <FeaturedEvents />
      <EventsPreview />
      <CommunityStats />
      <SharedPhotos />
      <CallToAction />
    </div>
  )
}
