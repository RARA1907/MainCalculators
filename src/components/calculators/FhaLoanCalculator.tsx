'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

// FHA Loan Constants
const FHA_CONSTANTS = {
  minDownPayment: 0.035, // 3.5% minimum down payment
  upfrontMipRate: 0.0175, // 1.75% upfront MIP
  annualMipRate: 0.0085, // 0.85% annual MIP
  maxLoanAmount: 726200, // 2024 FHA loan limit for most areas
  highCostMaxLoan: 1089300, // 2024 FHA loan limit for high-cost areas
  minFicoScore: 580, // Minimum credit score for 3.5% down
  lowFicoMinDown: 0.10 // 10% minimum down payment for credit scores 500-579
}

export function FhaLoanCalculator() {
  // Basic inputs
  const [homePrice, setHomePrice] = useState<number>(300000)
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(3.5)
  const [interestRate, setInterestRate] = useState<number>(7.5)
  const [loanTerm, setLoanTerm] = useState<number>(30)
  const [creditScore, setCreditScore] = useState<number>(680)
  
  // Location and property type
  const [isHighCostArea, setIsHighCostArea] = useState<boolean>(false)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true)
  
  // Results
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0)
  const [loanAmount, setLoanAmount] = useState<number>(0)
  const [upfrontMip, setUpfrontMip] = useState<number>(0)
  const [monthlyMip, setMonthlyMip] = useState<number>(0)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
  const [totalPayment, setTotalPayment] = useState<number>(0)

  const calculateLoan = () => {
    // Calculate down payment amount
    const calculatedDownPayment = (homePrice * downPaymentPercent) / 100
    setDownPaymentAmount(calculatedDownPayment)

    // Calculate base loan amount
    const baseAmount = homePrice - calculatedDownPayment
    setLoanAmount(baseAmount)

    // Calculate Upfront MIP
    const calculatedUpfrontMip = baseAmount * FHA_CONSTANTS.upfrontMipRate
    setUpfrontMip(calculatedUpfrontMip)

    // Calculate Monthly MIP
    const calculatedMonthlyMip = (baseAmount * FHA_CONSTANTS.annualMipRate) / 12
    setMonthlyMip(calculatedMonthlyMip)

    // Calculate Monthly Principal & Interest
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPandI = baseAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

    // Calculate Total Monthly Payment
    const calculatedMonthlyPayment = monthlyPandI + calculatedMonthlyMip
    setMonthlyPayment(calculatedMonthlyPayment)

    // Calculate Total Payment over loan term
    const totalPaymentAmount = (calculatedMonthlyPayment * numberOfPayments) + calculatedUpfrontMip
    setTotalPayment(totalPaymentAmount)

    // Generate chart data
    generateChartData(
      calculatedDownPayment,
      baseAmount,
      calculatedUpfrontMip,
      calculatedMonthlyMip * numberOfPayments
    )
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    down: number,
    principal: number,
    upfrontMip: number,
    totalMonthlyMip: number
  ) => {
    const data = [
      { value: down, name: 'Down Payment', itemStyle: { color: '#22c55e' } },
      { value: principal, name: 'Loan Amount', itemStyle: { color: '#3b82f6' } },
      { value: upfrontMip, name: 'Upfront MIP', itemStyle: { color: '#ef4444' } },
      { value: totalMonthlyMip, name: 'Total MIP', itemStyle: { color: '#f97316' } }
    ]
    
    setChartData(data)
  }

  const getChartOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: $${params.value.toFixed(2)} (${params.percent}%)`
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Home Price',
      type: 'number',
      value: homePrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHomePrice(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'homePrice',
      placeholder: '300000'
    },
    {
      label: 'Down Payment (%)',
      type: 'number',
      value: downPaymentPercent,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDownPaymentPercent(Number(e.target.value)),
      min: creditScore >= 580 ? 3.5 : 10,
      max: 100,
      step: 0.5,
      name: 'downPaymentPercent',
      placeholder: '3.5'
    },
    {
      label: 'Interest Rate (%)',
      type: 'number',
      value: interestRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setInterestRate(Number(e.target.value)),
      min: 0,
      max: 100,
      step: 0.125,
      name: 'interestRate',
      placeholder: '7.5'
    },
    {
      label: 'Loan Term (years)',
      type: 'number',
      value: loanTerm,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setLoanTerm(Number(e.target.value)),
      min: 15,
      max: 30,
      step: 15,
      name: 'loanTerm',
      placeholder: '30'
    },
    {
      label: 'Credit Score',
      type: 'number',
      value: creditScore,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newScore = Number(e.target.value)
        setCreditScore(newScore)
        if (newScore < 580 && downPaymentPercent < 10) {
          setDownPaymentPercent(10)
        }
      },
      min: 500,
      max: 850,
      step: 1,
      name: 'creditScore',
      placeholder: '680'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-end space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isHighCostArea"
              checked={isHighCostArea}
              onChange={(e) => setIsHighCostArea(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isHighCostArea"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              High-Cost Area
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFirstTime"
              checked={isFirstTime}
              onChange={(e) => setIsFirstTime(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isFirstTime"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              First-Time Homebuyer
            </label>
          </div>
        </div>

        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Loan Limits</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${((isHighCostArea ? FHA_CONSTANTS.highCostMaxLoan : FHA_CONSTANTS.maxLoanAmount).toLocaleString())}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {isHighCostArea ? 'High-Cost Area Limit' : 'Standard FHA Limit'}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Down Payment</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${downPaymentAmount.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {downPaymentPercent}% of purchase price
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Loan Amount</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${loanAmount.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Base loan amount
          </p>
        </div>

        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <h3 className="font-semibold text-red-700 dark:text-red-300">Upfront MIP</h3>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200">
            ${upfrontMip.toFixed(2)}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {(FHA_CONSTANTS.upfrontMipRate * 100)}% of loan amount
          </p>
        </div>

        <div className="p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
          <h3 className="font-semibold text-orange-700 dark:text-orange-300">Monthly MIP</h3>
          <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
            ${monthlyMip.toFixed(2)}
          </p>
          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
            {(FHA_CONSTANTS.annualMipRate * 100)}% annual rate
          </p>
        </div>

        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Monthly Payment</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            ${monthlyPayment.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
            Principal, Interest, and MIP
          </p>
        </div>

        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">Total Cost</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            ${totalPayment.toFixed(2)}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Over {loanTerm} years
          </p>
        </div>
      </div>

      {/* Loan Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="FHA Loan Calculator Results"
          results={`Monthly Payment: $${monthlyPayment.toFixed(2)} | Loan Amount: $${loanAmount.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="FHA Loan Calculator"
      description="Calculate FHA loan amounts, payments, and mortgage insurance"
      inputs={inputs}
      onCalculate={calculateLoan}
      results={results}
    />
  )
}
