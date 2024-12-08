'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight } from 'lucide-react'
import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { SearchBar } from '@/components/SearchBar';
import { getAllCalculators } from '@/utils/getAllCalculators';
import { categories } from '@/data/categories';

function CategorySection({ category }) {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {category.title}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400 sm:mt-4">
            {category.description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {category.subcategories.map((subcategory) => (
            <div
              key={subcategory.title}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{subcategory.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {subcategory.title}
                  </h3>
                </div>
                <div className="mt-6">
                  <ul className="space-y-3">
                    {subcategory.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-200 flex items-center group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {item.name}
                          </span>
                          <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200" />
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
    <div>
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Free Online Calculators</span>
              <span className="block text-blue-600">For Every Need</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Access hundreds of free calculators for finance, health, math, and more. Simple, accurate, and always free.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8">
              <SearchBar allCalculators={allCalculators} />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Sections */}
      <div className="bg-gray-50 dark:bg-gray-900">
        {categories.map((category) => (
          <CategorySection key={category.title} category={category} />
        ))}
      </div>
    </div>
  );
}
