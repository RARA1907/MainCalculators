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
    id: 'findX',
    name: 'Find X',
    description: 'Solve for missing value in proportion',
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Scale numbers by ratio',
  },
  {
    id: 'simplify',
    name: 'Simplify',
    description: 'Simplify ratio to lowest terms',
  },
];

const breadcrumbItems = [
  {
    label: 'Ratio Calculator',
    href: '/ratio-calculator',
  },
];

export default function RatioCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'findX' | 'scale' | 'simplify'>('findX');
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [d, setD] = useState<string>('');
  const [scale, setScale] = useState<string>('');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('2');
  
  // Results
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Format number with proper decimal places
  const formatNumber = (num: number): string => {
    const places = parseInt(decimalPlaces);
    if (Math.abs(num) < 0.00001) return '0';
    return num.toFixed(places);
  };

  // Find GCD for simplifying ratios
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Simplify ratio
  const simplifyRatio = (num1: number, num2: number): [number, number] => {
    const divisor = gcd(Math.abs(num1), Math.abs(num2));
    return [num1 / divisor, num2 / divisor];
  };

  // Find missing value in proportion
  const findX = () => {
    try {
      if (!a || !b || !c) {
        throw new Error('Please fill in three values to find the fourth');
      }

      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const cNum = parseFloat(c);

      if (aNum === 0 || bNum === 0 || cNum === 0) {
        throw new Error('Values cannot be zero');
      }

      const result = (bNum * cNum) / aNum;
      const [simplifiedA, simplifiedB] = simplifyRatio(aNum, bNum);
      const [simplifiedC, simplifiedD] = simplifyRatio(cNum, result);

      const steps = [
        'Given proportion:',
        `${aNum} : ${bNum} = ${cNum} : x`,
        '',
        'Step 1: Simplify first ratio',
        `${aNum} : ${bNum} = ${simplifiedA} : ${simplifiedB}`,
        '',
        'Step 2: Use cross multiplication',
        `${aNum}x = ${bNum} × ${cNum}`,
        '',
        'Step 3: Solve for x',
        `x = (${bNum} × ${cNum}) ÷ ${aNum}`,
        `x = ${formatNumber(result)}`,
        '',
        'Step 4: Verify proportion',
        `${aNum} : ${bNum} = ${cNum} : ${formatNumber(result)}`
      ];

      setResult(formatNumber(result));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Scale numbers by ratio
  const scaleRatio = () => {
    try {
      if (!a || !b || !scale) {
        throw new Error('Please fill in the ratio and scale factor');
      }

      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const scaleNum = parseFloat(scale);

      if (aNum === 0 || bNum === 0) {
        throw new Error('Ratio values cannot be zero');
      }

      const scaledA = aNum * scaleNum;
      const scaledB = bNum * scaleNum;
      const [simplifiedA, simplifiedB] = simplifyRatio(scaledA, scaledB);

      const steps = [
        'Original ratio:',
        `${aNum} : ${bNum}`,
        '',
        'Step 1: Multiply both numbers by scale factor',
        `${aNum} × ${scaleNum} = ${formatNumber(scaledA)}`,
        `${bNum} × ${scaleNum} = ${formatNumber(scaledB)}`,
        '',
        'Step 2: New ratio',
        `${formatNumber(scaledA)} : ${formatNumber(scaledB)}`,
        '',
        'Step 3: Simplify new ratio',
        `${formatNumber(simplifiedA)} : ${formatNumber(simplifiedB)}`
      ];

      setResult(`${formatNumber(scaledA)} : ${formatNumber(scaledB)}`);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Simplify ratio
  const simplifyRatioCalc = () => {
    try {
      if (!a || !b) {
        throw new Error('Please fill in both numbers of the ratio');
      }

      const aNum = parseFloat(a);
      const bNum = parseFloat(b);

      if (aNum === 0 || bNum === 0) {
        throw new Error('Ratio values cannot be zero');
      }

      const [simplifiedA, simplifiedB] = simplifyRatio(aNum, bNum);
      const gcdValue = gcd(Math.abs(aNum), Math.abs(bNum));

      const steps = [
        'Original ratio:',
        `${aNum} : ${bNum}`,
        '',
        'Step 1: Find GCD (Greatest Common Divisor)',
        `GCD(${Math.abs(aNum)}, ${Math.abs(bNum)}) = ${gcdValue}`,
        '',
        'Step 2: Divide both numbers by GCD',
        `${aNum} ÷ ${gcdValue} = ${simplifiedA}`,
        `${bNum} ÷ ${gcdValue} = ${simplifiedB}`,
        '',
        'Step 3: Simplified ratio',
        `${simplifiedA} : ${simplifiedB}`
      ];

      setResult(`${simplifiedA} : ${simplifiedB}`);
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Ratio Calculator</h1>
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
                        setMode(calcMode.id as 'findX' | 'scale' | 'simplify');
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

                {/* Find X Mode */}
                {mode === 'findX' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Number (a)</span>
                        </label>
                        <input
                          type="number"
                          value={a}
                          onChange={(e) => setA(e.target.value)}
                          placeholder="Enter a"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Second Number (b)</span>
                        </label>
                        <input
                          type="number"
                          value={b}
                          onChange={(e) => setB(e.target.value)}
                          placeholder="Enter b"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Third Number (c)</span>
                        </label>
                        <input
                          type="number"
                          value={c}
                          onChange={(e) => setC(e.target.value)}
                          placeholder="Enter c"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Fourth Number (x)</span>
                        </label>
                        <input
                          type="text"
                          value="x"
                          disabled
                          className="input input-bordered w-full bg-base-200"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Scale Mode */}
                {mode === 'scale' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Number</span>
                        </label>
                        <input
                          type="number"
                          value={a}
                          onChange={(e) => setA(e.target.value)}
                          placeholder="Enter first number"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Second Number</span>
                        </label>
                        <input
                          type="number"
                          value={b}
                          onChange={(e) => setB(e.target.value)}
                          placeholder="Enter second number"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Scale Factor</span>
                      </label>
                      <input
                        type="number"
                        value={scale}
                        onChange={(e) => setScale(e.target.value)}
                        placeholder="Enter scale factor"
                        className="input input-bordered w-full"
                        step="any"
                      />
                    </div>
                  </div>
                )}

                {/* Simplify Mode */}
                {mode === 'simplify' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">First Number</span>
                        </label>
                        <input
                          type="number"
                          value={a}
                          onChange={(e) => setA(e.target.value)}
                          placeholder="Enter first number"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Second Number</span>
                        </label>
                        <input
                          type="number"
                          value={b}
                          onChange={(e) => setB(e.target.value)}
                          placeholder="Enter second number"
                          className="input input-bordered w-full"
                          step="any"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Decimal Places</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of decimal places (0-6)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={decimalPlaces}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 6) {
                        setDecimalPlaces(e.target.value);
                      }
                    }}
                    min="0"
                    max="6"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'findX':
                        findX();
                        break;
                      case 'scale':
                        scaleRatio();
                        break;
                      case 'simplify':
                        simplifyRatioCalc();
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
            <h2 className="text-2xl font-semibold">Understanding Ratios</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Ratio compares two quantities</li>
                  <li className="break-words">Written as a:b or a/b</li>
                  <li className="break-words">Order matters (a:b ≠ b:a)</li>
                  <li className="break-words">Both numbers must be non-zero</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Proportions</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Two equal ratios (a:b = c:d)</li>
                  <li className="break-words">Cross multiply: ad = bc</li>
                  <li className="break-words">Used to find missing values</li>
                  <li className="break-words">Scale drawings and maps</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Recipe scaling</li>
                  <li className="break-words">Map scales</li>
                  <li className="break-words">Financial ratios</li>
                  <li className="break-words">Probability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
