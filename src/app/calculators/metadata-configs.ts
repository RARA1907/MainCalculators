interface CalculatorMetadata {
  title: string;
  description: string;
  keywords: string[];
}

interface CalculatorMetadataConfig {
  [key: string]: CalculatorMetadata;
}

export const calculatorMetadata: CalculatorMetadataConfig = {
  'mortgage-payoff-calculator': {
    title: 'Mortgage Payoff Calculator | Calculate Your Mortgage Payoff Strategy',
    description: 'Use our mortgage payoff calculator to determine how quickly you can pay off your mortgage and how much you can save in interest with different payment strategies.',
    keywords: ['mortgage payoff calculator', 'mortgage calculator', 'loan payoff', 'early mortgage payoff', 'mortgage payment calculator'],
  },
  'house-affordability-calculator': {
    title: 'House Affordability Calculator | How Much House Can You Afford?',
    description: 'Calculate how much house you can afford based on your income, debt, down payment, and other financial factors with our comprehensive house affordability calculator.',
    keywords: ['house affordability calculator', 'home affordability', 'mortgage affordability', 'home buying calculator', 'house payment calculator'],
  },
  'rent-calculator': {
    title: 'Rent Calculator | Calculate Monthly Rent Payments',
    description: 'Calculate your monthly rent payments and determine what you can afford with our rent calculator. Factor in utilities, insurance, and other costs.',
    keywords: ['rent calculator', 'rental payment calculator', 'monthly rent calculator', 'apartment rent calculator', 'rental cost calculator'],
  },
  'debt-to-income-calculator': {
    title: 'Debt-to-Income Ratio Calculator | DTI Calculator',
    description: 'Calculate your debt-to-income ratio (DTI) to understand your financial health and mortgage qualification potential with our easy-to-use DTI calculator.',
    keywords: ['debt to income calculator', 'DTI calculator', 'debt ratio calculator', 'mortgage qualification calculator'],
  },
  'real-estate-calculator': {
    title: 'Real Estate Calculator | Investment Property Analysis',
    description: 'Analyze real estate investments with our comprehensive calculator. Calculate ROI, cash flow, cap rate, and other key metrics for property investments.',
    keywords: ['real estate calculator', 'property investment calculator', 'ROI calculator', 'rental property calculator'],
  },
  'refinance-calculator': {
    title: 'Refinance Calculator | Should You Refinance Your Mortgage?',
    description: 'Determine if refinancing your mortgage makes financial sense. Calculate potential savings, break-even point, and new monthly payments.',
    keywords: ['refinance calculator', 'mortgage refinance calculator', 'refinancing calculator', 'loan refinance calculator'],
  },
  'amortization-calculator': {
    title: 'Amortization Calculator | Loan Amortization Schedule',
    description: 'Generate a detailed loan amortization schedule and calculate your monthly payments with our amortization calculator.',
    keywords: ['amortization calculator', 'loan amortization', 'payment schedule calculator', 'mortgage amortization'],
  },
  'compound-interest-calculator': {
    title: 'Compound Interest Calculator | Calculate Investment Growth',
    description: 'Calculate how your investments will grow over time with our compound interest calculator. Plan your savings and investment strategy.',
    keywords: ['compound interest calculator', 'investment calculator', 'savings calculator', 'interest calculator'],
  }
};
