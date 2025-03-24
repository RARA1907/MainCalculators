'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight, Search } from 'lucide-react'
import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { SearchBar } from '@/components/SearchBar';
import { getAllCalculators } from '@/utils/getAllCalculators';
import { categories } from '@/data/categories';

function CategorySection({ category }) {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {category.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
            {category.description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.title}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="px-8 py-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl text-blue-600">{subcategory.icon}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {subcategory.title}
                  </h3>
                </div>
                <div className="mt-6">
                  <ul className="space-y-4">
                    {subcategory.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="group flex items-center text-base text-slate-600 hover:text-blue-600 transition-colors duration-200"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const allCalculators = getAllCalculators();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-blue-100 transform -skew-y-6"></div>
          <div className="absolute right-0 bottom-0 w-2/3 h-1/3 bg-blue-200 rounded-tl-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Only <span className="text-blue-600">Main Calculators</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover a comprehensive collection of calculators for all your needs. From basic math to complex financial calculations.
            </p>
            <div className="max-w-xl mx-auto relative z-50">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Sections */}
      <div className="bg-white">
        {categories.map((category) => (
          <CategorySection key={category.title} category={category} />
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Calculator Suggestion?</h2>
          <p className="text-xl text-slate-300 mb-8">We'd love to hear your ideas for new calculators</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
          >
            Contact Us
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
