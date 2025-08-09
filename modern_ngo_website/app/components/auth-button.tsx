'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
          Log in
        </Button>
      </Link>
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
