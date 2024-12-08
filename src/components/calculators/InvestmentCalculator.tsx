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
    totalContributions: number;
    totalInterest: number;
    finalBalance: number;
  } | null>(null)

  const handleInputChange = (field: keyof Inputs, value: string) => {
    const numValue = Number(value)
    setInputs(prev => ({ ...prev, [field]: numValue }))
    
    try {
      inputSchema.shape[field].parse(numValue)
      setErrors(prev => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }))
      }
    }
  }

  const calculateInvestment = () => {
    try {
      const validatedInputs = inputSchema.parse(inputs)
      
      const monthlyRate = validatedInputs.annualReturn / 100 / 12
      const totalMonths = validatedInputs.investmentPeriod * 12
      
      let balance = validatedInputs.initialInvestment
      const totalContributions = validatedInputs.initialInvestment + 
        (validatedInputs.monthlyContribution * totalMonths)
      
      for (let i = 0; i < totalMonths; i++) {
        balance += validatedInputs.monthlyContribution
        balance *= (1 + monthlyRate)
      }
      
      const finalBalance = balance
      const totalInterest = finalBalance - totalContributions
      
      setResults({
        totalContributions,
        totalInterest,
        finalBalance,
      })
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof Inputs, string>> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof Inputs] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <CalculatorLayout
      title="Investment Calculator"
      description="Calculate the potential growth of your investment over time with regular contributions."
      inputs={[
        {
          label: 'Initial Investment ($)',
          type: 'number',
          value: inputs.initialInvestment,
          onChange: (e) => handleInputChange('initialInvestment', e.target.value),
          error: errors.initialInvestment,
        },
        {
          label: 'Monthly Contribution ($)',
          type: 'number',
          value: inputs.monthlyContribution,
          onChange: (e) => handleInputChange('monthlyContribution', e.target.value),
          error: errors.monthlyContribution,
        },
        {
          label: 'Annual Return (%)',
          type: 'number',
          value: inputs.annualReturn,
          onChange: (e) => handleInputChange('annualReturn', e.target.value),
          error: errors.annualReturn,
        },
        {
          label: 'Investment Period (Years)',
          type: 'number',
          value: inputs.investmentPeriod,
          onChange: (e) => handleInputChange('investmentPeriod', e.target.value),
          error: errors.investmentPeriod,
        },
      ]}
      onCalculate={calculateInvestment}
      results={results ? [
        {
          label: 'Total Contributions',
          value: `$${results.totalContributions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        {
          label: 'Total Interest Earned',
          value: `$${results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        {
          label: 'Final Balance',
          value: `$${results.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      ] : []}
    />
  )
}
