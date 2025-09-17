import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
}

export async function authenticateApiRequest(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return null
    }

    const email = session.user.email
    
    // Ensure email is from authorized domain
    if (!email.endsWith('@aaa-sj.org')) {
      return null
    }

    return {
      id: email, // Use email as id since that's what's set in auth config
      email,
      name: session.user.name || undefined
    }
  } catch (error) {
    console.error('API authentication error:', error)
    return null
  }
}

export function requireAuth(handler: (req: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    const user = await authenticateApiRequest(req)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(req, user)
  }
}

export function optionalAuth(handler: (req: NextRequest, user: AuthenticatedUser | null) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    const user = await authenticateApiRequest(req)
    return handler(req, user)
  }
}
