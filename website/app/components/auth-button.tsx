'use client'

import { useRef } from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const popupRef = useRef<Window | null>(null)

  if (status === 'loading') {
    return null
  }

  const openBlankPopup = () => {
    const width = 500
    const height = 650
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    const features = `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,noopener=no,noreferrer=no,width=${width},height=${height},top=${top},left=${left}`
    popupRef.current = window.open('about:blank', 'aaasj-auth', features)
  }

  const handlePopupLogin = async () => {
    const currentUrl = window.location.href
    const origin = window.location.origin

    // Ask NextAuth for the Google OAuth URL (no redirect on parent)
    const result = await signIn('google', { callbackUrl: currentUrl, redirect: false })
    const googleUrl = result?.url

    const popup = popupRef.current || window.open('about:blank', 'aaasj-auth')
    popupRef.current = popup

    if (!popup) {
      // Fallback to normal redirect
      await signIn('google', { callbackUrl: currentUrl })
      return
    }

    try {
      const targetUrl = googleUrl || `${origin}/api/auth/signin/google?callbackUrl=${encodeURIComponent(currentUrl)}`
      try {
        popup.document.write(`<!doctype html><html><head><title>Sign in...</title></head><body style=\"font-family:system-ui;margin:16px\">Redirecting to Google sign-in…<script>location.replace('${targetUrl}')</script></body></html>`)
        popup.document.close()
      } catch (_) {
        popup.location.href = targetUrl
      }
      popup.focus()

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
        } catch (_) {}
      }, 500)
    } catch (_) {
      popup.close()
      await signIn('google', { callbackUrl: currentUrl })
    } finally {
      popupRef.current = null
    }
  }

  if (!session) {
    return (
      <Button
        onMouseDown={openBlankPopup}
        onTouchStart={openBlankPopup}
        onClick={handlePopupLogin}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Log in
      </Button>
    )
  }

  const userName = session.user?.name ?? 'Account'

  return (
    <div className="flex items-center gap-3">
      <span className="text-white/90 hidden lg:inline">Hi, {userName.split(' ')[0]}</span>
      <Button onClick={() => signOut({ callbackUrl: '/' })} className="bg-white/10 text-white hover:bg-white/20">
        Sign out
      </Button>
    </div>
  )
}
