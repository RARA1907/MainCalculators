'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import { z } from 'zod'

const inputSchema = z.object({
  initialInvestment: z.number().min(0, 'Initial investment cannot be negative'),
  monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative'),
  annualReturn: z.number(),
  investmentPeriod: z.number().positive('Investment period must be positive'),
})

type Inputs = z.infer<typeof inputSchema>

export default function InvestmentCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturn: 7,
    investmentPeriod: 20,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>({})
  const [results, setResults] = useState<{
    totalContributions: number
    totalInterest: number
    finalBalance: number
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const calculateInvestment = () => {
    try {
      inputSchema.parse(inputs)
      setErrors({})

      const monthlyRate = inputs.annualReturn / 100 / 12
      const totalMonths = inputs.investmentPeriod * 12

      let balance = inputs.initialInvestment
      const totalContributions =
        inputs.initialInvestment + inputs.monthlyContribution * totalMonths

      for (let i = 0; i < totalMonths; i++) {
        balance += inputs.monthlyContribution
        balance *= 1 + monthlyRate
      }

      const finalBalance = balance
      const totalInterest = finalBalance - totalContributions

      setResults({
        totalContributions,
        totalInterest,
        finalBalance,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof Inputs, string>> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof Inputs
          newErrors[field] = err.message
        })
        setErrors(newErrors)
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <CalculatorLayout
      title="Investment Calculator"
      description="Calculate the potential growth of your investment over time with regular contributions"
      inputs={[
        {
          label: 'Initial Investment',
          type: 'number',
          value: inputs.initialInvestment,
          onChange: handleInputChange,
          error: errors.initialInvestment,
          placeholder: 'Enter initial investment',
          min: 0,
          name: 'initialInvestment',
        },
        {
          label: 'Monthly Contribution',
          type: 'number',
          value: inputs.monthlyContribution,
          onChange: handleInputChange,
          error: errors.monthlyContribution,
          placeholder: 'Enter monthly contribution',
          min: 0,
          name: 'monthlyContribution',
        },
        {
          label: 'Annual Return (%)',
          type: 'number',
          value: inputs.annualReturn,
          onChange: handleInputChange,
          error: errors.annualReturn,
          placeholder: 'Enter expected return',
          step: 0.1,
          name: 'annualReturn',
        },
        {
          label: 'Investment Period (Years)',
          type: 'number',
          value: inputs.investmentPeriod,
          onChange: handleInputChange,
          error: errors.investmentPeriod,
          placeholder: 'Enter investment period',
          min: 1,
          name: 'investmentPeriod',
        },
      ]}
      onCalculate={calculateInvestment}
      results={
        results && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Contributions
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(results.totalContributions)}
                </div>
              </div>
              <div className="p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Total Interest Earned
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Final Balance
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(results.finalBalance)}
              </div>
            </div>
          </div>
        )
      }
    />
  )
}
