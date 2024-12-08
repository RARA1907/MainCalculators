'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight, Search } from 'lucide-react'
import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';

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
      { name: 'Scientific Calculator', href: '/calculators/scientific' },
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
      <div className="w-full max-w-6xl mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Your Ultimate Calculator Hub
            </h1>
            <p className="text-base md:text-lg mb-4 opacity-90">
              From basic arithmetic to complex financial calculations, we've got you covered.
            </p>
            {/* Search Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 pl-10 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            </div>
            <Link 
              href="/calculators/scientific"
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
            >
              Open Full Calculator
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-lg max-w-md mx-auto lg:mx-0 w-full">
            <div className="transform scale-90">
              <ScientificCalculator />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-4"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
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
  );
}
