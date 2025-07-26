import { Metadata } from 'next'
import AhrefsKeywordGeneratorClient from './AhrefsKeywordGeneratorClient'

export const metadata: Metadata = {
  title: 'Ahrefs Keyword Generator - Free SEO Keyword Research Tool',
  description: 'Generate high-performing SEO keywords with AI-powered research. Free keyword generator tool for better search engine rankings and content strategy.',
  keywords: ['keyword generator', 'SEO keywords', 'keyword research', 'Ahrefs alternative', 'free keyword tool', 'SEO tool'],
  openGraph: {
    title: 'Ahrefs Keyword Generator - Free SEO Keyword Research Tool',
    description: 'Generate high-performing SEO keywords with AI-powered research. Free keyword generator tool for better search engine rankings.',
    type: 'website',
    url: 'https://maincalculators.com/ahrefs-keyword-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ahrefs Keyword Generator - Free SEO Keyword Research Tool',
    description: 'Generate high-performing SEO keywords with AI-powered research. Free keyword generator tool for better search engine rankings.',
  },
  alternates: {
    canonical: 'https://maincalculators.com/ahrefs-keyword-generator',
  },
}

export default function AhrefsKeywordGeneratorPage() {
  return <AhrefsKeywordGeneratorClient />
} 