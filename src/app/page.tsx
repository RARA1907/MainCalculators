'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight, Search } from 'lucide-react'

const categories = [
  {
    title: 'Financial Calculators',
    description: 'Calculate mortgages, loans, and investments',
    icon: HomeIcon,
    color: 'bg-green-500',
    items: [
      { name: 'Mortgage Calculator', href: '/calculators/mortgage' },
      { name: 'Compound Interest', href: '/calculators/compound-interest' },
      { name: 'Loan Calculator', href: '/calculators/loan' },
    ]
  },
  {
    title: 'Math Calculators',
    description: 'Advanced mathematical calculations and conversions',
    icon: Calculator,
    color: 'bg-blue-500',
    items: [
      { name: 'Scientific Calculator', href: '/calculators/scientific' },
      { name: 'Percentage Calculator', href: '/calculators/percentage' },
      { name: 'Unit Converter', href: '/calculators/unit-converter' },
    ]
  },
  {
    title: 'Other Calculators',
    description: 'Specialized calculators for specific needs',
    icon: Percent,
    color: 'bg-purple-500',
    items: [
      { name: 'BMI Calculator', href: '/calculators/bmi' },
      { name: 'Age Calculator', href: '/calculators/age' },
      { name: 'Time Calculator', href: '/calculators/time' },
    ]
  },
]

export default function HomePage() {
  const [displayValue, setDisplayValue] = useState('0')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDegrees, setIsDegrees] = useState(true)

  const handleButtonClick = (value: string) => {
    if (displayValue === '0' && !['/', '*', '-', '+', '.'].includes(value)) {
      setDisplayValue(value)
    } else {
      setDisplayValue(prev => prev + value)
    }
  }

  const handleClear = () => {
    setDisplayValue('0')
  }

  const handleCalculate = () => {
    try {
      setDisplayValue(eval(displayValue).toString())
    } catch (error) {
      setDisplayValue('Error')
    }
  }

  const handleTrigFunction = (func: string) => {
    try {
      const value = parseFloat(displayValue)
      let result
      if (func === 'sin') {
        result = isDegrees ? Math.sin(value * Math.PI / 180) : Math.sin(value)
      } else if (func === 'cos') {
        result = isDegrees ? Math.cos(value * Math.PI / 180) : Math.cos(value)
      } else if (func === 'tan') {
        result = isDegrees ? Math.tan(value * Math.PI / 180) : Math.tan(value)
      }
      setDisplayValue(result?.toString() || 'Error')
    } catch (error) {
      setDisplayValue('Error')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Calculator */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Main Calculators
            </h1>
            <div className="max-w-xl mx-auto relative mb-8">
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Calculator Interface */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Display */}
            <div className="bg-gray-100 dark:bg-gray-900 p-4">
              <div className="text-right text-3xl font-mono mb-2 text-gray-900 dark:text-white">
                {displayValue}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setIsDegrees(!isDegrees)}
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  {isDegrees ? 'DEG' : 'RAD'}
                </button>
              </div>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-5 gap-1 p-2">
              {/* First Row */}
              <button onClick={() => handleTrigFunction('sin')} className="btn">sin</button>
              <button onClick={() => handleTrigFunction('cos')} className="btn">cos</button>
              <button onClick={() => handleTrigFunction('tan')} className="btn">tan</button>
              <button onClick={() => handleButtonClick('(')} className="btn">(</button>
              <button onClick={() => handleButtonClick(')')} className="btn">)</button>

              {/* Numbers and Operations */}
              <button onClick={() => handleButtonClick('7')} className="btn">7</button>
              <button onClick={() => handleButtonClick('8')} className="btn">8</button>
              <button onClick={() => handleButtonClick('9')} className="btn">9</button>
              <button onClick={() => handleButtonClick('/')} className="btn">/</button>
              <button onClick={handleClear} className="btn">AC</button>

              <button onClick={() => handleButtonClick('4')} className="btn">4</button>
              <button onClick={() => handleButtonClick('5')} className="btn">5</button>
              <button onClick={() => handleButtonClick('6')} className="btn">6</button>
              <button onClick={() => handleButtonClick('*')} className="btn">×</button>
              <button onClick={() => handleButtonClick('%')} className="btn">%</button>

              <button onClick={() => handleButtonClick('1')} className="btn">1</button>
              <button onClick={() => handleButtonClick('2')} className="btn">2</button>
              <button onClick={() => handleButtonClick('3')} className="btn">3</button>
              <button onClick={() => handleButtonClick('-')} className="btn">-</button>
              <button onClick={() => handleCalculate()} className="btn row-span-2">
                =
              </button>

              <button onClick={() => handleButtonClick('0')} className="btn col-span-2">0</button>
              <button onClick={() => handleButtonClick('.')} className="btn">.</button>
              <button onClick={() => handleButtonClick('+')} className="btn">+</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Calculator Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.title}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <category.icon className={`h-12 w-12 ${category.color.replace('bg-', 'text-')} mb-4`} />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {item.name}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
