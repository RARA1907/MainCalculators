import { CalculatorPageLayout } from '@/components/calculator/CalculatorPageLayout';
import { Formula } from '@/components/calculator/Formula';
import { FAQList } from '@/components/calculator/FAQ';
import Image from 'next/image';

export const metadata = {
  title: 'Compound Interest Calculator',
  description: 'Calculate compound interest with our easy-to-use calculator. Learn about compound interest formulas and concepts.',
};

function CompoundInterestCalculator() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Principal Amount ($)</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="10000"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Annual Interest Rate (%)</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="5"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Time Period (Years)</label>
        <input
          type="number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
          placeholder="5"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#0EA5E9] text-white py-2 px-4 rounded-md hover:bg-[#7DD3FC] transition-colors"
      >
        Calculate
      </button>
    </form>
  );
}

function Content() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">What is Compound Interest?</h2>
        <p>
          Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods...
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Formula</h2>
        <Formula
          title="Compound Interest Formula"
          formula="A = P(1 + r/n)^(nt)"
          description="Where: A = Final amount, P = Principal balance, r = Interest rate, n = Number of times interest is compounded per year, t = Number of years"
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example Calculation</h2>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p>Let's calculate compound interest for:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Principal: $10,000</li>
            <li>Interest Rate: 5% per year</li>
            <li>Time: 5 years</li>
            <li>Compounding: Annually</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

const faqItems = [
  {
    question: "What is compound interest?",
    answer: "Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods of a deposit or loan.",
  },
  {
    question: "How often can interest be compounded?",
    answer: "Interest can be compounded at different frequencies: annually, semi-annually, quarterly, monthly, or daily. The more frequent the compounding, the more interest will accrue.",
  },
  {
    question: "What's the difference between simple and compound interest?",
    answer: "Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal and the accumulated interest from previous periods.",
  },
];

export default function CompoundInterestPage() {
  return (
    <CalculatorPageLayout
      title="Compound Interest Calculator"
      description="Calculate how your investments grow with compound interest. Free online calculator with detailed explanations and examples."
      calculator={<CompoundInterestCalculator />}
      content={<Content />}
      faq={<FAQList items={faqItems} />}
    />
  );
}
