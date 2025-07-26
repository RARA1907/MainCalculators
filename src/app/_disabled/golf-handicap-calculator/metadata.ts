import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Golf Handicap Calculator | Golf Index Calculator',
  'Calculate your golf handicap index easily with our golf handicap calculator. Track your scores, course ratings, and slope ratings to determine your official handicap.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Golf Handicap Calculator | Golf Index Calculator',
  'Calculate your golf handicap index easily with our golf handicap calculator. Track your scores, course ratings, and slope ratings to determine your official handicap.',
  ["golf handicap calculator","golf index calculator","golf handicap index","course handicap calculator","golf score calculator","USGA handicap calculator"],
  structuredData
);