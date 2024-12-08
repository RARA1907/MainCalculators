import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Calculate Your Monthly Payments',
  description: 'Free mortgage calculator to estimate your monthly mortgage payment. Calculate the cost of your home loan with our easy-to-use calculator.',
  keywords: [
    'mortgage calculator',
    'home loan calculator',
    'mortgage payment calculator',
    'house payment calculator',
    'monthly mortgage payment',
    'mortgage estimator',
  ],
  openGraph: {
    title: 'Mortgage Calculator - Calculate Your Monthly Payments',
    description: 'Free mortgage calculator to estimate your monthly mortgage payment. Calculate the cost of your home loan with our easy-to-use calculator.',
    type: 'website',
    images: [
      {
        url: '/images/mortgage-calculator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator - Calculate Your Monthly Payments',
    description: 'Free mortgage calculator to estimate your monthly mortgage payment. Calculate the cost of your home loan with our easy-to-use calculator.',
    images: ['/images/mortgage-calculator-twitter.jpg'],
  },
};
