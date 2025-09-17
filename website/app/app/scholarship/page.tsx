
import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, FileText, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AAASJ Scholarship - Community Service Scholarship',
  description: 'Learn about the AAASJ Community Service Scholarship: eligibility, awards, and recent winners. Apply online.',
}

export default function ScholarshipPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto py-12 text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AAASJ Community Service Scholarship</h1>
          <p className="text-white/90 text-lg max-w-3xl mx-auto">
            This scholarship supports Asian American students in South Jersey who demonstrate academic excellence,
            community service, and contributions to the AAPI community.
          </p>
        </div>

        {/* Awards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-yellow-500/20 backdrop-blur-sm border-yellow-400/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Gold Award</h3>
              <p className="text-yellow-400 text-2xl font-bold mb-1">$1,000</p>
              <p className="text-white/80 text-sm">1 recipient</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-400/20 backdrop-blur-sm border-gray-300/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Silver Awards</h3>
              <p className="text-gray-300 text-2xl font-bold mb-1">$500</p>
              <p className="text-white/80 text-sm">2 recipients</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-600/20 backdrop-blur-sm border-amber-500/30">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Bronze Awards</h3>
              <p className="text-amber-500 text-2xl font-bold mb-1">$300</p>
              <p className="text-white/80 text-sm">3 recipients</p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              Requirements & Criteria
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/90 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Eligibility:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Current high school junior or senior</li>
                  <li>Demonstrated community service and leadership</li>
                  <li>Commitment to attend awards ceremony (March)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">Evaluation Based On:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Academic achievements</li>
                  <li>Extracurricular activities</li>
                  <li>Community service & civic engagement</li>
                  <li>Contributions to AAPI community in South Jersey</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Winners */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Winners</h2>
          <div className="bg-white/10 border border-white/20 rounded-lg p-6">
            <ul className="space-y-2 text-white/90">
              <li>
                <span className="font-semibold">2025:</span> Scholarship Winner (name to be updated)
              </li>
              <li>
                <span className="font-semibold">2024:</span> Scholarship Winner (name to be updated)
              </li>
            </ul>
          </div>
        </div>

        {/* Apply CTA */}
        <div className="text-center">
          <Link href="/scholarship/apply">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Apply for 2026 Scholarship by Sep 30, 2025
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
