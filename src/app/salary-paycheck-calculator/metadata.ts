import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Salary Paycheck Calculator - Calculate Take-Home Pay with AI Analysis',
  description: 'Calculate your take-home pay with our comprehensive salary paycheck calculator. Get AI-powered financial analysis, tax optimization tips, and personalized recommendations for your income.',
  keywords: 'salary calculator, paycheck calculator, take-home pay, tax calculator, salary after taxes, paycheck analysis, AI financial analysis, tax optimization',
  alternates: {
    canonical: 'https://www.maincalculators.com/salary-paycheck-calculator'
  },
  openGraph: {
    title: 'Salary Paycheck Calculator - Calculate Take-Home Pay with AI Analysis',
    description: 'Calculate your take-home pay with our comprehensive salary paycheck calculator. Get AI-powered financial analysis, tax optimization tips, and personalized recommendations.',
    url: 'https://www.maincalculators.com/salary-paycheck-calculator',
    type: 'website',
    siteName: 'Main Calculators',
    images: [
      {
        url: '/images/salary-paycheck-calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Salary Paycheck Calculator - Financial Analysis Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salary Paycheck Calculator - Calculate Take-Home Pay with AI Analysis',
    description: 'Calculate your take-home pay with our comprehensive salary paycheck calculator. Get AI-powered financial analysis, tax optimization tips, and personalized recommendations.',
    images: ['/images/salary-paycheck-calculator-twitter.jpg']
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