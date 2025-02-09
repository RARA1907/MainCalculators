'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface PayPeriod {
  label: string
  value: number
}

const PAY_PERIODS: PayPeriod[] = [
  { label: 'Weekly', value: 52 },
  { label: 'Bi-weekly', value: 26 },
  { label: 'Semi-monthly', value: 24 },
  { label: 'Monthly', value: 12 },
  { label: 'Annually', value: 1 }
]

const STATE_TAX_RATES: { [key: string]: number } = {
  'CA': 9.3,
  'NY': 8.5,
  'TX': 0,
  'FL': 0,
  'IL': 4.95,
  'WA': 0,
  'MA': 5.0,
  'NJ': 5.525,
  'PA': 3.07,
  'OH': 3.99
}

export function TakeHomePayCalculator() {
  // Income inputs
  const [grossPay, setGrossPay] = useState<number>(75000)
  const [payPeriod, setPayPeriod] = useState<string>('Annually')
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single')
  const [state, setState] = useState<string>('CA')
  const [numberOfAllowances, setNumberOfAllowances] = useState<number>(1)
  
  // Pre-tax deductions
  const [retirement401k, setRetirement401k] = useState<number>(0)
  const [retirement401kType, setRetirement401kType] = useState<'percentage' | 'amount'>('percentage')
  const [healthInsurance, setHealthInsurance] = useState<number>(0)
  const [dentalInsurance, setDentalInsurance] = useState<number>(0)
  const [visionInsurance, setVisionInsurance] = useState<number>(0)
  const [hsa, setHsa] = useState<number>(0)
  const [fsa, setFsa] = useState<number>(0)
  
  // Post-tax deductions
  const [rothIra, setRothIra] = useState<number>(0)
  const [otherDeductions, setOtherDeductions] = useState<number>(0)
  
  // Results
  const [annualGrossPay, setAnnualGrossPay] = useState<number>(0)
  const [federalTax, setFederalTax] = useState<number>(0)
  const [stateTax, setStateTax] = useState<number>(0)
  const [socialSecurity, setSocialSecurity] = useState<number>(0)
  const [medicare, setMedicare] = useState<number>(0)
  const [totalDeductions, setTotalDeductions] = useState<number>(0)
  const [netPay, setNetPay] = useState<number>(0)
  const [perPeriodPay, setPerPeriodPay] = useState<number>(0)

  const calculateTakeHomePay = () => {
    // Convert pay to annual if needed
    const payFrequency = PAY_PERIODS.find(p => p.label === payPeriod)?.value || 1
    const calculatedAnnualGross = grossPay * payFrequency
    setAnnualGrossPay(calculatedAnnualGross)

    // Calculate pre-tax deductions
    const retirement401kAmount = retirement401kType === 'percentage' 
      ? (calculatedAnnualGross * retirement401k / 100)
      : retirement401k * payFrequency
    
    const totalPreTaxDeductions = 
      retirement401kAmount +
      (healthInsurance * payFrequency) +
      (dentalInsurance * payFrequency) +
      (visionInsurance * payFrequency) +
      (hsa * payFrequency) +
      (fsa * payFrequency)

    // Calculate taxable income
    const taxableIncome = calculatedAnnualGross - totalPreTaxDeductions

    // Calculate federal tax (simplified progressive tax calculation)
    let federalTaxAmount = 0
    if (filingStatus === 'single') {
      if (taxableIncome <= 11600) {
        federalTaxAmount = taxableIncome * 0.10
      } else if (taxableIncome <= 47150) {
        federalTaxAmount = 1160 + (taxableIncome - 11600) * 0.12
      } else if (taxableIncome <= 100525) {
        federalTaxAmount = 5426 + (taxableIncome - 47150) * 0.22
      } else if (taxableIncome <= 191950) {
        federalTaxAmount = 17168.50 + (taxableIncome - 100525) * 0.24
      } else if (taxableIncome <= 243725) {
        federalTaxAmount = 39110.50 + (taxableIncome - 191950) * 0.32
      } else if (taxableIncome <= 609350) {
        federalTaxAmount = 55678.50 + (taxableIncome - 243725) * 0.35
      } else {
        federalTaxAmount = 183647.25 + (taxableIncome - 609350) * 0.37
      }
    }
    // Adjust for allowances (simplified)
    federalTaxAmount = Math.max(0, federalTaxAmount - (numberOfAllowances * 4450))

    // Calculate state tax
    const stateTaxAmount = taxableIncome * (STATE_TAX_RATES[state] / 100)

    // Calculate FICA taxes
    const socialSecurityAmount = Math.min(taxableIncome, 168600) * 0.062
    const medicareAmount = taxableIncome * 0.0145

    // Calculate post-tax deductions
    const totalPostTaxDeductions = 
      (rothIra * payFrequency) +
      (otherDeductions * payFrequency)

    // Calculate total deductions and net pay
    const totalDeductionsAmount = totalPreTaxDeductions + totalPostTaxDeductions
    const totalTaxes = federalTaxAmount + stateTaxAmount + socialSecurityAmount + medicareAmount
    const netPayAmount = calculatedAnnualGross - totalTaxes - totalDeductionsAmount

    // Update state
    setFederalTax(federalTaxAmount)
    setStateTax(stateTaxAmount)
    setSocialSecurity(socialSecurityAmount)
    setMedicare(medicareAmount)
    setTotalDeductions(totalDeductionsAmount)
    setNetPay(netPayAmount)
    setPerPeriodPay(netPayAmount / payFrequency)

    // Generate chart data
    generateChartData(
      netPayAmount,
      federalTaxAmount,
      stateTaxAmount,
      socialSecurityAmount + medicareAmount,
      totalDeductionsAmount
    )
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    net: number,
    federal: number,
    state: number,
    fica: number,
    deductions: number
  ) => {
    const data = [
      { value: net, name: 'Take-Home Pay' },
      { value: federal, name: 'Federal Tax' },
      { value: state, name: 'State Tax' },
      { value: fica, name: 'FICA Taxes' },
      { value: deductions, name: 'Deductions' }
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
            const colors = ['#22c55e', '#ef4444', '#f97316', '#3b82f6', '#a855f7']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Gross Pay',
      type: 'number',
      value: grossPay,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setGrossPay(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'grossPay',
      placeholder: '75000'
    },
    {
      label: 'Number of Allowances',
      type: 'number',
      value: numberOfAllowances,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setNumberOfAllowances(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'numberOfAllowances',
      placeholder: '1'
    },
    {
      label: '401(k) Contribution',
      type: 'number',
      value: retirement401k,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement401k(Number(e.target.value)),
      min: 0,
      step: retirement401kType === 'percentage' ? 1 : 100,
      name: 'retirement401k',
      placeholder: '0'
    },
    {
      label: 'Health Insurance',
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
      label: 'Dental Insurance',
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
      label: 'Vision Insurance',
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
      label: 'HSA Contribution',
      type: 'number',
      value: hsa,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHsa(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'hsa',
      placeholder: '0'
    },
    {
      label: 'FSA Contribution',
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
      label: 'Roth IRA Contribution',
      type: 'number',
      value: rothIra,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRothIra(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'rothIra',
      placeholder: '0'
    },
    {
      label: 'Other Deductions',
      type: 'number',
      value: otherDeductions,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherDeductions(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'otherDeductions',
      placeholder: '0'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Pay Period and Location Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Pay Period
          </label>
          <select
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            {PAY_PERIODS.map(period => (
              <option key={period.label} value={period.label}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

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
            {Object.entries(STATE_TAX_RATES).map(([state, rate]) => (
              <option key={state} value={state}>
                {state} ({rate}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 401(k) Type Selection */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 ">
          401(k) Contribution Type:
        </label>
        <select
          value={retirement401kType}
          onChange={(e) => setRetirement401kType(e.target.value as 'percentage' | 'amount')}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
        >
          <option value="percentage">Percentage</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 ">
          <h3 className="font-semibold text-green-700 ">Take-Home Pay</h3>
          <p className="text-2xl font-bold text-green-800 ">
            ${perPeriodPay.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 ">
            Per {payPeriod.toLowerCase()} period
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 ">
          <h3 className="font-semibold text-blue-700 ">Annual Net Pay</h3>
          <p className="text-2xl font-bold text-blue-800 ">
            ${netPay.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 ">
            Total after taxes & deductions
          </p>
        </div>

        <div className="p-4 bg-red-100 ">
          <h3 className="font-semibold text-red-700 ">Total Taxes</h3>
          <p className="text-2xl font-bold text-red-800 ">
            ${(federalTax + stateTax + socialSecurity + medicare).toFixed(2)}
          </p>
          <p className="text-sm text-red-600 ">
            Federal + State + FICA
          </p>
        </div>

        <div className="p-4 bg-purple-100 ">
          <h3 className="font-semibold text-purple-700 ">Total Deductions</h3>
          <p className="text-2xl font-bold text-purple-800 ">
            ${totalDeductions.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 ">
            Pre-tax + Post-tax
          </p>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-amber-100 ">
          <h3 className="font-semibold text-amber-700 ">Federal Tax</h3>
          <p className="text-xl font-bold text-amber-800 ">
            ${federalTax.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-emerald-100 ">
          <h3 className="font-semibold text-emerald-700 ">State Tax</h3>
          <p className="text-xl font-bold text-emerald-800 ">
            ${stateTax.toFixed(2)}
          </p>
        </div>

        <div className="p-4 bg-indigo-100 ">
          <h3 className="font-semibold text-indigo-700 ">FICA Taxes</h3>
          <p className="text-xl font-bold text-indigo-800 ">
            ${(socialSecurity + medicare).toFixed(2)}
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
          title="Take-Home Pay Calculator Results"
          results={`Take-Home Pay: $${perPeriodPay.toFixed(2)} per ${payPeriod.toLowerCase()} | Annual Net: $${netPay.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Take-Home Pay Calculator"
      description="Calculate your take-home pay after taxes and deductions"
      inputs={inputs}
      onCalculate={calculateTakeHomePay}
      results={results}
    />
  )
}
