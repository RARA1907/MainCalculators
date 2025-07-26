'use client'

import Link from 'next/link'
import { ArrowRight, Search, BarChart3, Calculator, Lightbulb, Target, TrendingUp, Zap, Users } from 'lucide-react'

const featuredTools = [
  {
    title: 'Ahrefs Keyword Generator',
    description: 'Generate high-performing SEO keywords with AI-powered research',
    icon: Search,
    href: '/ahrefs-keyword-generator',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-blue-50',
    isNew: true
  },
  {
    title: 'AI Keyword Planner',
    description: 'Create comprehensive keyword strategies with advanced planning features',
    icon: BarChart3,
    href: '/ai-keyword-planner',
    color: 'from-green-500 to-teal-600',
    bgColor: 'bg-green-50',
    isNew: true
  },
  {
    title: 'Salary Paycheck Calculator',
    description: 'Calculate take-home pay with AI-powered financial analysis',
    icon: Calculator,
    href: '/salary-paycheck-calculator',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    isNew: true
  },
  {
    title: 'Content Optimizer',
    description: 'Optimize your content for better search engine rankings',
    icon: Lightbulb,
    href: '#',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    comingSoon: true
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Professional <span className="text-blue-600">Digital Tools</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Discover a comprehensive collection of professional tools for SEO, content marketing, analytics, and digital growth. 
            Everything you need to succeed online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/ahrefs-keyword-generator" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Our Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/calculators" 
              className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Explore All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section id="tools" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Featured Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Start with our most powerful and popular tools designed for professionals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool, index) => (
              <div key={index} className="group relative">
                <Link href={tool.href} className="block">
                  <div className={`${tool.bgColor} rounded-2xl p-6 h-full border border-transparent hover:border-slate-200 transition-all duration-300 hover:shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      {tool.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                      {tool.comingSoon && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                      {tool.comingSoon ? 'Coming Soon' : 'Try Tool'}
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Tools?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professional-grade tools designed for serious digital marketers and businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Professional Grade</h3>
              <p className="text-slate-600">Built for professionals with enterprise-level accuracy and features</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered</h3>
              <p className="text-slate-600">Leverage advanced AI technology for better results and insights</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Fast & Efficient</h3>
              <p className="text-slate-600">Get results quickly with optimized workflows and automation</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">User-Friendly</h3>
              <p className="text-slate-600">Intuitive interfaces designed for both beginners and experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-slate-300">Professional Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-slate-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-slate-300">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-slate-300">Support</div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Need a Custom Tool?
          </h3>
          <p className="text-slate-600 mb-6">
            We can build custom tools tailored to your specific business needs
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:border-slate-400 hover:bg-slate-100 transition-all duration-300"
          >
            Request Custom Tool
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
