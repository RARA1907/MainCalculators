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
      { name: 'Mortgage Calculator', href: '/mortgage-calculator' },
      { name: 'Amortization Calculator', href: '/amortization-calculator' },
      { name: 'Mortgage Payoff Calculator', href: '/mortgage-payoff-calculator' },
      { name: 'House Affordability Calculator', href: '/house-affordability-calculator' },
      { name: 'Rent Calculator', href: '/rent-calculator' },
      { name: 'Debt-to-Income Ratio Calculator', href: '/debt-to-income-ratio-calculator' },
      { name: 'Real Estate Calculator', href: '/real-estate-calculator' },
      { name: 'Refinance Calculator', href: '/refinance-calculator' },
      { name: 'Rental Property Calculator', href: '/rental-property-calculator' },
      { name: 'APR Calculator', href: '/apr-calculator' },
      { name: 'FHA Loan Calculator', href: '/fha-loan-calculator' },
      { name: 'VA Mortgage Calculator', href: '/va-mortgage-calculator' },
      { name: 'Down Payment Calculator', href: '/down-payment-calculator' },
      { name: 'Rent vs. Buy Calculator', href: '/rent-vs-buy-calculator' },
    ],
  },
  {
    title: 'Auto',
    items: [
      { name: 'Auto Loan Calculator', href: '/auto-loan-calculator' },
      { name: 'Cash Back or Low Interest Calculator', href: '/cash-back-or-low-interest-calculator' },
      { name: 'Auto Lease Calculator', href: '/auto-lease-calculator' },
    ],
  },
  {
    title: 'Investment',
    items: [
      { name: 'Interest Calculator', href: '/interest-calculator' },
      { name: 'Investment Calculator', href: '/investment-calculator' },
      { name: 'Finance Calculator', href: '/finance-calculator' },
      { name: 'Compound Interest Calculator', href: '/compound-interest-calculator' },
      { name: 'Interest Rate Calculator', href: '/interest-rate-calculator' },
      { name: 'Savings Calculator', href: '/savings-calculator' },
      { name: 'Simple Interest Calculator', href: '/simple-interest-calculator' },
      { name: 'CD Calculator', href: '/cd-calculator' },
      { name: 'Bond Calculator', href: '/bond-calculator' },
      { name: 'Average Return Calculator', href: '/average-return-calculator' },
      { name: 'ROI Calculator', href: '/roi-calculator' },
      { name: 'Payback Period Calculator', href: '/payback-period-calculator' },
      { name: 'Present Value Calculator', href: '/present-value-calculator' },
      { name: 'Future Value Calculator', href: '/future-value-calculator' },
    ],
  },
  {
    title: 'Health & Fitness',
    items: [
      // Fitness Calculators
      { name: 'BMI Calculator', href: '/bmi-calculator', category: 'Fitness' },
      { name: 'Calorie Calculator', href: '/calorie-calculator', category: 'Fitness' },
      { name: 'Body Fat Calculator', href: '/body-fat-calculator', category: 'Fitness' },
      { name: 'BMR Calculator', href: '/bmr-calculator', category: 'Fitness' },
      { name: 'Ideal Weight Calculator', href: '/ideal-weight-calculator', category: 'Fitness' },
      { name: 'Pace Calculator', href: '/pace-calculator', category: 'Fitness' },
      { name: 'Army Body Fat Calculator', href: '/army-body-fat-calculator', category: 'Fitness' },
      { name: 'Lean Body Mass Calculator', href: '/lean-body-mass-calculator', category: 'Fitness' },
      { name: 'Healthy Weight Calculator', href: '/healthy-weight-calculator', category: 'Fitness' },
      { name: 'Calories Burned Calculator', href: '/calories-burned-calculator', category: 'Fitness' },
      { name: 'One Rep Max Calculator', href: '/one-rep-max-calculator', category: 'Fitness' },
      
      // Pregnancy Calculators
      { name: 'Pregnancy Calculator', href: '/pregnancy-calculator', category: 'Pregnancy' },
      { name: 'Pregnancy Weight Gain Calculator', href: '/pregnancy-weight-gain-calculator', category: 'Pregnancy' },
      { name: 'Pregnancy Conception Calculator', href: '/pregnancy-conception-calculator', category: 'Pregnancy' },
      { name: 'Due Date Calculator', href: '/due-date-calculator', category: 'Pregnancy' },
      { name: 'Ovulation Calculator', href: '/ovulation-calculator', category: 'Pregnancy' },
      { name: 'Conception Calculator', href: '/conception-calculator', category: 'Pregnancy' },
      { name: 'Period Calculator', href: '/period-calculator', category: 'Pregnancy' },
      
      // Nutrition & Other Health Calculators
      { name: 'Macro Calculator', href: '/macro-calculator', category: 'Other' },
      { name: 'Carbohydrate Calculator', href: '/carbohydrate-calculator', category: 'Other' },
      { name: 'Protein Calculator', href: '/protein-calculator', category: 'Other' },
      { name: 'Fat Intake Calculator', href: '/fat-intake-calculator', category: 'Other' },
      { name: 'TDEE Calculator', href: '/tdee-calculator', category: 'Other' },
      { name: 'GFR Calculator', href: '/gfr-calculator', category: 'Other' },
      { name: 'Body Type Calculator', href: '/body-type-calculator', category: 'Other' },
      { name: 'Body Surface Area Calculator', href: '/body-surface-area-calculator', category: 'Other' },
      { name: 'BAC Calculator', href: '/bac-calculator', category: 'Other' }
    ],
  },
  {
    title: 'Mathematics',
    items: [
      // Basic Math & Numbers
      { name: 'Scientific Calculator', href: '/scientific-calculator', category: 'Basic' },
      { name: 'Fraction Calculator', href: '/fraction-calculator', category: 'Basic' },
      { name: 'Percentage Calculator', href: '/percentage-calculator', category: 'Basic' },
      { name: 'Random Number Generator', href: '/random-number-generator', category: 'Basic' },
      { name: 'Percent Error Calculator', href: '/percent-error-calculator', category: 'Basic' },
      { name: 'Exponent Calculator', href: '/exponent-calculator', category: 'Basic' },
      { name: 'Binary Calculator', href: '/binary-calculator', category: 'Basic' },
      { name: 'Hex Calculator', href: '/hex-calculator', category: 'Basic' },
      { name: 'Half-Life Calculator', href: '/half-life-calculator', category: 'Basic' },
      { name: 'Quadratic Formula Calculator', href: '/quadratic-formula-calculator', category: 'Basic' },
      { name: 'Log Calculator', href: '/log-calculator', category: 'Basic' },
      { name: 'Ratio Calculator', href: '/ratio-calculator', category: 'Basic' },
      { name: 'Root Calculator', href: '/root-calculator', category: 'Basic' },
      { name: 'Least Common Multiple Calculator', href: '/lcm-calculator', category: 'Basic' },
      { name: 'Greatest Common Factor Calculator', href: '/gcf-calculator', category: 'Basic' },
      { name: 'Factor Calculator', href: '/factor-calculator', category: 'Basic' },
      { name: 'Rounding Calculator', href: '/rounding-calculator', category: 'Basic' },
      { name: 'Matrix Calculator', href: '/matrix-calculator', category: 'Basic' },
      { name: 'Scientific Notation Calculator', href: '/scientific-notation-calculator', category: 'Basic' },
      { name: 'Big Number Calculator', href: '/big-number-calculator', category: 'Basic' },

      // Statistics
      { name: 'Standard Deviation Calculator', href: '/standard-deviation-calculator', category: 'Statistics' },
      { name: 'Number Sequence Calculator', href: '/number-sequence-calculator', category: 'Statistics' },
      { name: 'Sample Size Calculator', href: '/sample-size-calculator', category: 'Statistics' },
      { name: 'Probability Calculator', href: '/probability-calculator', category: 'Statistics' },
      { name: 'Statistics Calculator', href: '/statistics-calculator', category: 'Statistics' },
      { name: 'Mean, Median, Mode, Range Calculator', href: '/mean-median-mode-range-calculator', category: 'Statistics' },
      { name: 'Permutation and Combination Calculator', href: '/permutation-combination-calculator', category: 'Statistics' },
      { name: 'Z-score Calculator', href: '/z-score-calculator', category: 'Statistics' },
      { name: 'Confidence Interval Calculator', href: '/confidence-interval-calculator', category: 'Statistics' },

      // Geometry
      { name: 'Triangle Calculator', href: '/triangle-calculator', category: 'Geometry' },
      { name: 'Volume Calculator', href: '/volume-calculator', category: 'Geometry' },
      { name: 'Slope Calculator', href: '/slope-calculator', category: 'Geometry' },
      { name: 'Area Calculator', href: '/area-calculator', category: 'Geometry' },
      { name: 'Distance Calculator', href: '/distance-calculator', category: 'Geometry' },
      { name: 'Circle Calculator', href: '/circle-calculator', category: 'Geometry' },
      { name: 'Surface Area Calculator', href: '/surface-area-calculator', category: 'Geometry' },
      { name: 'Pythagorean Theorem Calculator', href: '/pythagorean-theorem-calculator', category: 'Geometry' },
      { name: 'Right Triangle Calculator', href: '/right-triangle-calculator', category: 'Geometry' }
    ],
  },
  {
    title: 'Retirement',
    items: [
      { name: 'Retirement Calculator', href: '/retirement-calculator' },
      { name: '401K Calculator', href: '/401k-calculator' },
      { name: 'Pension Calculator', href: '/pension-calculator' },
      { name: 'Social Security Calculator', href: '/social-security-calculator' },
      { name: 'Annuity Calculator', href: '/annuity-calculator' },
      { name: 'Annuity Payout Calculator', href: '/annuity-payout-calculator' },
      { name: 'Roth IRA Calculator', href: '/roth-ira-calculator' },
      { name: 'IRA Calculator', href: '/ira-calculator' },
      { name: 'RMD Calculator', href: '/rmd-calculator' },
    ],
  },
  {
    title: 'Tax and Salary',
    items: [
      { name: 'Income Tax Calculator', href: '/income-tax-calculator' },
      { name: 'Salary Calculator', href: '/salary-calculator' },
      { name: 'Marriage Tax Calculator', href: '/marriage-tax-calculator' },
      { name: 'Estate Tax Calculator', href: '/estate-tax-calculator' },
      { name: 'Take-Home-Paycheck Calculator', href: '/take-home-paycheck-calculator' },
    ],
  },
  {
    title: 'Other',
    items: [
      { name: 'Loan Calculator', href: '/loan-calculator' },
      { name: 'Payment Calculator', href: '/payment-calculator' },
      { name: 'Currency Calculator', href: '/currency-calculator' },
      { name: 'Inflation Calculator', href: '/inflation-calculator' },
      { name: 'Sales Tax Calculator', href: '/sales-tax-calculator' },
      { name: 'Credit Card Calculator', href: '/credit-card-calculator' },
      { name: 'Credit Cards Payoff Calculator', href: '/credit-cards-payoff-calculator' },
      { name: 'Debt Payoff Calculator', href: '/debt-payoff-calculator' },
      { name: 'Debt Consolidation Calculator', href: '/debt-consolidation-calculator' },
      { name: 'Repayment Calculator', href: '/repayment-calculator' },
      { name: 'Student Loan Calculator', href: '/student-loan-calculator' },
      { name: 'College Cost Calculator', href: '/college-cost-calculator' },
      { name: 'VAT Calculator', href: '/vat-calculator' },
      { name: 'Depreciation Calculator', href: '/depreciation-calculator' },
      { name: 'Margin Calculator', href: '/margin-calculator' },
      { name: 'Discount Calculator', href: '/discount-calculator' },
      { name: 'Business Loan Calculator', href: '/business-loan-calculator' },
      { name: 'Personal Loan Calculator', href: '/personal-loan-calculator' },
      { name: 'Lease Calculator', href: '/lease-calculator' },
      { name: 'Budget Calculator', href: '/budget-calculator' },
      { name: 'Commission Calculator', href: '/commission-calculator' },
      { name: 'Scientific Calculator', href: '/scientific-calculator' },
      { name: 'Unit Converter', href: '/unit-converter' },
      { name: 'Percentage Calculator', href: '/percentage-calculator' },
      { name: 'Date Calculator', href: '/date-calculator' }
    ],
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(calculatorCategories);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = calculatorCategories.filter(category =>
      category.title.toLowerCase().includes(query.toLowerCase()) ||
      category.items.some(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredCategories(filtered);
  };

  // Health kategorisi için özel görüntüleme bileşeni
  function HealthCalculatorsList({ items }) {
    const categories = {
      Fitness: 'Fitness & Body Measurements',
      Pregnancy: 'Pregnancy & Fertility',
      Other: 'Nutrition & Other Health'
    };

    return (
      <div className="space-y-4">
        {Object.entries(categories).map(([category, title]) => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {title}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {categoryItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }

  // Math kategorisi için özel görüntüleme bileşeni
  function MathCalculatorsList({ items }) {
    const categories = {
      Basic: 'Basic Math & Numbers',
      Statistics: 'Statistics & Probability',
      Geometry: 'Geometry & Measurements'
    };

    return (
      <div className="space-y-4">
        {Object.entries(categories).map(([category, title]) => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {title}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {categoryItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  }

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
              href="/scientific-calculator"
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
        {filteredCategories.map((category) => (
          <div
            key={category.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-4"
          >
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              {category.title}
            </h2>
            {category.title === 'Health & Fitness' ? (
              <HealthCalculatorsList items={category.items} />
            ) : category.title === 'Mathematics' ? (
              <MathCalculatorsList items={category.items} />
            ) : (
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
