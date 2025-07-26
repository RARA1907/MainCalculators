import { Metadata } from 'next';

export interface CalculatorStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    ratingCount: string;
    bestRating: string;
    worstRating: string;
  };
}

export function generateCalculatorStructuredData(
  title: string,
  description: string,
  rating?: {
    value: number;
    count: number;
  }
): CalculatorStructuredData {
  const structuredData: CalculatorStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: description,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  if (rating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toString(),
      ratingCount: rating.count.toString(),
      bestRating: '5',
      worstRating: '1'
    };
  }

  return structuredData;
}

export function generateCalculatorMetaTags(
  title: string,
  description: string,
  keywords: string[],
  structuredData: CalculatorStructuredData
): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'structured-data': JSON.stringify(structuredData),
    },
  };
}
