
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AuthButton from '@/components/auth-button'
import { Menu, X, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Scholarship', href: '/scholarship' },
  { name: 'Supported', href: '/supported' },
  { name: 'Board Members', href: '/board' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Removed popup-based login; mobile login links to /login for full-page auth

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-blue-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 relative">
              <Image
                src="/pictures/aaasj_logo.png"
                alt="AAASJ Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-white hover:text-orange-400 transition-colors duration-200 ${
                  pathname === item.href ? 'text-orange-400 font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/events">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white btn-hover">
                Coming Events
              </Button>
            </Link>
            {session && (
              <Link href="/admin">
                <Button className="bg-white/10 hover:bg-white/20 text-white">Admin</Button>
              </Link>
            )}
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-orange-400 hover:bg-white/10"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900/95 backdrop-blur-md rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-white hover:text-orange-400 hover:bg-white/10 rounded-md transition-colors duration-200 ${
                    pathname === item.href ? 'text-orange-400 bg-white/10' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 grid grid-cols-2 gap-2">
                <Link href="/events">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Coming Events
                  </Button>
                </Link>
                {session ? (
                  <Link href="/admin">
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white">Admin</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Log in</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
