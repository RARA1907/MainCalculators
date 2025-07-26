'use client'

import Link from 'next/link'
import { ArrowRight, Search, BarChart3, Calculator } from 'lucide-react'

const allTools = [
  {
    title: 'Ahrefs Keyword Generator',
    description: 'Generate high-performing SEO keywords with AI-powered research',
    icon: Search,
    href: '/ahrefs-keyword-generator',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    category: 'SEO Tools'
  },
  {
    title: 'AI Keyword Planner',
    description: 'Create comprehensive keyword strategies with advanced planning features',
    icon: BarChart3,
    href: '/ai-keyword-planner',
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50',
    category: 'SEO Tools'
  },
  {
    title: 'Salary Paycheck Calculator',
    description: 'Calculate take-home pay with AI-powered financial analysis',
    icon: Calculator,
    href: '/salary-paycheck-calculator',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    category: 'Financial Tools'
  }
]

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              All Calculators
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Explore our complete collection of professional calculators and tools designed to help you succeed
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTools.map((tool, index) => (
              <div key={index} className="group relative">
                <Link href={tool.href} className="block">
                  <div className={`${tool.bgColor} rounded-2xl p-6 h-full border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{tool.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                      Try Calculator
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Need a Custom Calculator?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            We can build custom calculators tailored to your specific business needs
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Request Custom Calculator
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
} 