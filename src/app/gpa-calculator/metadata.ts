import { Metadata } from 'next';
import { generateCalculatorStructuredData, generateCalculatorMetaTags } from '../utils/structured-data';

const structuredData = generateCalculatorStructuredData(
  'GPA Calculator | Grade Point Average Calculator',
  'Calculate your Grade Point Average (GPA) easily with our free GPA calculator. Convert letter grades to grade points and calculate cumulative GPA.'
);

export const metadata: Metadata = generateCalculatorMetaTags(
  'GPA Calculator | Grade Point Average Calculator',
  'Calculate your Grade Point Average (GPA) easily with our free GPA calculator. Convert letter grades to grade points and calculate cumulative GPA.',
  ["gpa calculator","grade point average calculator","college gpa calculator","high school gpa calculator","cumulative gpa calculator","semester gpa calculator"],
  structuredData
);