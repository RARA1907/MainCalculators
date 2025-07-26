#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Original calculator routes mapping
const calculatorRoutes = {
  // Finance Calculators - Mortgage & Real Estate
  'Mortgage Calculator': '/mortgage-calculator',
  'Amortization Calculator': '/amortization-calculator',
  'Mortgage Payoff Calculator': '/mortgage-payoff-calculator',
  'House Affordability Calculator': '/house-affordability-calculator',
  'Rent Calculator': '/rent-calculator',
  'Debt-to-Income Ratio Calculator': '/debt-to-income-ratio-calculator',
  'Real Estate Calculator': '/real-estate-calculator',
  'Refinance Calculator': '/refinance-calculator',
  'Rental Property Calculator': '/rental-property-calculator',
  'APR Calculator': '/apr-calculator',
  'FHA Loan Calculator': '/fha-loan-calculator',
  'VA Mortgage Calculator': '/va-mortgage-calculator',
  'Down Payment Calculator': '/down-payment-calculator',
  'Rent vs. Buy Calculator': '/rent-vs-buy-calculator',

  // Finance Calculators - Investment & Trading
  'Investment Calculator': '/investment-calculator',
  'Interest Calculator': '/interest-calculator',
  'Finance Calculator': '/finance-calculator',
  'Compound Interest Calculator': '/compound-interest-calculator',
  'Interest Rate Calculator': '/interest-rate-calculator',
  'Simple Interest Calculator': '/simple-interest-calculator',
  'CD Calculator': '/cd-calculator',
  'Bond Calculator': '/bond-calculator',
  'Average Return Calculator': '/average-return-calculator',
  'ROI Calculator': '/roi-calculator',
  'Payback Period Calculator': '/payback-period-calculator',
  'Present Value Calculator': '/present-value-calculator',
  'Future Value Calculator': '/future-value-calculator',
  'Stock Calculator': '/stock-calculator',
  'Dividend Calculator': '/dividend-calculator',
  'Capital Gains Calculator': '/capital-gains-calculator',

  // Finance Calculators - Tax & Salary
  'Income Tax Calculator': '/income-tax-calculator',
  'Take Home Pay Calculator': '/take-home-pay-calculator',
  'Salary Calculator': '/salary-calculator',
  'VAT Calculator': '/vat-calculator',
  'Sales Tax Calculator': '/sales-tax-calculator',
  'Marriage Tax Calculator': '/marriage-tax-calculator',
  'Estate Tax Calculator': '/estate-tax-calculator',
  'Take-Home-Paycheck Calculator': '/take-home-paycheck-calculator',

  // Finance Calculators - Retirement & Savings
  'Retirement Calculator': '/retirement-calculator',
  '401k Calculator': '/401k-calculator',
  'Savings Calculator': '/savings-calculator',
  'Pension Calculator': '/pension-calculator',
  'Social Security Calculator': '/social-security-calculator',
  'Annuity Calculator': '/annuity-calculator',
  'Annuity Payout Calculator': '/annuity-payout-calculator',
  'Roth IRA Calculator': '/roth-ira-calculator',
  'IRA Calculator': '/ira-calculator',
  'RMD Calculator': '/rmd-calculator',

  // Finance Calculators - Loans & Credit
  'Loan Calculator': '/loan-calculator',
  'Payment Calculator': '/payment-calculator',
  'Auto Loan Calculator': '/auto-loan-calculator',
  'Cash Back or Low Interest Calculator': '/cash-back-or-low-interest-calculator',
  'Auto Lease Calculator': '/auto-lease-calculator',
  'Credit Card Calculator': '/credit-card-calculator',
  'Credit Cards Payoff Calculator': '/credit-cards-payoff-calculator',
  'Debt Payoff Calculator': '/debt-payoff-calculator',
  'Debt Consolidation Calculator': '/debt-consolidation-calculator',
  'Repayment Calculator': '/repayment-calculator',
  'Student Loan Calculator': '/student-loan-calculator',
  'Business Loan Calculator': '/business-loan-calculator',
  'Personal Loan Calculator': '/personal-loan-calculator',
  'Lease Calculator': '/lease-calculator',

  // Finance Calculators - Business & Other
  'Currency Calculator': '/currency-calculator',
  'Inflation Calculator': '/inflation-calculator',
  'College Cost Calculator': '/college-cost-calculator',
  'Depreciation Calculator': '/depreciation-calculator',
  'Margin Calculator': '/margin-calculator',
  'Discount Calculator': '/discount-calculator',
  'Budget Calculator': '/budget-calculator',
  'Commission Calculator': '/commission-calculator',
  'Unit Converter': '/unit-converter',
  'Date Calculator': '/date-calculator',

  // Health & Fitness Calculators - Fitness & Body
  'BMI Calculator': '/bmi-calculator',
  'Body Fat Calculator': '/body-fat-calculator',
  'BMR Calculator': '/bmr-calculator',
  'Ideal Weight Calculator': '/ideal-weight-calculator',
  'Calories Burned Calculator': '/calories-burned-calculator',
  'One Rep Max Calculator': '/one-rep-max-calculator',
  'Pace Calculator': '/pace-calculator',
  'Army Body Fat Calculator': '/army-body-fat-calculator',
  'Lean Body Mass Calculator': '/lean-body-mass-calculator',
  'Healthy Weight Calculator': '/healthy-weight-calculator',
  'Body Type Calculator': '/body-type-calculator',
  'Body Surface Area Calculator': '/body-surface-area-calculator',

  // Health & Fitness Calculators - Nutrition & Diet
  'Calorie Calculator': '/calorie-calculator',
  'Macro Calculator': '/macro-calculator',
  'Protein Calculator': '/protein-calculator',
  'TDEE Calculator': '/tdee-calculator',
  'Carbohydrate Calculator': '/carbohydrate-calculator',
  'Fat Intake Calculator': '/fat-intake-calculator',
  'BAC Calculator': '/bac-calculator',

  // Health & Fitness Calculators - Pregnancy & Fertility
  'Pregnancy Calculator': '/pregnancy-calculator',
  'Due Date Calculator': '/due-date-calculator',
  'Ovulation Calculator': '/ovulation-calculator',
  'Conception Calculator': '/conception-calculator',
  'Period Calculator': '/period-calculator',
  'Pregnancy Weight Gain Calculator': '/pregnancy-weight-gain-calculator',
  'Pregnancy Conception Calculator': '/pregnancy-conception-calculator',

  // Health & Fitness Calculators - Medical
  'GFR Calculator': '/gfr-calculator',

  // Mathematics Calculators - Basic Math & Numbers
  'Scientific Calculator': '/scientific-calculator',
  'Fraction Calculator': '/fraction-calculator',
  'Percentage Calculator': '/percentage-calculator',
  'Random Number Generator': '/random-number-generator',
  'Percent Error Calculator': '/percent-error-calculator',
  'Exponent Calculator': '/exponent-calculator',
  'Binary Calculator': '/binary-calculator',
  'Hex Calculator': '/hex-calculator',
  'Half-Life Calculator': '/half-life-calculator',
  'Quadratic Formula Calculator': '/quadratic-formula-calculator',
  'Log Calculator': '/log-calculator',
  'Ratio Calculator': '/ratio-calculator',
  'Root Calculator': '/root-calculator',
  'Least Common Multiple Calculator': '/lcm-calculator',
  'Greatest Common Factor Calculator': '/gcf-calculator',
  'Factor Calculator': '/factor-calculator',
  'Rounding Calculator': '/rounding-calculator',
  'Matrix Calculator': '/matrix-calculator',
  'Scientific Notation Calculator': '/scientific-notation-calculator',
  'Big Number Calculator': '/big-number-calculator',

  // Mathematics Calculators - Statistics & Probability
  'Statistics Calculator': '/statistics-calculator',
  'Standard Deviation Calculator': '/standard-deviation-calculator',
  'Number Sequence Calculator': '/number-sequence-calculator',
  'Sample Size Calculator': '/sample-size-calculator',
  'Probability Calculator': '/probability-calculator',
  'Mean, Median, Mode, Range Calculator': '/mean-median-mode-range-calculator',
  'Permutation and Combination Calculator': '/permutation-combination-calculator',
  'Z-score Calculator': '/z-score-calculator',
  'Confidence Interval Calculator': '/confidence-interval-calculator',

  // Mathematics Calculators - Geometry & Measurements
  'Area Calculator': '/area-calculator',
  'Volume Calculator': '/volume-calculator',
  'Triangle Calculator': '/triangle-calculator',
  'Circle Calculator': '/circle-calculator',
  'Pythagorean Theorem Calculator': '/pythagorean-theorem-calculator',
  'Slope Calculator': '/slope-calculator',
  'Distance Calculator': '/distance-calculator',
  'Surface Area Calculator': '/surface-area-calculator',
  'Right Triangle Calculator': '/right-triangle-calculator',

  // Other Calculators - Date and Time
  'Age Calculator': '/age-calculator',
  'Date Calculator': '/date-calculator',
  'Time Calculator': '/time-calculator',
  'Hours Calculator': '/hours-calculator',
  'How Many Days': '/how-many-days',
  'Time Zone Calculator': '/time-zone-calculator',
  'Time Duration Calculator': '/time-duration-calculator',
  'Day Counter': '/day-counter',
  'Day of the Week Calculator': '/day-of-week-calculator',

  // Other Calculators - Construction
  'Concrete Calculator': '/concrete-calculator',
  'BTU Calculator': '/btu-calculator',
  'Square Footage Calculator': '/square-footage-calculator',
  'Stair Calculator': '/stair-calculator',
  'Roofing Calculator': '/roofing-calculator',
  'Tile Calculator': '/tile-calculator',
  'Mulch Calculator': '/mulch-calculator',
  'Gravel Calculator': '/gravel-calculator',

  // Other Calculators - Measurements
  'Height Calculator': '/height-calculator',
  'Conversion Calculator': '/conversion-calculator',
  'GDP Calculator': '/gdp-calculator',
  'Density Calculator': '/density-calculator',
  'Mass Calculator': '/mass-calculator',
  'Weight Calculator': '/weight-calculator',
  'Speed Calculator': '/speed-calculator',
  'Molarity Calculator': '/molarity-calculator',
  'Molecular Weight Calculator': '/molecular-weight-calculator',

  // Other Calculators - Electronics
  'Voltage Drop Calculator': '/voltage-drop-calculator',
  'Resistor Calculator': '/resistor-calculator',
  'Ohms Law Calculator': '/ohms-law-calculator',
  'Electricity Calculator': '/electricity-calculator',

  // Other Calculators - Internet & Tech
  'IP Subnet Calculator': '/ip-subnet-calculator',
  'Password Generator': '/password-generator',
  'Bandwidth Calculator': '/bandwidth-calculator',
  'JSONL Converter': '/jsonl-converter',
  'JSONL Validator': '/jsonl-validator',

  // Other Calculators - Daily Life
  'GPA Calculator': '/gpa-calculator',
  'Grade Calculator': '/grade-calculator',
  'Bra Size Calculator': '/bra-size-calculator',
  'Tip Calculator': '/tip-calculator',
  'Golf Handicap Calculator': '/golf-handicap-calculator',
  'Sleep Calculator': '/sleep-calculator',

  // Other Calculators - Weather
  'Wind Chill Calculator': '/wind-chill-calculator',
  'Heat Index Calculator': '/heat-index-calculator',
  'Dew Point Calculator': '/dew-point-calculator',

  // Other Calculators - Transportation
  'Fuel Cost Calculator': '/fuel-cost-calculator',
  'Gas Mileage Calculator': '/gas-mileage-calculator',
  'Horsepower Calculator': '/horsepower-calculator',
  'Engine Horsepower Calculator': '/engine-horsepower-calculator',
  'Mileage Calculator': '/mileage-calculator',
  'Tire Size Calculator': '/tire-size-calculator',

  // Other Calculators - Fun & Games
  'Dice Roller': '/dice-roller',
  'Love Calculator': '/love-calculator'
};

function restoreCalculators() {
  const categoriesPath = path.join(__dirname, '../src/data/categories.ts');
  
  try {
    let content = fs.readFileSync(categoriesPath, 'utf8');
    
    // Replace all href: '#' with their original routes
    for (const [calculatorName, route] of Object.entries(calculatorRoutes)) {
      const searchPattern = new RegExp(`\\{ name: '${calculatorName.replace(/'/g, "\\'")}', href: '#' \\}`, 'g');
      const replacement = `{ name: '${calculatorName}', href: '${route}' }`;
      content = content.replace(searchPattern, replacement);
    }
    
    fs.writeFileSync(categoriesPath, content, 'utf8');
    console.log('✅ All calculator links have been restored!');
    console.log('📝 The calculators are now accessible again from the homepage.');
    
  } catch (error) {
    console.error('❌ Error restoring calculators:', error.message);
    process.exit(1);
  }
}

// Run the restore function
restoreCalculators(); 