'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface VatRate {
  label: string
  rate: number
  description: string
}

const VAT_RATES: { [key: string]: VatRate[] } = {
  'UK': [
    { label: 'Standard', rate: 20, description: 'Most goods and services' },
    { label: 'Reduced', rate: 5, description: 'Some goods and services like children\'s car seats and home energy' },
    { label: 'Zero', rate: 0, description: 'Zero-rated goods like most food and children\'s clothes' }
  ],
  'EU': [
    { label: 'Standard', rate: 21, description: 'Most goods and services' },
    { label: 'Reduced', rate: 10, description: 'Some goods and services' },
    { label: 'Super Reduced', rate: 4, description: 'Basic necessities' }
  ],
  'US': [
    { label: 'Sales Tax', rate: 8.875, description: 'Average sales tax (varies by state)' },
    { label: 'Reduced', rate: 4, description: 'Reduced rate for certain items' },
    { label: 'Zero', rate: 0, description: 'Tax-exempt items' }
  ]
}

export function VatCalculator() {
  // Basic inputs
  const [amount, setAmount] = useState<number>(100)
  const [region, setRegion] = useState<string>('UK')
  const [selectedRate, setSelectedRate] = useState<VatRate>(VAT_RATES['UK'][0])
  const [calculationType, setCalculationType] = useState<'add' | 'remove' | 'extract'>('add')
  
  // Additional options
  const [quantity, setQuantity] = useState<number>(1)
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')
  const [shipping, setShipping] = useState<number>(0)
  const [includeVatOnShipping, setIncludeVatOnShipping] = useState<boolean>(true)
  
  // Results
  const [netAmount, setNetAmount] = useState<number>(0)
  const [vatAmount, setVatAmount] = useState<number>(0)
  const [grossAmount, setGrossAmount] = useState<number>(0)
  const [effectiveRate, setEffectiveRate] = useState<number>(0)

  const calculateVat = () => {
    let baseAmount = amount * quantity
    
    // Apply discount
    let discountAmount = 0
    if (discountType === 'percentage') {
      discountAmount = baseAmount * (discount / 100)
    } else {
      discountAmount = discount
    }
    baseAmount -= discountAmount

    // Calculate VAT based on calculation type
    let calculatedNet = 0
    let calculatedVat = 0
    let calculatedGross = 0
    const rate = selectedRate.rate / 100

    switch (calculationType) {
      case 'add':
        // Calculate VAT to add to net amount
        calculatedNet = baseAmount
        calculatedVat = baseAmount * rate
        calculatedGross = baseAmount + calculatedVat
        break
        
      case 'remove':
        // Remove VAT from gross amount
        calculatedGross = baseAmount
        calculatedNet = baseAmount / (1 + rate)
        calculatedVat = calculatedGross - calculatedNet
        break
        
      case 'extract':
        // Extract VAT from amount that includes VAT
        calculatedGross = baseAmount
        calculatedVat = baseAmount * (rate / (1 + rate))
        calculatedNet = baseAmount - calculatedVat
        break
    }

    // Handle shipping
    if (shipping > 0) {
      if (includeVatOnShipping) {
        const shippingVat = shipping * rate
        calculatedVat += shippingVat
        calculatedGross += shipping + shippingVat
      } else {
        calculatedGross += shipping
      }
      calculatedNet += shipping
    }

    // Calculate effective rate
    const effectiveVatRate = (calculatedVat / calculatedNet) * 100

    // Update state
    setNetAmount(calculatedNet)
    setVatAmount(calculatedVat)
    setGrossAmount(calculatedGross)
    setEffectiveRate(effectiveVatRate)

    // Generate chart data
    generateChartData(calculatedNet, calculatedVat, discountAmount)
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (net: number, vat: number, discount: number) => {
    const data = [
      { value: net, name: 'Net Amount' },
      { value: vat, name: 'VAT Amount' }
    ]
    
    if (discount > 0) {
      data.push({ value: discount, name: 'Discount' })
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
            const colors = ['#22c55e', '#3b82f6', '#f97316']
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
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Region and Rate Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              setSelectedRate(VAT_RATES[e.target.value][0])
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            {Object.keys(VAT_RATES).map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 ">
            VAT Rate
          </label>
          <select
            value={selectedRate.label}
            onChange={(e) => {
              const rate = VAT_RATES[region].find(r => r.label === e.target.value)
              if (rate) setSelectedRate(rate)
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            {VAT_RATES[region].map(rate => (
              <option key={rate.label} value={rate.label}>
                {rate.label} ({rate.rate}%) - {rate.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Calculation Type
          </label>
          <select
            value={calculationType}
            onChange={(e) => setCalculationType(e.target.value as 'add' | 'remove' | 'extract')}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="add">Add VAT to net amount</option>
            <option value="remove">Remove VAT from gross amount</option>
            <option value="extract">Extract VAT from inclusive amount</option>
          </select>
        </div>
      </div>

      {/* Additional Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 ">
            Discount Type
          </label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
          >
            <option value="percentage">Percentage</option>
            <option value="amount">Fixed Amount</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeVatOnShipping"
            checked={includeVatOnShipping}
            onChange={(e) => setIncludeVatOnShipping(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="includeVatOnShipping"
            className="text-sm font-medium text-gray-700 "
          >
            Apply VAT to shipping
          </label>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 ">
          <h3 className="font-semibold text-green-700 ">Net Amount</h3>
          <p className="text-2xl font-bold text-green-800 ">
            ${netAmount.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 ">
            Before VAT
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 ">
          <h3 className="font-semibold text-blue-700 ">VAT Amount</h3>
          <p className="text-2xl font-bold text-blue-800 ">
            ${vatAmount.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 ">
            {selectedRate.rate}% VAT
          </p>
        </div>

        <div className="p-4 bg-purple-100 ">
          <h3 className="font-semibold text-purple-700 ">Gross Amount</h3>
          <p className="text-2xl font-bold text-purple-800 ">
            ${grossAmount.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 ">
            Including VAT
          </p>
        </div>

        <div className="p-4 bg-amber-100 ">
          <h3 className="font-semibold text-amber-700 ">Effective Rate</h3>
          <p className="text-2xl font-bold text-amber-800 ">
            {effectiveRate.toFixed(2)}%
          </p>
          <p className="text-sm text-amber-600 ">
            Actual VAT rate
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
          title="VAT Calculator Results"
          results={`Net: $${netAmount.toFixed(2)} | VAT: $${vatAmount.toFixed(2)} | Gross: $${grossAmount.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="VAT Calculator"
      description="Calculate VAT amounts and prices for different regions"
      inputs={inputs}
      onCalculate={calculateVat}
      results={results}
    />
  )
}
