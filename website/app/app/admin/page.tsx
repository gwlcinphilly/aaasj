'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useMemo } from 'react'

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
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/80 mb-6">Welcome! Use the tools below to manage site content and media.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Google Access</h2>
              <GoogleAccessStatus />
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Events</h2>
              <p className="opacity-90 mb-4">Manage Events content on the website.</p>
              <Link href="/admin/events">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Open Events Manager</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Scholarship</h2>
              <p className="opacity-90 mb-4">Review scholarship submission mailbox.</p>
              <Link href="mailto:scholarship@aaa-sj.org">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Open Mailbox</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Google Drive</h2>
              <p className="opacity-90 mb-4">Pick documents or images from your Drive to publish on the site.</p>
              <Link href="/admin/photos">
                <Button className="bg-green-700 hover:bg-green-800 text-white">Manage Photos & Albums</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-3">Google Photos</h2>
              <p className="opacity-90 mb-4">Create albums, browse your library, and copy share links to use on the site.</p>
              <Link href="/admin/photos">
                <Button className="bg-green-700 hover:bg-green-800 text-white">Open Photos Manager</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function GoogleAccessStatus() {
  const { data: session } = useSession()
  const accessToken = (session as any)?.accessToken as string | undefined
  const expiresAt = (session as any)?.accessTokenExpires as number | undefined
  const expiresIn = useMemo(() => {
    if (!expiresAt) return null
    const ms = expiresAt - Date.now()
    return ms > 0 ? Math.round(ms / 1000) : 0
  }, [expiresAt])

  if (!accessToken) {
    return <p className="opacity-90">Not connected to Google. Sign out and sign in again with Google if needed.</p>
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accessToken)
      alert('Access token copied to clipboard')
    } catch {
      alert('Failed to copy access token')
    }
  }

  return (
    <div className="space-y-2">
      <p className="opacity-90 break-all"><span className="opacity-70">Access Token:</span> {accessToken.slice(0, 12)}…</p>
      {expiresIn !== null && (
        <p className="opacity-90"><span className="opacity-70">Expires in:</span> {expiresIn}s</p>
      )}
      <Button onClick={copy} className="bg-white/10 hover:bg-white/20 text-white">Copy access token</Button>
    </div>
  )
}
