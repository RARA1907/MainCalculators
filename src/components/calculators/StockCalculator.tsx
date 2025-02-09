'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface Position {
  shares: number
  entryPrice: number
  date: string
}

export function StockCalculator() {
  const [currentPrice, setCurrentPrice] = useState<number>(100)
  const [positions, setPositions] = useState<Position[]>([
    { shares: 10, entryPrice: 90, date: '2024-01-01' }
  ])
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000)
  const [stopLoss, setStopLoss] = useState<number>(85)
  const [targetPrice, setTargetPrice] = useState<number>(120)
  const [commission, setCommission] = useState<number>(0)

  // Calculated results
  const [totalValue, setTotalValue] = useState<number>(0)
  const [totalReturn, setTotalReturn] = useState<number>(0)
  const [returnPercentage, setReturnPercentage] = useState<number>(0)
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(0)
  const [potentialProfit, setPotentialProfit] = useState<number>(0)
  const [potentialLoss, setPotentialLoss] = useState<number>(0)
  const [breakevenPrice, setBreakevenPrice] = useState<number>(0)

  const calculateMetrics = () => {
    // Calculate total investment and current value
    let totalInvestment = 0
    let currentValue = 0
    let totalShares = 0

    positions.forEach(position => {
      const positionInvestment = position.shares * position.entryPrice
      const positionValue = position.shares * currentPrice
      totalInvestment += positionInvestment + commission
      currentValue += positionValue
      totalShares += position.shares
    })

    // Calculate returns
    const absoluteReturn = currentValue - totalInvestment
    const returnPct = (absoluteReturn / totalInvestment) * 100

    // Calculate breakeven price
    const totalCommission = commission * positions.length
    const breakeven = (totalInvestment + totalCommission) / totalShares

    // Calculate risk/reward metrics
    const potentialProfitCalc = (targetPrice - currentPrice) * totalShares
    const potentialLossCalc = (currentPrice - stopLoss) * totalShares
    const riskReward = Math.abs(potentialProfitCalc / potentialLossCalc)

    // Update state
    setTotalValue(currentValue)
    setTotalReturn(absoluteReturn)
    setReturnPercentage(returnPct)
    setRiskRewardRatio(riskReward)
    setPotentialProfit(potentialProfitCalc)
    setPotentialLoss(potentialLossCalc)
    setBreakevenPrice(breakeven)

    // Generate chart data
    const chartData = generateChartData(totalShares, breakeven)
    setTimelineData(chartData)
  }

  const [timelineData, setTimelineData] = useState<any[]>([])

  const generateChartData = (totalShares: number, breakeven: number) => {
    const data = []
    const minPrice = Math.min(stopLoss, breakeven) * 0.9
    const maxPrice = Math.max(targetPrice, breakeven) * 1.1
    const step = (maxPrice - minPrice) / 20

    for (let price = minPrice; price <= maxPrice; price += step) {
      const value = totalShares * price
      const profit = value - (totalShares * breakeven)
      data.push([price, profit])
    }

    return data
  }

  const addPosition = () => {
    setPositions([
      ...positions,
      { shares: 0, entryPrice: currentPrice, date: new Date().toISOString().split('T')[0] }
    ])
  }

  const updatePosition = (index: number, field: keyof Position, value: number | string) => {
    const newPositions = [...positions]
    newPositions[index] = { ...newPositions[index], [field]: value }
    setPositions(newPositions)
  }

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index))
  }

  const inputs = [
    {
      label: 'Current Stock Price ($)',
      type: 'number',
      value: currentPrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCurrentPrice(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'currentPrice',
      placeholder: '100'
    },
    {
      label: 'Stop Loss ($)',
      type: 'number',
      value: stopLoss,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setStopLoss(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'stopLoss',
      placeholder: '85'
    },
    {
      label: 'Target Price ($)',
      type: 'number',
      value: targetPrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setTargetPrice(Number(e.target.value)),
      min: 0.01,
      step: 0.01,
      name: 'targetPrice',
      placeholder: '120'
    },
    {
      label: 'Commission per Trade ($)',
      type: 'number',
      value: commission,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCommission(Number(e.target.value)),
      min: 0,
      step: 0.01,
      name: 'commission',
      placeholder: '0'
    }
  ]

  const getChartOption = () => ({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const price = params[0].data[0]
        const profit = params[0].data[1]
        return `Stock Price: $${price.toFixed(2)}<br/>P/L: $${profit.toFixed(2)}`
      }
    },
    xAxis: {
      type: 'value',
      name: 'Stock Price ($)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(0)}`
      }
    },
    yAxis: {
      type: 'value',
      name: 'Profit/Loss ($)',
      nameLocation: 'middle',
      nameGap: 50,
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(0)}`
      }
    },
    series: [
      {
        data: timelineData,
        type: 'line',
        smooth: true,
        name: 'P/L',
        markLine: {
          data: [
            { yAxis: 0, lineStyle: { color: '#475569' } },
            { xAxis: breakevenPrice, lineStyle: { color: '#475569' } }
          ],
          label: {
            formatter: (params: any) => {
              if (params.value === 0) return 'Break-even'
              if (params.value === breakevenPrice) return `$${breakevenPrice.toFixed(2)}`
              return ''
            }
          }
        },
        markArea: {
          data: [
            [
              { xAxis: 'min', itemStyle: { color: 'rgba(239, 68, 68, 0.1)' } },
              { xAxis: breakevenPrice }
            ],
            [
              { xAxis: breakevenPrice, itemStyle: { color: 'rgba(34, 197, 94, 0.1)' } },
              { xAxis: 'max' }
            ]
          ]
        }
      }
    ]
  })

  const results = (
    <div className="space-y-6">
      {/* Positions Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 ">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 ">Shares</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 ">Entry Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 ">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white ">
            {positions.map((position, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    value={position.date}
                    onChange={(e) => updatePosition(index, 'date', e.target.value)}
                    className="w-full bg-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={position.shares}
                    onChange={(e) => updatePosition(index, 'shares', Number(e.target.value))}
                    min="0"
                    step="1"
                    className="w-full bg-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={position.entryPrice}
                    onChange={(e) => updatePosition(index, 'entryPrice', Number(e.target.value))}
                    min="0.01"
                    step="0.01"
                    className="w-full bg-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => removePosition(index)}
                    className="px-3 py-1 rounded-md bg-red-100 "
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={addPosition}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 "
      >
        Add Position
      </button>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-green-100 ">
          <h3 className="font-semibold text-green-700 ">Total Value</h3>
          <p className="text-2xl font-bold text-green-800 ">
            ${totalValue.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 ">
            Return: {returnPercentage.toFixed(2)}%
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 ">
          <h3 className="font-semibold text-blue-700 ">Risk/Reward Ratio</h3>
          <p className="text-2xl font-bold text-blue-800 ">
            {riskRewardRatio.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 ">
            Target: ${targetPrice} | Stop: ${stopLoss}
          </p>
        </div>

        <div className="p-4 bg-purple-100 ">
          <h3 className="font-semibold text-purple-700 ">Breakeven Price</h3>
          <p className="text-2xl font-bold text-purple-800 ">
            ${breakevenPrice.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 ">
            Including commissions
          </p>
        </div>
      </div>

      {/* P/L Chart */}
      {timelineData.length > 0 && (
        <div className="h-[400px] p-4 bg-white ">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Stock Calculator Results"
          results={`Total Value: $${totalValue.toFixed(2)} (${returnPercentage.toFixed(2)}% return)`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Stock Calculator"
      description="Calculate stock position metrics, returns, and risk/reward ratios"
      inputs={inputs}
      onCalculate={calculateMetrics}
      results={results}
    />
  )
}
