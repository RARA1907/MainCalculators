import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Main Calculators - Get in Touch',
  description: 'Contact the Main Calculators team for support, feedback, or suggestions. We\'re here to help with all your calculator needs.',
  keywords: [
    "contact main calculators", 
    "calculator help", 
    "calculator support", 
    "calculator feedback",
    "main calculators contact",
    "online calculator support",
    "contact us"
  ],
  alternates: {
    canonical: 'https://www.maincalculators.com/contact'
  },
  openGraph: {
    title: 'Contact Us | Main Calculators - Get in Touch',
    description: 'Contact the Main Calculators team for support, feedback, or suggestions. We\'re here to help with all your calculator needs.',
    url: 'https://www.maincalculators.com/contact',
    type: 'website',
    siteName: 'Main Calculators',
    images: [
      {
        url: '/images/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Main Calculators'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Main Calculators - Get in Touch',
    description: 'Contact the Main Calculators team for support, feedback, or suggestions. We\'re here to help with all your calculator needs.',
    images: ['/images/contact-twitter-image.jpg']
  }
}; 