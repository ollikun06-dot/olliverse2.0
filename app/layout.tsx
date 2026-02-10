import React from "react"
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import { SWRProvider } from '@/components/swr-provider'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'OlliVerse - Your RPG Manga Quest',
  description: 'Level up your manga game. Explore, discover, and read thousands of titles in a wild 3D RPG-inspired experience.',
}

export const viewport: Viewport = {
  themeColor: '#0b0d14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased`}>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
