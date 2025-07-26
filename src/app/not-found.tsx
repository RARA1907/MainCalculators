'use client'

import Link from 'next/link'
import { Home, Search, Calculator, ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-9xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group"
          >
            <Home className="w-5 h-5 mr-2 text-blue-600 group-hover:text-blue-700" />
            <span className="font-medium text-slate-700">Go Home</span>
          </Link>
          
          <Link 
            href="/calculators" 
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group"
          >
            <Calculator className="w-5 h-5 mr-2 text-green-600 group-hover:text-green-700" />
            <span className="font-medium text-slate-700">All Calculators</span>
          </Link>
          
          <Link 
            href="/contact" 
            className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 group"
          >
            <Search className="w-5 h-5 mr-2 text-purple-600 group-hover:text-purple-700" />
            <span className="font-medium text-slate-700">Contact Us</span>
          </Link>
        </div>

        {/* Popular Tools */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Popular Tools</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/ahrefs-keyword-generator" 
              className="block p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
            >
              <h4 className="font-semibold text-slate-900 mb-2">Keyword Generator</h4>
              <p className="text-sm text-slate-600">Generate SEO keywords with AI</p>
            </Link>
            
            <Link 
              href="/ai-keyword-planner" 
              className="block p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300"
            >
              <h4 className="font-semibold text-slate-900 mb-2">Keyword Planner</h4>
              <p className="text-sm text-slate-600">Advanced keyword strategy tool</p>
            </Link>
            
            <Link 
              href="/salary-paycheck-calculator" 
              className="block p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
            >
              <h4 className="font-semibold text-slate-900 mb-2">Paycheck Calculator</h4>
              <p className="text-sm text-slate-600">Calculate take-home pay</p>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-slate-500">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  )
} 