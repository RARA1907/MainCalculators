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
    description: 'Find LCM of two numbers',
  },
  {
    id: 'multipleNumbers',
    name: 'Multiple Numbers',
    description: 'Find LCM of multiple numbers',
  },
  {
    id: 'primeFactors',
    name: 'Prime Factors',
    description: 'Show prime factorization',
  },
];

const breadcrumbItems = [
  {
    label: 'LCM Calculator',
    href: '/lcm-calculator',
  },
];

export default function LCMCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'twoNumbers' | 'multipleNumbers' | 'primeFactors'>('twoNumbers');
  const [number1, setNumber1] = useState<string>('');
  const [number2, setNumber2] = useState<string>('');
  const [numbers, setNumbers] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [primeFactors, setPrimeFactors] = useState<{ [key: string]: string[] }>({});

  // Calculate GCD using Euclidean algorithm
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Calculate LCM using GCD
  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  // Find prime factors of a number
  const findPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let num = Math.abs(n);
    
    // Handle 2 separately
    while (num % 2 === 0) {
      factors.push(2);
      num = num / 2;
    }
    
    // Check odd numbers up to square root
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
      }
    }
    
    // If num is still greater than 2, it's prime
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

  // Calculate LCM of multiple numbers
  const calculateMultipleLCM = (numbers: number[]): number => {
    return numbers.reduce((acc, curr) => lcm(acc, curr));
  };

  // Calculate LCM of two numbers
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

      if (a === 0 || b === 0) {
        throw new Error('Numbers cannot be zero');
      }

      const gcdValue = gcd(Math.abs(a), Math.abs(b));
      const lcmValue = lcm(a, b);
      const factorsA = findPrimeFactors(a);
      const factorsB = findPrimeFactors(b);

      const steps = [
        `Step 1: Find prime factorizations`,
        `${a} = ${formatPrimeFactorization(factorsA)}`,
        `${b} = ${formatPrimeFactorization(factorsB)}`,
        '',
        `Step 2: Calculate GCD`,
        `GCD(${a}, ${b}) = ${gcdValue}`,
        '',
        `Step 3: Calculate LCM using formula`,
        `LCM = |a × b| ÷ GCD`,
        `LCM = |${a} × ${b}| ÷ ${gcdValue}`,
        `LCM = ${lcmValue}`
      ];

      setPrimeFactors({
        [a]: factorsA.map(String),
        [b]: factorsB.map(String)
      });
      setResult(lcmValue.toString());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setPrimeFactors({});
    }
  };

  // Calculate LCM of multiple numbers
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
        if (parsed === 0) {
          throw new Error('Numbers cannot be zero');
        }
        return parsed;
      });

      if (nums.length < 2) {
        throw new Error('Please enter at least two numbers');
      }

      const factors: { [key: string]: number[] } = {};
      nums.forEach(n => {
        factors[n] = findPrimeFactors(n);
      });

      const lcmValue = calculateMultipleLCM(nums);

      const steps = [
        'Step 1: Find prime factorizations',
        ...nums.map(n => `${n} = ${formatPrimeFactorization(factors[n])}`),
        '',
        'Step 2: Calculate LCM iteratively',
        ...nums.slice(1).map((_, index) => {
          const partial = calculateMultipleLCM(nums.slice(0, index + 2));
          return `LCM(${nums.slice(0, index + 2).join(', ')}) = ${partial}`;
        }),
        '',
        `Final LCM = ${lcmValue}`
      ];

      setPrimeFactors(Object.fromEntries(
        Object.entries(factors).map(([k, v]) => [k, v.map(String)])
      ));
      setResult(lcmValue.toString());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setPrimeFactors({});
    }
  };

  // Show prime factorization
  const showPrimeFactorization = () => {
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

      const factors = findPrimeFactors(num);
      const factorization = formatPrimeFactorization(factors);

      const steps = [
        'Step 1: Find prime factors',
        `Start with ${num}`,
        '',
        'Step 2: Divide by smallest prime factors',
        ...factors.map((factor, index) => {
          const remaining = num / factors.slice(0, index + 1).reduce((a, b) => a * b);
          return `${remaining * factor} ÷ ${factor} = ${remaining}`;
        }),
        '',
        'Step 3: Express as product of prime factors',
        `${num} = ${factorization}`
      ];

      setPrimeFactors({ [num]: factors.map(String) });
      setResult(factorization);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setPrimeFactors({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">LCM Calculator</h1>
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
                        setMode(calcMode.id as 'twoNumbers' | 'multipleNumbers' | 'primeFactors');
                        setResult('');
                        setSteps([]);
                        setError('');
                        setPrimeFactors({});
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

                {mode === 'primeFactors' && (
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
                      case 'primeFactors':
                        showPrimeFactorization();
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

                  {/* Prime Factorizations */}
                  {Object.keys(primeFactors).length > 0 && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Prime Factorizations</h3>
                      <div className="space-y-2">
                        {Object.entries(primeFactors).map(([num, factors]) => (
                          <div key={num} className="font-mono break-words">
                            {num} = {formatPrimeFactorization(factors.map(Number))}
                          </div>
                        ))}
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
            <h2 className="text-2xl font-semibold">Understanding LCM</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Smallest multiple of all numbers</li>
                  <li className="break-words">Must be positive</li>
                  <li className="break-words">Related to GCD</li>
                  <li className="break-words">LCM(a,b) × GCD(a,b) = |a × b|</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Methods</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Prime factorization</li>
                  <li className="break-words">GCD method</li>
                  <li className="break-words">Listing multiples</li>
                  <li className="break-words">Division method</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Fractions (common denominators)</li>
                  <li className="break-words">Scheduling problems</li>
                  <li className="break-words">Gear ratios</li>
                  <li className="break-words">Pattern repetition</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
