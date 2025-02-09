'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface TaxBracket {
  rate: number
  min: number
  max: number | null
}

const FEDERAL_TAX_BRACKETS_2024: TaxBracket[] = [
  { rate: 10, min: 0, max: 11600 },
  { rate: 12, min: 11600, max: 47150 },
  { rate: 22, min: 47150, max: 100525 },
  { rate: 24, min: 100525, max: 191950 },
  { rate: 32, min: 191950, max: 243725 },
  { rate: 35, min: 243725, max: 609350 },
  { rate: 37, min: 609350, max: null }
]

const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  married: 29200,
  head: 21900
}

export function IncomeTaxCalculator() {
  // Income inputs
  const [salary, setSalary] = useState<number>(75000)
  const [otherIncome, setOtherIncome] = useState<number>(0)
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single')
  const [state, setState] = useState<string>('CA')
  const [numberOfDependents, setNumberOfDependents] = useState<number>(0)
  
  // Deductions and credits
  const [itemizedDeductions, setItemizedDeductions] = useState<number>(0)
  const [useStandardDeduction, setUseStandardDeduction] = useState<boolean>(true)
  const [retirement401k, setRetirement401k] = useState<number>(0)
  const [ira, setIra] = useState<number>(0)
  const [hsa, setHsa] = useState<number>(0)
  const [studentLoanInterest, setStudentLoanInterest] = useState<number>(0)
  const [childTaxCredit, setChildTaxCredit] = useState<boolean>(true)
  
  // Results
  const [grossIncome, setGrossIncome] = useState<number>(0)
  const [taxableIncome, setTaxableIncome] = useState<number>(0)
  const [federalTax, setFederalTax] = useState<number>(0)
  const [stateTax, setStateTax] = useState<number>(0)
  const [ficaTax, setFicaTax] = useState<number>(0)
  const [totalTax, setTotalTax] = useState<number>(0)
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0)
  const [takeHomePay, setTakeHomePay] = useState<number>(0)
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(0)

  const calculateIncomeTax = () => {
    // Calculate gross income
    const totalGrossIncome = salary + otherIncome
    setGrossIncome(totalGrossIncome)

    // Calculate adjustments
    const totalAdjustments = retirement401k + ira + hsa + studentLoanInterest

    // Calculate deduction
    const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus]
    const deduction = useStandardDeduction ? standardDeduction : itemizedDeductions

    // Calculate taxable income
    const calculatedTaxableIncome = Math.max(0, totalGrossIncome - totalAdjustments - deduction)
    setTaxableIncome(calculatedTaxableIncome)

    // Calculate federal tax
    let totalFederalTax = 0
    let previousBracketMax = 0
    let currentMarginalRate = 0

    for (const bracket of FEDERAL_TAX_BRACKETS_2024) {
      if (calculatedTaxableIncome > previousBracketMax) {
        const taxableInBracket = Math.min(
          calculatedTaxableIncome - previousBracketMax,
          (bracket.max ?? calculatedTaxableIncome) - previousBracketMax
        )
        totalFederalTax += taxableInBracket * (bracket.rate / 100)
        currentMarginalRate = bracket.rate
      }
      if (bracket.max) previousBracketMax = bracket.max
    }

    // Apply child tax credit
    if (childTaxCredit) {
      const creditAmount = Math.min(numberOfDependents * 2000, totalFederalTax)
      totalFederalTax -= creditAmount
    }

    // Calculate FICA taxes (Social Security and Medicare)
    const socialSecurityTax = Math.min(totalGrossIncome, 168600) * 0.062
    const medicareTax = totalGrossIncome * 0.0145
    const totalFicaTax = socialSecurityTax + medicareTax

    // Calculate state tax (simplified example rates)
    const stateRates: { [key: string]: number } = {
      'CA': 0.093,
      'NY': 0.085,
      'TX': 0,
      'FL': 0,
      // Add more states as needed
    }
    const calculatedStateTax = calculatedTaxableIncome * (stateRates[state] || 0)

    // Calculate totals
    const calculatedTotalTax = totalFederalTax + calculatedStateTax + totalFicaTax
    const calculatedEffectiveRate = (calculatedTotalTax / totalGrossIncome) * 100
    const calculatedTakeHome = totalGrossIncome - calculatedTotalTax

    // Update state
    setFederalTax(totalFederalTax)
    setStateTax(calculatedStateTax)
    setFicaTax(totalFicaTax)
    setTotalTax(calculatedTotalTax)
    setEffectiveTaxRate(calculatedEffectiveRate)
    setTakeHomePay(calculatedTakeHome)
    setMarginalTaxRate(currentMarginalRate)

    // Generate chart data
    generateChartData(totalFederalTax, calculatedStateTax, totalFicaTax, calculatedTakeHome)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (federal: number, state: number, fica: number, takeHome: number) => {
    const data = [
      { value: takeHome, name: 'Take-Home Pay' },
      { value: federal, name: 'Federal Tax' },
      { value: state, name: 'State Tax' },
      { value: fica, name: 'FICA Tax' }
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
        },
        itemStyle: {
          color: (params: any) => {
            const colors = ['#22c55e', '#ef4444', '#f97316', '#3b82f6']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Annual Salary ($)',
      type: 'number',
      value: salary,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setSalary(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'salary',
      placeholder: '75000'
    },
    {
      label: 'Other Income ($)',
      type: 'number',
      value: otherIncome,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherIncome(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'otherIncome',
      placeholder: '0'
    },
    {
      label: 'Number of Dependents',
      type: 'number',
      value: numberOfDependents,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setNumberOfDependents(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'numberOfDependents',
      placeholder: '0'
    },
    {
      label: '401(k) Contribution ($)',
      type: 'number',
      value: retirement401k,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement401k(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'retirement401k',
      placeholder: '0'
    },
    {
      label: 'IRA Contribution ($)',
      type: 'number',
      value: ira,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setIra(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'ira',
      placeholder: '0'
    },
    {
      label: 'HSA Contribution ($)',
      type: 'number',
      value: hsa,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHsa(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'hsa',
      placeholder: '0'
    },
    {
      label: 'Student Loan Interest ($)',
      type: 'number',
      value: studentLoanInterest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setStudentLoanInterest(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'studentLoanInterest',
      placeholder: '0'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Filing Status and State Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Filing Status
          </label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married' | 'head')}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="head">Head of Household</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 ">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="CA">California</option>
            <option value="NY">New York</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
          </select>
        </div>
      </div>

      {/* Deduction Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="standardDeduction"
            checked={useStandardDeduction}
            onChange={(e) => setUseStandardDeduction(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="standardDeduction" className="text-sm font-medium text-gray-700 ">
            Use Standard Deduction (${STANDARD_DEDUCTION_2024[filingStatus].toLocaleString()})
          </label>
        </div>

        {!useStandardDeduction && (
          <div>
            <label className="text-sm font-medium text-gray-700 ">
              Itemized Deductions ($)
            </label>
            <input
              type="number"
              value={itemizedDeductions}
              onChange={(e) => setItemizedDeductions(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
              min="0"
              step="100"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="childTaxCredit"
            checked={childTaxCredit}
            onChange={(e) => setChildTaxCredit(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="childTaxCredit" className="text-sm font-medium text-gray-700 ">
            Apply Child Tax Credit
          </label>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 ">
          <h3 className="font-semibold text-green-700 ">Take-Home Pay</h3>
          <p className="text-2xl font-bold text-green-800 ">
            ${takeHomePay.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 ">
            Annual after-tax income
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 ">
          <h3 className="font-semibold text-blue-700 ">Total Tax</h3>
          <p className="text-2xl font-bold text-blue-800 ">
            ${totalTax.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 ">
            Federal + State + FICA
          </p>
        </div>

        <div className="p-4 bg-purple-100 ">
          <h3 className="font-semibold text-purple-700 ">Effective Tax Rate</h3>
          <p className="text-2xl font-bold text-purple-800 ">
            {effectiveTaxRate.toFixed(2)}%
          </p>
          <p className="text-sm text-purple-600 ">
            Total tax / Gross income
          </p>
        </div>

        <div className="p-4 bg-orange-100 ">
          <h3 className="font-semibold text-orange-700 ">Marginal Tax Rate</h3>
          <p className="text-2xl font-bold text-orange-800 ">
            {marginalTaxRate.toFixed(2)}%
          </p>
          <p className="text-sm text-orange-600 ">
            Tax rate on next dollar
          </p>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-red-100 ">
          <h3 className="font-semibold text-red-700 ">Federal Tax</h3>
          <p className="text-xl font-bold text-red-800 ">
            ${federalTax.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-amber-100 ">
          <h3 className="font-semibold text-amber-700 ">State Tax</h3>
          <p className="text-xl font-bold text-amber-800 ">
            ${stateTax.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-indigo-100 ">
          <h3 className="font-semibold text-indigo-700 ">FICA Tax</h3>
          <p className="text-xl font-bold text-indigo-800 ">
            ${ficaTax.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white ">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Income Tax Calculator Results"
          results={`Take-Home Pay: $${takeHomePay.toFixed(2)} | Effective Tax Rate: ${effectiveTaxRate.toFixed(2)}%`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Income Tax Calculator"
      description="Calculate your annual income tax, including federal, state, and FICA taxes"
      inputs={inputs}
      onCalculate={calculateIncomeTax}
      results={results}
    />
  )
}
