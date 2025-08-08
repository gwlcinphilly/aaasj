
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AAASJ - Asian American Alliance in South Jersey',
  description: 'Representing, uniting, and amplifying Asian American voices in our community since 2019. Join us for events, advocacy, and community building.',
  keywords: 'Asian American, South Jersey, community, advocacy, events, AAPI, non-profit',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
            <Header />
            <main>{children}</main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
