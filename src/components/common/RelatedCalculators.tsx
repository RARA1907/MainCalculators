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
    <div className="bg-white ">
      <h2 className="text-xl font-bold mb-4 text-gray-900 ">
        Related Calculators
      </h2>
      <div className="space-y-4">
        {calculators.map((calc, index) => (
          <Link
            key={index}
            href={calc.href}
            className="block p-4 bg-gray-50 "
          >
            <div className="flex items-start space-x-3">
              <Calculator className="w-5 h-5 text-blue-600 " />
              <div>
                <h3 className="font-medium text-gray-900 ">
                  {calc.name}
                </h3>
                <p className="text-sm text-gray-600 ">
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
