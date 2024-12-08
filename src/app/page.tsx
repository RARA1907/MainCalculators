'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight, Search } from 'lucide-react'

const calculatorCategories = [
  {
    title: 'Mortgage and Real Estate',
    items: [
      { name: 'Mortgage Calculator', href: '/calculators/mortgage' },
      { name: 'Amortization Calculator', href: '/calculators/amortization' },
      { name: 'Mortgage Payoff Calculator', href: '/calculators/mortgage-payoff' },
      { name: 'House Affordability Calculator', href: '/calculators/house-affordability' },
      { name: 'Rent Calculator', href: '/calculators/rent' },
      { name: 'Debt-to-Income Ratio Calculator', href: '/calculators/dti' },
      { name: 'Real Estate Calculator', href: '/calculators/real-estate' },
      { name: 'Refinance Calculator', href: '/calculators/refinance' },
      { name: 'Rental Property Calculator', href: '/calculators/rental-property' },
      { name: 'APR Calculator', href: '/calculators/apr' },
      { name: 'FHA Loan Calculator', href: '/calculators/fha-loan' },
      { name: 'VA Mortgage Calculator', href: '/calculators/va-mortgage' },
      { name: 'Down Payment Calculator', href: '/calculators/down-payment' },
      { name: 'Rent vs. Buy Calculator', href: '/calculators/rent-vs-buy' },
    ],
  },
  {
    title: 'Auto',
    items: [
      { name: 'Auto Loan Calculator', href: '/calculators/auto-loan' },
      { name: 'Cash Back or Low Interest Calculator', href: '/calculators/cash-back-interest' },
      { name: 'Auto Lease Calculator', href: '/calculators/auto-lease' },
    ],
  },
  {
    title: 'Investment',
    items: [
      { name: 'Interest Calculator', href: '/calculators/interest' },
      { name: 'Investment Calculator', href: '/calculators/investment' },
      { name: 'Finance Calculator', href: '/calculators/finance' },
      { name: 'Compound Interest Calculator', href: '/calculators/compound-interest' },
      { name: 'Interest Rate Calculator', href: '/calculators/interest-rate' },
      { name: 'Savings Calculator', href: '/calculators/savings' },
      { name: 'Simple Interest Calculator', href: '/calculators/simple-interest' },
      { name: 'CD Calculator', href: '/calculators/cd' },
      { name: 'Bond Calculator', href: '/calculators/bond' },
      { name: 'Average Return Calculator', href: '/calculators/average-return' },
      { name: 'ROI Calculator', href: '/calculators/roi' },
      { name: 'Payback Period Calculator', href: '/calculators/payback-period' },
      { name: 'Present Value Calculator', href: '/calculators/present-value' },
      { name: 'Future Value Calculator', href: '/calculators/future-value' },
    ],
  },
  {
    title: 'Retirement',
    items: [
      { name: 'Retirement Calculator', href: '/calculators/retirement' },
      { name: '401K Calculator', href: '/calculators/401k' },
      { name: 'Pension Calculator', href: '/calculators/pension' },
      { name: 'Social Security Calculator', href: '/calculators/social-security' },
      { name: 'Annuity Calculator', href: '/calculators/annuity' },
      { name: 'Annuity Payout Calculator', href: '/calculators/annuity-payout' },
      { name: 'Roth IRA Calculator', href: '/calculators/roth-ira' },
      { name: 'IRA Calculator', href: '/calculators/ira' },
      { name: 'RMD Calculator', href: '/calculators/rmd' },
    ],
  },
  {
    title: 'Tax and Salary',
    items: [
      { name: 'Income Tax Calculator', href: '/calculators/income-tax' },
      { name: 'Salary Calculator', href: '/calculators/salary' },
      { name: 'Marriage Tax Calculator', href: '/calculators/marriage-tax' },
      { name: 'Estate Tax Calculator', href: '/calculators/estate-tax' },
      { name: 'Take-Home-Paycheck Calculator', href: '/calculators/take-home-paycheck' },
    ],
  },
  {
    title: 'Other',
    items: [
      { name: 'Loan Calculator', href: '/calculators/loan' },
      { name: 'Payment Calculator', href: '/calculators/payment' },
      { name: 'Currency Calculator', href: '/calculators/currency' },
      { name: 'Inflation Calculator', href: '/calculators/inflation' },
      { name: 'Sales Tax Calculator', href: '/calculators/sales-tax' },
      { name: 'Credit Card Calculator', href: '/calculators/credit-card' },
      { name: 'Credit Cards Payoff Calculator', href: '/calculators/credit-cards-payoff' },
      { name: 'Debt Payoff Calculator', href: '/calculators/debt-payoff' },
      { name: 'Debt Consolidation Calculator', href: '/calculators/debt-consolidation' },
      { name: 'Repayment Calculator', href: '/calculators/repayment' },
      { name: 'Student Loan Calculator', href: '/calculators/student-loan' },
      { name: 'College Cost Calculator', href: '/calculators/college-cost' },
      { name: 'VAT Calculator', href: '/calculators/vat' },
      { name: 'Depreciation Calculator', href: '/calculators/depreciation' },
      { name: 'Margin Calculator', href: '/calculators/margin' },
      { name: 'Discount Calculator', href: '/calculators/discount' },
      { name: 'Business Loan Calculator', href: '/calculators/business-loan' },
      { name: 'Personal Loan Calculator', href: '/calculators/personal-loan' },
      { name: 'Lease Calculator', href: '/calculators/lease' },
      { name: 'Budget Calculator', href: '/calculators/budget' },
      { name: 'Commission Calculator', href: '/calculators/commission' },
    ],
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(calculatorCategories);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredCategories(calculatorCategories);
      return;
    }

    const filtered = calculatorCategories.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(category => category.items.length > 0);

    setFilteredCategories(filtered);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Ultimate Calculator Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Access over 50+ calculators for finance, math, and more
            </p>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search calculators..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 bg-white/95 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {category.title}
              </h2>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
