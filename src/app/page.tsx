'use client'

import { useState } from 'react'
import LoanCalculator from '../components/calculators/LoanCalculator'
import MortgageCalculator from '../components/calculators/MortgageCalculator'
import InvestmentCalculator from '../components/calculators/InvestmentCalculator'

const calculators = [
  {
    id: 'loan',
    name: 'Loan Calculator',
    description: 'Calculate monthly loan payments and total interest',
    component: LoanCalculator,
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments including PITI',
    component: MortgageCalculator,
  },
  {
    id: 'investment',
    name: 'Investment Calculator',
    description: 'Project investment growth with compound interest',
    component: InvestmentCalculator,
  },
]

export default function Home() {
  const [activeCalculator, setActiveCalculator] = useState('loan')

  const ActiveCalculatorComponent = calculators.find(calc => calc.id === activeCalculator)?.component

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to MainCalculators.com</h1>
        <p className="text-xl text-gray-600">Your one-stop destination for all financial calculations</p>
      </div>

      {/* Calculator Navigation */}
      <div className="flex justify-center space-x-4">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200
              ${activeCalculator === calc.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
              }`}
          >
            {calc.name}
          </button>
        ))}
      </div>

      {/* Calculator Description */}
      <div className="text-center">
        <p className="text-gray-600">
          {calculators.find(calc => calc.id === activeCalculator)?.description}
        </p>
      </div>

      {/* Active Calculator */}
      {ActiveCalculatorComponent && <ActiveCalculatorComponent />}
    </div>
  )
}
