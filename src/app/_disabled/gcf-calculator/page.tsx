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
    id: 'twoNumbers',
    name: 'Two Numbers',
    description: 'Find GCF of two numbers',
  },
  {
    id: 'multipleNumbers',
    name: 'Multiple Numbers',
    description: 'Find GCF of multiple numbers',
  },
  {
    id: 'factorList',
    name: 'Factor List',
    description: 'Show all factors and GCF',
  },
];

const breadcrumbItems = [
  {
    label: 'GCF Calculator',
    href: '/gcf-calculator',
  },
];

export default function GCFCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'twoNumbers' | 'multipleNumbers' | 'factorList'>('twoNumbers');
  const [number1, setNumber1] = useState<string>('');
  const [number2, setNumber2] = useState<string>('');
  const [numbers, setNumbers] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [factors, setFactors] = useState<{ [key: string]: number[] }>({});
  const [commonFactors, setCommonFactors] = useState<number[]>([]);

  // Find all factors of a number
  const findFactors = (n: number): number[] => {
    const factors: number[] = [];
    const absN = Math.abs(n);
    
    for (let i = 1; i <= Math.sqrt(absN); i++) {
      if (absN % i === 0) {
        factors.push(i);
        if (i !== absN / i) {
          factors.push(absN / i);
        }
      }
    }
    
    return factors.sort((a, b) => a - b);
  };

  // Find prime factors of a number
  const findPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let num = Math.abs(n);
    
    while (num % 2 === 0) {
      factors.push(2);
      num = num / 2;
    }
    
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
      }
    }
    
    if (num > 2) {
      factors.push(num);
    }
    
    return factors;
  };

  // Format prime factorization
  const formatPrimeFactorization = (factors: number[]): string => {
    if (factors.length === 0) return '1';
    
    const counts: { [key: number]: number } = {};
    factors.forEach(factor => {
      counts[factor] = (counts[factor] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([factor, count]) => count === 1 ? factor : `${factor}^${count}`)
      .join(' × ');
  };

  // Calculate GCD using Euclidean algorithm
  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  // Calculate GCD of multiple numbers
  const calculateMultipleGCD = (numbers: number[]): number => {
    return numbers.reduce((acc, curr) => gcd(acc, curr));
  };

  // Calculate GCD of two numbers
  const calculateTwoNumbers = () => {
    try {
      if (!number1 || !number2) {
        throw new Error('Please enter both numbers');
      }

      const a = parseInt(number1);
      const b = parseInt(number2);

      if (!Number.isInteger(a) || !Number.isInteger(b)) {
        throw new Error('Please enter valid integers');
      }

      if (a === 0 && b === 0) {
        throw new Error('Both numbers cannot be zero');
      }

      const factorsA = findFactors(a);
      const factorsB = findFactors(b);
      const common = factorsA.filter(x => factorsB.includes(x));
      const gcdValue = gcd(a, b);
      const primeFactorsA = findPrimeFactors(a);
      const primeFactorsB = findPrimeFactors(b);

      const steps = [
        `Step 1: Find factors of both numbers`,
        `Factors of ${a}: ${factorsA.join(', ')}`,
        `Factors of ${b}: ${factorsB.join(', ')}`,
        '',
        `Step 2: Find common factors`,
        `Common factors: ${common.join(', ')}`,
        '',
        `Step 3: Prime factorizations`,
        `${a} = ${formatPrimeFactorization(primeFactorsA)}`,
        `${b} = ${formatPrimeFactorization(primeFactorsB)}`,
        '',
        `Step 4: Using Euclidean algorithm`,
        ...generateEuclideanSteps(a, b),
        '',
        `GCF = ${gcdValue}`
      ];

      setFactors({
        [a]: factorsA,
        [b]: factorsB
      });
      setCommonFactors(common);
      setResult(gcdValue.toString());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setFactors({});
      setCommonFactors([]);
    }
  };

  // Generate steps for Euclidean algorithm
  const generateEuclideanSteps = (a: number, b: number): string[] => {
    const steps: string[] = [];
    let x = Math.abs(a);
    let y = Math.abs(b);
    
    while (y !== 0) {
      const quotient = Math.floor(x / y);
      const remainder = x % y;
      steps.push(`${x} = ${y} × ${quotient} + ${remainder}`);
      x = y;
      y = remainder;
    }
    
    return steps;
  };

  // Calculate GCD of multiple numbers
  const calculateMultipleNumbers = () => {
    try {
      if (!numbers) {
        throw new Error('Please enter numbers');
      }

      const numberArray = numbers.split(',').map(n => n.trim());
      const nums = numberArray.map(n => {
        const parsed = parseInt(n);
        if (!Number.isInteger(parsed)) {
          throw new Error(`Invalid number: ${n}`);
        }
        return parsed;
      });

      if (nums.length < 2) {
        throw new Error('Please enter at least two numbers');
      }

      if (nums.every(n => n === 0)) {
        throw new Error('All numbers cannot be zero');
      }

      const allFactors: { [key: string]: number[] } = {};
      nums.forEach(n => {
        allFactors[n] = findFactors(n);
      });

      const common = allFactors[nums[0]].filter(x =>
        nums.slice(1).every(n => allFactors[n].includes(x))
      );

      const gcdValue = calculateMultipleGCD(nums);

      const steps = [
        'Step 1: Find factors of all numbers',
        ...nums.map(n => `Factors of ${n}: ${allFactors[n].join(', ')}`),
        '',
        'Step 2: Find common factors',
        `Common factors: ${common.join(', ')}`,
        '',
        'Step 3: Calculate GCF iteratively',
        ...nums.slice(1).map((_, index) => {
          const partial = calculateMultipleGCD(nums.slice(0, index + 2));
          return `GCF(${nums.slice(0, index + 2).join(', ')}) = ${partial}`;
        }),
        '',
        `Final GCF = ${gcdValue}`
      ];

      setFactors(allFactors);
      setCommonFactors(common);
      setResult(gcdValue.toString());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setFactors({});
      setCommonFactors([]);
    }
  };

  // Show factor list
  const showFactorList = () => {
    try {
      if (!number1) {
        throw new Error('Please enter a number');
      }

      const num = parseInt(number1);

      if (!Number.isInteger(num)) {
        throw new Error('Please enter a valid integer');
      }

      if (num === 0) {
        throw new Error('Number cannot be zero');
      }

      const allFactors = findFactors(num);
      const primeFactors = findPrimeFactors(num);

      const steps = [
        'Step 1: Find all factors',
        `Factors: ${allFactors.join(', ')}`,
        '',
        'Step 2: Count factors',
        `Total factors: ${allFactors.length}`,
        '',
        'Step 3: Prime factorization',
        `${num} = ${formatPrimeFactorization(primeFactors)}`,
        '',
        'Step 4: Factor pairs',
        ...allFactors.slice(0, Math.ceil(allFactors.length / 2)).map((factor, index) => {
          const pair = allFactors[allFactors.length - 1 - index];
          return `${factor} × ${pair} = ${num}`;
        })
      ];

      setFactors({ [num]: allFactors });
      setResult(allFactors.join(', '));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setFactors({});
      setCommonFactors([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">GCF Calculator</h1>
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
                        setMode(calcMode.id as 'twoNumbers' | 'multipleNumbers' | 'factorList');
                        setResult('');
                        setSteps([]);
                        setError('');
                        setFactors({});
                        setCommonFactors([]);
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

                {/* Input Fields */}
                {mode === 'twoNumbers' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Number</span>
                      </label>
                      <input
                        type="number"
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
                        placeholder="Enter first number"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Second Number</span>
                      </label>
                      <input
                        type="number"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                        placeholder="Enter second number"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                )}

                {mode === 'multipleNumbers' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Numbers</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter numbers separated by commas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="text"
                      value={numbers}
                      onChange={(e) => setNumbers(e.target.value)}
                      placeholder="Enter numbers (e.g., 12, 18, 24)"
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                {mode === 'factorList' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number</span>
                    </label>
                    <input
                      type="number"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                      placeholder="Enter a number"
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'twoNumbers':
                        calculateTwoNumbers();
                        break;
                      case 'multipleNumbers':
                        calculateMultipleNumbers();
                        break;
                      case 'factorList':
                        showFactorList();
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

                  {/* Factors List */}
                  {Object.keys(factors).length > 0 && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Factors</h3>
                      <div className="space-y-2">
                        {Object.entries(factors).map(([num, factorList]) => (
                          <div key={num} className="font-mono break-words">
                            {num}: {factorList.join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common Factors */}
                  {commonFactors.length > 0 && mode !== 'factorList' && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Common Factors</h3>
                      <div className="font-mono break-words">
                        {commonFactors.join(', ')}
                      </div>
                    </div>
                  )}

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
            <h2 className="text-2xl font-semibold">Understanding GCF</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Largest factor of all numbers</li>
                  <li className="break-words">Always positive</li>
                  <li className="break-words">Related to LCM</li>
                  <li className="break-words">GCF(a,b) × LCM(a,b) = |a × b|</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Methods</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Listing factors</li>
                  <li className="break-words">Prime factorization</li>
                  <li className="break-words">Euclidean algorithm</li>
                  <li className="break-words">Division method</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Reducing fractions</li>
                  <li className="break-words">Factoring expressions</li>
                  <li className="break-words">Problem solving</li>
                  <li className="break-words">Cryptography</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
