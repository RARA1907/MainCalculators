'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

export function FutureValueCalculator() {
  const [presentValue, setPresentValue] = useState<number>(1000)
  const [interestRate, setInterestRate] = useState<number>(5)
  const [timePeriod, setTimePeriod] = useState<number>(5)
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('annually')
  const [additionalContributions, setAdditionalContributions] = useState<number>(0)
  const [contributionFrequency, setContributionFrequency] = useState<string>('monthly')
  const [futureValue, setFutureValue] = useState<number>(0)
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [totalContributions, setTotalContributions] = useState<number>(0)
  const [totalInterest, setTotalInterest] = useState<number>(0)

  const calculateFutureValue = () => {
    const rate = interestRate / 100
    let n = 1 // compounding frequency per year
    let m = 12 // contribution frequency per year

    // Set compounding frequency
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

    // Set contribution frequency
    switch (contributionFrequency) {
      case 'annually':
        m = 1
        break
      case 'semi-annually':
        m = 2
        break
      case 'quarterly':
        m = 4
        break
      case 'monthly':
        m = 12
        break
    }

    const periodicRate = rate / n
    const totalPeriods = timePeriod * n
    const contributionsPerPeriod = additionalContributions * (n / m)

    // Calculate future value with contributions
    let fv = presentValue * Math.pow(1 + periodicRate, totalPeriods)
    if (additionalContributions > 0) {
      const contributionFv = contributionsPerPeriod * 
        ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate)
      fv += contributionFv
    }

    setFutureValue(fv)

    // Calculate total contributions
    const totalContrib = additionalContributions * m * timePeriod
    setTotalContributions(totalContrib)
    setTotalInterest(fv - presentValue - totalContrib)

    // Generate timeline data for the chart
    const timelinePoints = []
    let currentValue = presentValue
    let yearlyContributions = additionalContributions * m

    for (let year = 0; year <= timePeriod; year++) {
      if (year === 0) {
        timelinePoints.push({
          year,
          principal: currentValue,
          contributions: 0,
          interest: 0,
          total: currentValue
        })
        continue
      }

      const previousTotal = timelinePoints[year - 1].total
      const yearEnd = previousTotal * Math.pow(1 + rate, 1) + yearlyContributions
      const interestEarned = yearEnd - previousTotal - yearlyContributions

      timelinePoints.push({
        year,
        principal: presentValue,
        contributions: timelinePoints[year - 1].contributions + yearlyContributions,
        interest: timelinePoints[year - 1].interest + interestEarned,
        total: yearEnd
      })
    }
    setTimelineData(timelinePoints)
  }

  // Define input interface to match CalculatorLayout requirements
  interface CalculatorInput {
    label: string;
    type: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    name: string;
  }

  const frequencyToNumber = (freq: string): number => {
    switch (freq) {
      case 'annually': return 1;
      case 'semi-annually': return 2;
      case 'quarterly': return 4;
      case 'monthly': return 12;
      case 'daily': return 365;
      default: return 12;
    }
  }

  const inputs: CalculatorInput[] = [
    {
      label: 'Present Value ($)',
      type: 'number',
      value: presentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setPresentValue(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'presentValue',
      placeholder: '1000'
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
      min: 1,
      max: 100,
      step: 1,
      name: 'timePeriod',
      placeholder: '5'
    },
    {
      label: 'Compounding Frequency',
      type: 'number',
      value: frequencyToNumber(compoundingFrequency),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCompoundingFrequency(e.target.value),
      name: 'compoundingFrequency',
      min: 1,
      max: 365
    },
    {
      label: 'Additional Contributions ($)',
      type: 'number',
      value: additionalContributions,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setAdditionalContributions(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'additionalContributions',
      placeholder: '0'
    },
    {
      label: 'Contribution Frequency',
      type: 'number',
      value: frequencyToNumber(contributionFrequency),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setContributionFrequency(e.target.value),
      name: 'contributionFrequency',
      min: 1,
      max: 12
    }
  ]

  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const year = params[0].dataIndex
        const data = timelineData[year]
        return `Year ${year}<br/>
                Principal: $${data.principal.toFixed(2)}<br/>
                Contributions: $${data.contributions.toFixed(2)}<br/>
                Interest: $${data.interest.toFixed(2)}<br/>
                Total: $${data.total.toFixed(2)}`
      }
    },
    legend: {
      data: ['Principal', 'Contributions', 'Interest']
    },
    xAxis: {
      type: 'category',
      data: timelineData.map(point => `Year ${point.year}`),
      name: 'Year',
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
        name: 'Principal',
        type: 'bar',
        stack: 'total',
        data: timelineData.map(point => point.principal),
        itemStyle: { color: '#4ade80' }
      },
      {
        name: 'Contributions',
        type: 'bar',
        stack: 'total',
        data: timelineData.map(point => point.contributions),
        itemStyle: { color: '#60a5fa' }
      },
      {
        name: 'Interest',
        type: 'bar',
        stack: 'total',
        data: timelineData.map(point => point.interest),
        itemStyle: { color: '#f472b6' }
      }
    ]
  })

  const results = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Future Value</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">
            ${futureValue.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Total value after {timePeriod} years
          </p>
        </div>
        
        <div className="p-6 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Total Contributions</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
            ${totalContributions.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            Sum of all contributions
          </p>
        </div>

        <div className="p-6 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
          <h3 className="font-semibold text-pink-700 dark:text-pink-300">Total Interest</h3>
          <p className="text-3xl font-bold text-pink-800 dark:text-pink-200">
            ${totalInterest.toFixed(2)}
          </p>
          <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
            Interest earned over time
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
          title="Future Value Calculator Results"
          results={`Future Value: $${futureValue.toFixed(2)} (${totalInterest.toFixed(2)} interest earned)`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Future Value Calculator"
      description="Calculate the future value of your investments with regular contributions"
      inputs={inputs}
      onCalculate={calculateFutureValue}
      results={results}
    />
  )
}
