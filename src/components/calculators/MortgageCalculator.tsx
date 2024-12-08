'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import { z } from 'zod'

const inputSchema = z.object({
  homePrice: z.number().positive('Home price must be positive'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative'),
  loanTerm: z.number().positive('Loan term must be positive'),
  propertyTax: z.number().min(0, 'Property tax cannot be negative'),
  insurance: z.number().min(0, 'Insurance cannot be negative'),
})

type Inputs = z.infer<typeof inputSchema>

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    homePrice: 300000,
    downPayment: 60000,
    interestRate: 3.5,
    loanTerm: 30,
    propertyTax: 2400,
    insurance: 1200,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>({})
  const [results, setResults] = useState<{
    monthlyPrincipalInterest: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
    totalMonthlyPayment: number;
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

  const calculateMortgage = () => {
    try {
      const validatedInputs = inputSchema.parse(inputs)
      
      const loanAmount = validatedInputs.homePrice - validatedInputs.downPayment
      const monthlyInterestRate = validatedInputs.interestRate / 100 / 12
      const numberOfPayments = validatedInputs.loanTerm * 12
      
      const monthlyPrincipalInterest = 
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      
      const monthlyPropertyTax = validatedInputs.propertyTax / 12
      const monthlyInsurance = validatedInputs.insurance / 12
      const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance
      
      setResults({
        monthlyPrincipalInterest,
        monthlyPropertyTax,
        monthlyInsurance,
        totalMonthlyPayment,
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
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments including principal, interest, taxes, and insurance (PITI)."
      inputs={[
        {
          label: 'Home Price ($)',
          type: 'number',
          value: inputs.homePrice,
          onChange: (e) => handleInputChange('homePrice', e.target.value),
          error: errors.homePrice,
        },
        {
          label: 'Down Payment ($)',
          type: 'number',
          value: inputs.downPayment,
          onChange: (e) => handleInputChange('downPayment', e.target.value),
          error: errors.downPayment,
        },
        {
          label: 'Interest Rate (%)',
          type: 'number',
          value: inputs.interestRate,
          onChange: (e) => handleInputChange('interestRate', e.target.value),
          error: errors.interestRate,
        },
        {
          label: 'Loan Term (Years)',
          type: 'number',
          value: inputs.loanTerm,
          onChange: (e) => handleInputChange('loanTerm', e.target.value),
          error: errors.loanTerm,
        },
        {
          label: 'Annual Property Tax ($)',
          type: 'number',
          value: inputs.propertyTax,
          onChange: (e) => handleInputChange('propertyTax', e.target.value),
          error: errors.propertyTax,
        },
        {
          label: 'Annual Insurance ($)',
          type: 'number',
          value: inputs.insurance,
          onChange: (e) => handleInputChange('insurance', e.target.value),
          error: errors.insurance,
        },
      ]}
      onCalculate={calculateMortgage}
      results={results ? [
        {
          label: 'Principal & Interest',
          value: `$${results.monthlyPrincipalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        {
          label: 'Property Tax',
          value: `$${results.monthlyPropertyTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        {
          label: 'Insurance',
          value: `$${results.monthlyInsurance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        {
          label: 'Total Monthly Payment',
          value: `$${results.totalMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      ] : []}
    />
  )
}
