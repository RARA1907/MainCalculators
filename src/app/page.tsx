'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calculator, HomeIcon, Percent, ArrowRight } from 'lucide-react'

const categories = [
  {
    title: 'Scientific Calculator',
    description: 'Perform complex mathematical calculations with advanced functions',
    icon: Calculator,
    href: '/calculators/scientific',
    color: 'bg-blue-500',
  },
  {
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and more',
    icon: HomeIcon,
    href: '/calculators/mortgage',
    color: 'bg-green-500',
  },
  {
    title: 'Compound Interest',
    description: 'Calculate how your investments grow over time with compound interest',
    icon: Percent,
    href: '/calculators/compound-interest',
    color: 'bg-purple-500',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-background.jpg"
            alt="Calculator Background"
            fill
            className="object-cover opacity-50 dark:opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Swift Calculators Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
            Your comprehensive toolkit for financial and scientific calculations
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/calculators/scientific"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Choose Your Calculator
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
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
                <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Try Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
