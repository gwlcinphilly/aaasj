'use client'

import { signIn } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const handlePopupLogin = async () => {
    const currentUrl = window.location.href
    const origin = window.location.origin

    const width = 500
    const height = 650
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`

    // Open a blank popup synchronously to avoid blockers
    const popup = window.open('about:blank', 'aaasj-auth', features)

    // Use current page as callback URL so the popup returns here
    const signinPath = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(currentUrl)}`
    const fullUrl = `${origin}${signinPath}`

    if (!popup) {
      // Fallback to normal redirect if popup was blocked
      await signIn('google', { callbackUrl: currentUrl })
      return
    }

    try {
      // Navigate the popup to the Google sign-in URL
      popup.location.href = fullUrl

      // Poll: when popup returns to same-origin, close and refresh parent (stay on same page)
      const timer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(timer)
            window.location.replace(currentUrl)
            return
          }
          const sameOrigin = popup.location.origin === origin
          if (sameOrigin) {
            clearInterval(timer)
            popup.close()
            window.location.replace(currentUrl)
          }
        } catch (_) {
          // Ignore cross-origin access errors until it returns
        }
      }, 500)
    } catch (_e) {
      // If anything goes wrong, fallback to normal redirect
      popup.close()
      await signIn('google', { callbackUrl: currentUrl })
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-xl mx-auto py-16">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Log in</h1>
            <p className="text-white/80 mb-8">Sign in with your AAA-SJ Google account to access private features.</p>
            <Button
              onClick={handlePopupLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Login with AAA-SJ account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
