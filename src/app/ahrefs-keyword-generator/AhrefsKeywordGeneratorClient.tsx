'use client'

import { useState } from 'react'
import { Search, TrendingUp, Target, Zap, Download, Copy, RefreshCw, AlertCircle } from 'lucide-react'

interface KeywordResult {
  keyword: string
  searchVolume: number
  difficulty: number
  cpc: number
  competition: string
}

export default function AhrefsKeywordGeneratorClient() {
  const [seedKeyword, setSeedKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<KeywordResult[]>([])
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    minVolume: 100,
    maxDifficulty: 50,
    minCpc: 0.1
  })

  const generateKeywords = async () => {
    if (!seedKeyword.trim()) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedKeyword: seedKeyword.trim(),
          minVolume: filters.minVolume,
          maxDifficulty: filters.maxDifficulty,
          minCpc: filters.minCpc
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate keywords')
      }

      setResults(data.keywords || [])
    } catch (err) {
      console.error('Error generating keywords:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate keywords')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportResults = () => {
    const csvContent = `Keyword,Search Volume,Difficulty,CPC,Competition\n${results.map(r => `${r.keyword},${r.searchVolume},${r.difficulty},${r.cpc},${r.competition}`).join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keywords.csv'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Ahrefs Keyword Generator</h1>
              <p className="text-slate-600 mt-1">Generate high-performing keywords for your SEO strategy</p>
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
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Generate Keywords</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seed Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={seedKeyword}
                    onChange={(e) => setSeedKeyword(e.target.value)}
                    placeholder="Enter your main keyword (e.g., 'digital marketing')"
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

              <button
                onClick={generateKeywords}
                disabled={!seedKeyword.trim() || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generating Keywords with AI...
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Generate Keywords with AI
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
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Generated Keywords ({results.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={exportResults}
                  className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Keyword</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Search Volume</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Difficulty</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">CPC</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Competition</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{result.keyword}</td>
                      <td className="py-3 px-4 text-slate-600">{result.searchVolume.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">${result.cpc}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getCompetitionColor(result.competition)}`}>
                          {result.competition}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => copyToClipboard(result.keyword)}
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
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">💡 Pro Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Choose the Right Keywords</h4>
              <p className="text-slate-600 text-sm">
                Focus on keywords with high search volume and low competition for better ranking opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Analyze User Intent</h4>
              <p className="text-slate-600 text-sm">
                Consider what users are looking for when they search for these keywords to create better content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 