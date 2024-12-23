'use client'

import React, { useState } from 'react'
import CalculatorLayout from './CalculatorLayout'
import ReactECharts from 'echarts-for-react'
import { SocialShareIcons } from '../common/SocialShareIcons'

interface PayPeriod {
  label: string
  value: number
  workingDays?: number
  workingHours?: number
}

const PAY_PERIODS: PayPeriod[] = [
  { label: 'Hourly', value: 2080, workingHours: 1 }, // Based on 40-hour work week
  { label: 'Daily', value: 260, workingDays: 1 }, // Based on 5-day work week
  { label: 'Weekly', value: 52 },
  { label: 'Bi-weekly', value: 26 },
  { label: 'Semi-monthly', value: 24 },
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Annually', value: 1 }
]

export function SalaryCalculator() {
  // Base salary inputs
  const [baseSalary, setBaseSalary] = useState<number>(50000)
  const [fromPeriod, setFromPeriod] = useState<string>('Annually')
  const [toPeriod, setToPeriod] = useState<string>('Monthly')
  
  // Additional compensation
  const [bonus, setBonus] = useState<number>(0)
  const [bonusFrequency, setBonusFrequency] = useState<string>('Annually')
  const [commission, setCommission] = useState<number>(0)
  const [commissionFrequency, setCommissionFrequency] = useState<string>('Monthly')
  const [overtime, setOvertime] = useState<number>(0)
  const [overtimeRate, setOvertimeRate] = useState<number>(1.5)
  const [stockOptions, setStockOptions] = useState<number>(0)
  const [benefits, setBenefits] = useState<number>(0)
  
  // Work schedule
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5)
  const [vacationDays, setVacationDays] = useState<number>(15)
  
  // Results
  const [convertedSalary, setConvertedSalary] = useState<number>(0)
  const [hourlyRate, setHourlyRate] = useState<number>(0)
  const [dailyRate, setDailyRate] = useState<number>(0)
  const [totalCompensation, setTotalCompensation] = useState<number>(0)
  const [effectiveHourlyRate, setEffectiveHourlyRate] = useState<number>(0)

  const calculateSalary = () => {
    // Convert base salary to annual
    const fromPeriodData = PAY_PERIODS.find(p => p.label === fromPeriod)
    const annualBaseSalary = baseSalary * (fromPeriodData?.value || 1)

    // Calculate converted salary
    const toPeriodData = PAY_PERIODS.find(p => p.label === toPeriod)
    const converted = annualBaseSalary / (toPeriodData?.value || 1)
    setConvertedSalary(converted)

    // Calculate hourly and daily rates
    const workingDaysPerYear = 260 - vacationDays
    const workingHoursPerYear = workingDaysPerYear * (hoursPerWeek / daysPerWeek)
    
    const hourly = annualBaseSalary / workingHoursPerYear
    const daily = annualBaseSalary / workingDaysPerYear
    setHourlyRate(hourly)
    setDailyRate(daily)

    // Calculate total annual compensation
    const annualBonus = bonus * (PAY_PERIODS.find(p => p.label === bonusFrequency)?.value || 1)
    const annualCommission = commission * (PAY_PERIODS.find(p => p.label === commissionFrequency)?.value || 1)
    const annualOvertime = overtime * overtimeRate * 52 // Assuming weekly overtime hours
    const annualTotal = annualBaseSalary + annualBonus + annualCommission + annualOvertime + stockOptions + benefits
    setTotalCompensation(annualTotal)

    // Calculate effective hourly rate including all compensation
    const effectiveHourly = annualTotal / workingHoursPerYear
    setEffectiveHourlyRate(effectiveHourly)

    // Generate chart data
    generateChartData(
      annualBaseSalary,
      annualBonus,
      annualCommission,
      annualOvertime,
      stockOptions,
      benefits
    )
  }

  const [chartData, setChartData] = useState<any[]>([])

  const generateChartData = (
    base: number,
    bonus: number,
    commission: number,
    overtime: number,
    stock: number,
    benefits: number
  ) => {
    const data = [
      { value: base, name: 'Base Salary' },
      { value: bonus, name: 'Bonus' },
      { value: commission, name: 'Commission' },
      { value: overtime, name: 'Overtime' },
      { value: stock, name: 'Stock Options' },
      { value: benefits, name: 'Benefits' }
    ].filter(item => item.value > 0)
    
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
            const colors = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#ec4899', '#14b8a6']
            return colors[params.dataIndex]
          }
        }
      }
    ]
  })

  const inputs = [
    {
      label: 'Base Salary',
      type: 'number',
      value: baseSalary,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setBaseSalary(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'baseSalary',
      placeholder: '50000'
    },
    {
      label: 'Bonus Amount',
      type: 'number',
      value: bonus,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setBonus(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'bonus',
      placeholder: '0'
    },
    {
      label: 'Commission',
      type: 'number',
      value: commission,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setCommission(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'commission',
      placeholder: '0'
    },
    {
      label: 'Overtime Hours (per week)',
      type: 'number',
      value: overtime,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setOvertime(Number(e.target.value)),
      min: 0,
      step: 1,
      name: 'overtime',
      placeholder: '0'
    },
    {
      label: 'Stock Options (annual value)',
      type: 'number',
      value: stockOptions,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setStockOptions(Number(e.target.value)),
      min: 0,
      step: 1000,
      name: 'stockOptions',
      placeholder: '0'
    },
    {
      label: 'Benefits Value (annual)',
      type: 'number',
      value: benefits,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setBenefits(Number(e.target.value)),
      min: 0,
      step: 100,
      name: 'benefits',
      placeholder: '0'
    },
    {
      label: 'Hours per Week',
      type: 'number',
      value: hoursPerWeek,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setHoursPerWeek(Number(e.target.value)),
      min: 1,
      max: 168,
      step: 1,
      name: 'hoursPerWeek',
      placeholder: '40'
    },
    {
      label: 'Days per Week',
      type: 'number',
      value: daysPerWeek,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setDaysPerWeek(Number(e.target.value)),
      min: 1,
      max: 7,
      step: 1,
      name: 'daysPerWeek',
      placeholder: '5'
    },
    {
      label: 'Vacation Days per Year',
      type: 'number',
      value: vacationDays,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setVacationDays(Number(e.target.value)),
      min: 0,
      max: 365,
      step: 1,
      name: 'vacationDays',
      placeholder: '15'
    }
  ]

  const results = (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            From Period
          </label>
          <select
            value={fromPeriod}
            onChange={(e) => setFromPeriod(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {PAY_PERIODS.map(period => (
              <option key={period.label} value={period.label}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            To Period
          </label>
          <select
            value={toPeriod}
            onChange={(e) => setToPeriod(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {PAY_PERIODS.map(period => (
              <option key={period.label} value={period.label}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overtime Rate
          </label>
          <select
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            <option value={1.5}>1.5x (Time and a half)</option>
            <option value={2}>2x (Double time)</option>
            <option value={2.5}>2.5x</option>
            <option value={3}>3x</option>
          </select>
        </div>
      </div>

      {/* Additional Compensation Frequency */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Bonus Frequency
          </label>
          <select
            value={bonusFrequency}
            onChange={(e) => setBonusFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {PAY_PERIODS.filter(p => p.label !== 'Hourly' && p.label !== 'Daily').map(period => (
              <option key={period.label} value={period.label}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Commission Frequency
          </label>
          <select
            value={commissionFrequency}
            onChange={(e) => setCommissionFrequency(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          >
            {PAY_PERIODS.filter(p => p.label !== 'Hourly' && p.label !== 'Daily').map(period => (
              <option key={period.label} value={period.label}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold text-green-700 dark:text-green-300">Converted Salary</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${convertedSalary.toFixed(2)}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Per {toPeriod.toLowerCase()} period
          </p>
        </div>
        
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300">Total Compensation</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            ${totalCompensation.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Annual total
          </p>
        </div>

        <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300">Hourly Rate</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            ${hourlyRate.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
            Base rate per hour
          </p>
        </div>

        <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">Daily Rate</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
            ${dailyRate.toFixed(2)}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Base rate per day
          </p>
        </div>
      </div>

      {/* Additional Results */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
          <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">
            Effective Hourly Rate
          </h3>
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
            ${effectiveHourlyRate.toFixed(2)}
          </p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
            Including all compensation
          </p>
        </div>

        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
          <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">
            Working Hours
          </h3>
          <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
            {(hoursPerWeek * 52) - (vacationDays * (hoursPerWeek / daysPerWeek))}
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
            Annual working hours
          </p>
        </div>
      </div>

      {/* Compensation Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="h-[400px] p-4 bg-white dark:bg-gray-800 rounded-lg">
          <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
        </div>
      )}

      {/* Social Share */}
      <div className="flex justify-end mt-4">
        <SocialShareIcons 
          title="Salary Calculator Results"
          results={`${toPeriod} Salary: $${convertedSalary.toFixed(2)} | Annual Total: $${totalCompensation.toFixed(2)}`}
        />
      </div>
    </div>
  )

  return (
    <CalculatorLayout
      title="Salary Calculator"
      description="Convert between salary periods and calculate total compensation"
      inputs={inputs}
      onCalculate={calculateSalary}
      results={results}
    />
  )
}
