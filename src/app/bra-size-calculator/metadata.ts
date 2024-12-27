import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Bra Size Calculator | Find Your Perfect Bra Size',
  'Calculate your perfect bra size with our easy-to-use calculator. Get accurate measurements and find your ideal band and cup size for maximum comfort.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Bra Size Calculator | Find Your Perfect Bra Size',
  'Calculate your perfect bra size with our easy-to-use calculator. Get accurate measurements and find your ideal band and cup size for maximum comfort.',
  ["bra size calculator","bra measurement calculator","cup size calculator","band size calculator","bra fitting calculator","find my bra size","measure bra size"],
  structuredData
);