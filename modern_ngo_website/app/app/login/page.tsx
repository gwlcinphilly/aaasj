'use client'

import { signIn } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-xl mx-auto py-16">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Log in</h1>
            <p className="text-white/80 mb-8">Sign in with your AAA-SJ Google account to access private features.</p>
            <Button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              Login with AAA-SJ account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
