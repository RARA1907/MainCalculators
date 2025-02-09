'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import { z } from 'zod'

const inputSchema = z.object({
  loanAmount: z.number().positive('Loan amount must be positive'),
  interestRate: z.number().min(0, 'Interest rate cannot be negative'),
  loanTerm: z.number().positive('Loan term must be positive'),
})

type Inputs = z.infer<typeof inputSchema>

export default function LoanCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    loanAmount: 10000,
    interestRate: 5,
    loanTerm: 3,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Inputs, string>>>({})
  const [results, setResults] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const calculateLoan = () => {
    try {
      inputSchema.parse(inputs)
      setErrors({})

      const principal = inputs.loanAmount
      const annualRate = inputs.interestRate / 100
      const monthlyRate = annualRate / 12
      const totalMonths = inputs.loanTerm * 12

      const monthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)

      const totalPayment = monthlyPayment * totalMonths
      const totalInterest = totalPayment - principal

      setResults({
        monthlyPayment,
        totalPayment,
        totalInterest,
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
      title="Loan Calculator"
      description="Calculate your monthly loan payments and total interest"
      inputs={[
        {
          label: 'Loan Amount',
          type: 'number',
          value: inputs.loanAmount,
          onChange: handleInputChange,
          error: errors.loanAmount,
          placeholder: 'Enter loan amount',
          min: 0,
          name: 'loanAmount',
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
      ]}
      onCalculate={calculateLoan}
      results={
        results && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 ">
                <div className="text-sm text-gray-600 ">Monthly Payment</div>
                <div className="text-2xl font-bold text-blue-600 ">
                  {formatCurrency(results.monthlyPayment)}
                </div>
              </div>
              <div className="p-4 bg-white/50 ">
                <div className="text-sm text-gray-600 ">Total Interest</div>
                <div className="text-2xl font-bold text-blue-600 ">
                  {formatCurrency(results.totalInterest)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 ">
              <div className="text-sm text-gray-600 ">Total Payment</div>
              <div className="text-2xl font-bold text-blue-600 ">
                {formatCurrency(results.totalPayment)}
              </div>
            </div>
          </div>
        )
      }
    />
  )
}
