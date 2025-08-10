import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// ========================================
// TEMPORARY TEST USER AUTHENTICATION
// TODO: REMOVE THIS ENTIRE SECTION LATER
// ========================================

// Simple encryption/decryption for temporary use
const encryptPassword = (password: string): string => {
  // Simple XOR encryption with a fixed key
  const key = 'AAASJ_TEMP_KEY_2024'
  let encrypted = ''
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    encrypted += String.fromCharCode(charCode)
  }
  return btoa(encrypted) // Base64 encode
}

const decryptPassword = (encrypted: string): string => {
  try {
    const decoded = atob(encrypted) // Base64 decode
    const key = 'AAASJ_TEMP_KEY_2024'
    let decrypted = ''
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      decrypted += String.fromCharCode(charCode)
    }
    return decrypted
  } catch (error) {
    console.error('Password decryption failed:', error)
    return ''
  }
}

// Test user configuration with encrypted password
const TEST_USERS = {
  'testuser@aaa-sj.org': {
    // Password: K9#mP2$vL7@nQ4!xR8&wE5%tY3*uI6^oA1
    encryptedPassword: encryptPassword('K9#mP2$vL7@nQ4!xR8&wE5%tY3*uI6^oA1'),
    name: 'Test User (Temporary)'
  }
}

// ========================================
// END TEMPORARY TEST USER AUTHENTICATION
// ========================================

const providers: NextAuthOptions['providers'] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.sharing',
          hd: 'aaa-sj.org',
          access_type: 'offline',
          prompt: 'consent',
          include_granted_scopes: 'true',
        },
      },
    })
  )
}

providers.push(
  CredentialsProvider({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      passcode: { label: 'Passcode', type: 'password' },
    },
    async authorize(credentials) {
      const email = (credentials?.email || '').toString().trim().toLowerCase()
      const passcode = (credentials?.passcode || '').toString()

      // ========================================
      // TEMPORARY: Check for test user first
      // TODO: REMOVE THIS SECTION LATER
      // ========================================
      if (TEST_USERS[email as keyof typeof TEST_USERS]) {
        const user = TEST_USERS[email as keyof typeof TEST_USERS]
        const decryptedPassword = decryptPassword(user.encryptedPassword)
        
        // TEMPORARY DEBUG LOGGING - REMOVE LATER
        console.log('=== TEMPORARY TEST USER AUTH ===')
        console.log('Email:', email)
        console.log('Password match:', passcode === decryptedPassword)
        console.log('=== END TEMPORARY DEBUG ===')
        
        if (passcode === decryptedPassword) {
          console.log('Test user authentication successful')
          return {
            id: email,
            email,
            name: user.name,
          }
        } else {
          console.log('Test user authentication failed')
          return null
        }
      }
      // ========================================
      // END TEMPORARY TEST USER CHECK
      // ========================================

      // Regular authentication for other users
      const expectedPasscode =
        process.env.AAASJ_ADMIN_PASSCODE || process.env.ADMIN_PASSCODE || ''

      if (!email.endsWith('@aaa-sj.org')) {
        return null
      }
      if (!expectedPasscode || passcode !== expectedPasscode) {
        return null
      }

      return {
        id: email,
        email,
        name: email.split('@')[0],
      }
    },
  })
)

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'your-fallback-secret-key-change-in-production',
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile, account }) {
      if (account?.provider === 'google') {
        const email = profile?.email ?? ''
        return email.endsWith('@aaa-sj.org')
      }
      // Credentials are validated in authorize()
      return true
    },
    async jwt({ token, account }) {
      if (account?.provider === 'google') {
        ;(token as any).access_token = (account as any).access_token
        ;(token as any).refresh_token = (account as any).refresh_token
        ;(token as any).expires_at =
          Date.now() + ((account as any).expires_in ?? 0) * 1000
      }
      return token
    },
    async session({ session, token }) {
      ;(session as any).accessToken = (token as any).access_token
      if ((token as any).expires_at) {
        ;(session as any).accessTokenExpires = (token as any).expires_at
      }
      return session
    },
  },
  pages: { signIn: '/login' },
}
