'use client'

import { useState } from 'react'
import LoanCalculator from '../components/calculators/LoanCalculator'
import MortgageCalculator from '../components/calculators/MortgageCalculator'
import InvestmentCalculator from '../components/calculators/InvestmentCalculator'
import * as Tabs from '@radix-ui/react-tabs'
import { Calculator, Home, PiggyBank } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('loan')

  const calculators = [
    {
      id: 'loan',
      name: 'Loan Calculator',
      description: 'Calculate monthly loan payments and total interest',
      component: LoanCalculator,
      icon: Calculator,
    },
    {
      id: 'mortgage',
      name: 'Mortgage Calculator',
      description: 'Calculate monthly mortgage payments including PITI',
      component: MortgageCalculator,
      icon: Home,
    },
    {
      id: 'investment',
      name: 'Investment Calculator',
      description: 'Plan your investments and calculate potential returns',
      component: InvestmentCalculator,
      icon: PiggyBank,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Financial Calculators Hub
        </h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Make informed financial decisions with our suite of calculators
        </p>

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-4xl mx-auto"
        >
          <Tabs.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 p-1 mb-8">
            {calculators.map((calc) => (
              <Tabs.Trigger
                key={calc.id}
                value={calc.id}
                className={`w-full rounded-lg py-3 px-4 text-sm font-medium transition-all focus:outline-none flex items-center justify-center gap-2
                  ${
                    activeTab === calc.id
                      ? 'bg-white text-gray-900 shadow dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
              >
                {calc.icon && <calc.icon className="w-4 h-4" />}
                {calc.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {calculators.map((calc) => (
            <Tabs.Content
              key={calc.id}
              value={calc.id}
              className="focus:outline-none"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {calc.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {calc.description}
                </p>
                <calc.component />
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </main>
  )
}
