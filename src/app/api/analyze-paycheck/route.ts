import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { salary, payFrequency, state, filingStatus, allowances, paycheckResult } = await request.json()

    if (!salary || !paycheckResult) {
      return NextResponse.json({ error: 'Salary and paycheck results are required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
Analyze this paycheck calculation and provide financial insights:

Salary: $${salary.toLocaleString()} annually
Pay Frequency: ${payFrequency}
State: ${state}
Filing Status: ${filingStatus}
Allowances: ${allowances}

Paycheck Results:
- Gross Pay: $${paycheckResult.grossPay.toFixed(2)}
- Net Pay: $${paycheckResult.netPay.toFixed(2)}
- Take Home Percentage: ${paycheckResult.takeHomePercentage.toFixed(1)}%
- Effective Tax Rate: ${paycheckResult.effectiveTaxRate.toFixed(1)}%
- Federal Tax: $${paycheckResult.federalTax.toFixed(2)}
- State Tax: $${paycheckResult.stateTax.toFixed(2)}
- Social Security: $${paycheckResult.socialSecurity.toFixed(2)}
- Medicare: $${paycheckResult.medicare.toFixed(2)}

Provide a comprehensive financial analysis in JSON format:

{
  "summary": "Brief 2-3 sentence summary of the paycheck analysis",
  "insights": [
    "3-4 key insights about the paycheck breakdown",
    "Focus on tax implications, take-home percentage, and deductions"
  ],
  "recommendations": [
    "3-4 actionable recommendations for optimizing finances",
    "Include tax optimization and retirement planning"
  ],
  "taxOptimization": [
    "3-4 specific tax optimization strategies",
    "Include deductions, credits, and retirement accounts"
  ],
  "financialTips": [
    "3-4 general financial wellness tips",
    "Include budgeting, saving, and investment advice"
  ]
}

Make the analysis practical, actionable, and specific to the income level and state. Focus on helping the person optimize their finances and understand their paycheck better.

Only return the JSON object, no additional text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    let analysis
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      // Fallback to mock analysis if parsing fails
      analysis = generateMockAnalysis(paycheckResult, salary, state)
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Error analyzing paycheck:', error)
    return NextResponse.json({ error: 'Failed to analyze paycheck' }, { status: 500 })
  }
}

function generateMockAnalysis(paycheckResult: any, salary: number, state: string) {
  const takeHomePercentage = paycheckResult.takeHomePercentage
  const effectiveTaxRate = paycheckResult.effectiveTaxRate

  let summaryQuality = 'good'
  if (takeHomePercentage < 65) summaryQuality = 'below average'
  if (takeHomePercentage > 80) summaryQuality = 'excellent'

  return {
    summary: `Your take-home pay is ${takeHomePercentage.toFixed(1)}% of your gross pay, which is ${summaryQuality} for your income level. You're paying ${effectiveTaxRate.toFixed(1)}% in total taxes, which is ${effectiveTaxRate > 30 ? 'above' : 'below'} the national average.`,
    insights: [
      `You're paying ${effectiveTaxRate.toFixed(1)}% in total taxes`,
      `Social Security contribution: $${paycheckResult.socialSecurity.toFixed(2)} per paycheck`,
      `Medicare contribution: $${paycheckResult.medicare.toFixed(2)} per paycheck`,
      `State taxes in ${state} are ${paycheckResult.stateTax > 0 ? 'applicable' : 'not applicable'}`
    ],
    recommendations: [
      'Consider increasing retirement contributions to reduce taxable income',
      'Review your withholding allowances to optimize tax payments',
      'Explore tax-advantaged accounts like HSA or FSA',
      'Consider consulting a tax professional for state-specific deductions'
    ],
    taxOptimization: [
      'Maximize 401(k) contributions up to the annual limit',
      'Consider traditional IRA contributions for additional tax benefits',
      'Review state-specific tax credits and deductions',
      'Explore health savings accounts (HSA) for medical expenses'
    ],
    financialTips: [
      'Build an emergency fund with 3-6 months of expenses',
      'Consider automatic savings transfers to separate accounts',
      'Review your budget monthly and track spending',
      'Consider investing in low-cost index funds for long-term growth'
    ]
  }
} 