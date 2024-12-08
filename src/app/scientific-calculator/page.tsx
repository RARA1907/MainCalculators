'use client';

import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SocialShare } from '@/components/common/SocialShare';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { EmbedCode } from '@/components/common/EmbedCode';

const relatedCalculators = [
  {
    name: 'Basic Calculator',
    description: 'Simple arithmetic calculations for everyday use',
    href: '/basic-calculator'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    href: '/unit-converter'
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, and decreases',
    href: '/percentage-calculator'
  }
];

export default function ScientificCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Scientific Calculator', href: '/scientific-calculator' }
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Scientific Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our advanced scientific calculator provides a comprehensive set of mathematical functions
              for complex calculations. Perfect for students, engineers, and professionals.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <ScientificCalculator />
          </div>

          {/* Instructions and Features */}
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Features
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Basic arithmetic operations (addition, subtraction, multiplication, division)</li>
                <li>Trigonometric functions (sin, cos, tan) with degree/radian mode</li>
                <li>Exponential and logarithmic functions</li>
                <li>Memory functions for storing and recalling values</li>
                <li>Square root and power functions</li>
                <li>Parentheses for complex expressions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How to Use
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  1. <strong>Basic Operations:</strong> Use the number pad and operation buttons (+, -, ×, ÷) for basic calculations.
                </p>
                <p>
                  2. <strong>Scientific Functions:</strong> Access advanced functions like sin, cos, tan, and log. Toggle between degrees and radians using the RAD/DEG button.
                </p>
                <p>
                  3. <strong>Memory Functions:</strong>
                  <ul>
                    <li>MC (Memory Clear): Clears the memory</li>
                    <li>MR (Memory Recall): Recalls the stored value</li>
                    <li>M+ (Memory Add): Adds the current value to memory</li>
                    <li>M- (Memory Subtract): Subtracts the current value from memory</li>
                  </ul>
                </p>
                <p>
                  4. <strong>Complex Expressions:</strong> Use parentheses to group operations and ensure correct calculation order.
                </p>
              </div>
            </section>

            {/* Embed Code Section */}
            <EmbedCode calculatorId="scientific" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Share */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <SocialShare
              url="https://yourcalculatorsite.com/scientific-calculator"
              title="Scientific Calculator - Your Calculator Hub"
            />
          </div>

          {/* Related Calculators */}
          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </div>
    </div>
  );
}
