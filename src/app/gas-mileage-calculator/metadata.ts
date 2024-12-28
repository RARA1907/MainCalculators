import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Gas Mileage Calculator | MPG Calculator',
  'Calculate your vehicle\'s gas mileage (MPG) and fuel efficiency. Track fuel consumption and compare different vehicles with our accurate gas mileage calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Gas Mileage Calculator | MPG Calculator',
  'Calculate your vehicle\'s gas mileage (MPG) and fuel efficiency. Track fuel consumption and compare different vehicles with our accurate gas mileage calculator.',
  structuredData
);