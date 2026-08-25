import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/ui/SmoothScrollProvider'
import GlobalAmbientBackground from '@/components/ui/GlobalAmbientBackground'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins'
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'The Three Amigos - AI Marketing & Content Production Agency',
  description: 'We help brands grow faster with AI-powered marketing, strategic social media management, in-house video production, influencer collaborations, and performance digital campaigns.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico?v=5', sizes: 'any' },
      { url: '/favicon-16x16.png?v=5', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png?v=5', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48x48.png?v=5', type: 'image/png', sizes: '48x48' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=5', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=5',
  },
  manifest: '/site.webmanifest?v=5',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#D6003C' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=5" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=5" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=5" />
        <link rel="manifest" href="/site.webmanifest?v=5" />
      </head>
      <body className="antialiased font-inter bg-[#FDFBFF] text-neutral-black relative">
        {/*
          GlobalAmbientBackground — renders the full premium background system
          (cursor orb, particle canvas, 4-layer parallax, SVG illustrations,
          ambient blobs, light streaks) on EVERY page without any per-page code.
          It is absolute-positioned so it fills each page's scroll height.
          z-index: 0 — always behind all page content.
        */}
        <GlobalAmbientBackground />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
