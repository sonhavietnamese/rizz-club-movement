import Providers from '@/components/providers'
import '@/styles/globals.css'
import { LayoutGroup } from 'motion/react'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import localFont from 'next/font/local'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const proximaSoft = localFont({
  src: [
    {
      path: '../assets/fonts/ProximaSoft-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/ProximaSoft-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-proxima-soft',
  display: 'swap',
})

const blur = localFont({
  src: '../assets/fonts/blur.otf',
  variable: '--font-blur',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rizz Club',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${proximaSoft.variable} ${blur.variable} antialiased`}
      >
        <Providers>
          <LayoutGroup>{children}</LayoutGroup>
        </Providers>
      </body>
    </html>
  )
}
