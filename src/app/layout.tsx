import { Inter } from 'next/font/google'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { Footer } from '@/components/layout/Footer'
import { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { ScrollToTop } from '@/components/ScrollToTop'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Main Calculators - Your Financial Calculator Hub',
    template: '%s | Main Calculators'
  },
  description: 'Access a comprehensive suite of financial calculators for all your calculation needs. Simple, accurate, and easy to use.',
  keywords: ['financial calculators', 'calculator hub', 'finance tools', 'calculation tools', 'math calculators'],
  authors: [{ name: 'Main Calculators Team' }],
  creator: 'Main Calculators',
  publisher: 'Main Calculators',
  verification: {
    google: 'google-site-verification=yKFcNDXhrn4qzd4j7miHnj8B_crVlmNJs27hwbLWZWQ'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maincalculators.com',
    siteName: 'Main Calculators',
    title: 'Main Calculators - Your Financial Calculator Hub',
    description: 'Access a comprehensive suite of financial calculators for all your calculation needs. Simple, accurate, and easy to use.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Main Calculators Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Main Calculators - Your Financial Calculator Hub',
    description: 'Access a comprehensive suite of financial calculators for all your calculation needs. Simple, accurate, and easy to use.',
    images: ['/twitter-image.jpg'],
    creator: '@maincalculators',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://maincalculators.com'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark']}
        >
          <Layout>
            {children}
            <Footer />
            <ScrollToTop />
          </Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
