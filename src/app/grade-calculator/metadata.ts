import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Grade Calculator | Final Grade Calculator',
  'Calculate your final grade with our easy-to-use grade calculator. Input your assignments, tests, and their weights to determine your course grade.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Grade Calculator | Final Grade Calculator',
  'Calculate your final grade with our easy-to-use grade calculator. Input your assignments, tests, and their weights to determine your course grade.',
  ["grade calculator","final grade calculator","weighted grade calculator","course grade calculator","assignment grade calculator","test grade calculator"],
  structuredData
);