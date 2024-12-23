'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

export function PresentValueCalculator() {
  const [futureValue, setFutureValue] = useState<number>(10000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [timePeriod, setTimePeriod] = useState<number>(5)
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('annually')
  const [presentValue, setPresentValue] = useState<number>(0)
  const [timelineData, setTimelineData] = useState<any[]>([])

  const calculatePresentValue = () => {
    const rate = interestRate / 100
    let n = 1 // compounding frequency per year

    switch (compoundingFrequency) {
      case 'annually':
        n = 1
        break
      case 'semi-annually':
        n = 2
        break
      case 'quarterly':
        n = 4
        break
      case 'monthly':
        n = 12
        break
      case 'daily':
        n = 365
        break
    }

    // Calculate Present Value
    const totalPeriods = timePeriod * n
    const periodicRate = rate / n
    const pv = futureValue / Math.pow(1 + periodicRate, totalPeriods)
    setPresentValue(pv)

    // Generate timeline data for the chart
    const timelinePoints = []
    for (let year = 0; year <= timePeriod; year++) {
      const yearPeriods = year * n
      const valueAtTime = futureValue / Math.pow(1 + periodicRate, totalPeriods - yearPeriods)
      timelinePoints.push({
        year,
        value: valueAtTime
      })
    }
    setTimelineData(timelinePoints)
  }

  const inputs = [
    {
      label: 'Future Value ($)',
      type: 'number',
      value: futureValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFutureValue(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'futureValue',
      placeholder: '10000'
    },
    {
      label: 'Interest Rate (%)',
      type: 'number',
      value: interestRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setInterestRate(Number(e.target.value)),
      min: 0,
      max: 100,
      step: 0.1,
      name: 'interestRate',
      placeholder: '5'
    },
    {
      label: 'Time Period (Years)',
      type: 'number',
      value: timePeriod,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setTimePeriod(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'timePeriod',
      placeholder: '5'
    },
    {
      label: 'Compounding Frequency',
      type: 'select',
      value: compoundingFrequency,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => 
        setCompoundingFrequency(e.target.value),
      options: [
        { value: 'annually', label: 'Annually' },
        { value: 'semi-annually', label: 'Semi-annually' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'daily', label: 'Daily' }
      ],
      name: 'compoundingFrequency'
    }
  ]

  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0].data
        return `Year ${data[0]}<br/>Value: $${data[1].toFixed(2)}`
      }
    },
    xAxis: {
      type: 'value',
      name: 'Years',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Value ($)',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(0)}`
      }
    },
    series: [
      {
        data: timelineData.map(point => [point.year, point.value]),
        type: 'line',
        smooth: true,
        name: 'Value Over Time',
        lineStyle: {
          width: 3,
          color: '#4ade80'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(74, 222, 128, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(74, 222, 128, 0.05)'
              }
            ]
          }
        }
      }
    ]
  })

  const results = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Present Value</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">
            ${presentValue.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            This is what your future ${futureValue} is worth today
          </p>
        </div>
        
        <div className="p-6 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Discount Factor</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            {((presentValue / futureValue) * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            The percentage of future value in today's terms
          </p>
        </div>
      </div>

      {timelineData.length > 0 && (
        <div className="h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Present Value Calculator Results"
          results={`Present Value: $${presentValue.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Present Value Calculator"
      description="Calculate the current worth of a future sum of money"
      inputs={inputs}
      onCalculate={calculatePresentValue}
      results={results}
    />
  )
}
