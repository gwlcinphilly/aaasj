import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Supported - AAASJ',
  description: 'Acknowledging the generous supporters of AAASJ and our community events.',
}

export default function SupportedPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto py-12 text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Supporters</h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            We are grateful for the generous support from individuals, organizations, and partners who make our
            community programs and events possible.
          </p>
        </div>

        <div className="space-y-6">
          <Card id="community-partners" className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-3">Community Partners</h2>
              <ul className="list-disc list-inside text-white/90 space-y-1">
                <li>To be announced</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="event-sponsors" className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-3">Event Sponsors</h2>
              <ul className="list-disc list-inside text-white/90 space-y-1">
                <li>To be announced</li>
              </ul>
            </CardContent>
          </Card>

          <Card id="individual-donors" className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-3">Individual Donors</h2>
              <ul className="list-disc list-inside text-white/90 space-y-1">
                <li>To be announced</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
