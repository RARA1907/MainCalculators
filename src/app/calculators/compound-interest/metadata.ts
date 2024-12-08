import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate compound interest with our easy-to-use calculator. Learn about compound interest formulas and concepts.',
  keywords: ['compound interest', 'interest calculator', 'finance calculator', 'investment calculator'],
  openGraph: {
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest with our easy-to-use calculator. Learn about compound interest formulas and concepts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest with our easy-to-use calculator. Learn about compound interest formulas and concepts.',
  },
};
