'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [interestRate, setInterestRate] = useState<number>(0)
  const [loanTerm, setLoanTerm] = useState<number>(0)
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)

  const calculateLoanPayment = () => {
    if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
      const monthlyInterestRate = interestRate / 100 / 12
      const numberOfPayments = loanTerm * 12
      
      const payment = 
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      
      setMonthlyPayment(Number(payment.toFixed(2)))
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
          value: loanAmount,
          onChange: (e) => setLoanAmount(Number(e.target.value))
        },
        {
          label: 'Annual Interest Rate (%)',
          type: 'number',
          value: interestRate,
          onChange: (e) => setInterestRate(Number(e.target.value))
        },
        {
          label: 'Loan Term (Years)',
          type: 'number',
          value: loanTerm,
          onChange: (e) => setLoanTerm(Number(e.target.value))
        }
      ]}
      onCalculate={calculateLoanPayment}
      results={monthlyPayment !== null ? [
        {
          label: 'Monthly Payment',
          value: `$${monthlyPayment.toLocaleString()}`
        }
      ] : []}
    />
  )
}
