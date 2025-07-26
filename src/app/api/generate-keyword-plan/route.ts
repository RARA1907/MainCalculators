import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { seedKeyword, minVolume, maxDifficulty, minCpc, includeSeasonal, includeLongTail } = await request.json()

    if (!seedKeyword) {
      return NextResponse.json({ error: 'Seed keyword is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `
Create a comprehensive keyword strategy plan for "${seedKeyword}" with the following requirements:

Criteria:
- Minimum search volume: ${minVolume}
- Maximum difficulty: ${maxDifficulty}
- Minimum CPC: $${minCpc}
- Include seasonal keywords: ${includeSeasonal}
- Include long-tail keywords: ${includeLongTail}

Generate a JSON response with the following structure:

{
  "primaryKeywords": [
    {
      "keyword": "keyword phrase",
      "searchVolume": number,
      "difficulty": number (0-100),
      "cpc": number,
      "competition": "Low/Medium/High",
      "intent": "Informational/Commercial/Transactional",
      "seasonality": "Year-round/Seasonal",
      "contentIdeas": ["idea1", "idea2"]
    }
  ],
  "longTailKeywords": [
    {
      "keyword": "long tail keyword phrase",
      "searchVolume": number,
      "difficulty": number,
      "cpc": number,
      "competition": "Low/Medium/High",
      "intent": "Informational/Commercial/Transactional",
      "seasonality": "Year-round/Seasonal",
      "contentIdeas": ["idea1", "idea2"]
    }
  ],
  "seasonalKeywords": [
    {
      "keyword": "seasonal keyword phrase",
      "searchVolume": number,
      "difficulty": number,
      "cpc": number,
      "competition": "Low/Medium/High",
      "intent": "Informational/Commercial/Transactional",
      "seasonality": "Seasonal",
      "contentIdeas": ["idea1", "idea2"]
    }
  ],
  "contentStrategy": {
    "highPriority": ["content idea 1", "content idea 2", "content idea 3"],
    "mediumPriority": ["content idea 4", "content idea 5", "content idea 6"],
    "lowPriority": ["content idea 7", "content idea 8", "content idea 9"]
  }
}

Generate 8-10 primary keywords, 6-8 long-tail keywords, and 4-6 seasonal keywords. Make sure all numbers are realistic and the content strategy ideas are actionable.

Only return the JSON object, no additional text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    let plan
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      // Fallback to mock data if parsing fails
      plan = generateMockPlan(seedKeyword)
    }

    return NextResponse.json({ plan })

  } catch (error) {
    console.error('Error generating keyword plan:', error)
    return NextResponse.json({ error: 'Failed to generate keyword plan' }, { status: 500 })
  }
}

function generateMockPlan(seedKeyword: string) {
  const primaryKeywords = [
    `${seedKeyword} guide`,
    `best ${seedKeyword}`,
    `${seedKeyword} tips`,
    `how to ${seedKeyword}`,
    `${seedKeyword} examples`,
    `${seedKeyword} tutorial`,
    `${seedKeyword} strategies`,
    `${seedKeyword} for beginners`
  ]

  const longTailKeywords = [
    `${seedKeyword} for small business`,
    `advanced ${seedKeyword} techniques`,
    `${seedKeyword} best practices 2024`,
    `${seedKeyword} step by step guide`,
    `${seedKeyword} case studies`,
    `${seedKeyword} tools and resources`
  ]

  const seasonalKeywords = [
    `${seedKeyword} new year`,
    `${seedKeyword} spring cleaning`,
    `${seedKeyword} summer strategies`,
    `${seedKeyword} holiday season`
  ]

  const generateKeywordData = (keywords: string[]) => {
    return keywords.map(keyword => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      difficulty: Math.floor(Math.random() * 70) + 20,
      cpc: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      intent: ['Informational', 'Commercial', 'Transactional'][Math.floor(Math.random() * 3)],
      seasonality: Math.random() > 0.7 ? 'Seasonal' : 'Year-round',
      contentIdeas: [
        `Complete guide to ${keyword}`,
        `Top 10 ${keyword} strategies`,
        `${keyword} case study`
      ]
    }))
  }

  return {
    primaryKeywords: generateKeywordData(primaryKeywords),
    longTailKeywords: generateKeywordData(longTailKeywords),
    seasonalKeywords: generateKeywordData(seasonalKeywords),
    contentStrategy: {
      highPriority: [
        `Ultimate ${seedKeyword} guide for beginners`,
        `${seedKeyword} best practices and tips`,
        `How to implement ${seedKeyword} effectively`
      ],
      mediumPriority: [
        `${seedKeyword} case studies and examples`,
        `Advanced ${seedKeyword} strategies`,
        `${seedKeyword} tools and resources`
      ],
      lowPriority: [
        `${seedKeyword} industry trends`,
        `${seedKeyword} comparison guide`,
        `${seedKeyword} FAQ and troubleshooting`
      ]
    }
  }
} 