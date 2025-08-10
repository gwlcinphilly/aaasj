import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

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
