'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const { status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const normalizedEmail = useMemo(() => {
    const trimmed = email.trim()
    if (!trimmed) return ''
    return trimmed.includes('@') ? trimmed.toLowerCase() : `${trimmed.toLowerCase()}@aaa-sj.org`
  }, [email])

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin')
    }
  }, [status, router])

  const handleLogin = async () => {
    setError(null)
    const callbackUrl = '/admin'

    if (!normalizedEmail.endsWith('@aaa-sj.org')) {
      setError('Please use your aaa-sj.org email account')
      return
    }

    await signIn('google', { callbackUrl, login_hint: normalizedEmail } as any)
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-xl mx-auto py-16">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Log in</h1>
            <p className="text-white/80 mb-6">Use your AAA-SJ Google account to access the admin area.</p>

            <div className="space-y-3 mb-6">
              <Label htmlFor="email" className="text-white/90">AAA-SJ email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@aaa-sj.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/90"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin()
                  }}
                />
                <Button onClick={handleLogin} className="bg-red-600 hover:bg-red-700 text-white">Continue</Button>
              </div>
              {error && <p className="text-red-300 text-sm">{error}</p>}
              {!error && normalizedEmail && !normalizedEmail.endsWith('@aaa-sj.org') && (
                <p className="text-red-300 text-sm">Please enter an aaa-sj.org email</p>
              )}
            </div>

            <p className="text-white/70 text-sm">You'll be redirected to Google to authenticate. Only accounts in the aaa-sj.org domain are allowed.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
