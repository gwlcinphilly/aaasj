import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/photoslibrary.readonly',
          hd: 'aaa-sj.org',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email ?? ''
      return email.endsWith('@aaa-sj.org')
    },
    async jwt({ token, account }) {
      if (account) {
        ;(token as any).access_token = (account as any).access_token
        ;(token as any).refresh_token = (account as any).refresh_token
        ;(token as any).expires_at = Date.now() + ((account as any).expires_in ?? 0) * 1000
      }
      return token
    },
    async session({ session, token }) {
      ;(session as any).accessToken = (token as any).access_token
      return session
    },
  },
  pages: { signIn: '/login' },
}
