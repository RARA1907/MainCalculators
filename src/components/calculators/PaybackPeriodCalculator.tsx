'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'

export function PaybackPeriodCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [annualCashFlow, setAnnualCashFlow] = useState<number>(2500)
  const [growthRate, setGrowthRate] = useState<number>(0)
  const [paybackPeriod, setPaybackPeriod] = useState<number>(0)
  const [discountedPaybackPeriod, setDiscountedPaybackPeriod] = useState<number>(0)
  const [cumulativeCashFlow, setCumulativeCashFlow] = useState<number[]>([])

  const calculatePaybackPeriod = () => {
    let remainingInvestment = initialInvestment
    let years = 0
    let yearlyFlows: number[] = []
    let currentCashFlow = annualCashFlow
    
    // Calculate simple payback period
    while (remainingInvestment > 0 && years < 30) {
      remainingInvestment -= currentCashFlow
      yearlyFlows.push(currentCashFlow)
      currentCashFlow *= (1 + growthRate / 100)
      years += 1
    }

    // Calculate exact payback period including partial years
    const exactPayback = years - 1 + (remainingInvestment + currentCashFlow) / currentCashFlow
    setPaybackPeriod(exactPayback)

    // Calculate cumulative cash flow for chart
    let cumulative = -initialInvestment
    const cumulativeFlows = [cumulative]
    yearlyFlows.forEach(flow => {
      cumulative += flow
      cumulativeFlows.push(cumulative)
    })
    setCumulativeCashFlow(cumulativeFlows)

    // Calculate discounted payback period (using 10% discount rate)
    const discountRate = 0.10
    remainingInvestment = initialInvestment
    years = 0
    currentCashFlow = annualCashFlow

    while (remainingInvestment > 0 && years < 30) {
      const discountedCashFlow = currentCashFlow / Math.pow(1 + discountRate, years + 1)
      remainingInvestment -= discountedCashFlow
      currentCashFlow *= (1 + growthRate / 100)
      years += 1
    }

    const exactDiscountedPayback = years - 1 + (remainingInvestment + currentCashFlow) / currentCashFlow
    setDiscountedPaybackPeriod(exactDiscountedPayback)
  }

  const inputs = [
    {
      label: 'Initial Investment ($)',
      type: 'number',
      value: initialInvestment,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setInitialInvestment(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'initialInvestment',
      placeholder: '10000'
    },
    {
      label: 'Annual Cash Flow ($)',
      type: 'number',
      value: annualCashFlow,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setAnnualCashFlow(Number(e.target.value)),
      min: 0,
      step: 500,
      name: 'annualCashFlow',
      placeholder: '2500'
    },
    {
      label: 'Annual Growth Rate (%)',
      type: 'number',
      value: growthRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setGrowthRate(Number(e.target.value)),
      min: -100,
      max: 100,
      step: 0.5,
      name: 'growthRate',
      placeholder: '0'
    }
  ]

  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const year = params[0].dataIndex
        const value = params[0].value
        return `Year ${year}<br/>Cumulative Cash Flow: $${value.toFixed(2)}`
      }
    },
    xAxis: {
      type: 'category',
      data: cumulativeCashFlow.map((_, index) => `Year ${index}`),
      name: 'Year'
    },
    yAxis: {
      type: 'value',
      name: 'Cumulative Cash Flow ($)',
      axisLabel: {
        formatter: (value: number) => `$${value}`
      }
    },
    series: [
      {
        data: cumulativeCashFlow,
        type: 'line',
        smooth: true,
        markLine: {
          data: [
            {
              yAxis: 0,
              lineStyle: {
                color: '#ff4d4f'
              },
              label: {
                formatter: 'Break-even'
              }
            }
          ]
        }
      }
    ]
  })

  const results = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Simple Payback Period</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            {paybackPeriod.toFixed(2)} years
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Discounted Payback Period</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {discountedPaybackPeriod.toFixed(2)} years
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">(10% discount rate)</p>
        </div>
      </div>

      {cumulativeCashFlow.length > 0 && (
        <div className="h-[300px]">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}
    </div>
  )

  return (
    <CalculatorLayout
      title="Payback Period Calculator"
      description="Calculate how long it will take to recover your initial investment"
      inputs={inputs}
      onCalculate={calculatePaybackPeriod}
      results={results}
    />
  )
}
