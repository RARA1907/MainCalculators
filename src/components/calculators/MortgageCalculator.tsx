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
    interestRate: 4.5,
    loanTerm: 30,
    propertyTax: 2400,
    insurance: 1200,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>({})
  const [results, setResults] = useState<{
    monthlyPrincipalAndInterest: number
    monthlyTax: number
    monthlyInsurance: number
    totalMonthlyPayment: number
    totalLoanAmount: number
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const calculateMortgage = () => {
    try {
      inputSchema.parse(inputs)
      setErrors({})

      const loanAmount = inputs.homePrice - inputs.downPayment
      const monthlyRate = inputs.interestRate / 100 / 12
      const totalMonths = inputs.loanTerm * 12

      const monthlyPrincipalAndInterest =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)

      const monthlyTax = inputs.propertyTax / 12
      const monthlyInsurance = inputs.insurance / 12
      const totalMonthlyPayment =
        monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance

      setResults({
        monthlyPrincipalAndInterest,
        monthlyTax,
        monthlyInsurance,
        totalMonthlyPayment,
        totalLoanAmount: loanAmount,
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
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments including principal, interest, taxes, and insurance (PITI)"
      inputs={[
        {
          label: 'Home Price',
          type: 'number',
          value: inputs.homePrice,
          onChange: handleInputChange,
          error: errors.homePrice,
          placeholder: 'Enter home price',
          min: 0,
          name: 'homePrice',
        },
        {
          label: 'Down Payment',
          type: 'number',
          value: inputs.downPayment,
          onChange: handleInputChange,
          error: errors.downPayment,
          placeholder: 'Enter down payment',
          min: 0,
          name: 'downPayment',
        },
        {
          label: 'Interest Rate (%)',
          type: 'number',
          value: inputs.interestRate,
          onChange: handleInputChange,
          error: errors.interestRate,
          placeholder: 'Enter interest rate',
          min: 0,
          step: 0.1,
          name: 'interestRate',
        },
        {
          label: 'Loan Term (Years)',
          type: 'number',
          value: inputs.loanTerm,
          onChange: handleInputChange,
          error: errors.loanTerm,
          placeholder: 'Enter loan term',
          min: 1,
          name: 'loanTerm',
        },
        {
          label: 'Annual Property Tax',
          type: 'number',
          value: inputs.propertyTax,
          onChange: handleInputChange,
          error: errors.propertyTax,
          placeholder: 'Enter annual property tax',
          min: 0,
          name: 'propertyTax',
        },
        {
          label: 'Annual Insurance',
          type: 'number',
          value: inputs.insurance,
          onChange: handleInputChange,
          error: errors.insurance,
          placeholder: 'Enter annual insurance',
          min: 0,
          name: 'insurance',
        },
      ]}
      onCalculate={calculateMortgage}
      results={
        results && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 ">
                <div className="text-sm text-gray-600 ">
                  Principal & Interest
                </div>
                <div className="text-2xl font-bold text-blue-600 ">
                  {formatCurrency(results.monthlyPrincipalAndInterest)}
                </div>
              </div>
              <div className="p-4 bg-white/50 ">
                <div className="text-sm text-gray-600 ">
                  Taxes & Insurance
                </div>
                <div className="text-2xl font-bold text-blue-600 ">
                  {formatCurrency(results.monthlyTax + results.monthlyInsurance)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 ">
              <div className="text-sm text-gray-600 ">
                Total Monthly Payment
              </div>
              <div className="text-2xl font-bold text-blue-600 ">
                {formatCurrency(results.totalMonthlyPayment)}
              </div>
              <div className="mt-2 text-sm text-gray-500 ">
                Loan Amount: {formatCurrency(results.totalLoanAmount)}
              </div>
            </div>
          </div>
        )
      }
    />
  )
}
