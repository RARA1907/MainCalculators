import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Engine Horsepower Calculator | Engine Power Calculator',
  'Calculate engine horsepower using multiple methods including displacement, compression ratio, and dyno results. Estimate engine power with our comprehensive engine horsepower calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Engine Horsepower Calculator | Engine Power Calculator',
  'Calculate engine horsepower using multiple methods including displacement, compression ratio, and dyno results. Estimate engine power with our comprehensive engine horsepower calculator.',
  ["engine horsepower calculator","engine power calculator","engine hp calculator","displacement calculator","compression ratio calculator","dyno calculator","engine performance calculator"],
  structuredData
);