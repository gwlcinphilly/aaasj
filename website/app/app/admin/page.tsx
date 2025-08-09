'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto py-16 text-center text-white">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-2">Admin</h1>
              <p className="opacity-90">Please log in with your AAA-SJ account to access the admin page.</p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-white mb-6">Admin: Media</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Google Drive</h2>
              <p className="opacity-90 mb-4">Pick documents or images from your Drive to publish on the site.</p>
              <Button className="bg-green-700 hover:bg-green-800 text-white">Choose from Drive</Button>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Google Photos</h2>
              <p className="opacity-90 mb-4">Pick photos from your Google Photos library to feature.</p>
              <Button className="bg-green-700 hover:bg-green-800 text-white">Choose from Photos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
