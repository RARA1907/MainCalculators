import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { seedKeyword, minVolume, maxDifficulty, minCpc } = await request.json()

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
Generate 10 SEO keywords based on the seed keyword "${seedKeyword}" with the following criteria:
- Minimum search volume: ${minVolume}
- Maximum difficulty: ${maxDifficulty}
- Minimum CPC: $${minCpc}

For each keyword, provide:
1. The keyword phrase
2. Estimated search volume (between ${minVolume} and 50000)
3. Difficulty score (0-100, where 0 is easiest)
4. CPC (Cost Per Click) in USD
5. Competition level (Low, Medium, or High)

Format the response as a JSON array with objects containing: keyword, searchVolume, difficulty, cpc, competition

Example format:
[
  {
    "keyword": "digital marketing tips",
    "searchVolume": 2400,
    "difficulty": 35,
    "cpc": 2.45,
    "competition": "Low"
  }
]

Only return the JSON array, no additional text.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse the JSON response
    let keywords
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        keywords = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text)
      // Fallback to mock data if parsing fails
      keywords = generateMockKeywords(seedKeyword)
    }

    return NextResponse.json({ keywords })

  } catch (error) {
    console.error('Error generating keywords:', error)
    return NextResponse.json({ error: 'Failed to generate keywords' }, { status: 500 })
  }
}

function generateMockKeywords(seedKeyword: string) {
  const variations = [
    `${seedKeyword} guide`,
    `best ${seedKeyword}`,
    `${seedKeyword} tips`,
    `how to ${seedKeyword}`,
    `${seedKeyword} examples`,
    `${seedKeyword} tutorial`,
    `${seedKeyword} strategies`,
    `${seedKeyword} for beginners`,
    `advanced ${seedKeyword}`,
    `${seedKeyword} tools`
  ]

  return variations.map((keyword, index) => ({
    keyword,
    searchVolume: Math.floor(Math.random() * 5000) + 500,
    difficulty: Math.floor(Math.random() * 70) + 20,
    cpc: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
    competition: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
  }))
} 