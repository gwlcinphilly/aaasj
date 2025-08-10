'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, AlertTriangle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  // ========================================
  // TEMPORARY: Check if this is the test user
  // TODO: REMOVE THIS SECTION LATER
  // ========================================
  const isTestUser = email.toLowerCase() === 'testuser@aaa-sj.org'

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email.endsWith('@aaa-sj.org')) {
      setError('Please use an @aaa-sj.org email address')
      setIsLoading(false)
      return
    }

    // ========================================
    // TEMPORARY: Special handling for test user
    // TODO: REMOVE THIS SECTION LATER
    // ========================================
    if (isTestUser) {
      setShowPasswordForm(true)
      setIsLoading(false)
      return
    }
    // ========================================
    // END TEMPORARY TEST USER HANDLING
    // ========================================

    // Regular Google OAuth flow for other users
    try {
      const result = await signIn('google', {
        callbackUrl: '/admin',
        redirect: false,
      })

      if (result?.error) {
        setError('Authentication failed. Please try again.')
      } else if (result?.ok) {
        router.push('/admin')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ========================================
  // TEMPORARY: Password authentication for test user
  // TODO: REMOVE THIS SECTION LATER
  // ========================================
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: 'testuser@aaa-sj.org',
        passcode: password,
        callbackUrl: '/admin',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid password. Please try again.')
      } else if (result?.ok) {
        router.push('/admin')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ========================================
  // TEMPORARY: Reset form when email changes
  // TODO: REMOVE THIS SECTION LATER
  // ========================================
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (newEmail.toLowerCase() !== 'testuser@aaa-sj.org') {
      setShowPasswordForm(false)
      setPassword('')
    }
  }
  // ========================================
  // END TEMPORARY PASSWORD HANDLING
  // ========================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-white/80">
            Sign in to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-500/20 border-red-400/30">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* ======================================== */}
          {/* TEMPORARY: Test user notice */}
          {/* TODO: REMOVE THIS SECTION LATER */}
          {/* ======================================== */}
          {isTestUser && !showPasswordForm && (
            <Alert className="mb-4 bg-orange-500/20 border-orange-400/30">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <AlertDescription className="text-orange-200">
                <strong>Temporary Test User:</strong> This account uses password authentication instead of Google OAuth.
              </AlertDescription>
            </Alert>
          )}
          {/* ======================================== */}
          {/* END TEMPORARY TEST USER NOTICE */}
          {/* ======================================== */}

          {/* ======================================== */}
          {/* TEMPORARY: Password form for test user */}
          {/* TODO: REMOVE THIS SECTION LATER */}
          {/* ======================================== */}
          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-white/90 font-medium">Test User Authentication</p>
                <p className="text-white/70 text-sm">Enter password for testuser@aaa-sj.org</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20">
                  <Mail className="w-4 h-4 text-white/70" />
                  <span className="text-white font-medium">testuser@aaa-sj.org</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPassword('')
                    setEmail('')
                  }}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* ======================================== */
            /* END TEMPORARY PASSWORD FORM */
            /* ======================================== */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    type="email"
                    placeholder="Enter your @aaa-sj.org email"
                    value={email}
                    onChange={handleEmailChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Continue with Google'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
