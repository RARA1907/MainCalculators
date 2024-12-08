'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Calculator, HomeIcon, Percent, ArrowRight } from 'lucide-react'
import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { SearchBar } from '@/components/SearchBar';
import { getAllCalculators } from '@/utils/getAllCalculators';

export const categories = [
  {
    title: 'Finance Calculators',
    description: 'Comprehensive financial planning tools for all your needs',
    subcategories: [
      {
        title: 'Mortgage & Real Estate',
        icon: '🏠',
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
          { name: 'Rent vs. Buy Calculator', href: '/rent-vs-buy-calculator' }
        ]
      },
      {
        title: 'Investment & Trading',
        icon: '📈',
        items: [
          { name: 'Investment Calculator', href: '/investment-calculator' },
          { name: 'Interest Calculator', href: '/interest-calculator' },
          { name: 'Finance Calculator', href: '/finance-calculator' },
          { name: 'Compound Interest Calculator', href: '/compound-interest-calculator' },
          { name: 'Interest Rate Calculator', href: '/interest-rate-calculator' },
          { name: 'Simple Interest Calculator', href: '/simple-interest-calculator' },
          { name: 'CD Calculator', href: '/cd-calculator' },
          { name: 'Bond Calculator', href: '/bond-calculator' },
          { name: 'Average Return Calculator', href: '/average-return-calculator' },
          { name: 'ROI Calculator', href: '/roi-calculator' },
          { name: 'Payback Period Calculator', href: '/payback-period-calculator' },
          { name: 'Present Value Calculator', href: '/present-value-calculator' },
          { name: 'Future Value Calculator', href: '/future-value-calculator' },
          { name: 'Stock Calculator', href: '/stock-calculator' },
          { name: 'Dividend Calculator', href: '/dividend-calculator' },
          { name: 'Capital Gains Calculator', href: '/capital-gains-calculator' }
        ]
      },
      {
        title: 'Tax & Salary',
        icon: '💰',
        items: [
          { name: 'Income Tax Calculator', href: '/income-tax-calculator' },
          { name: 'Take Home Pay Calculator', href: '/take-home-pay-calculator' },
          { name: 'Salary Calculator', href: '/salary-calculator' },
          { name: 'VAT Calculator', href: '/vat-calculator' },
          { name: 'Sales Tax Calculator', href: '/sales-tax-calculator' },
          { name: 'Marriage Tax Calculator', href: '/marriage-tax-calculator' },
          { name: 'Estate Tax Calculator', href: '/estate-tax-calculator' },
          { name: 'Take-Home-Paycheck Calculator', href: '/take-home-paycheck-calculator' }
        ]
      },
      {
        title: 'Retirement & Savings',
        icon: '👴',
        items: [
          { name: 'Retirement Calculator', href: '/retirement-calculator' },
          { name: '401k Calculator', href: '/401k-calculator' },
          { name: 'Savings Calculator', href: '/savings-calculator' },
          { name: 'Pension Calculator', href: '/pension-calculator' },
          { name: 'Social Security Calculator', href: '/social-security-calculator' },
          { name: 'Annuity Calculator', href: '/annuity-calculator' },
          { name: 'Annuity Payout Calculator', href: '/annuity-payout-calculator' },
          { name: 'Roth IRA Calculator', href: '/roth-ira-calculator' },
          { name: 'IRA Calculator', href: '/ira-calculator' },
          { name: 'RMD Calculator', href: '/rmd-calculator' }
        ]
      },
      {
        title: 'Loans & Credit',
        icon: '💳',
        items: [
          { name: 'Loan Calculator', href: '/loan-calculator' },
          { name: 'Payment Calculator', href: '/payment-calculator' },
          { name: 'Auto Loan Calculator', href: '/auto-loan-calculator' },
          { name: 'Cash Back or Low Interest Calculator', href: '/cash-back-or-low-interest-calculator' },
          { name: 'Auto Lease Calculator', href: '/auto-lease-calculator' },
          { name: 'Credit Card Calculator', href: '/credit-card-calculator' },
          { name: 'Credit Cards Payoff Calculator', href: '/credit-cards-payoff-calculator' },
          { name: 'Debt Payoff Calculator', href: '/debt-payoff-calculator' },
          { name: 'Debt Consolidation Calculator', href: '/debt-consolidation-calculator' },
          { name: 'Repayment Calculator', href: '/repayment-calculator' },
          { name: 'Student Loan Calculator', href: '/student-loan-calculator' },
          { name: 'Business Loan Calculator', href: '/business-loan-calculator' },
          { name: 'Personal Loan Calculator', href: '/personal-loan-calculator' },
          { name: 'Lease Calculator', href: '/lease-calculator' }
        ]
      },
      {
        title: 'Business & Other',
        icon: '💼',
        items: [
          { name: 'Currency Calculator', href: '/currency-calculator' },
          { name: 'Inflation Calculator', href: '/inflation-calculator' },
          { name: 'College Cost Calculator', href: '/college-cost-calculator' },
          { name: 'Depreciation Calculator', href: '/depreciation-calculator' },
          { name: 'Margin Calculator', href: '/margin-calculator' },
          { name: 'Discount Calculator', href: '/discount-calculator' },
          { name: 'Budget Calculator', href: '/budget-calculator' },
          { name: 'Commission Calculator', href: '/commission-calculator' },
          { name: 'Unit Converter', href: '/unit-converter' },
          { name: 'Date Calculator', href: '/date-calculator' }
        ]
      }
    ]
  },
  {
    title: 'Health & Fitness Calculators',
    description: 'Tools for tracking health, fitness, and wellness goals',
    subcategories: [
      {
        title: 'Fitness & Body',
        icon: '💪',
        items: [
          { name: 'BMI Calculator', href: '/bmi-calculator' },
          { name: 'Body Fat Calculator', href: '/body-fat-calculator' },
          { name: 'BMR Calculator', href: '/bmr-calculator' },
          { name: 'Ideal Weight Calculator', href: '/ideal-weight-calculator' },
          { name: 'Calories Burned Calculator', href: '/calories-burned-calculator' },
          { name: 'One Rep Max Calculator', href: '/one-rep-max-calculator' },
          { name: 'Pace Calculator', href: '/pace-calculator' },
          { name: 'Army Body Fat Calculator', href: '/army-body-fat-calculator' },
          { name: 'Lean Body Mass Calculator', href: '/lean-body-mass-calculator' },
          { name: 'Healthy Weight Calculator', href: '/healthy-weight-calculator' },
          { name: 'Body Type Calculator', href: '/body-type-calculator' },
          { name: 'Body Surface Area Calculator', href: '/body-surface-area-calculator' }
        ]
      },
      {
        title: 'Nutrition & Diet',
        icon: '🥗',
        items: [
          { name: 'Calorie Calculator', href: '/calorie-calculator' },
          { name: 'Macro Calculator', href: '/macro-calculator' },
          { name: 'Protein Calculator', href: '/protein-calculator' },
          { name: 'TDEE Calculator', href: '/tdee-calculator' },
          { name: 'Carbohydrate Calculator', href: '/carbohydrate-calculator' },
          { name: 'Fat Intake Calculator', href: '/fat-intake-calculator' },
          { name: 'BAC Calculator', href: '/bac-calculator' }
        ]
      },
      {
        title: 'Pregnancy & Fertility',
        icon: '👶',
        items: [
          { name: 'Pregnancy Calculator', href: '/pregnancy-calculator' },
          { name: 'Due Date Calculator', href: '/due-date-calculator' },
          { name: 'Ovulation Calculator', href: '/ovulation-calculator' },
          { name: 'Conception Calculator', href: '/conception-calculator' },
          { name: 'Period Calculator', href: '/period-calculator' },
          { name: 'Pregnancy Weight Gain Calculator', href: '/pregnancy-weight-gain-calculator' },
          { name: 'Pregnancy Conception Calculator', href: '/pregnancy-conception-calculator' }
        ]
      },
      {
        title: 'Medical',
        icon: '🏥',
        items: [
          { name: 'GFR Calculator', href: '/gfr-calculator' }
        ]
      }
    ]
  },
  {
    title: 'Mathematics Calculators',
    description: 'Advanced mathematical tools for calculations and analysis',
    subcategories: [
      {
        title: 'Basic Math & Numbers',
        icon: '🔢',
        items: [
          { name: 'Scientific Calculator', href: '/scientific-calculator' },
          { name: 'Fraction Calculator', href: '/fraction-calculator' },
          { name: 'Percentage Calculator', href: '/percentage-calculator' },
          { name: 'Random Number Generator', href: '/random-number-generator' },
          { name: 'Percent Error Calculator', href: '/percent-error-calculator' },
          { name: 'Exponent Calculator', href: '/exponent-calculator' },
          { name: 'Binary Calculator', href: '/binary-calculator' },
          { name: 'Hex Calculator', href: '/hex-calculator' },
          { name: 'Half-Life Calculator', href: '/half-life-calculator' },
          { name: 'Quadratic Formula Calculator', href: '/quadratic-formula-calculator' },
          { name: 'Log Calculator', href: '/log-calculator' },
          { name: 'Ratio Calculator', href: '/ratio-calculator' },
          { name: 'Root Calculator', href: '/root-calculator' },
          { name: 'Least Common Multiple Calculator', href: '/lcm-calculator' },
          { name: 'Greatest Common Factor Calculator', href: '/gcf-calculator' },
          { name: 'Factor Calculator', href: '/factor-calculator' },
          { name: 'Rounding Calculator', href: '/rounding-calculator' },
          { name: 'Matrix Calculator', href: '/matrix-calculator' },
          { name: 'Scientific Notation Calculator', href: '/scientific-notation-calculator' },
          { name: 'Big Number Calculator', href: '/big-number-calculator' }
        ]
      },
      {
        title: 'Statistics & Probability',
        icon: '📊',
        items: [
          { name: 'Statistics Calculator', href: '/statistics-calculator' },
          { name: 'Standard Deviation Calculator', href: '/standard-deviation-calculator' },
          { name: 'Number Sequence Calculator', href: '/number-sequence-calculator' },
          { name: 'Sample Size Calculator', href: '/sample-size-calculator' },
          { name: 'Probability Calculator', href: '/probability-calculator' },
          { name: 'Mean, Median, Mode, Range Calculator', href: '/mean-median-mode-range-calculator' },
          { name: 'Permutation and Combination Calculator', href: '/permutation-combination-calculator' },
          { name: 'Z-score Calculator', href: '/z-score-calculator' },
          { name: 'Confidence Interval Calculator', href: '/confidence-interval-calculator' }
        ]
      },
      {
        title: 'Geometry & Measurements',
        icon: '📐',
        items: [
          { name: 'Area Calculator', href: '/area-calculator' },
          { name: 'Volume Calculator', href: '/volume-calculator' },
          { name: 'Triangle Calculator', href: '/triangle-calculator' },
          { name: 'Circle Calculator', href: '/circle-calculator' },
          { name: 'Pythagorean Theorem Calculator', href: '/pythagorean-theorem-calculator' },
          { name: 'Slope Calculator', href: '/slope-calculator' },
          { name: 'Distance Calculator', href: '/distance-calculator' },
          { name: 'Surface Area Calculator', href: '/surface-area-calculator' },
          { name: 'Right Triangle Calculator', href: '/right-triangle-calculator' }
        ]
      }
    ]
  },
  {
    title: 'Other Calculators',
    description: 'Specialized calculators for various daily needs and professional tasks',
    subcategories: [
      {
        title: 'Date and Time',
        icon: '⏰',
        items: [
          { name: 'Age Calculator', href: '/age-calculator' },
          { name: 'Date Calculator', href: '/date-calculator' },
          { name: 'Time Calculator', href: '/time-calculator' },
          { name: 'Hours Calculator', href: '/hours-calculator' },
          { name: 'Time Card Calculator', href: '/time-card-calculator' },
          { name: 'Time Zone Calculator', href: '/time-zone-calculator' },
          { name: 'Time Duration Calculator', href: '/time-duration-calculator' },
          { name: 'Day Counter', href: '/day-counter' },
          { name: 'Day of the Week Calculator', href: '/day-of-week-calculator' }
        ]
      },
      {
        title: 'Construction',
        icon: '🏗️',
        items: [
          { name: 'Concrete Calculator', href: '/concrete-calculator' },
          { name: 'BTU Calculator', href: '/btu-calculator' },
          { name: 'Square Footage Calculator', href: '/square-footage-calculator' },
          { name: 'Stair Calculator', href: '/stair-calculator' },
          { name: 'Roofing Calculator', href: '/roofing-calculator' },
          { name: 'Tile Calculator', href: '/tile-calculator' },
          { name: 'Mulch Calculator', href: '/mulch-calculator' },
          { name: 'Gravel Calculator', href: '/gravel-calculator' }
        ]
      },
      {
        title: 'Measurements',
        icon: '📏',
        items: [
          { name: 'Height Calculator', href: '/height-calculator' },
          { name: 'Conversion Calculator', href: '/conversion-calculator' },
          { name: 'GDP Calculator', href: '/gdp-calculator' },
          { name: 'Density Calculator', href: '/density-calculator' },
          { name: 'Mass Calculator', href: '/mass-calculator' },
          { name: 'Weight Calculator', href: '/weight-calculator' },
          { name: 'Speed Calculator', href: '/speed-calculator' },
          { name: 'Molarity Calculator', href: '/molarity-calculator' },
          { name: 'Molecular Weight Calculator', href: '/molecular-weight-calculator' }
        ]
      },
      {
        title: 'Electronics',
        icon: '⚡',
        items: [
          { name: 'Voltage Drop Calculator', href: '/voltage-drop-calculator' },
          { name: 'Resistor Calculator', href: '/resistor-calculator' },
          { name: 'Ohms Law Calculator', href: '/ohms-law-calculator' },
          { name: 'Electricity Calculator', href: '/electricity-calculator' }
        ]
      },
      {
        title: 'Internet & Tech',
        icon: '🌐',
        items: [
          { name: 'IP Subnet Calculator', href: '/ip-subnet-calculator' },
          { name: 'Password Generator', href: '/password-generator' },
          { name: 'Bandwidth Calculator', href: '/bandwidth-calculator' }
        ]
      },
      {
        title: 'Daily Life',
        icon: '📝',
        items: [
          { name: 'GPA Calculator', href: '/gpa-calculator' },
          { name: 'Grade Calculator', href: '/grade-calculator' },
          { name: 'Bra Size Calculator', href: '/bra-size-calculator' },
          { name: 'Tip Calculator', href: '/tip-calculator' },
          { name: 'Golf Handicap Calculator', href: '/golf-handicap-calculator' },
          { name: 'Sleep Calculator', href: '/sleep-calculator' }
        ]
      },
      {
        title: 'Weather',
        icon: '🌤️',
        items: [
          { name: 'Wind Chill Calculator', href: '/wind-chill-calculator' },
          { name: 'Heat Index Calculator', href: '/heat-index-calculator' },
          { name: 'Dew Point Calculator', href: '/dew-point-calculator' }
        ]
      },
      {
        title: 'Transportation',
        icon: '🚗',
        items: [
          { name: 'Fuel Cost Calculator', href: '/fuel-cost-calculator' },
          { name: 'Gas Mileage Calculator', href: '/gas-mileage-calculator' },
          { name: 'Horsepower Calculator', href: '/horsepower-calculator' },
          { name: 'Engine Horsepower Calculator', href: '/engine-horsepower-calculator' },
          { name: 'Mileage Calculator', href: '/mileage-calculator' },
          { name: 'Tire Size Calculator', href: '/tire-size-calculator' }
        ]
      },
      {
        title: 'Fun & Games',
        icon: '🎲',
        items: [
          { name: 'Dice Roller', href: '/dice-roller' },
          { name: 'Love Calculator', href: '/love-calculator' }
        ]
      }
    ]
  }
];

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
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{subcategory.icon}</span>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {subcategory.title}
                  </h3>
                </div>
                <div className="mt-4">
                  <ul className="space-y-2">
                    {subcategory.items.map((item) => (
                      <li key={item.name}>
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
