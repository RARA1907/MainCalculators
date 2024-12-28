import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Gas Mileage Calculator | MPG Calculator',
  'Calculate your vehicle\'s gas mileage (MPG) and fuel efficiency. Track fuel consumption and compare different vehicles with our accurate gas mileage calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Gas Mileage Calculator | MPG Calculator',
  'Calculate your vehicle\'s gas mileage (MPG) and fuel efficiency. Track fuel consumption and compare different vehicles with our accurate gas mileage calculator.',
  ["gas mileage calculator", "mpg calculator", "fuel efficiency calculator", "miles per gallon calculator", "fuel consumption calculator", "vehicle mileage calculator", "car mpg calculator"],
  structuredData
);