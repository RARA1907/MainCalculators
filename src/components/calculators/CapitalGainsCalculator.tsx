'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface TaxBracket {
  rate: number
  description: string
}

const SHORT_TERM_BRACKETS: TaxBracket[] = [
  { rate: 10, description: '10% (Up to $11,600)' },
  { rate: 12, description: '12% ($11,601 - $47,150)' },
  { rate: 22, description: '22% ($47,151 - $100,525)' },
  { rate: 24, description: '24% ($100,526 - $191,950)' },
  { rate: 32, description: '32% ($191,951 - $243,725)' },
  { rate: 35, description: '35% ($243,726 - $609,350)' },
  { rate: 37, description: '37% (Over $609,350)' }
]

const LONG_TERM_BRACKETS: TaxBracket[] = [
  { rate: 0, description: '0% (Up to $44,625)' },
  { rate: 15, description: '15% ($44,626 - $492,300)' },
  { rate: 20, description: '20% (Over $492,300)' }
]

export function CapitalGainsCalculator() {
  // Investment inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(1000)
  const [salePrice, setSalePrice] = useState<number>(1500)
  const [quantity, setQuantity] = useState<number>(100)
  const [holdingPeriod, setHoldingPeriod] = useState<number>(6)
  const [holdingPeriodUnit, setHoldingPeriodUnit] = useState<'months' | 'years'>('months')
  const [taxBracket, setTaxBracket] = useState<number>(22)
  const [stateTaxRate, setStateTaxRate] = useState<number>(5)
  const [brokerageFees, setBrokerageFees] = useState<number>(10)
  
  // Results
  const [capitalGain, setCapitalGain] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [netProfit, setNetProfit] = useState<number>(0)
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0)
  const [isLongTerm, setIsLongTerm] = useState<boolean>(false)

  const calculateCapitalGains = () => {
    // Calculate if long-term based on holding period
    const monthsHeld = holdingPeriodUnit === 'years' ? holdingPeriod * 12 : holdingPeriod
    const isLongTermGain = monthsHeld >= 12
    setIsLongTerm(isLongTermGain)

    // Calculate total gain/loss
    const totalCost = (purchasePrice * quantity) + brokerageFees
    const totalRevenue = (salePrice * quantity) - brokerageFees
    const totalGain = totalRevenue - totalCost

    // Calculate taxes
    const federalTaxRate = isLongTermGain ? 
      (totalGain <= 44625 ? 0 : totalGain <= 492300 ? 15 : 20) : 
      taxBracket
    
    const federalTax = (totalGain * (federalTaxRate / 100))
    const stateTax = (totalGain * (stateTaxRate / 100))
    const totalTax = federalTax + stateTax
    
    // Calculate effective tax rate
    const effectiveRate = totalGain > 0 ? (totalTax / totalGain) * 100 : 0

    setCapitalGain(totalGain)
    setTaxAmount(totalTax)
    setNetProfit(totalGain - totalTax)
    setEffectiveTaxRate(effectiveRate)

    // Generate breakdown data for the chart
    generateChartData(totalGain, federalTax, stateTax)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (gain: number, federalTax: number, stateTax: number) => {
    const data = [
      { value: gain - federalTax - stateTax, name: 'Net Profit' },
      { value: federalTax, name: 'Federal Tax' },
      { value: stateTax, name: 'State Tax' }
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
            const colors = ['#22c55e', '#ef4444', '#f97316']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Purchase Price per Share ($)',
      type: 'number',
      value: purchasePrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setPurchasePrice(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'purchasePrice',
      placeholder: '1000'
    },
    {
      label: 'Sale Price per Share ($)',
      type: 'number',
      value: salePrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setSalePrice(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'salePrice',
      placeholder: '1500'
    },
    {
      label: 'Number of Shares',
      type: 'number',
      value: quantity,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setQuantity(Number(e.target.value)),
      min: 1,
      step: 1,
      name: 'quantity',
      placeholder: '100'
    },
    {
      label: 'Holding Period',
      type: 'number',
      value: holdingPeriod,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHoldingPeriod(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'holdingPeriod',
      placeholder: '6'
    },
    {
      label: 'Tax Bracket (%)',
      type: 'number',
      value: taxBracket,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setTaxBracket(Number(e.target.value)),
      min: 0,
      max: 100,
      step: 1,
      name: 'taxBracket',
      placeholder: '22'
    },
    {
      label: 'State Tax Rate (%)',
      type: 'number',
      value: stateTaxRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setStateTaxRate(Number(e.target.value)),
      min: 0,
      max: 100,
      step: 0.1,
      name: 'stateTaxRate',
      placeholder: '5'
    },
    {
      label: 'Brokerage Fees ($)',
      type: 'number',
      value: brokerageFees,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setBrokerageFees(Number(e.target.value)),
      min: 0,
      step: 0.01,
      name: 'brokerageFees',
      placeholder: '10'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Holding Period Unit Toggle */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Holding Period Unit:
        </label>
        <select
          value={holdingPeriodUnit}
          onChange={(e) => setHoldingPeriodUnit(e.target.value as 'months' | 'years')}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Capital Gain/Loss</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${capitalGain.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {isLongTerm ? 'Long-term' : 'Short-term'} gain
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Net Profit</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${netProfit.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            After taxes and fees
          </p>
        </div>

        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <h3 className="font-semibold text-red-700 dark:text-red-300">Tax Amount</h3>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200">
            ${taxAmount.toFixed(2)}
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Federal + State taxes
          </p>
        </div>

        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Effective Tax Rate</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {effectiveTaxRate.toFixed(2)}%
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
            Combined tax rate
          </p>
        </div>
      </div>

      {/* Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Capital Gains Calculator Results"
          results={`Capital Gain: $${capitalGain.toFixed(2)} | Net Profit: $${netProfit.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Capital Gains Calculator"
      description="Calculate capital gains tax and after-tax profits from your investments"
      inputs={inputs}
      onCalculate={calculateCapitalGains}
      results={results}
    />
  )
}
