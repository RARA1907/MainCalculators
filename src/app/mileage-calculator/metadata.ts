import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  "Mileage Calculator | MPG Calculator | Fuel Economy Calculator",
  "Calculate your vehicle's fuel efficiency with our mileage calculator. Convert between MPG, L/100km, and km/L. Track fuel costs and analyze your vehicle's performance."
);

export const metadata: Metadata = generateCalculatorMetaTags(
  "Mileage Calculator | MPG Calculator | Fuel Economy Calculator",
  "Calculate your vehicle's fuel efficiency with our mileage calculator. Convert between MPG, L/100km, and km/L. Track fuel costs and analyze your vehicle's performance.",
  ["mileage calculator","mpg calculator","fuel economy calculator","fuel efficiency calculator","gas mileage calculator","km/l calculator","l/100km calculator"],
  structuredData
);