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
    id: 'nthRoot',
    name: 'nth Root',
    description: 'Calculate nth root of a number',
  },
  {
    id: 'solve',
    name: 'Solve',
    description: 'Find x in root equation',
  },
  {
    id: 'complex',
    name: 'Complex',
    description: 'Complex number roots',
  },
];

const breadcrumbItems = [
  {
    label: 'Root Calculator',
    href: '/root-calculator',
  },
];

export default function RootCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'nthRoot' | 'solve' | 'complex'>('nthRoot');
  const [number, setNumber] = useState<string>('');
  const [rootDegree, setRootDegree] = useState<string>('2');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('4');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [complexResults, setComplexResults] = useState<string[]>([]);

  // Format number with proper decimal places
  const formatNumber = (num: number): string => {
    const places = parseInt(decimalPlaces);
    if (Math.abs(num) < 0.00001) return '0';
    return num.toFixed(places);
  };

  // Format complex number
  const formatComplex = (real: number, imag: number): string => {
    const realPart = formatNumber(real);
    const imagPart = formatNumber(Math.abs(imag));
    if (imag === 0) return realPart;
    if (real === 0) return `${imagPart}i`;
    return `${realPart} ${imag > 0 ? '+' : '-'} ${imagPart}i`;
  };

  // Get chart options for visualization
  const getChartOptions = () => {
    if (!number || !rootDegree) return {};

    let data: [number, number][] = [];
    let title = '';
    const n = parseFloat(rootDegree);
    const x = parseFloat(number);

    if (mode === 'nthRoot' || mode === 'solve') {
      // Generate points for root function
      const points = 100;
      const xMin = x > 0 ? x * 0.1 : -10;
      const xMax = x > 0 ? x * 2 : 10;
      
      for (let i = 0; i < points; i++) {
        const xVal = xMin + (i / points) * (xMax - xMin);
        const yVal = Math.pow(Math.abs(xVal), 1/n) * (xVal < 0 ? -1 : 1);
        if (!isNaN(yVal)) {
          data.push([xVal, yVal]);
        }
      }

      title = `f(x) = ${n}√x`;
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
          return `(${formatNumber(point.value[0])}, ${formatNumber(point.value[1])})`;
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
        name: 'x'
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
    };
  };

  // Calculate nth root
  const calculateNthRoot = () => {
    try {
      if (!number || !rootDegree) {
        throw new Error('Please fill in all fields');
      }

      const x = parseFloat(number);
      const n = parseFloat(rootDegree);

      if (n === 0) {
        throw new Error('Root degree cannot be zero');
      }

      if (!Number.isInteger(n)) {
        throw new Error('Root degree must be an integer');
      }

      // Handle negative numbers
      if (x < 0 && n % 2 === 0) {
        throw new Error('Even root of negative number results in complex number');
      }

      const result = Math.pow(Math.abs(x), 1/n) * (x < 0 ? -1 : 1);

      const steps = [
        `Step 1: Calculate ${n}√${x}`,
        `Step 2: Using the formula: x^(1/${n})`,
        x < 0 ? `Step 3: Handle negative number: -(|${x}|^(1/${n}))` : `Step 3: ${x}^(1/${n})`,
        `Result: ${formatNumber(result)}`
      ];

      setResult(formatNumber(result));
      setSteps(steps);
      setError('');
      setComplexResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setComplexResults([]);
    }
  };

  // Solve for x
  const solveForX = () => {
    try {
      if (!number || !rootDegree) {
        throw new Error('Please fill in all fields');
      }

      const result = parseFloat(number);
      const n = parseFloat(rootDegree);

      if (n === 0) {
        throw new Error('Root degree cannot be zero');
      }

      if (!Number.isInteger(n)) {
        throw new Error('Root degree must be an integer');
      }

      const x = Math.pow(result, n);

      const steps = [
        `Step 1: Given equation ${n}√x = ${result}`,
        `Step 2: Raise both sides to power ${n}`,
        `(${n}√x)^${n} = ${result}^${n}`,
        `Step 3: Simplify left side`,
        `x = ${result}^${n}`,
        `Result: x = ${formatNumber(x)}`
      ];

      setResult(formatNumber(x));
      setSteps(steps);
      setError('');
      setComplexResults([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setComplexResults([]);
    }
  };

  // Calculate complex roots
  const calculateComplexRoots = () => {
    try {
      if (!number || !rootDegree) {
        throw new Error('Please fill in all fields');
      }

      const x = parseFloat(number);
      const n = parseFloat(rootDegree);

      if (n === 0) {
        throw new Error('Root degree cannot be zero');
      }

      if (!Number.isInteger(n)) {
        throw new Error('Root degree must be an integer');
      }

      if (n < 1) {
        throw new Error('Root degree must be positive');
      }

      // Calculate magnitude and argument
      const r = Math.pow(Math.abs(x), 1/n);
      const theta = Math.atan2(0, x < 0 ? -1 : 1);
      
      // Calculate all complex roots
      const roots: string[] = [];
      const steps: string[] = [
        `Step 1: Express ${x} in polar form`,
        `r = |${x}|^(1/${n}) = ${formatNumber(r)}`,
        `θ = ${formatNumber(theta)} radians`,
        '',
        'Step 2: Calculate all roots using formula:',
        `x_k = r * (cos((θ + 2πk)/${n}) + i*sin((θ + 2πk)/${n}))`,
        'where k = 0, 1, ..., n-1',
        ''
      ];

      for (let k = 0; k < n; k++) {
        const angle = (theta + 2 * Math.PI * k) / n;
        const real = r * Math.cos(angle);
        const imag = r * Math.sin(angle);
        roots.push(formatComplex(real, imag));
        steps.push(`Root ${k + 1}: ${formatComplex(real, imag)}`);
      }

      setComplexResults(roots);
      setSteps(steps);
      setError('');
      setResult('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
      setComplexResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Root Calculator</h1>
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
                        setMode(calcMode.id as 'nthRoot' | 'solve' | 'complex');
                        setResult('');
                        setSteps([]);
                        setError('');
                        setComplexResults([]);
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
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Root Degree (n)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Integer value for the root degree</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={rootDegree}
                      onChange={(e) => setRootDegree(e.target.value)}
                      placeholder="Enter root degree"
                      className="input input-bordered w-full"
                      step="1"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {mode === 'solve' ? 'Result' : 'Number'}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder={`Enter ${mode === 'solve' ? 'result' : 'number'}`}
                      className="input input-bordered w-full"
                      step="any"
                    />
                  </div>

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
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'nthRoot':
                        calculateNthRoot();
                        break;
                      case 'solve':
                        solveForX();
                        break;
                      case 'complex':
                        calculateComplexRoots();
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
              {(result || complexResults.length > 0) && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  {result && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Result</h3>
                      <div className="text-2xl font-bold font-mono break-all overflow-hidden">
                        {result}
                      </div>
                    </div>
                  )}

                  {/* Complex Results */}
                  {complexResults.length > 0 && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-2">Complex Roots</h3>
                      <div className="space-y-2">
                        {complexResults.map((root, index) => (
                          <div key={index} className="font-mono break-all">
                            Root {index + 1}: {root}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visualization */}
                  {mode !== 'complex' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Graph</h3>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
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

              {!result && complexResults.length === 0 && !error && (
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
            <h2 className="text-2xl font-semibold">Understanding Roots</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">n√x means x^(1/n)</li>
                  <li className="break-words">Square root: n = 2</li>
                  <li className="break-words">Cube root: n = 3</li>
                  <li className="break-words">Even roots: only positive numbers</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Complex Roots</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">n roots for degree n</li>
                  <li className="break-words">Uses polar form</li>
                  <li className="break-words">Evenly spaced on circle</li>
                  <li className="break-words">One real root for odd n</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Geometry (areas, volumes)</li>
                  <li className="break-words">Physics (wave equations)</li>
                  <li className="break-words">Engineering (structural design)</li>
                  <li className="break-words">Computer graphics (3D modeling)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
