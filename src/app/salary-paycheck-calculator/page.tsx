'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Percent, Calendar, FileText, Lightbulb, RefreshCw, AlertCircle, Download, Copy } from 'lucide-react'

interface PaycheckResult {
  grossPay: number
  netPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  otherDeductions: number
  takeHomePercentage: number
  effectiveTaxRate: number
}

interface AIAnalysis {
  summary: string
  insights: string[]
  recommendations: string[]
  taxOptimization: string[]
  financialTips: string[]
}

export default function SalaryPaycheckCalculator() {
  const [formData, setFormData] = useState({
    salary: '',
    payFrequency: 'bi-weekly',
    state: '',
    filingStatus: 'single',
    allowances: 1,
    otherDeductions: '',
    retirementContribution: '',
    healthInsurance: ''
  })

  const [results, setResults] = useState<PaycheckResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const payFrequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'semi-monthly', label: 'Semi-monthly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'annually', label: 'Annually' }
  ]

  const states = [
    { value: '', label: 'Select State' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ]

  const filingStatuses = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married Filing Jointly' },
    { value: 'married-separate', label: 'Married Filing Separately' },
    { value: 'head-of-household', label: 'Head of Household' }
  ]

  const calculatePaycheck = (): PaycheckResult => {
    const salary = parseFloat(formData.salary)
    const payFrequency = formData.payFrequency
    const allowances = formData.allowances
    const otherDeductions = parseFloat(formData.otherDeductions) || 0
    const retirementContribution = parseFloat(formData.retirementContribution) || 0
    const healthInsurance = parseFloat(formData.healthInsurance) || 0

    // Calculate gross pay per paycheck
    let grossPay: number
    switch (payFrequency) {
      case 'weekly':
        grossPay = salary / 52
        break
      case 'bi-weekly':
        grossPay = salary / 26
        break
      case 'semi-monthly':
        grossPay = salary / 24
        break
      case 'monthly':
        grossPay = salary / 12
        break
      case 'annually':
        grossPay = salary
        break
      default:
        grossPay = salary / 26
    }

    // Federal tax calculation (simplified)
    const federalTaxRate = 0.22 // Simplified rate
    const federalTax = grossPay * federalTaxRate

    // State tax calculation (simplified)
    const stateTaxRate = 0.05 // Simplified rate
    const stateTax = grossPay * stateTaxRate

    // Social Security (6.2% up to limit)
    const socialSecurity = Math.min(grossPay * 0.062, 160200 / 26)

    // Medicare (1.45%)
    const medicare = grossPay * 0.0145

    // Total deductions
    const totalDeductions = federalTax + stateTax + socialSecurity + medicare + otherDeductions + retirementContribution + healthInsurance

    // Net pay
    const netPay = grossPay - totalDeductions

    // Percentages
    const takeHomePercentage = (netPay / grossPay) * 100
    const effectiveTaxRate = ((grossPay - netPay) / grossPay) * 100

    return {
      grossPay,
      netPay,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      otherDeductions,
      takeHomePercentage,
      effectiveTaxRate
    }
  }

  const generateAIAnalysis = async (paycheckResult: PaycheckResult) => {
    try {
      const response = await fetch('/api/analyze-paycheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salary: parseFloat(formData.salary),
          payFrequency: formData.payFrequency,
          state: formData.state,
          filingStatus: formData.filingStatus,
          allowances: formData.allowances,
          paycheckResult
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis')
      }

      setAiAnalysis(data.analysis)
    } catch (err) {
      console.error('Error generating analysis:', err)
      // Fallback to mock analysis
      setAiAnalysis({
        summary: `Your take-home pay is ${paycheckResult.takeHomePercentage.toFixed(1)}% of your gross pay, which is ${paycheckResult.takeHomePercentage > 70 ? 'good' : 'below average'} for your income level.`,
        insights: [
          `You're paying ${paycheckResult.effectiveTaxRate.toFixed(1)}% in total taxes`,
          `Social Security contribution: $${paycheckResult.socialSecurity.toFixed(2)} per paycheck`,
          `Medicare contribution: $${paycheckResult.medicare.toFixed(2)} per paycheck`
        ],
        recommendations: [
          'Consider increasing retirement contributions to reduce taxable income',
          'Review your withholding allowances to optimize tax payments',
          'Explore tax-advantaged accounts like HSA or FSA'
        ],
        taxOptimization: [
          'Maximize 401(k) contributions',
          'Consider traditional IRA contributions',
          'Review state-specific tax credits'
        ],
        financialTips: [
          'Build an emergency fund with 3-6 months of expenses',
          'Consider automatic savings transfers',
          'Review your budget monthly'
        ]
      })
    }
  }

  const handleCalculate = async () => {
    if (!formData.salary || !formData.state) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const paycheckResult = calculatePaycheck()
      setResults(paycheckResult)
      
      // Generate AI analysis
      await generateAIAnalysis(paycheckResult)
    } catch (err) {
      setError('Error calculating paycheck')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportResults = () => {
    if (!results) return
    
    const csvContent = `Paycheck Calculation Results
Gross Pay,$${results.grossPay.toFixed(2)}
Net Pay,$${results.netPay.toFixed(2)}
Federal Tax,$${results.federalTax.toFixed(2)}
State Tax,$${results.stateTax.toFixed(2)}
Social Security,$${results.socialSecurity.toFixed(2)}
Medicare,$${results.medicare.toFixed(2)}
Take Home %,${results.takeHomePercentage.toFixed(1)}%
Effective Tax Rate,${results.effectiveTaxRate.toFixed(1)}%`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paycheck-calculation.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Salary Paycheck Calculator</h1>
              <p className="text-slate-600 mt-1">Calculate your take-home pay with AI-powered financial analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Lightbulb className="w-4 h-4" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Calculate Your Paycheck</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual Salary *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      placeholder="Enter your annual salary"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pay Frequency
                  </label>
                  <select
                    value={formData.payFrequency}
                    onChange={(e) => setFormData({...formData, payFrequency: e.target.value})}
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {payFrequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>{freq.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {states.map(state => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={formData.filingStatus}
                    onChange={(e) => setFormData({...formData, filingStatus: e.target.value})}
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {filingStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Allowances
                  </label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({...formData, allowances: parseInt(e.target.value)})}
                    min="0"
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Retirement Contribution (per paycheck)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.retirementContribution}
                      onChange={(e) => setFormData({...formData, retirementContribution: e.target.value})}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Health Insurance (per paycheck)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.healthInsurance}
                      onChange={(e) => setFormData({...formData, healthInsurance: e.target.value})}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Other Deductions (per paycheck)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={formData.otherDeductions}
                      onChange={(e) => setFormData({...formData, otherDeductions: e.target.value})}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!formData.salary || !formData.state || isLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Paycheck
                </>
              )}
            </button>

            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Paycheck Results */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  Paycheck Breakdown
                </h2>
                <button
                  onClick={exportResults}
                  className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Gross Pay</p>
                      <p className="text-2xl font-bold text-green-800">${results.grossPay.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Net Pay</p>
                      <p className="text-2xl font-bold text-blue-800">${results.netPay.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Take Home %</p>
                      <p className="text-2xl font-bold text-purple-800">{results.takeHomePercentage.toFixed(1)}%</p>
                    </div>
                    <Percent className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Tax Rate</p>
                      <p className="text-2xl font-bold text-orange-800">{results.effectiveTaxRate.toFixed(1)}%</p>
                    </div>
                    <FileText className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Breakdown</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Federal Tax</span>
                      <span className="font-medium">${results.federalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">State Tax</span>
                      <span className="font-medium">${results.stateTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Social Security</span>
                      <span className="font-medium">${results.socialSecurity.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Medicare</span>
                      <span className="font-medium">${results.medicare.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Other Deductions</span>
                      <span className="font-medium">${results.otherDeductions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Retirement</span>
                      <span className="font-medium">${parseFloat(formData.retirementContribution) || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Health Insurance</span>
                      <span className="font-medium">${parseFloat(formData.healthInsurance) || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-600">Total Deductions</span>
                      <span className="font-medium text-red-600">${(results.grossPay - results.netPay).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
                  AI Financial Analysis
                </h2>

                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
                    <p className="text-slate-700">{aiAnalysis.summary}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Insights */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.insights.map((insight, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3 mt-2"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Tax Optimization */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Tax Optimization</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.taxOptimization.map((tip, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-3 mt-2"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Financial Tips */}
                    <div className="bg-slate-50 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Tips</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.financialTips.map((tip, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-3 mt-2"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">💡 Calculator Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Accurate Inputs</h4>
              <p className="text-slate-600 text-sm">
                For the most accurate results, include all deductions and benefits from your employer.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Regular Reviews</h4>
              <p className="text-slate-600 text-sm">
                Review your paycheck calculations quarterly to ensure accuracy and optimize your finances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 