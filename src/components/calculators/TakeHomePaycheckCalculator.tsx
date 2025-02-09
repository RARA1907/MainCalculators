'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

// 2024 Federal Tax Brackets
const FEDERAL_TAX_BRACKETS = {
  single: [
    { rate: 0.10, start: 0, end: 11600 },
    { rate: 0.12, start: 11600, end: 47150 },
    { rate: 0.22, start: 47150, end: 100525 },
    { rate: 0.24, start: 100525, end: 191950 },
    { rate: 0.32, start: 191950, end: 243725 },
    { rate: 0.35, start: 243725, end: 609350 },
    { rate: 0.37, start: 609350, end: Infinity }
  ],
  married: [
    { rate: 0.10, start: 0, end: 23200 },
    { rate: 0.12, start: 23200, end: 94300 },
    { rate: 0.22, start: 94300, end: 201050 },
    { rate: 0.24, start: 201050, end: 383900 },
    { rate: 0.32, start: 383900, end: 487450 },
    { rate: 0.35, start: 487450, end: 731200 },
    { rate: 0.37, start: 731200, end: Infinity }
  ]
}

// 2024 Standard Deductions
const STANDARD_DEDUCTION = {
  single: 14600,
  married: 29200
}

// 2024 FICA Rates
const FICA_RATES = {
  socialSecurity: {
    rate: 0.062,
    wageBase: 168600
  },
  medicare: {
    rate: 0.0145,
    additionalRate: 0.009, // Additional Medicare tax rate above threshold
    threshold: {
      single: 200000,
      married: 250000
    }
  }
}

// State Tax Rates (Example rates - should be updated with accurate state data)
const STATE_TAX_RATES = {
  'CA': { maxRate: 0.133, brackets: [
    { rate: 0.01, start: 0, end: 10099 },
    { rate: 0.02, start: 10099, end: 23942 },
    { rate: 0.04, start: 23942, end: 37788 },
    { rate: 0.06, start: 37788, end: 52455 },
    { rate: 0.08, start: 52455, end: 66295 },
    { rate: 0.093, start: 66295, end: 338639 },
    { rate: 0.103, start: 338639, end: 406364 },
    { rate: 0.113, start: 406364, end: 677275 },
    { rate: 0.123, start: 677275, end: 1000000 },
    { rate: 0.133, start: 1000000, end: Infinity }
  ]},
  'NY': { maxRate: 0.109, brackets: [
    { rate: 0.04, start: 0, end: 8500 },
    { rate: 0.045, start: 8500, end: 11700 },
    { rate: 0.0525, start: 11700, end: 13900 },
    { rate: 0.059, start: 13900, end: 80650 },
    { rate: 0.0597, start: 80650, end: 215400 },
    { rate: 0.0633, start: 215400, end: 1077550 },
    { rate: 0.0685, start: 1077550, end: 5000000 },
    { rate: 0.0965, start: 5000000, end: 25000000 },
    { rate: 0.109, start: 25000000, end: Infinity }
  ]},
  // Add more states as needed
  'None': { maxRate: 0, brackets: [{ rate: 0, start: 0, end: Infinity }] }
}

export function TakeHomePaycheckCalculator() {
  // Basic inputs
  const [salary, setSalary] = useState<number>(75000)
  const [payFrequency, setPayFrequency] = useState<string>('bi-weekly')
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single')
  const [state, setState] = useState<string>('None')
  
  // Deductions and benefits
  const [retirement401k, setRetirement401k] = useState<number>(0)
  const [retirement401kMatch, setRetirement401kMatch] = useState<number>(0)
  const [healthInsurance, setHealthInsurance] = useState<number>(0)
  const [dentalInsurance, setDentalInsurance] = useState<number>(0)
  const [visionInsurance, setVisionInsurance] = useState<number>(0)
  const [fsa, setFsa] = useState<number>(0)
  const [otherPreTax, setOtherPreTax] = useState<number>(0)
  const [otherPostTax, setOtherPostTax] = useState<number>(0)
  
  // Results
  const [grossPay, setGrossPay] = useState<number>(0)
  const [federalTax, setFederalTax] = useState<number>(0)
  const [stateTax, setStateTax] = useState<number>(0)
  const [socialSecurity, setSocialSecurity] = useState<number>(0)
  const [medicare, setMedicare] = useState<number>(0)
  const [netPay, setNetPay] = useState<number>(0)

  const calculatePaycheck = () => {
    // Calculate pay period gross income
    const payPeriods = {
      'weekly': 52,
      'bi-weekly': 26,
      'semi-monthly': 24,
      'monthly': 12
    }[payFrequency]
    
    const periodGross = salary / payPeriods
    setGrossPay(periodGross)

    // Calculate pre-tax deductions
    const preTaxDeductions = 
      (retirement401k / 100 * periodGross) +
      healthInsurance +
      dentalInsurance +
      visionInsurance +
      fsa +
      otherPreTax

    // Calculate taxable income
    const annualTaxableIncome = salary - (preTaxDeductions * payPeriods)
    const periodTaxableIncome = annualTaxableIncome / payPeriods

    // Calculate Federal Tax
    const annualFederalTax = calculateTax(
      Math.max(0, annualTaxableIncome - STANDARD_DEDUCTION[filingStatus]),
      FEDERAL_TAX_BRACKETS[filingStatus]
    )
    const periodFederalTax = annualFederalTax / payPeriods
    setFederalTax(periodFederalTax)

    // Calculate State Tax
    const annualStateTax = calculateTax(
      annualTaxableIncome,
      STATE_TAX_RATES[state].brackets
    )
    const periodStateTax = annualStateTax / payPeriods
    setStateTax(periodStateTax)

    // Calculate FICA taxes
    const ssTax = Math.min(
      periodGross * FICA_RATES.socialSecurity.rate,
      FICA_RATES.socialSecurity.wageBase * FICA_RATES.socialSecurity.rate / payPeriods
    )
    setSocialSecurity(ssTax)

    let medicareTax = periodGross * FICA_RATES.medicare.rate
    if (salary > FICA_RATES.medicare.threshold[filingStatus]) {
      medicareTax += (periodGross * FICA_RATES.medicare.additionalRate)
    }
    setMedicare(medicareTax)

    // Calculate net pay
    const periodNet = periodGross -
      preTaxDeductions -
      periodFederalTax -
      periodStateTax -
      ssTax -
      medicareTax -
      otherPostTax

    setNetPay(periodNet)

    // Generate chart data
    generateChartData(
      periodGross,
      preTaxDeductions,
      periodFederalTax,
      periodStateTax,
      ssTax + medicareTax,
      otherPostTax,
      periodNet
    )
  }

  const calculateTax = (income: number, brackets: any[]) => {
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

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    gross: number,
    preTax: number,
    federal: number,
    state: number,
    fica: number,
    postTax: number,
    net: number
  ) => {
    const data = [
      { value: net, name: 'Take Home Pay', itemStyle: { color: '#22c55e' } },
      { value: federal, name: 'Federal Tax', itemStyle: { color: '#ef4444' } },
      { value: state, name: 'State Tax', itemStyle: { color: '#3b82f6' } },
      { value: fica, name: 'FICA Taxes', itemStyle: { color: '#a855f7' } },
      { value: preTax, name: 'Pre-tax Deductions', itemStyle: { color: '#f97316' } },
      { value: postTax, name: 'Post-tax Deductions', itemStyle: { color: '#64748b' } }
    ].filter(item => item.value > 0)
    
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
      label: 'Annual Salary',
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
      label: '401(k) Contribution (%)',
      type: 'number',
      value: retirement401k,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement401k(Number(e.target.value)),
      min: 0,
      max: 100,
      step: 1,
      name: 'retirement401k',
      placeholder: '0'
    },
    {
      label: 'Health Insurance (per period)',
      type: 'number',
      value: healthInsurance,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHealthInsurance(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'healthInsurance',
      placeholder: '0'
    },
    {
      label: 'Dental Insurance (per period)',
      type: 'number',
      value: dentalInsurance,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDentalInsurance(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'dentalInsurance',
      placeholder: '0'
    },
    {
      label: 'Vision Insurance (per period)',
      type: 'number',
      value: visionInsurance,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setVisionInsurance(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'visionInsurance',
      placeholder: '0'
    },
    {
      label: 'FSA Contribution (per period)',
      type: 'number',
      value: fsa,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFsa(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'fsa',
      placeholder: '0'
    },
    {
      label: 'Other Pre-tax Deductions',
      type: 'number',
      value: otherPreTax,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherPreTax(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'otherPreTax',
      placeholder: '0'
    },
    {
      label: 'Other Post-tax Deductions',
      type: 'number',
      value: otherPostTax,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherPostTax(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'otherPostTax',
      placeholder: '0'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Pay Frequency and Filing Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Pay Frequency
          </label>
          <select
            value={payFrequency}
            onChange={(e) => setPayFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="semi-monthly">Semi-monthly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Filing Status
          </label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(STATE_TAX_RATES).map(([code, data]) => (
              <option key={code} value={code}>
                {code === 'None' ? 'No State Tax' : `${code} (Max: ${(data.maxRate * 100).toFixed(1)}%)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-green-100 rounded-lg">
          <h3 className="font-semibold text-green-700">Gross Pay</h3>
          <p className="text-2xl font-bold text-green-800">
            ${grossPay.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            Per pay period
          </p>
        </div>
        
        <div className="p-4 bg-red-100 rounded-lg">
          <h3 className="font-semibold text-red-700">Federal Tax</h3>
          <p className="text-2xl font-bold text-red-800">
            ${federalTax.toFixed(2)}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {((federalTax / grossPay) * 100).toFixed(1)}% of gross
          </p>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg">
          <h3 className="font-semibold text-blue-700">State Tax</h3>
          <p className="text-2xl font-bold text-blue-800">
            ${stateTax.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {((stateTax / grossPay) * 100).toFixed(1)}% of gross
          </p>
        </div>

        <div className="p-4 bg-purple-100 rounded-lg">
          <h3 className="font-semibold text-purple-700">FICA Taxes</h3>
          <p className="text-2xl font-bold text-purple-800">
            ${(socialSecurity + medicare).toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 mt-1">
            SS: ${socialSecurity.toFixed(2)} | Medicare: ${medicare.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-orange-100 rounded-lg col-span-2">
          <h3 className="font-semibold text-orange-700">Take Home Pay</h3>
          <p className="text-2xl font-bold text-orange-800">
            ${netPay.toFixed(2)}
          </p>
          <p className="text-sm text-orange-600 mt-1">
            {((netPay / grossPay) * 100).toFixed(1)}% of gross pay
          </p>
        </div>
      </div>

      {/* Paycheck Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Take Home Paycheck Calculator Results"
          results={`Take Home Pay: $${netPay.toFixed(2)} (${((netPay / grossPay) * 100).toFixed(1)}% of gross)`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Take Home Paycheck Calculator"
      description="Calculate your take-home pay after taxes and deductions"
      inputs={inputs}
      onCalculate={calculatePaycheck}
      results={results}
    />
  )
}
