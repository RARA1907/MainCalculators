'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface DividendTimelineData {
  year: number
  dividendIncome: number
  totalInvestment: number
  shares: number
  dividendPerShare: number
}

export function DividendCalculator() {
  // Initial investment inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [sharePrice, setSharePrice] = useState<number>(50)
  const [dividendPerShare, setDividendPerShare] = useState<number>(2)
  
  // Growth inputs
  const [yearsToProject, setYearsToProject] = useState<number>(10)
  const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(5)
  const [additionalInvestmentPerYear, setAdditionalInvestmentPerYear] = useState<number>(1000)
  const [drip, setDrip] = useState<boolean>(true)
  
  // Results
  const [timelineData, setTimelineData] = useState<DividendTimelineData[]>([])
  const [totalDividends, setTotalDividends] = useState<number>(0)
  const [finalYield, setFinalYield] = useState<number>(0)
  const [finalShares, setFinalShares] = useState<number>(0)

  const calculateDividends = () => {
    const timeline: DividendTimelineData[] = []
    let currentShares = initialInvestment / sharePrice
    let totalInvestment = initialInvestment
    let totalDividendsEarned = 0
    let currentDividendPerShare = dividendPerShare

    for (let year = 1; year <= yearsToProject; year++) {
      // Calculate dividends for the year
      const yearlyDividends = currentShares * currentDividendPerShare

      // Add additional investment
      const additionalShares = additionalInvestmentPerYear / sharePrice
      currentShares += additionalShares
      totalInvestment += additionalInvestmentPerYear

      // DRIP calculation
      if (drip) {
        const dripShares = yearlyDividends / sharePrice
        currentShares += dripShares
      }

      // Increase dividend per share by growth rate
      currentDividendPerShare *= (1 + dividendGrowthRate / 100)
      totalDividendsEarned += yearlyDividends

      timeline.push({
        year,
        dividendIncome: yearlyDividends,
        totalInvestment,
        shares: currentShares,
        dividendPerShare: currentDividendPerShare
      })
    }

    setTimelineData(timeline)
    setTotalDividends(totalDividendsEarned)
    setFinalYield((timeline[timeline.length - 1].dividendIncome / totalInvestment) * 100)
    setFinalShares(currentShares)
  }

  const getChartOption = () => {
    const years = timelineData.map(d => d.year)
    const dividendIncome = timelineData.map(d => d.dividendIncome)
    const investments = timelineData.map(d => d.totalInvestment)

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const year = params[0].axisValue
          const data = timelineData[year - 1]
          return `Year ${year}<br/>
                 Dividend Income: $${data.dividendIncome.toFixed(2)}<br/>
                 Total Investment: $${data.totalInvestment.toFixed(2)}<br/>
                 Shares: ${data.shares.toFixed(2)}<br/>
                 Dividend/Share: $${data.dividendPerShare.toFixed(2)}`
        }
      },
      legend: {
        data: ['Dividend Income', 'Total Investment']
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Year',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: 'Amount ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => `$${value.toFixed(0)}`
        }
      },
      series: [
        {
          name: 'Dividend Income',
          type: 'bar',
          data: dividendIncome,
          itemStyle: {
            color: '#22c55e'
          }
        },
        {
          name: 'Total Investment',
          type: 'line',
          data: investments,
          itemStyle: {
            color: '#3b82f6'
          }
        }
      ]
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
      placeholder: '10000'
    },
    {
      label: 'Share Price ($)',
      type: 'number',
      value: sharePrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setSharePrice(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'sharePrice',
      placeholder: '50'
    },
    {
      label: 'Annual Dividend per Share ($)',
      type: 'number',
      value: dividendPerShare,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDividendPerShare(Number(e.target.value)),
      min: 0,
      step: 0.01,
      name: 'dividendPerShare',
      placeholder: '2'
    },
    {
      label: 'Years to Project',
      type: 'number',
      value: yearsToProject,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setYearsToProject(Number(e.target.value)),
      min: 1,
      max: 50,
      step: 1,
      name: 'yearsToProject',
      placeholder: '10'
    },
    {
      label: 'Dividend Growth Rate (%)',
      type: 'number',
      value: dividendGrowthRate,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDividendGrowthRate(Number(e.target.value)),
      min: 0,
      step: 0.1,
      name: 'dividendGrowthRate',
      placeholder: '5'
    },
    {
      label: 'Additional Investment per Year ($)',
      type: 'number',
      value: additionalInvestmentPerYear,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setAdditionalInvestmentPerYear(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'additionalInvestmentPerYear',
      placeholder: '1000'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* DRIP Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="drip"
          checked={drip}
          onChange={(e) => setDrip(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="drip" className="text-sm font-medium text-gray-700 ">
          Reinvest Dividends (DRIP)
        </label>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-green-100 ">
          <h3 className="font-semibold text-green-700 ">Total Dividends</h3>
          <p className="text-2xl font-bold text-green-800 ">
            ${totalDividends.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 ">
            Over {yearsToProject} years
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 ">
          <h3 className="font-semibold text-blue-700 ">Final Yield</h3>
          <p className="text-2xl font-bold text-blue-800 ">
            {finalYield.toFixed(2)}%
          </p>
          <p className="text-sm text-blue-600 ">
            Based on total investment
          </p>
        </div>

        <div className="p-4 bg-purple-100 ">
          <h3 className="font-semibold text-purple-700 ">Final Shares</h3>
          <p className="text-2xl font-bold text-purple-800 ">
            {finalShares.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 ">
            Including DRIP & additional investments
          </p>
        </div>
      </div>

      {/* Timeline Chart */}
      {timelineData.length > 0 && (
        <div className="h-[400px] p-4 bg-white ">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Dividend Calculator Results"
          results={`Total Dividends: $${totalDividends.toFixed(2)} | Final Yield: ${finalYield.toFixed(2)}%`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Dividend Calculator"
      description="Calculate dividend income, yield, and growth over time with DRIP options"
      inputs={inputs}
      onCalculate={calculateDividends}
      results={results}
    />
  )
}
