import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Horsepower Calculator | Engine Power Calculator',
  'Calculate engine horsepower and convert between different power units. Estimate engine power using torque and RPM with our accurate horsepower calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Horsepower Calculator | Engine Power Calculator',
  'Calculate engine horsepower and convert between different power units. Estimate engine power using torque and RPM with our accurate horsepower calculator.',
  ["horsepower calculator","engine power calculator","hp calculator","torque to horsepower calculator","power converter","engine performance calculator","mechanical power calculator"],
  structuredData
);