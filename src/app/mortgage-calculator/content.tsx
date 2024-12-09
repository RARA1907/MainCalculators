import Link from 'next/link';
import { ArrowUpRightFromSquare, Calculator, DollarSign, Info, PiggyBank, Shield } from 'lucide-react';

export function MortgageCalculatorContent() {
  return (
    <article className="max-w-4xl mx-auto mt-16 prose dark:prose-invert prose-slate lg:prose-lg">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          Understanding Mortgage Calculations
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          A mortgage calculator is an essential tool for potential homeowners to estimate their monthly payments
          and understand the total cost of their home loan. Our calculator takes into account all the key factors
          that influence your mortgage payments, helping you make informed decisions about your home purchase.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          Key Components of Your Mortgage Payment
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <DollarSign className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Principal and Interest</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              The core of your monthly payment, consisting of the loan amount being repaid plus the interest charged by the lender.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <PiggyBank className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Property Taxes</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Annual property taxes divided into monthly payments, typically held in an escrow account by your lender.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Insurance Costs</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Includes homeowners insurance and, if required, private mortgage insurance (PMI) for down payments less than 20%.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Info className="w-6 h-6 text-orange-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Costs</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              HOA fees and other regular maintenance costs that may be part of your monthly housing expenses.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          The Mathematics Behind Mortgage Calculations
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Payment Formula</h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-md mb-4 overflow-x-auto">
            <code className="text-sm text-gray-800 dark:text-gray-200">
              M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
            </code>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>M = Monthly Payment</li>
            <li>P = Principal (Loan Amount)</li>
            <li>r = Monthly Interest Rate (Annual Rate ÷ 12)</li>
            <li>n = Total Number of Payments (Years × 12)</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          Important Considerations
        </h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Down Payment Impact</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              A larger down payment can significantly reduce your monthly payments and may eliminate the need for PMI.
              Consider these benefits when planning your home purchase:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Lower monthly payments</li>
              <li>Reduced interest costs over the loan term</li>
              <li>Potential PMI savings</li>
              <li>More equity in your home from the start</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Interest Rate Factors</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Interest rates can vary based on several factors:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Credit score</li>
              <li>Loan term</li>
              <li>Down payment amount</li>
              <li>Type of interest rate (fixed vs. adjustable)</li>
              <li>Current market conditions</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          Additional Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/calculators/loan-comparison"
            className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Loan Comparison Calculator</h3>
              <ArrowUpRightFromSquare className="w-5 h-5 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Compare different loan options side by side to find the best fit for your needs.
            </p>
          </Link>
          
          <Link 
            href="/calculators/refinance"
            className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Refinance Calculator</h3>
              <ArrowUpRightFromSquare className="w-5 h-5 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Evaluate if refinancing your current mortgage could save you money.
            </p>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          External Resources
        </h2>
        <div className="space-y-4">
          <a 
            href="https://www.consumerfinance.gov/owning-a-home/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Consumer Financial Protection Bureau
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Official guide to home buying and mortgages from the CFPB.
              </p>
            </div>
            <ArrowUpRightFromSquare className="w-5 h-5 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
          
          <a 
            href="https://www.hud.gov/buying/loans"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                HUD Loan Resources
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Information about FHA loans and other government-backed mortgage options.
              </p>
            </div>
            <ArrowUpRightFromSquare className="w-5 h-5 text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              What is PMI and when is it required?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Private Mortgage Insurance (PMI) is typically required when your down payment is less than 20% of the home's value.
              It protects the lender against default and usually costs between 0.5% to 1% of the loan amount annually.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              How can I lower my monthly mortgage payment?
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Make a larger down payment</li>
              <li>Extend the loan term (though this increases total interest paid)</li>
              <li>Find a lower interest rate</li>
              <li>Improve your credit score before applying</li>
              <li>Shop around with multiple lenders</li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}
