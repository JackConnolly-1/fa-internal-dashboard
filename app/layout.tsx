import type { Metadata } from 'next'
import { Bitter, Source_Sans_3, Source_Code_Pro } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

// Design system typography (frontier-angels-ds): Source Sans 3 body, Bitter display, Source Code Pro mono
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://frontierangels.com'),
  title: {
    default: 'FrontierAngels — Montana\'s Most Active Angel Investment Network',
    template: '%s | FrontierAngels',
  },
  description:
    'FrontierAngels connects 100+ accredited investors with high-growth B2B technology companies founded in Montana and the Mountain West. Apply for funding or join our investor network.',
  keywords: [
    'angel investing',
    'Montana startup funding',
    'venture capital Montana',
    'accredited investors',
    'B2B technology investment',
    'startup funding Bozeman',
    'angel investor network',
    'FrontierAngels',
  ],
  authors: [{ name: 'FrontierAngels', url: 'https://frontierangels.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://frontierangels.com',
    siteName: 'FrontierAngels',
    title: 'FrontierAngels — Montana\'s Most Active Angel Investment Network',
    description:
      'Connecting 100+ accredited investors with high-growth B2B technology companies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FrontierAngels',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FrontierAngels',
    description: 'Montana\'s most active angel investment network.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${sourceSans.variable} ${bitter.variable} ${sourceCodePro.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
