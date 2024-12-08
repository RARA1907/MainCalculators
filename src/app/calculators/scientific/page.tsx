'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the calculator component
const ScientificCalculator = dynamic(
  () => import('@/components/calculator/ScientificCalculator').then(mod => mod.ScientificCalculator),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ),
    ssr: false // Disable server-side rendering for calculator components
  }
)

export default function ScientificCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Scientific Calculator
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <ScientificCalculator />
        </Suspense>
      </div>
    </div>
  )
}
