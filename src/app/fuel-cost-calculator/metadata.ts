import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Fuel Cost Calculator | Gas Cost Calculator',
  'Calculate fuel costs for your trips based on distance, fuel efficiency, and gas prices. Plan your travel expenses with our accurate fuel cost calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Fuel Cost Calculator | Gas Cost Calculator',
  'Calculate fuel costs for your trips based on distance, fuel efficiency, and gas prices. Plan your travel expenses with our accurate fuel cost calculator.',
  ["fuel cost calculator","gas cost calculator","mileage calculator","trip cost calculator","fuel expense calculator","gas mileage calculator","road trip calculator"],
  structuredData
);