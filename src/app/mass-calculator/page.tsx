'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface ConversionFactors {
  [key: string]: {
    toGrams: number;
    symbol: string;
    name: string;
  };
}

const conversionFactors: ConversionFactors = {
  milligrams: {
    toGrams: 0.001,
    symbol: 'mg',
    name: 'Milligrams'
  },
  grams: {
    toGrams: 1,
    symbol: 'g',
    name: 'Grams'
  },
  kilograms: {
    toGrams: 1000,
    symbol: 'kg',
    name: 'Kilograms'
  },
  ounces: {
    toGrams: 28.3495,
    symbol: 'oz',
    name: 'Ounces'
  },
  pounds: {
    toGrams: 453.592,
    symbol: 'lb',
    name: 'Pounds'
  },
  tons: {
    toGrams: 907185,
    symbol: 't',
    name: 'Tons'
  }
};

export default function MassCalculator() {
  const breadcrumbItems = [
    {
      label: 'Mass Calculator',
      href: '/mass-calculator'
    }
  ];

  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('kilograms');
  const [results, setResults] = useState<{ [key: string]: number }>({});

  const calculateConversions = () => {
    const inputInGrams = inputValue * conversionFactors[fromUnit].toGrams;
    const newResults: { [key: string]: number } = {};

    Object.keys(conversionFactors).forEach(unit => {
      newResults[unit] = inputInGrams / conversionFactors[unit].toGrams;
    });

    setResults(newResults);
  };

  useEffect(() => {
    calculateConversions();
  }, [inputValue, fromUnit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Mass Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Convert Mass Units</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Value</span>
                  </label>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    placeholder="Enter value"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">From Unit</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                  >
                    {Object.entries(conversionFactors).map(([unit, { name }]) => (
                      <option key={unit} value={unit}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Conversion Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results).map(([unit, value]) => (
                  <div key={unit} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{conversionFactors[unit].name}</span>
                    <span className="text-right">
                      {value.toFixed(4)} {conversionFactors[unit].symbol}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Mass Units</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Metric System</h3>
                  <p>The metric system uses units like milligrams (mg), grams (g), and kilograms (kg). It's based on powers of 10, making conversions simple.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Imperial System</h3>
                  <p>The imperial system uses units like ounces (oz), pounds (lb), and tons (t). It's commonly used in the United States and some other countries.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Common Usage</h3>
                  <p>Different units are used in different contexts: mg for medicine, kg for human weight, tons for industrial measurements, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
