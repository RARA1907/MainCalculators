'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

// 2024 Federal Estate Tax Rates
const ESTATE_TAX_BRACKETS = [
  { rate: 0.18, start: 0, end: 10000 },
  { rate: 0.20, start: 10000, end: 20000 },
  { rate: 0.22, start: 20000, end: 40000 },
  { rate: 0.24, start: 40000, end: 60000 },
  { rate: 0.26, start: 60000, end: 80000 },
  { rate: 0.28, start: 80000, end: 100000 },
  { rate: 0.30, start: 100000, end: 150000 },
  { rate: 0.32, start: 150000, end: 250000 },
  { rate: 0.34, start: 250000, end: 500000 },
  { rate: 0.37, start: 500000, end: 750000 },
  { rate: 0.39, start: 750000, end: 1000000 },
  { rate: 0.40, start: 1000000, end: Infinity }
]

const FEDERAL_EXEMPTION = 13610000 // 2024 Federal Estate Tax Exemption
const ANNUAL_GIFT_EXCLUSION = 17000 // 2024 Annual Gift Tax Exclusion

// State Estate Tax Rates (2024)
const STATE_ESTATE_TAXES = {
  'None': { exemption: 0, maxRate: 0 },
  'CT': { exemption: 12920000, maxRate: 12 },
  'DC': { exemption: 4644859, maxRate: 16 },
  'HI': { exemption: 5490000, maxRate: 20 },
  'IL': { exemption: 4000000, maxRate: 16 },
  'MA': { exemption: 2000000, maxRate: 16 },
  'MD': { exemption: 5000000, maxRate: 16 },
  'ME': { exemption: 6410000, maxRate: 12 },
  'MN': { exemption: 3000000, maxRate: 16 },
  'NY': { exemption: 6580000, maxRate: 16 },
  'OR': { exemption: 1000000, maxRate: 16 },
  'RI': { exemption: 1733264, maxRate: 16 },
  'VT': { exemption: 5000000, maxRate: 16 },
  'WA': { exemption: 2193000, maxRate: 20 }
}

export function EstateTaxCalculator() {
  // Basic inputs
  const [totalAssets, setTotalAssets] = useState<number>(15000000)
  const [state, setState] = useState<string>('None')
  const [isMarried, setIsMarried] = useState<boolean>(false)
  const [hasPortability, setHasPortability] = useState<boolean>(false)
  
  // Asset breakdown
  const [realEstate, setRealEstate] = useState<number>(0)
  const [investments, setInvestments] = useState<number>(0)
  const [retirement, setRetirement] = useState<number>(0)
  const [lifeInsurance, setLifeInsurance] = useState<number>(0)
  const [business, setBusiness] = useState<number>(0)
  const [otherAssets, setOtherAssets] = useState<number>(0)
  
  // Deductions and credits
  const [debts, setDebts] = useState<number>(0)
  const [funeralExpenses, setFuneralExpenses] = useState<number>(0)
  const [charitableGifts, setCharitableGifts] = useState<number>(0)
  const [priorGifts, setPriorGifts] = useState<number>(0)
  
  // Results
  const [taxableEstate, setTaxableEstate] = useState<number>(0)
  const [federalTax, setFederalTax] = useState<number>(0)
  const [stateTax, setStateTax] = useState<number>(0)
  const [totalTax, setTotalTax] = useState<number>(0)
  const [effectiveRate, setEffectiveRate] = useState<number>(0)

  const calculateEstateTax = () => {
    // Calculate total estate value
    const totalEstate = totalAssets - debts - funeralExpenses - charitableGifts

    // Calculate available exemption
    let availableExemption = FEDERAL_EXEMPTION
    if (isMarried && hasPortability) {
      availableExemption *= 2 // Double exemption with portability
    }

    // Calculate federal taxable estate
    const federalTaxableEstate = Math.max(0, totalEstate - availableExemption)
    
    // Calculate federal estate tax
    let calculatedFederalTax = 0
    let remainingAmount = federalTaxableEstate

    for (const bracket of ESTATE_TAX_BRACKETS) {
      const taxableInBracket = Math.min(
        Math.max(0, remainingAmount),
        bracket.end - bracket.start
      )
      calculatedFederalTax += taxableInBracket * bracket.rate
      remainingAmount -= taxableInBracket
      if (remainingAmount <= 0) break
    }

    // Calculate state estate tax
    const stateInfo = STATE_ESTATE_TAXES[state]
    let calculatedStateTax = 0
    
    if (stateInfo.exemption > 0) {
      const stateTaxableEstate = Math.max(0, totalEstate - stateInfo.exemption)
      calculatedStateTax = stateTaxableEstate * (stateInfo.maxRate / 100)
    }

    // Calculate total tax and effective rate
    const calculatedTotalTax = calculatedFederalTax + calculatedStateTax
    const calculatedEffectiveRate = (calculatedTotalTax / totalEstate) * 100

    // Update state
    setTaxableEstate(federalTaxableEstate)
    setFederalTax(calculatedFederalTax)
    setStateTax(calculatedStateTax)
    setTotalTax(calculatedTotalTax)
    setEffectiveRate(calculatedEffectiveRate)

    // Generate chart data
    generateChartData(totalEstate, calculatedFederalTax, calculatedStateTax)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    estate: number,
    federal: number,
    state: number
  ) => {
    const data = [
      { value: estate - federal - state, name: 'Net Estate', itemStyle: { color: '#22c55e' } },
      { value: federal, name: 'Federal Estate Tax', itemStyle: { color: '#ef4444' } }
    ]
    
    if (state > 0) {
      data.push({ value: state, name: 'State Estate Tax', itemStyle: { color: '#3b82f6' } })
    }
    
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
      label: 'Total Estate Value',
      type: 'number',
      value: totalAssets,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setTotalAssets(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'totalAssets',
      placeholder: '15000000'
    },
    {
      label: 'Real Estate Value',
      type: 'number',
      value: realEstate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRealEstate(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'realEstate',
      placeholder: '0'
    },
    {
      label: 'Investment Assets',
      type: 'number',
      value: investments,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setInvestments(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'investments',
      placeholder: '0'
    },
    {
      label: 'Retirement Accounts',
      type: 'number',
      value: retirement,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setRetirement(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'retirement',
      placeholder: '0'
    },
    {
      label: 'Life Insurance Proceeds',
      type: 'number',
      value: lifeInsurance,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setLifeInsurance(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'lifeInsurance',
      placeholder: '0'
    },
    {
      label: 'Business Interests',
      type: 'number',
      value: business,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setBusiness(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'business',
      placeholder: '0'
    },
    {
      label: 'Other Assets',
      type: 'number',
      value: otherAssets,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOtherAssets(Number(e.target.value)),
      min: 0,
      step: 10000,
      name: 'otherAssets',
      placeholder: '0'
    },
    {
      label: 'Outstanding Debts',
      type: 'number',
      value: debts,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDebts(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'debts',
      placeholder: '0'
    },
    {
      label: 'Funeral Expenses',
      type: 'number',
      value: funeralExpenses,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFuneralExpenses(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'funeralExpenses',
      placeholder: '0'
    },
    {
      label: 'Charitable Gifts',
      type: 'number',
      value: charitableGifts,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCharitableGifts(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'charitableGifts',
      placeholder: '0'
    },
    {
      label: 'Lifetime Taxable Gifts',
      type: 'number',
      value: priorGifts,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setPriorGifts(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'priorGifts',
      placeholder: '0'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* State Selection and Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {Object.entries(STATE_ESTATE_TAXES).map(([code, data]) => (
              <option key={code} value={code}>
                {code === 'None' ? 'No State Estate Tax' : `${code} (Exemption: $${(data.exemption / 1000000).toFixed(1)}M)`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isMarried"
              checked={isMarried}
              onChange={(e) => setIsMarried(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isMarried"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Married
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasPortability"
              checked={hasPortability}
              onChange={(e) => setHasPortability(e.target.checked)}
              disabled={!isMarried}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="hasPortability"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Use Portability Election
            </label>
          </div>
        </div>
      </div>

      {/* Exemption Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Federal Exemption</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${((isMarried && hasPortability ? FEDERAL_EXEMPTION * 2 : FEDERAL_EXEMPTION) / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {isMarried && hasPortability ? 'Including spouse\'s portable exemption' : 'Basic exemption amount'}
          </p>
        </div>

        {state !== 'None' && (
          <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300">State Exemption</h3>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              ${(STATE_ESTATE_TAXES[state].exemption / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              Maximum rate: {STATE_ESTATE_TAXES[state].maxRate}%
            </p>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Taxable Estate</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${(taxableEstate / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            After exemptions
          </p>
        </div>
        
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <h3 className="font-semibold text-red-700 dark:text-red-300">Federal Estate Tax</h3>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200">
            ${(federalTax / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Federal tax liability
          </p>
        </div>

        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">State Estate Tax</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${(stateTax / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            State tax liability
          </p>
        </div>

        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">Total Tax</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            ${(totalTax / 1000000).toFixed(2)}M
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Effective Rate: {effectiveRate.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Estate Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Estate Tax Calculator Results"
          results={`Estate Tax: $${(totalTax / 1000000).toFixed(2)}M (${effectiveRate.toFixed(2)}% effective rate)`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Estate Tax Calculator"
      description="Calculate potential estate tax liability"
      inputs={inputs}
      onCalculate={calculateEstateTax}
      results={results}
    />
  )
}
