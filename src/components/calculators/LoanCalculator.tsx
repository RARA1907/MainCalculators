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
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

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

  const calculateLoanPayment = () => {
    try {
      const validatedInputs = inputSchema.parse(inputs)
      
      const monthlyInterestRate = validatedInputs.interestRate / 100 / 12
      const numberOfPayments = validatedInputs.loanTerm * 12
      
      const payment = 
        (validatedInputs.loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      
      setMonthlyPayment(Number(payment.toFixed(2)))
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
      title="Loan Calculator"
      description="Calculate your monthly loan payments based on loan amount, interest rate, and term."
      inputs={[
        {
          label: 'Loan Amount ($)',
          type: 'number',
          value: inputs.loanAmount,
          onChange: (e) => handleInputChange('loanAmount', e.target.value),
          error: errors.loanAmount,
        },
        {
          label: 'Annual Interest Rate (%)',
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
      ]}
      onCalculate={calculateLoanPayment}
      results={monthlyPayment !== null ? [
        {
          label: 'Monthly Payment',
          value: `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      ] : []}
    />
  )
}
