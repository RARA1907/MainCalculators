import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Swift Calculators Hub',
  description: 'Calculate how your investments grow over time with our compound interest calculator. See the power of compound interest with detailed breakdowns and visualizations.',
  keywords: ['compound interest', 'investment calculator', 'interest calculator', 'financial calculator', 'investment growth'],
  openGraph: {
    title: 'Compound Interest Calculator | Swift Calculators Hub',
    description: 'Calculate how your investments grow over time with our compound interest calculator.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator | Swift Calculators Hub',
    description: 'Calculate how your investments grow over time with our compound interest calculator.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
