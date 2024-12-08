'use client';

import * as React from 'react';
import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';
import { Formula } from '@/components/calculator/Formula';
import { FAQList } from '@/components/calculator/FAQ';

function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = React.useState<number>(300000);
  const [interestRate, setInterestRate] = React.useState<number>(4.5);
  const [loanTerm, setLoanTerm] = React.useState<number>(30);
  const [downPayment, setDownPayment] = React.useState<number>(60000);
  const [result, setResult] = React.useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const calculateMortgage = (e: React.FormEvent) => {
    e.preventDefault();
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
    });
  };

  return (
    <form className="space-y-4" onSubmit={calculateMortgage}>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Home Price ($)</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="300000"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Down Payment ($)</label>
        <input
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="60000"
        />
        <p className="text-sm text-gray-500">
          {((downPayment / loanAmount) * 100).toFixed(1)}% of home price
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Interest Rate (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="4.5"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Loan Term (Years)</label>
        <select
          value={loanTerm}
          onChange={(e) => setLoanTerm(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
        >
          <option value="30">30 years</option>
          <option value="20">20 years</option>
          <option value="15">15 years</option>
          <option value="10">10 years</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-[#0EA5E9] text-white py-2 px-4 rounded-md hover:bg-[#7DD3FC] transition-colors"
      >
        Calculate Mortgage
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Monthly Payment</h3>
            <p className="text-3xl font-bold text-[#0EA5E9]">
              ${result.monthlyPayment.toFixed(2)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium mb-1">Total Payment</h4>
              <p className="text-xl font-semibold text-[#0EA5E9]">
                ${result.totalPayment.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium mb-1">Total Interest</h4>
              <p className="text-xl font-semibold text-[#0EA5E9]">
                ${result.totalInterest.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Content() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Understanding Mortgage Payments</h2>
        <p>
          A mortgage calculator helps you estimate your monthly home loan payments. It takes into account
          the home price, down payment, interest rate, and loan term to calculate your monthly mortgage
          payment, total payment amount, and total interest paid over the life of the loan.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Mortgage Payment Formula</h2>
        <Formula
          title="Monthly Mortgage Payment Formula"
          formula="M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)"
          description="Where: M = Monthly payment, P = Principal loan amount, r = Monthly interest rate (annual rate ÷ 12), n = Total number of months (years × 12)"
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Key Components of a Mortgage Payment</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Principal</h3>
            <p>The amount you borrow from the lender (home price minus down payment)</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Interest</h3>
            <p>The cost of borrowing money, expressed as a percentage rate</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Term Length</h3>
            <p>The number of years you have to repay the loan</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Down Payment</h3>
            <p>The initial payment you make when purchasing the home</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const faqItems = [
  {
    question: "What is included in a mortgage payment?",
    answer: "A typical mortgage payment includes principal, interest, taxes, and insurance (PITI). Our calculator focuses on principal and interest, but remember to budget for property taxes and insurance separately.",
  },
  {
    question: "How does the down payment affect my mortgage?",
    answer: "A larger down payment reduces your loan amount, which leads to lower monthly payments and less interest paid over the life of the loan. It can also help you avoid private mortgage insurance (PMI).",
  },
  {
    question: "What loan term should I choose?",
    answer: "Common terms are 30, 20, and 15 years. Shorter terms typically have higher monthly payments but lower total interest costs. A 30-year term offers lower monthly payments but costs more in interest over time.",
  },
  {
    question: "How can I lower my monthly mortgage payment?",
    answer: "You can lower your payment by making a larger down payment, extending the loan term, finding a lower interest rate, or buying a less expensive home.",
  },
];

export default function MortgagePage() {
  return (
    <CalculatorPageLayout
      title="Mortgage Calculator"
      description="Calculate your monthly mortgage payments and understand the total cost of your home loan. Get detailed breakdowns of principal, interest, and total payments."
      calculator={<MortgageCalculator />}
      content={<Content />}
      faq={<FAQList items={faqItems} />}
    />
  );
}
