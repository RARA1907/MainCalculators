import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Main Calculators - Our Mission, Values & Story',
  description: 'Learn about Main Calculators and our mission to provide accurate, easy-to-use calculation tools for finance, health, math, and more. Discover our story, values, and commitment to empowering users with the tools they need.',
  keywords: [
    "about main calculators", 
    "calculator tools", 
    "online calculators", 
    "financial calculators",
    "math calculators",
    "health calculators",
    "free calculation tools",
    "calculator website",
    "online math tools"
  ],
  alternates: {
    canonical: 'https://www.maincalculators.com/about'
  },
  openGraph: {
    title: 'About Us | Main Calculators - Our Mission, Values & Story',
    description: 'Learn about Main Calculators and our mission to provide accurate, easy-to-use calculation tools for finance, health, math, and more. Discover our story, values, and commitment to empowering users.',
    url: 'https://www.maincalculators.com/about',
    type: 'website',
    siteName: 'Main Calculators',
    images: [
      {
        url: '/images/about-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Main Calculators - About Us'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Main Calculators - Our Mission, Values & Story',
    description: 'Learn about Main Calculators and our mission to provide accurate, easy-to-use calculation tools for finance, health, math, and more.',
    images: ['/images/about-twitter-image.jpg']
  }
};