import { Metadata } from 'next'
import AIKeywordPlannerClient from './AIKeywordPlannerClient'

export const metadata: Metadata = {
  title: 'AI Keyword Planner - Advanced SEO Keyword Strategy Tool',
  description: 'Create comprehensive keyword strategies with AI-powered planning features. Advanced keyword research tool for content strategy and SEO optimization.',
  keywords: ['keyword planner', 'SEO strategy', 'keyword research', 'content planning', 'AI keyword tool', 'SEO planning'],
  openGraph: {
    title: 'AI Keyword Planner - Advanced SEO Keyword Strategy Tool',
    description: 'Create comprehensive keyword strategies with AI-powered planning features. Advanced keyword research tool for content strategy.',
    type: 'website',
    url: 'https://maincalculators.com/ai-keyword-planner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Keyword Planner - Advanced SEO Keyword Strategy Tool',
    description: 'Create comprehensive keyword strategies with AI-powered planning features. Advanced keyword research tool for content strategy.',
  },
  alternates: {
    canonical: 'https://maincalculators.com/ai-keyword-planner',
  },
}

export default function AIKeywordPlannerPage() {
  return <AIKeywordPlannerClient />
} 