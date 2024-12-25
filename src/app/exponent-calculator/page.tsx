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
    id: 'power',
    name: 'Power',
    description: 'Calculate a number raised to a power',
  },
  {
    id: 'root',
    name: 'Root',
    description: 'Calculate the nth root of a number',
  },
  {
    id: 'scientific',
    name: 'Scientific Notation',
    description: 'Convert between decimal and scientific notation',
  },
];

const breadcrumbItems = [
  {
    label: 'Exponent Calculator',
    href: '/exponent-calculator',
  },
];

export default function ExponentCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'power' | 'root' | 'scientific'>('power');
  const [base, setBase] = useState<string>('');
  const [exponent, setExponent] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [rootDegree, setRootDegree] = useState<string>('');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('4');
  
  // Results
  const [result, setResult] = useState<number | null>(null);
  const [scientificNotation, setScientificNotation] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Calculate power
  const calculatePower = () => {
    try {
      const baseNum = parseFloat(base);
      const exp = parseFloat(exponent);
      const decimals = parseInt(decimalPlaces);

      if (isNaN(baseNum) || isNaN(exp)) {
        throw new Error('Please enter valid numbers');
      }

      const result = Math.pow(baseNum, exp);
      const steps = [
        `Step 1: Identify the base and exponent`,
        `Base (b) = ${baseNum}`,
        `Exponent (n) = ${exp}`,
        '',
        `Step 2: Calculate b^n = ${baseNum}^${exp}`,
        `Result = ${result.toFixed(decimals)}`,
        '',
        `Step 3: Convert to scientific notation`,
        `${result.toExponential()}`
      ];

      setResult(result);
      setSteps(steps);
      setScientificNotation(result.toExponential());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
      setSteps([]);
    }
  };

  // Calculate root
  const calculateRoot = () => {
    try {
      const num = parseFloat(number);
      const degree = parseFloat(rootDegree);
      const decimals = parseInt(decimalPlaces);

      if (isNaN(num) || isNaN(degree)) {
        throw new Error('Please enter valid numbers');
      }

      if (degree === 0) {
        throw new Error('Root degree cannot be zero');
      }

      if (degree % 2 === 0 && num < 0) {
        throw new Error('Even root of negative number is not real');
      }

      const result = Math.pow(num, 1/degree);
      const steps = [
        `Step 1: Identify the number and root degree`,
        `Number (x) = ${num}`,
        `Root degree (n) = ${degree}`,
        '',
        `Step 2: Calculate the ${degree}th root of ${num}`,
        `∛x = x^(1/${degree})`,
        `Result = ${result.toFixed(decimals)}`,
        '',
        `Step 3: Convert to scientific notation`,
        `${result.toExponential()}`
      ];

      setResult(result);
      setSteps(steps);
      setScientificNotation(result.toExponential());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
      setSteps([]);
    }
  };

  // Convert to scientific notation
  const convertToScientific = () => {
    try {
      const num = parseFloat(number);
      const decimals = parseInt(decimalPlaces);

      if (isNaN(num)) {
        throw new Error('Please enter a valid number');
      }

      const scientific = num.toExponential();
      const [coefficient, exponent] = scientific.split('e');
      const steps = [
        `Step 1: Convert ${num} to scientific notation`,
        `Format: a × 10^n where 1 ≤ |a| < 10`,
        '',
        `Step 2: Identify components`,
        `Coefficient (a) = ${parseFloat(coefficient).toFixed(decimals)}`,
        `Exponent (n) = ${exponent}`,
        '',
        `Step 3: Final expression`,
        `${parseFloat(coefficient).toFixed(decimals)} × 10^${exponent}`
      ];

      setResult(num);
      setSteps(steps);
      setScientificNotation(scientific);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
      setSteps([]);
    }
  };

  // Get visualization chart options
  const getChartOptions = () => {
    if (!result) return {};

    let data: any[] = [];
    let title = '';

    switch (mode) {
      case 'power': {
        const baseNum = parseFloat(base);
        const exp = parseFloat(exponent);
        title = `Power: ${baseNum}^${exp}`;
        
        // Generate points for power function
        for (let i = 0; i <= exp; i++) {
          data.push([i, Math.pow(baseNum, i)]);
        }
        break;
      }
      case 'root': {
        const num = parseFloat(number);
        const degree = parseFloat(rootDegree);
        title = `${degree}th Root of ${num}`;
        
        // Generate points for root function
        const points = 50;
        const max = num * 1.5;
        for (let i = 0; i < points; i++) {
          const x = (i / points) * max;
          data.push([x, Math.pow(x, 1/degree)]);
        }
        break;
      }
      case 'scientific': {
        const num = parseFloat(number);
        title = 'Number Line';
        
        // Generate points for number line
        const magnitude = Math.floor(Math.log10(Math.abs(num)));
        const start = Math.pow(10, magnitude - 1);
        const end = Math.pow(10, magnitude + 1);
        
        for (let i = start; i <= end; i *= 10) {
          data.push([Math.log10(i), i]);
        }
        break;
      }
    }

    return {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const point = params[0];
          return `(${point.value[0].toFixed(2)}, ${point.value[1].toFixed(2)})`;
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: mode === 'scientific' ? 'log10(x)' : 'x'
      },
      yAxis: {
        type: 'value',
        name: 'y'
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#0EA5E9'
          },
          itemStyle: {
            color: '#0EA5E9'
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Exponent Calculator</h1>
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
                        setMode(calcMode.id as 'power' | 'root' | 'scientific');
                        setResult(null);
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

                {/* Input Fields */}
                {mode === 'power' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Base Number</span>
                      </label>
                      <input
                        type="number"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        placeholder="Enter base number"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Exponent</span>
                      </label>
                      <input
                        type="number"
                        value={exponent}
                        onChange={(e) => setExponent(e.target.value)}
                        placeholder="Enter exponent"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                )}

                {mode === 'root' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Number</span>
                      </label>
                      <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Enter number"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Root Degree</span>
                      </label>
                      <input
                        type="number"
                        value={rootDegree}
                        onChange={(e) => setRootDegree(e.target.value)}
                        placeholder="Enter root degree"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                )}

                {mode === 'scientific' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number</span>
                    </label>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Enter number"
                      className="input input-bordered w-full"
                    />
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
                          <p>Number of decimal places (0-15)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={decimalPlaces}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 15) {
                        setDecimalPlaces(e.target.value);
                      }
                    }}
                    min="0"
                    max="15"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'power':
                        calculatePower();
                        break;
                      case 'root':
                        calculateRoot();
                        break;
                      case 'scientific':
                        convertToScientific();
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
              {result !== null && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Result</h3>
                      <div className="text-2xl font-bold font-mono break-all overflow-hidden">
                        {result.toFixed(parseInt(decimalPlaces))}
                      </div>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Scientific Notation</h3>
                      <div className="text-2xl font-bold">
                        {scientificNotation}
                      </div>
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Visualization</h3>
                    <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
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

              {result === null && !error && (
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
            <h2 className="text-2xl font-semibold">Understanding Exponents</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Powers</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>b^n means multiply b by itself n times</li>
                  <li>Negative exponents: b^-n = 1/b^n</li>
                  <li>Zero exponent: b^0 = 1</li>
                  <li>Fractional exponents: b^(1/n) = nth root of b</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Roots</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>nth root is the inverse of nth power</li>
                  <li>Square root: n = 2</li>
                  <li>Cube root: n = 3</li>
                  <li>Even roots of negative numbers are not real</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Scientific Notation</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Format: a × 10^n</li>
                  <li className="break-words">1 ≤ |a|  10</li>
                  <li className="break-words">n is an integer</li>
                  <li className="break-words">Used for very large/small numbers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
