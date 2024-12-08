'use client';

import Link from 'next/link';
import { Calculator } from 'lucide-react';

interface RelatedCalculatorsProps {
  calculators: {
    name: string;
    description: string;
    href: string;
  }[];
}

export function RelatedCalculators({ calculators }: RelatedCalculatorsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Related Calculators
      </h2>
      <div className="space-y-4">
        {calculators.map((calc, index) => (
          <Link
            key={index}
            href={calc.href}
            className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {calc.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {calc.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
