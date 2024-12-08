import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  calculator: React.ReactNode;
  content: React.ReactNode;
  faq: React.ReactNode;
}

export function CalculatorPageLayout({
  title,
  description,
  children,
  calculator,
  content,
  faq,
}: CalculatorPageLayoutProps) {
  return (
    <div className="min-h-screen w-full">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#0EA5E9] mb-4">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Quick Navigation */}
          <nav className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Quick Navigation</h2>
            <ul className="space-y-2">
              <li>
                <a href="#calculator" className="text-[#0EA5E9] hover:text-[#7DD3FC]">Calculator</a>
              </li>
              <li>
                <a href="#overview" className="text-[#0EA5E9] hover:text-[#7DD3FC]">Overview</a>
              </li>
              <li>
                <a href="#formulas" className="text-[#0EA5E9] hover:text-[#7DD3FC]">Formulas</a>
              </li>
              <li>
                <a href="#faq" className="text-[#0EA5E9] hover:text-[#7DD3FC]">FAQ</a>
              </li>
            </ul>
          </nav>

          {/* Content Sections */}
          <div className="prose dark:prose-invert max-w-none">
            <section id="overview" className="mb-12">
              {content}
            </section>

            <section id="faq" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              {faq}
            </section>

            {children}
          </div>
        </div>

        {/* Calculator Section - Sticky */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2">
          <div className="sticky top-4">
            <div id="calculator" className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Calculator</h2>
              {calculator}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
