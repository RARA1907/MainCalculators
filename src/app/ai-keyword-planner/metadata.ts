import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Keyword Planner',
  description: 'Create comprehensive keyword strategies with AI-powered planning. Generate primary keywords, long-tail keywords, seasonal keywords, and content strategies for your SEO campaigns.',
  keywords: 'AI keyword planner, keyword strategy, SEO planning, content strategy, long-tail keywords, seasonal keywords, keyword research',
  alternates: {
    canonical: 'https://www.maincalculators.com/ai-keyword-planner'
  },
  openGraph: {
    title: 'AI Keyword Planner - Create Comprehensive SEO Keyword Strategies',
    description: 'Create comprehensive keyword strategies with AI-powered planning. Generate primary keywords, long-tail keywords, seasonal keywords, and content strategies.',
    url: 'https://www.maincalculators.com/ai-keyword-planner',
    type: 'website',
    siteName: 'Main Calculators',
    images: [
      {
        url: '/images/ai-keyword-planner-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Keyword Planner - SEO Strategy Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Keyword Planner - Create Comprehensive SEO Keyword Strategies',
    description: 'Create comprehensive keyword strategies with AI-powered planning. Generate primary keywords, long-tail keywords, seasonal keywords, and content strategies.',
    images: ['/images/ai-keyword-planner-twitter.jpg']
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