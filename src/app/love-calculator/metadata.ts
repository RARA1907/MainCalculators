import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Love Calculator | Relationship Compatibility Calculator',
  'Calculate love compatibility between two names with our fun Love Calculator. A playful way to test romantic compatibility and relationship potential.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Love Calculator | Relationship Compatibility Calculator',
  'Calculate love compatibility between two names with our fun Love Calculator. A playful way to test romantic compatibility and relationship potential.',
  ["love calculator","relationship compatibility calculator","name compatibility","romance calculator","couples calculator","love meter","love test","compatibility test"],
  structuredData
);