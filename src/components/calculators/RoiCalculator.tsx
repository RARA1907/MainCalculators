'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'

export function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(1000)
  const [finalValue, setFinalValue] = useState<number>(1500)
  const [timePeriod, setTimePeriod] = useState<number>(1)
  const [roi, setRoi] = useState<number>(0)
  const [annualizedRoi, setAnnualizedRoi] = useState<number>(0)

  const calculateROI = () => {
    // Calculate ROI
    const roiValue = ((finalValue - initialInvestment) / initialInvestment) * 100
    setRoi(roiValue)

    // Calculate Annualized ROI
    if (timePeriod > 0) {
      const annualizedRoiValue = (Math.pow((finalValue / initialInvestment), 1/timePeriod) - 1) * 100
      setAnnualizedRoi(annualizedRoiValue)
    }
  }

  const inputs = [
    {
      label: 'Initial Investment ($)',
      type: 'number',
      value: initialInvestment,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setInitialInvestment(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'initialInvestment',
      placeholder: '1000'
    },
    {
      label: 'Final Value ($)',
      type: 'number',
      value: finalValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFinalValue(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'finalValue',
      placeholder: '1500'
    },
    {
      label: 'Time Period (Years)',
      type: 'number',
      value: timePeriod,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setTimePeriod(Number(e.target.value)),
      min: 0.1,
      step: 0.5,
      name: 'timePeriod',
      placeholder: '1'
    }
  ]

  const getChartOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ${c} ({d}%)'
    },
    series: [
      {
        name: 'Investment Breakdown',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: initialInvestment, 
            name: 'Initial Investment',
            itemStyle: { color: '#4ade80' }
          },
          { 
            value: Math.max(0, finalValue - initialInvestment), 
            name: 'Return',
            itemStyle: { color: '#60a5fa' }
          }
        ]
      }
    ]
  })

  const results = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">ROI</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            {roi.toFixed(2)}%
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Annualized ROI</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {annualizedRoi.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="ROI Calculator"
      description="Calculate your Return on Investment (ROI) and annualized ROI"
      inputs={inputs}
      onCalculate={calculateROI}
      results={results}
    />
  )
}
