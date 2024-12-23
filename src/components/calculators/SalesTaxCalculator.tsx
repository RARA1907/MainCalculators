'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface TaxRate {
  state: string
  stateRate: number
  avgLocalRate: number
  maxLocalRate: number
  combinedRate: number
}

const STATE_TAX_RATES: { [key: string]: TaxRate } = {
  'AL': { state: 'Alabama', stateRate: 4.00, avgLocalRate: 5.24, maxLocalRate: 7.50, combinedRate: 9.24 },
  'AK': { state: 'Alaska', stateRate: 0.00, avgLocalRate: 1.76, maxLocalRate: 7.50, combinedRate: 1.76 },
  'AZ': { state: 'Arizona', stateRate: 5.60, avgLocalRate: 2.80, maxLocalRate: 5.60, combinedRate: 8.40 },
  'AR': { state: 'Arkansas', stateRate: 6.50, avgLocalRate: 2.97, maxLocalRate: 5.125, combinedRate: 9.47 },
  'CA': { state: 'California', stateRate: 7.25, avgLocalRate: 1.43, maxLocalRate: 2.50, combinedRate: 8.68 },
  'CO': { state: 'Colorado', stateRate: 2.90, avgLocalRate: 4.87, maxLocalRate: 8.30, combinedRate: 7.77 },
  'CT': { state: 'Connecticut', stateRate: 6.35, avgLocalRate: 0.00, maxLocalRate: 0.00, combinedRate: 6.35 },
  'DE': { state: 'Delaware', stateRate: 0.00, avgLocalRate: 0.00, maxLocalRate: 0.00, combinedRate: 0.00 },
  'FL': { state: 'Florida', stateRate: 6.00, avgLocalRate: 1.05, maxLocalRate: 2.50, combinedRate: 7.05 },
  'GA': { state: 'Georgia', stateRate: 4.00, avgLocalRate: 3.31, maxLocalRate: 5.00, combinedRate: 7.31 },
  'HI': { state: 'Hawaii', stateRate: 4.00, avgLocalRate: 0.44, maxLocalRate: 0.50, combinedRate: 4.44 },
  'ID': { state: 'Idaho', stateRate: 6.00, avgLocalRate: 0.03, maxLocalRate: 3.00, combinedRate: 6.03 },
  'IL': { state: 'Illinois', stateRate: 6.25, avgLocalRate: 2.58, maxLocalRate: 4.75, combinedRate: 8.83 },
  'IN': { state: 'Indiana', stateRate: 7.00, avgLocalRate: 0.00, maxLocalRate: 0.00, combinedRate: 7.00 },
  'NY': { state: 'New York', stateRate: 4.00, avgLocalRate: 4.52, maxLocalRate: 4.875, combinedRate: 8.52 },
  'TX': { state: 'Texas', stateRate: 6.25, avgLocalRate: 1.94, maxLocalRate: 2.00, combinedRate: 8.19 }
}

export function SalesTaxCalculator() {
  // Basic inputs
  const [amount, setAmount] = useState<number>(100)
  const [state, setState] = useState<string>('NY')
  const [useLocalRate, setUseLocalRate] = useState<boolean>(true)
  const [customLocalRate, setCustomLocalRate] = useState<number>(0)
  
  // Additional options
  const [quantity, setQuantity] = useState<number>(1)
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')
  const [shipping, setShipping] = useState<number>(0)
  const [includeTaxOnShipping, setIncludeTaxOnShipping] = useState<boolean>(true)
  const [isExempt, setIsExempt] = useState<boolean>(false)
  
  // Results
  const [netAmount, setNetAmount] = useState<number>(0)
  const [taxAmount, setTaxAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [effectiveRate, setEffectiveRate] = useState<number>(0)

  const calculateSalesTax = () => {
    let baseAmount = amount * quantity
    
    // Apply discount
    let discountAmount = 0
    if (discountType === 'percentage') {
      discountAmount = baseAmount * (discount / 100)
    } else {
      discountAmount = discount
    }
    baseAmount -= discountAmount

    // Get tax rates
    const stateData = STATE_TAX_RATES[state]
    let taxRate = stateData.stateRate / 100

    if (useLocalRate) {
      taxRate += customLocalRate > 0 
        ? customLocalRate / 100 
        : stateData.avgLocalRate / 100
    }

    // Calculate amounts
    let calculatedNet = baseAmount
    let calculatedTax = 0
    
    if (!isExempt) {
      calculatedTax = baseAmount * taxRate
      
      // Add tax on shipping if applicable
      if (shipping > 0 && includeTaxOnShipping) {
        calculatedTax += shipping * taxRate
      }
    }

    const calculatedTotal = calculatedNet + calculatedTax + shipping
    const calculatedEffectiveRate = (calculatedTax / calculatedNet) * 100

    // Update state
    setNetAmount(calculatedNet)
    setTaxAmount(calculatedTax)
    setTotalAmount(calculatedTotal)
    setEffectiveRate(calculatedEffectiveRate)

    // Generate chart data
    generateChartData(calculatedNet, calculatedTax, discountAmount, shipping)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (net: number, tax: number, discount: number, shipping: number) => {
    const data = [
      { value: net, name: 'Net Amount' },
      { value: tax, name: 'Sales Tax' }
    ]
    
    if (discount > 0) {
      data.push({ value: discount, name: 'Discount' })
    }
    
    if (shipping > 0) {
      data.push({ value: shipping, name: 'Shipping' })
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
        },
        itemStyle: {
          color: (params: any) => {
            const colors = ['#22c55e', '#3b82f6', '#f97316', '#a855f7']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Amount',
      type: 'number',
      value: amount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setAmount(Number(e.target.value)),
      min: 0,
      step: 0.01,
      name: 'amount',
      placeholder: '100'
    },
    {
      label: 'Quantity',
      type: 'number',
      value: quantity,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setQuantity(Number(e.target.value)),
      min: 1,
      step: 1,
      name: 'quantity',
      placeholder: '1'
    },
    {
      label: discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount',
      type: 'number',
      value: discount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDiscount(Number(e.target.value)),
      min: 0,
      step: discountType === 'percentage' ? 1 : 0.01,
      name: 'discount',
      placeholder: '0'
    },
    {
      label: 'Shipping',
      type: 'number',
      value: shipping,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setShipping(Number(e.target.value)),
      min: 0,
      step: 0.01,
      name: 'shipping',
      placeholder: '0'
    },
    {
      label: 'Custom Local Rate (%)',
      type: 'number',
      value: customLocalRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCustomLocalRate(Number(e.target.value)),
      min: 0,
      max: STATE_TAX_RATES[state].maxLocalRate,
      step: 0.01,
      name: 'customLocalRate',
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
            {Object.entries(STATE_TAX_RATES).map(([code, data]) => (
              <option key={code} value={code}>
                {data.state} ({data.stateRate}% + up to {data.maxLocalRate}%)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Discount Type
          </label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Fixed Amount</option>
          </select>
        </div>

        <div className="flex flex-col justify-end space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useLocalRate"
              checked={useLocalRate}
              onChange={(e) => setUseLocalRate(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="useLocalRate"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Include local tax
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeTaxOnShipping"
              checked={includeTaxOnShipping}
              onChange={(e) => setIncludeTaxOnShipping(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="includeTaxOnShipping"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tax on shipping
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isExempt"
              checked={isExempt}
              onChange={(e) => setIsExempt(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isExempt"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tax exempt
            </label>
          </div>
        </div>
      </div>

      {/* Tax Rate Information */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">State Rate</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {STATE_TAX_RATES[state].stateRate}%
          </p>
        </div>

        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Avg Local Rate</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {STATE_TAX_RATES[state].avgLocalRate}%
          </p>
        </div>

        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">Combined Rate</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            {STATE_TAX_RATES[state].combinedRate}%
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Net Amount</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${netAmount.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Before tax
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Sales Tax</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${taxAmount.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            {effectiveRate.toFixed(2)}% effective rate
          </p>
        </div>

        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Total Amount</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            ${totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
            Including tax & shipping
          </p>
        </div>

        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">Per Item</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            ${(totalAmount / quantity).toFixed(2)}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Total per item
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
          title="Sales Tax Calculator Results"
          results={`Net: $${netAmount.toFixed(2)} | Tax: $${taxAmount.toFixed(2)} | Total: $${totalAmount.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Sales Tax Calculator"
      description="Calculate sales tax for different US states"
      inputs={inputs}
      onCalculate={calculateSalesTax}
      results={results}
    />
  )
}
