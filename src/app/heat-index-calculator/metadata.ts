import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Heat Index Calculator | Feels Like Temperature Calculator',
  'Calculate heat index and real feel temperature based on air temperature and humidity. Determine how hot it actually feels outside with our heat index calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Heat Index Calculator | Feels Like Temperature Calculator',
  'Calculate heat index and real feel temperature based on air temperature and humidity. Determine how hot it actually feels outside with our heat index calculator.',
  ["heat index calculator","feels like calculator","humidity calculator","real feel calculator","weather calculator","temperature calculator","heat stress calculator"],
  structuredData
);