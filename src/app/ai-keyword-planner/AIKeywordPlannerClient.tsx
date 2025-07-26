'use client'

import { useState } from 'react'
import { Search, TrendingUp, Target, Zap, Download, Copy, RefreshCw, AlertCircle, Calendar, BarChart3, Lightbulb, Users } from 'lucide-react'

interface KeywordPlan {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  competition: string
  intent: string
  seasonality: string
  contentIdeas: string[]
}

interface PlanResult {
  primaryKeywords: KeywordPlan[]
  longTailKeywords: KeywordPlan[]
  seasonalKeywords: KeywordPlan[]
  contentStrategy: {
    highPriority: string[]
    mediumPriority: string[]
    lowPriority: string[]
  }
}

export default function AIKeywordPlannerClient() {
  const [seedKeyword, setSeedKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<PlanResult | null>(null)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    minVolume: 100,
    maxDifficulty: 50,
    minCpc: 0.1,
    includeSeasonal: true,
    includeLongTail: true
  })

  const generateKeywordPlan = async () => {
    if (!seedKeyword.trim()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-keyword-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedKeyword: seedKeyword.trim(),
          minVolume: filters.minVolume,
          maxDifficulty: filters.maxDifficulty,
          minCpc: filters.minCpc,
          includeSeasonal: filters.includeSeasonal,
          includeLongTail: filters.includeLongTail
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate keyword plan')
      }

      setResults(data.plan || null)
    } catch (err) {
      console.error('Error generating keyword plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate keyword plan')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportPlan = () => {
    if (!results) return
    
    const csvContent = `Keyword,Search Volume,Difficulty,CPC,Competition,Intent,Seasonality\n${[
      ...results.primaryKeywords,
      ...results.longTailKeywords,
      ...results.seasonalKeywords
    ].map(k => `${k.keyword},${k.searchVolume},${k.difficulty},${k.cpc},${k.competition},${k.intent},${k.seasonality}`).join('\n')}`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keyword-plan.csv'
    a.click()
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-600'
    if (difficulty <= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCompetitionColor = (competition: string) => {
    if (competition === 'Low') return 'text-green-600'
    if (competition === 'Medium') return 'text-yellow-600'
    return 'text-red-600'
  }

  const getIntentColor = (intent: string) => {
    if (intent === 'Informational') return 'text-blue-600'
    if (intent === 'Commercial') return 'text-purple-600'
    return 'text-orange-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI Keyword Planner</h1>
              <p className="text-slate-600 mt-1">Create comprehensive keyword strategies with AI-powered planning</p>
            </div>
            <div className="flex items-center space-x-4">
            
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Create Keyword Strategy</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Main Topic / Seed Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    placeholder="Enter your main topic (e.g., 'digital marketing')"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Min Search Volume
                  </label>
                  <input
                    type="number"
                    value={filters.minVolume}
                    onChange={(e) => setFilters({...filters, minVolume: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Max Difficulty
                  </label>
                  <input
                    type="number"
                    value={filters.maxDifficulty}
                    onChange={(e) => setFilters({...filters, maxDifficulty: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Min CPC ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={filters.minCpc}
                    onChange={(e) => setFilters({...filters, minCpc: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.includeSeasonal}
                    onChange={(e) => setFilters({...filters, includeSeasonal: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Include Seasonal Keywords</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.includeLongTail}
                    onChange={(e) => setFilters({...filters, includeLongTail: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Include Long-tail Keywords</span>
                </label>
              </div>

              <button
                onClick={generateKeywordPlan}
                disabled={!seedKeyword.trim() || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Creating Keyword Strategy...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Create Keyword Strategy
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Primary Keywords */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-600" />
                  Primary Keywords ({results.primaryKeywords.length})
                </h2>
                <button
                  onClick={exportPlan}
                  className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Plan
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Keyword</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Volume</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Difficulty</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">CPC</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Competition</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Intent</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.primaryKeywords.map((keyword, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{keyword.keyword}</td>
                        <td className="py-3 px-4 text-slate-600">{keyword.searchVolume.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                            {keyword.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">${keyword.cpc}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getCompetitionColor(keyword.competition)}`}>
                            {keyword.competition}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getIntentColor(keyword.intent)}`}>
                            {keyword.intent}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => copyToClipboard(keyword.keyword)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Copy keyword"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Long-tail Keywords */}
            {results.longTailKeywords.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                  Long-tail Keywords ({results.longTailKeywords.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.longTailKeywords.map((keyword, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{keyword.keyword}</h3>
                        <button
                          onClick={() => copyToClipboard(keyword.keyword)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>Volume: {keyword.searchVolume.toLocaleString()}</div>
                        <div>Difficulty: <span className={getDifficultyColor(keyword.difficulty)}>{keyword.difficulty}</span></div>
                        <div>Intent: <span className={getIntentColor(keyword.intent)}>{keyword.intent}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Strategy */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-orange-600" />
                Content Strategy
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3">High Priority</h3>
                  <ul className="space-y-2">
                    {results.contentStrategy.highPriority.map((idea, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 mt-2"></div>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-600 mb-3">Medium Priority</h3>
                  <ul className="space-y-2">
                    {results.contentStrategy.mediumPriority.map((idea, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-3 mt-2"></div>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-3">Low Priority</h3>
                  <ul className="space-y-2">
                    {results.contentStrategy.lowPriority.map((idea, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-3 mt-2"></div>
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">💡 Strategy Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Focus on Intent</h4>
              <p className="text-slate-600 text-sm">
                Prioritize keywords that match your target audience's search intent and buying stage.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Content Planning</h4>
              <p className="text-slate-600 text-sm">
                Use the content strategy to plan your editorial calendar and content creation priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 