'use client';

import Link from 'next/link';
import { Calculator, Ruler, Percent, Calendar } from 'lucide-react';

const otherCalculators = [
  {
    name: 'Scientific Calculator',
    description: 'Advanced calculator with scientific functions, trigonometry, and more',
    icon: Calculator,
    href: '/calculators/scientific'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    icon: Ruler,
    href: '/calculators/unit-converter'
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, and decreases',
    icon: Percent,
    href: '/calculators/percentage'
  },
  {
    name: 'Date Calculator',
    description: 'Calculate dates, durations, and working days',
    icon: Calendar,
    href: '/calculators/date'
  }
];

export default function OthersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 ">
        Other Calculators
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {otherCalculators.map((calculator) => {
          const Icon = calculator.icon;
          return (
            <Link
              key={calculator.name}
              href={calculator.href}
              className="block p-6 bg-white "
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 ">
                  <Icon className="h-6 w-6 text-blue-600 " />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 ">
                    {calculator.name}
                  </h2>
                  <p className="mt-1 text-gray-600 ">
                    {calculator.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
