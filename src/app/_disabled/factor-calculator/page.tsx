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
import ReactECharts from 'echarts-for-react';

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'allFactors',
    name: 'All Factors',
    description: 'Find all factors and pairs',
  },
  {
    id: 'primeFactors',
    name: 'Prime Factors',
    description: 'Prime factorization',
  },
  {
    id: 'factorTree',
    name: 'Factor Tree',
    description: 'Visual factor tree',
  },
];

const breadcrumbItems = [
  {
    label: 'Factor Calculator',
    href: '/factor-calculator',
  },
];

export default function FactorCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'allFactors' | 'primeFactors' | 'factorTree'>('allFactors');
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [factors, setFactors] = useState<number[]>([]);
  const [factorPairs, setFactorPairs] = useState<[number, number][]>([]);
  const [primeFactors, setPrimeFactors] = useState<number[]>([]);

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

  // Find factor pairs
  const findFactorPairs = (n: number): [number, number][] => {
    const pairs: [number, number][] = [];
    const absN = Math.abs(n);
    
    for (let i = 1; i <= Math.sqrt(absN); i++) {
      if (absN % i === 0) {
        pairs.push([i, absN / i]);
      }
    }
    
    return pairs;
  };

  // Find prime factors
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

  // Get factor tree visualization data
  const getFactorTreeData = (n: number): any => {
    const data: any[] = [];
    const links: any[] = [];
    let nodeId = 0;

    const addNode = (value: number, x: number, y: number): number => {
      const id = nodeId++;
      data.push({
        id,
        name: value.toString(),
        value: value,
        x,
        y,
        symbolSize: 40,
        itemStyle: {
          color: isPrime(value) ? '#0EA5E9' : '#60A5FA'
        }
      });
      return id;
    };

    const buildTree = (num: number, x: number, y: number, parentId: number | null = null) => {
      const currentId = addNode(num, x, y);
      
      if (parentId !== null) {
        links.push({
          source: parentId,
          target: currentId
        });
      }

      if (!isPrime(num)) {
        const factors = findSmallestFactor(num);
        buildTree(factors[0], x - 50 / (y + 1), y + 1, currentId);
        buildTree(factors[1], x + 50 / (y + 1), y + 1, currentId);
      }
    };

    buildTree(Math.abs(n), 0, 0);

    return {
      tooltip: {
        formatter: '{b}'
      },
      series: [{
        type: 'graph',
        layout: 'none',
        symbolSize: 40,
        roam: true,
        label: {
          show: true
        },
        data: data,
        links: links,
        lineStyle: {
          color: '#60A5FA',
          width: 2
        }
      }]
    };
  };

  // Check if number is prime
  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  };

  // Find smallest factor pair
  const findSmallestFactor = (n: number): [number, number] => {
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return [i, n / i];
    }
    return [1, n];
  };

  // Calculate all factors
  const calculateAllFactors = () => {
    try {
      if (!number) {
        throw new Error('Please enter a number');
      }

      const num = parseInt(number);

      if (!Number.isInteger(num)) {
        throw new Error('Please enter a valid integer');
      }

      if (num === 0) {
        throw new Error('Number cannot be zero');
      }

      const allFactors = findFactors(num);
      const pairs = findFactorPairs(num);

      const steps = [
        'Step 1: Find all factors',
        `Factors: ${allFactors.join(', ')}`,
        '',
        'Step 2: Count factors',
        `Total factors: ${allFactors.length}`,
        '',
        'Step 3: Factor pairs',
        ...pairs.map(([a, b]) => `${a} × ${b} = ${num}`),
        '',
        'Step 4: Properties',
        `Perfect square: ${Math.sqrt(Math.abs(num)) % 1 === 0 ? 'Yes' : 'No'}`,
        `Perfect number: ${allFactors.slice(0, -1).reduce((a, b) => a + b, 0) === Math.abs(num) ? 'Yes' : 'No'}`
      ];

      setFactors(allFactors);
      setFactorPairs(pairs);
      setResult(allFactors.join(', '));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setFactors([]);
      setFactorPairs([]);
    }
  };

  // Calculate prime factors
  const calculatePrimeFactors = () => {
    try {
      if (!number) {
        throw new Error('Please enter a number');
      }

      const num = parseInt(number);

      if (!Number.isInteger(num)) {
        throw new Error('Please enter a valid integer');
      }

      if (num === 0) {
        throw new Error('Number cannot be zero');
      }

      const primeFactors = findPrimeFactors(num);
      const factorization = formatPrimeFactorization(primeFactors);

      const steps = [
        'Step 1: Find prime factors',
        `Start with ${num}`,
        '',
        'Step 2: Divide by smallest prime factors',
        ...primeFactors.map((factor, index) => {
          const remaining = num / primeFactors.slice(0, index + 1).reduce((a, b) => a * b);
          return `${remaining * factor} ÷ ${factor} = ${remaining}`;
        }),
        '',
        'Step 3: Express as product of prime factors',
        `${num} = ${factorization}`,
        '',
        'Step 4: Check primality',
        `${num} is ${isPrime(Math.abs(num)) ? '' : 'not '}prime`
      ];

      setPrimeFactors(primeFactors);
      setResult(factorization);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setPrimeFactors([]);
    }
  };

  // Show factor tree
  const showFactorTree = () => {
    try {
      if (!number) {
        throw new Error('Please enter a number');
      }

      const num = parseInt(number);

      if (!Number.isInteger(num)) {
        throw new Error('Please enter a valid integer');
      }

      if (num === 0) {
        throw new Error('Number cannot be zero');
      }

      const primeFactors = findPrimeFactors(num);
      const factorization = formatPrimeFactorization(primeFactors);

      const steps = [
        'Step 1: Start with the number',
        `Number: ${num}`,
        '',
        'Step 2: Break into factor pairs',
        'See visual factor tree',
        '',
        'Step 3: Continue until all factors are prime',
        `Prime factorization: ${factorization}`
      ];

      setPrimeFactors(primeFactors);
      setResult(factorization);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setPrimeFactors([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Factor Calculator</h1>
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
                        setMode(calcMode.id as 'allFactors' | 'primeFactors' | 'factorTree');
                        setResult('');
                        setSteps([]);
                        setError('');
                        setFactors([]);
                        setFactorPairs([]);
                        setPrimeFactors([]);
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Number</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter an integer to factor</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter a number"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'allFactors':
                        calculateAllFactors();
                        break;
                      case 'primeFactors':
                        calculatePrimeFactors();
                        break;
                      case 'factorTree':
                        showFactorTree();
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

                  {/* Factor Pairs */}
                  {factorPairs.length > 0 && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Factor Pairs</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {factorPairs.map(([a, b], index) => (
                          <div key={index} className="font-mono">
                            {a} × {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Factor Tree Visualization */}
                  {mode === 'factorTree' && number && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Factor Tree</h3>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <ReactECharts
                          option={getFactorTreeData(parseInt(number))}
                          style={{ height: '400px' }}
                        />
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
                  Enter a number and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Factors</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Numbers that divide evenly</li>
                  <li className="break-words">Always include 1 and itself</li>
                  <li className="break-words">Can be positive or negative</li>
                  <li className="break-words">Factor pairs multiply to original</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Prime Factors</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Building blocks of integers</li>
                  <li className="break-words">Only divisible by 1 and itself</li>
                  <li className="break-words">Unique factorization</li>
                  <li className="break-words">Used in cryptography</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Simplifying fractions</li>
                  <li className="break-words">Finding GCF and LCM</li>
                  <li className="break-words">Number theory</li>
                  <li className="break-words">Problem solving</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
