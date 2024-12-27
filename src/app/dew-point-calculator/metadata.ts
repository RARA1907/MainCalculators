import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'Dew Point Calculator | Condensation Point Calculator',
  'Calculate dew point temperature based on air temperature and relative humidity. Determine when water vapor will condense with our dew point calculator.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'Dew Point Calculator | Condensation Point Calculator',
  'Calculate dew point temperature based on air temperature and relative humidity. Determine when water vapor will condense with our dew point calculator.',
  ["dew point calculator","condensation calculator","humidity calculator","weather calculator","temperature calculator","moisture calculator","atmospheric calculator"],
  structuredData
);