import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Tire Size Calculator | Tire Comparison Calculator',
  'Compare tire sizes, calculate differences in diameter, circumference, and speedometer readings. Find the right tire size for your vehicle with our tire size calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Tire Size Calculator | Tire Comparison Calculator',
  'Compare tire sizes, calculate differences in diameter, circumference, and speedometer readings. Find the right tire size for your vehicle with our tire size calculator.',
  ["tire size calculator","tire comparison calculator","tire diameter calculator","tire circumference calculator","wheel size calculator","tire fitment calculator","speedometer calculator"],
  structuredData
);