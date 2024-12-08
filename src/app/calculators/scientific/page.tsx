'use client';

import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function ScientificCalculatorPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Scientific Calculator
      </h1>

      {/* Calculator Component */}
      <div className="mb-12">
        <ScientificCalculator />
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search calculations, functions, or mathematical concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* Quick Reference Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Basic Functions
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>Addition (+)</li>
            <li>Subtraction (-)</li>
            <li>Multiplication (×)</li>
            <li>Division (÷)</li>
            <li>Square Root (√)</li>
            <li>Power (^)</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Trigonometric Functions
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>Sine (sin)</li>
            <li>Cosine (cos)</li>
            <li>Tangent (tan)</li>
            <li>Switch between RAD/DEG</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Memory Functions
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>Memory Clear (MC)</li>
            <li>Memory Recall (MR)</li>
            <li>Memory Add (M+)</li>
            <li>Memory Subtract (M-)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
