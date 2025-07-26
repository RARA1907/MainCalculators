import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ahrefs Keyword Generator - Generate High-Performing SEO Keywords',
  description: 'Generate high-performing keywords for your SEO strategy with our advanced keyword research tool. Boost your website\'s visibility and drive more organic traffic.',
  keywords: 'keyword generator, SEO keywords, keyword research, Ahrefs, search volume, keyword difficulty, CPC analysis',
  alternates: {
    canonical: 'https://www.maincalculators.com/ahrefs-keyword-generator'
  },
  openGraph: {
    title: 'Ahrefs Keyword Generator - Generate High-Performing SEO Keywords',
    description: 'Generate high-performing keywords for your SEO strategy with our advanced keyword research tool.',
    url: 'https://www.maincalculators.com/ahrefs-keyword-generator',
    type: 'website',
    siteName: 'Main Calculators',
    images: [
      {
        url: '/images/ahrefs-keyword-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Ahrefs Keyword Generator - SEO Research Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahrefs Keyword Generator - Generate High-Performing SEO Keywords',
    description: 'Generate high-performing keywords for your SEO strategy with our advanced keyword research tool.',
    images: ['/images/ahrefs-keyword-generator-twitter.jpg']
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
  }
} 