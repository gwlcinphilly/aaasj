import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { SECURITY_CONFIG, validateOrigin, generateCSPHeader } from '@/lib/security'

// Protected API routes that require authentication
const PROTECTED_API_ROUTES = [
  '/api/events',
  '/api/photos',
  '/api/google',
  '/api/scholarship/debug',
  '/api/scholarship/test'
]

// Public API routes that don't need authentication
const PUBLIC_API_ROUTES = [
  '/api/scholarship/submit', // Public form submission
  '/api/auth' // Authentication endpoints
]

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const key = `rate_limit_${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS 
    })
    return false
  }

  if (record.count >= SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    return true
  }

  record.count++
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'

  // Apply rate limiting to all API routes
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        { 
          status: 429, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }

  // Check if this is a protected API route
  const isProtectedRoute = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))

  // Allow public routes to pass through
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Authentication required' }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      // Additional check for @aaa-sj.org email domain
      const email = token.email as string
      if (!email || !email.endsWith('@aaa-sj.org')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized domain' }),
          { 
            status: 403, 
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // CORS headers - only allow your domain
  const origin = request.headers.get('origin')
  if (validateOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin!)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Add Content Security Policy
  response.headers.set('Content-Security-Policy', generateCSPHeader())

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|pictures/).*)',
  ],
}
