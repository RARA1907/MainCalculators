'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

// 2024 Tax Brackets
const SINGLE_TAX_BRACKETS = [
  { rate: 0.10, start: 0, end: 11600 },
  { rate: 0.12, start: 11600, end: 47150 },
  { rate: 0.22, start: 47150, end: 100525 },
  { rate: 0.24, start: 100525, end: 191950 },
  { rate: 0.32, start: 191950, end: 243725 },
  { rate: 0.35, start: 243725, end: 609350 },
  { rate: 0.37, start: 609350, end: Infinity }
]

const MARRIED_TAX_BRACKETS = [
  { rate: 0.10, start: 0, end: 23200 },
  { rate: 0.12, start: 23200, end: 94300 },
  { rate: 0.22, start: 94300, end: 201050 },
  { rate: 0.24, start: 201050, end: 383900 },
  { rate: 0.32, start: 383900, end: 487450 },
  { rate: 0.35, start: 487450, end: 731200 },
  { rate: 0.37, start: 731200, end: Infinity }
]

const STANDARD_DEDUCTION = {
  single: 14600,
  married: 29200
}

export function MarriageTaxCalculator() {
  // Person 1 inputs
  const [income1, setIncome1] = useState<number>(75000)
  const [deductions1, setDeductions1] = useState<number>(0)
  const [retirement1, setRetirement1] = useState<number>(0)
  const [otherIncome1, setOtherIncome1] = useState<number>(0)
  
  // Person 2 inputs
  const [income2, setIncome2] = useState<number>(60000)
  const [deductions2, setDeductions2] = useState<number>(0)
  const [retirement2, setRetirement2] = useState<number>(0)
  const [otherIncome2, setOtherIncome2] = useState<number>(0)
  
  // Additional inputs
  const [dependents, setDependents] = useState<number>(0)
  const [mortgageInterest, setMortgageInterest] = useState<number>(0)
  const [charitableDonations, setCharitableDonations] = useState<number>(0)
  const [studentLoanInterest, setStudentLoanInterest] = useState<number>(0)
  
  // Results
  const [singleTax1, setSingleTax1] = useState<number>(0)
  const [singleTax2, setSingleTax2] = useState<number>(0)
  const [marriedTax, setMarriedTax] = useState<number>(0)
  const [marriagePenalty, setMarriagePenalty] = useState<number>(0)
  const [effectiveSingleRate1, setEffectiveSingleRate1] = useState<number>(0)
  const [effectiveSingleRate2, setEffectiveSingleRate2] = useState<number>(0)
  const [effectiveMarriedRate, setEffectiveMarriedRate] = useState<number>(0)

  const calculateTax = (income: number, brackets: typeof SINGLE_TAX_BRACKETS) => {
    let tax = 0
    let remainingIncome = income

    for (const bracket of brackets) {
      const taxableInBracket = Math.min(
        Math.max(0, remainingIncome),
        bracket.end - bracket.start
      )
      tax += taxableInBracket * bracket.rate
      remainingIncome -= taxableInBracket
      if (remainingIncome <= 0) break
    }

    return tax
  }

  const calculateMarriageTax = () => {
    // Calculate adjusted gross income for each person
    const agi1 = income1 + otherIncome1 - retirement1
    const agi2 = income2 + otherIncome2 - retirement2

    // Calculate itemized deductions
    const totalItemizedDeductions = 
      deductions1 + 
      deductions2 + 
      mortgageInterest + 
      charitableDonations + 
      studentLoanInterest

    // Calculate single taxes
    const taxableIncome1 = Math.max(0, agi1 - Math.max(STANDARD_DEDUCTION.single, totalItemizedDeductions / 2))
    const taxableIncome2 = Math.max(0, agi2 - Math.max(STANDARD_DEDUCTION.single, totalItemizedDeductions / 2))
    
    const tax1 = calculateTax(taxableIncome1, SINGLE_TAX_BRACKETS)
    const tax2 = calculateTax(taxableIncome2, SINGLE_TAX_BRACKETS)

    // Calculate married tax
    const combinedAGI = agi1 + agi2
    const marriedTaxableIncome = Math.max(0, combinedAGI - Math.max(STANDARD_DEDUCTION.married, totalItemizedDeductions))
    const combinedTax = calculateTax(marriedTaxableIncome, MARRIED_TAX_BRACKETS)

    // Calculate marriage penalty/bonus
    const penalty = combinedTax - (tax1 + tax2)

    // Calculate effective tax rates
    const effectiveRate1 = (tax1 / agi1) * 100
    const effectiveRate2 = (tax2 / agi2) * 100
    const effectiveMarried = (combinedTax / combinedAGI) * 100

    // Update state
    setSingleTax1(tax1)
    setSingleTax2(tax2)
    setMarriedTax(combinedTax)
    setMarriagePenalty(penalty)
    setEffectiveSingleRate1(effectiveRate1)
    setEffectiveSingleRate2(effectiveRate2)
    setEffectiveMarriedRate(effectiveMarried)

    // Generate chart data
    generateChartData(tax1, tax2, combinedTax, penalty)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    tax1: number,
    tax2: number,
    marriedTax: number,
    penalty: number
  ) => {
    const data = [
      {
        value: tax1 + tax2,
        name: 'Combined Single Tax',
        itemStyle: { color: '#22c55e' }
      },
      {
        value: Math.abs(penalty),
        name: penalty > 0 ? 'Marriage Penalty' : 'Marriage Bonus',
        itemStyle: { color: penalty > 0 ? '#ef4444' : '#3b82f6' }
      }
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
    // Person 1 inputs
    {
      label: 'Person 1 Income',
      type: 'number',
      value: income1,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setIncome1(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'income1',
      placeholder: '75000'
    },
    {
      label: 'Person 1 Deductions',
      type: 'number',
      value: deductions1,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDeductions1(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'deductions1',
      placeholder: '0'
    },
    {
      label: 'Person 1 Retirement Contributions',
      type: 'number',
      value: retirement1,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement1(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'retirement1',
      placeholder: '0'
    },
    {
      label: 'Person 1 Other Income',
      type: 'number',
      value: otherIncome1,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherIncome1(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'otherIncome1',
      placeholder: '0'
    },
    // Person 2 inputs
    {
      label: 'Person 2 Income',
      type: 'number',
      value: income2,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setIncome2(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'income2',
      placeholder: '60000'
    },
    {
      label: 'Person 2 Deductions',
      type: 'number',
      value: deductions2,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDeductions2(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'deductions2',
      placeholder: '0'
    },
    {
      label: 'Person 2 Retirement Contributions',
      type: 'number',
      value: retirement2,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement2(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'retirement2',
      placeholder: '0'
    },
    {
      label: 'Person 2 Other Income',
      type: 'number',
      value: otherIncome2,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherIncome2(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'otherIncome2',
      placeholder: '0'
    },
    // Additional inputs
    {
      label: 'Number of Dependents',
      type: 'number',
      value: dependents,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDependents(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'dependents',
      placeholder: '0'
    },
    {
      label: 'Mortgage Interest',
      type: 'number',
      value: mortgageInterest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setMortgageInterest(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'mortgageInterest',
      placeholder: '0'
    },
    {
      label: 'Charitable Donations',
      type: 'number',
      value: charitableDonations,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCharitableDonations(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'charitableDonations',
      placeholder: '0'
    },
    {
      label: 'Student Loan Interest',
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
      {/* Individual Results */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Person 1</h3>
          <div className="p-4 bg-green-100 ">
            <h4 className="font-semibold text-green-700 ">Tax as Single</h4>
            <p className="text-2xl font-bold text-green-800 ">
              ${singleTax1.toFixed(2)}
            </p>
            <p className="text-sm text-green-600 ">
              Effective Rate: {effectiveSingleRate1.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Person 2</h3>
          <div className="p-4 bg-blue-100 ">
            <h4 className="font-semibold text-blue-700 ">Tax as Single</h4>
            <p className="text-2xl font-bold text-blue-800 ">
              ${singleTax2.toFixed(2)}
            </p>
            <p className="text-sm text-blue-600 ">
              Effective Rate: {effectiveSingleRate2.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Combined Results */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-purple-100 ">
          <h4 className="font-semibold text-purple-700 ">Combined Single Tax</h4>
          <p className="text-2xl font-bold text-purple-800 ">
            ${(singleTax1 + singleTax2).toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 ">
            Total tax if filing separately
          </p>
        </div>

        <div className="p-4 bg-amber-100 ">
          <h4 className="font-semibold text-amber-700 ">Married Filing Jointly</h4>
          <p className="text-2xl font-bold text-amber-800 ">
            ${marriedTax.toFixed(2)}
          </p>
          <p className="text-sm text-amber-600 ">
            Effective Rate: {effectiveMarriedRate.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Marriage Penalty/Bonus */}
      <div className={`p-4 rounded-lg ${
        marriagePenalty > 0 
          ? 'bg-red-100 
          : 'bg-emerald-100 
      }`}>
        <h4 className={`font-semibold ${
          marriagePenalty > 0
            ? 'text-red-700 
            : 'text-emerald-700 
        }`}>
          {marriagePenalty > 0 ? 'Marriage Penalty' : 'Marriage Bonus'}
        </h4>
        <p className={`text-2xl font-bold ${
          marriagePenalty > 0
            ? 'text-red-800 
            : 'text-emerald-800 
        }`}>
          ${Math.abs(marriagePenalty).toFixed(2)}
        </p>
        <p className={`text-sm mt-1 ${
          marriagePenalty > 0
            ? 'text-red-600 
            : 'text-emerald-600 
        }`}>
          {marriagePenalty > 0
            ? 'Additional tax when married'
            : 'Tax savings when married'}
        </p>
      </div>

      {/* Tax Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white ">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Marriage Tax Calculator Results"
          results={`Marriage ${marriagePenalty > 0 ? 'Penalty' : 'Bonus'}: $${Math.abs(marriagePenalty).toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Marriage Tax Calculator"
      description="Calculate the tax implications of marriage"
      inputs={inputs}
      onCalculate={calculateMarriageTax}
      results={results}
    />
  )
}
