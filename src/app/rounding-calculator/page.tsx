'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'decimal',
    name: 'Decimal Places',
    description: 'Round to n decimal places',
  },
  {
    id: 'significant',
    name: 'Significant Figures',
    description: 'Round to n significant figures',
  },
  {
    id: 'nearest',
    name: 'Nearest',
    description: 'Round to nearest value',
  },
];

const roundingMethods = [
  { id: 'standard', name: 'Standard' },
  { id: 'up', name: 'Up (Ceiling)' },
  { id: 'down', name: 'Down (Floor)' },
  { id: 'truncate', name: 'Truncate' },
];

const breadcrumbItems = [
  {
    label: 'Rounding Calculator',
    href: '/rounding-calculator',
  },
];

export default function RoundingCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'decimal' | 'significant' | 'nearest'>('decimal');
  const [number, setNumber] = useState<string>('');
  const [places, setPlaces] = useState<string>('2');
  const [nearest, setNearest] = useState<string>('10');
  const [method, setMethod] = useState<'standard' | 'up' | 'down' | 'truncate'>('standard');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Count significant figures in a number
  const countSignificantFigures = (num: string): number => {
    // Remove leading/trailing zeros and decimal point
    const trimmed = num.replace(/^0+|\.|\s+/g, '').replace(/0+$/, '');
    return trimmed.length;
  };

  // Format number with proper grouping
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 20 });
  };

  // Round to decimal places
  const roundToDecimal = () => {
    try {
      if (!number) {
        throw new Error('Please enter a number');
      }

      const num = parseFloat(number);
      const decimals = parseInt(places);

      if (isNaN(num)) {
        throw new Error('Please enter a valid number');
      }

      if (!Number.isInteger(decimals) || decimals < 0) {
        throw new Error('Please enter a valid number of decimal places');
      }

      let result: number;
      const multiplier = Math.pow(10, decimals);

      switch (method) {
        case 'up':
          result = Math.ceil(num * multiplier) / multiplier;
          break;
        case 'down':
          result = Math.floor(num * multiplier) / multiplier;
          break;
        case 'truncate':
          result = Math.trunc(num * multiplier) / multiplier;
          break;
        default:
          result = Math.round(num * multiplier) / multiplier;
      }

      const steps = [
        `Step 1: Original number = ${formatNumber(num)}`,
        `Step 2: Multiply by 10^${decimals} = ${formatNumber(num * multiplier)}`,
        `Step 3: Apply ${method} rounding = ${formatNumber(Math.round(num * multiplier))}`,
        `Step 4: Divide by 10^${decimals} = ${formatNumber(result)}`,
        '',
        `Final result: ${formatNumber(result)}`
      ];

      setResult(result.toFixed(decimals));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Round to significant figures
  const roundToSignificant = () => {
    try {
      if (!number) {
        throw new Error('Please enter a number');
      }

      const num = parseFloat(number);
      const sigFigs = parseInt(places);

      if (isNaN(num)) {
        throw new Error('Please enter a valid number');
      }

      if (!Number.isInteger(sigFigs) || sigFigs < 1) {
        throw new Error('Please enter a valid number of significant figures');
      }

      const currentSigFigs = countSignificantFigures(Math.abs(num).toString());
      const magnitude = Math.floor(Math.log10(Math.abs(num)));
      const scale = Math.pow(10, magnitude - sigFigs + 1);

      let result: number;
      switch (method) {
        case 'up':
          result = Math.ceil(num / scale) * scale;
          break;
        case 'down':
          result = Math.floor(num / scale) * scale;
          break;
        case 'truncate':
          result = Math.trunc(num / scale) * scale;
          break;
        default:
          result = Math.round(num / scale) * scale;
      }

      const steps = [
        `Step 1: Original number = ${formatNumber(num)}`,
        `Step 2: Current significant figures = ${currentSigFigs}`,
        `Step 3: Calculate magnitude = ${magnitude}`,
        `Step 4: Calculate scale factor = 10^${magnitude - sigFigs + 1}`,
        `Step 5: Apply ${method} rounding`,
        '',
        `Final result: ${formatNumber(result)}`
      ];

      setResult(result.toPrecision(sigFigs));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Round to nearest value
  const roundToNearest = () => {
    try {
      if (!number || !nearest) {
        throw new Error('Please fill in all fields');
      }

      const num = parseFloat(number);
      const target = parseFloat(nearest);

      if (isNaN(num) || isNaN(target)) {
        throw new Error('Please enter valid numbers');
      }

      if (target <= 0) {
        throw new Error('Nearest value must be positive');
      }

      let result: number;
      switch (method) {
        case 'up':
          result = Math.ceil(num / target) * target;
          break;
        case 'down':
          result = Math.floor(num / target) * target;
          break;
        case 'truncate':
          result = Math.trunc(num / target) * target;
          break;
        default:
          result = Math.round(num / target) * target;
      }

      const steps = [
        `Step 1: Original number = ${formatNumber(num)}`,
        `Step 2: Target value = ${formatNumber(target)}`,
        `Step 3: Divide by target = ${formatNumber(num / target)}`,
        `Step 4: Apply ${method} rounding = ${formatNumber(Math.round(num / target))}`,
        `Step 5: Multiply by target = ${formatNumber(result)}`,
        '',
        `Final result: ${formatNumber(result)}`
      ];

      setResult(result.toString());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Rounding Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id as 'decimal' | 'significant' | 'nearest');
                        setResult('');
                        setSteps([]);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === calcMode.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                {/* Rounding Method */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roundingMethods.map((roundMethod) => (
                    <button
                      key={roundMethod.id}
                      onClick={() => setMethod(roundMethod.id as 'standard' | 'up' | 'down' | 'truncate')}
                      className={`p-2 rounded-lg text-center transition-all duration-300 ${
                        method === roundMethod.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {roundMethod.name}
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number</span>
                    </label>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Enter a number"
                      className="input input-bordered w-full"
                      step="any"
                    />
                  </div>

                  {mode !== 'nearest' ? (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          {mode === 'decimal' ? 'Decimal Places' : 'Significant Figures'}
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{mode === 'decimal' ? 'Number of digits after decimal point' : 'Number of meaningful digits'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        value={places}
                        onChange={(e) => setPlaces(e.target.value)}
                        placeholder={mode === 'decimal' ? 'Enter decimal places' : 'Enter significant figures'}
                        className="input input-bordered w-full"
                        min="0"
                        step="1"
                      />
                    </div>
                  ) : (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Round to Nearest</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Value to round to (e.g., 5, 10, 100)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        value={nearest}
                        onChange={(e) => setNearest(e.target.value)}
                        placeholder="Enter value"
                        className="input input-bordered w-full"
                        min="0"
                        step="any"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'decimal':
                        roundToDecimal();
                        break;
                      case 'significant':
                        roundToSignificant();
                        break;
                      case 'nearest':
                        roundToNearest();
                        break;
                    }
                  }}
                  className="btn w-full bg-[#0EA5E9] hover:bg-blue-600 text-white"
                >
                  Calculate
                </button>

                {error && (
                  <div className="text-error text-sm mt-2">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              {result && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-1">Result</h3>
                    <div className="text-2xl font-bold font-mono break-all overflow-hidden">
                      {result}
                    </div>
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="text-sm font-mono break-words">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Rounding</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Decimal Places</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Digits after decimal point</li>
                  <li className="break-words">Common in finance</li>
                  <li className="break-words">Used for currency</li>
                  <li className="break-words">Fixed precision</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Significant Figures</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Meaningful digits</li>
                  <li className="break-words">Used in science</li>
                  <li className="break-words">Indicates precision</li>
                  <li className="break-words">Includes leading digits</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Rounding Methods</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Standard (nearest)</li>
                  <li className="break-words">Up (ceiling)</li>
                  <li className="break-words">Down (floor)</li>
                  <li className="break-words">Truncate (cut off)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
