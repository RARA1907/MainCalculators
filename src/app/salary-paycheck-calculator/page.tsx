import { Metadata } from 'next'
import SalaryPaycheckCalculatorClient from './SalaryPaycheckCalculatorClient'

export const metadata: Metadata = {
  title: 'Salary Paycheck Calculator',
  description: 'Calculate your take-home pay with AI-powered financial analysis. Free salary calculator with tax estimates, deductions, and personalized financial insights.',
  keywords: ['salary calculator', 'paycheck calculator', 'take home pay', 'tax calculator', 'salary after tax', 'payroll calculator'],
  openGraph: {
    title: 'Salary Paycheck Calculator - Calculate Take-Home Pay with AI Analysis',
    description: 'Calculate your take-home pay with AI-powered financial analysis. Free salary calculator with tax estimates and deductions.',
    type: 'website',
    url: 'https://maincalculators.com/salary-paycheck-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salary Paycheck Calculator - Calculate Take-Home Pay with AI Analysis',
    description: 'Calculate your take-home pay with AI-powered financial analysis. Free salary calculator with tax estimates and deductions.',
  },
  alternates: {
    canonical: 'https://maincalculators.com/salary-paycheck-calculator',
  },
}

export default function SalaryPaycheckCalculatorPage() {
  return <SalaryPaycheckCalculatorClient />
} 