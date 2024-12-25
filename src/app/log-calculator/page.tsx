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
    id: 'evaluate',
    name: 'Evaluate',
    description: 'Calculate logarithm value',
  },
  {
    id: 'solve',
    name: 'Solve',
    description: 'Find x in log equation',
  },
  {
    id: 'convert',
    name: 'Convert',
    description: 'Convert between log bases',
  },
];

const breadcrumbItems = [
  {
    label: 'Log Calculator',
    href: '/log-calculator',
  },
];

export default function LogCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'evaluate' | 'solve' | 'convert'>('evaluate');
  const [base, setBase] = useState<string>('10');
  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [fromBase, setFromBase] = useState<string>('10');
  const [toBase, setToBase] = useState<string>('e');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('4');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Format number with proper decimal places
  const formatNumber = (num: number): string => {
    const places = parseInt(decimalPlaces);
    if (Math.abs(num) < 0.00001) return '0';
    return num.toFixed(places);
  };

  // Get chart options for visualization
  const getChartOptions = () => {
    if (!number || !base || (mode === 'convert' && (!fromBase || !toBase))) return {};

    let data: [number, number][] = [];
    let title = '';
    let baseNum = parseFloat(base);

    if (mode === 'evaluate' || mode === 'solve') {
      if (base === 'e') baseNum = Math.E;
      
      // Generate points for log function
      const num = parseFloat(number);
      const points = 100;
      const xMin = num > 0 ? num * 0.1 : 0.1;
      const xMax = num > 0 ? num * 2 : 10;
      
      for (let i = 0; i < points; i++) {
        const x = xMin + (i / points) * (xMax - xMin);
        const y = Math.log(x) / Math.log(baseNum);
        data.push([x, y]);
      }

      title = `f(x) = log${base}(x)`;
    } else if (mode === 'convert') {
      // Generate comparison of logs with different bases
      const fromBaseNum = fromBase === 'e' ? Math.E : parseFloat(fromBase);
      const toBaseNum = toBase === 'e' ? Math.E : parseFloat(toBase);
      
      for (let i = 0; i < 100; i++) {
        const x = 0.1 + i * 0.1;
        const y1 = Math.log(x) / Math.log(fromBaseNum);
        const y2 = Math.log(x) / Math.log(toBaseNum);
        data.push([x, y1]);
      }

      title = `Comparison of log bases ${fromBase} and ${toBase}`;
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

  // Evaluate logarithm
  const evaluateLog = () => {
    try {
      if (!number || !base) {
        throw new Error('Please fill in all fields');
      }

      const num = parseFloat(number);
      const baseNum = base === 'e' ? Math.E : parseFloat(base);

      if (num <= 0) {
        throw new Error('Number must be positive');
      }

      if (baseNum <= 0 || baseNum === 1) {
        throw new Error('Base must be positive and not equal to 1');
      }

      const result = Math.log(num) / Math.log(baseNum);

      const steps = [
        `Step 1: Using the formula log${base}(${num})`,
        base === 'e' 
          ? `Step 2: Calculate ln(${num}) = ${formatNumber(Math.log(num))}`
          : `Step 2: Using change of base formula:`,
        base !== 'e' && `log${base}(${num}) = ln(${num}) / ln(${base})`,
        base !== 'e' && `= ${formatNumber(Math.log(num))} / ${formatNumber(Math.log(baseNum))}`,
        `Result: ${formatNumber(result)}`
      ].filter(Boolean);

      setResult(formatNumber(result));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Solve for x
  const solveForX = () => {
    try {
      if (!number || !base) {
        throw new Error('Please fill in all fields');
      }

      const resultNum = parseFloat(number);
      const baseNum = base === 'e' ? Math.E : parseFloat(base);

      if (baseNum <= 0 || baseNum === 1) {
        throw new Error('Base must be positive and not equal to 1');
      }

      const result = Math.pow(baseNum, resultNum);

      const steps = [
        `Step 1: Given equation log${base}(x) = ${resultNum}`,
        `Step 2: Apply exponential function with base ${base} to both sides`,
        `${base}^(log${base}(x)) = ${base}^${resultNum}`,
        `Step 3: Simplify left side (inverse property of logs)`,
        `x = ${base}^${resultNum}`,
        `Result: x = ${formatNumber(result)}`
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

  // Convert between bases
  const convertBase = () => {
    try {
      if (!number || !fromBase || !toBase) {
        throw new Error('Please fill in all fields');
      }

      const num = parseFloat(number);
      const fromBaseNum = fromBase === 'e' ? Math.E : parseFloat(fromBase);
      const toBaseNum = toBase === 'e' ? Math.E : parseFloat(toBase);

      if (num <= 0) {
        throw new Error('Number must be positive');
      }

      if (fromBaseNum <= 0 || fromBaseNum === 1 || toBaseNum <= 0 || toBaseNum === 1) {
        throw new Error('Bases must be positive and not equal to 1');
      }

      const result = Math.log(num) / Math.log(toBaseNum);

      const steps = [
        `Step 1: Convert log${fromBase}(${num}) to log${toBase}(${num})`,
        'Step 2: Using change of base formula:',
        `log${toBase}(${num}) = ln(${num}) / ln(${toBase})`,
        `= ${formatNumber(Math.log(num))} / ${formatNumber(Math.log(toBaseNum))}`,
        `Result: ${formatNumber(result)}`
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Log Calculator</h1>
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
                        setMode(calcMode.id as 'evaluate' | 'solve' | 'convert');
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

                {/* Input Fields */}
                <div className="space-y-4">
                  {mode !== 'convert' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Base</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter base (e for natural log)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="text"
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        placeholder="Enter base (e for natural log)"
                        className="input input-bordered w-full"
                      />
                    </div>
                  )}

                  {mode === 'convert' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">From Base</span>
                        </label>
                        <input
                          type="text"
                          value={fromBase}
                          onChange={(e) => setFromBase(e.target.value)}
                          placeholder="Enter from base"
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">To Base</span>
                        </label>
                        <input
                          type="text"
                          value={toBase}
                          onChange={(e) => setToBase(e.target.value)}
                          placeholder="Enter to base"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {mode === 'evaluate' ? 'Number' : mode === 'solve' ? 'Result' : 'Number'}
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
                      case 'evaluate':
                        evaluateLog();
                        break;
                      case 'solve':
                        solveForX();
                        break;
                      case 'convert':
                        convertBase();
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

                  {/* Visualization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Graph</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
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
            <h2 className="text-2xl font-semibold">Understanding Logarithms</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">log_b(x) = y means b^y = x</li>
                  <li className="break-words">ln(x) is natural log (base e)</li>
                  <li className="break-words">log(x) is common log (base 10)</li>
                  <li className="break-words">Domain: x  0, base  0, base ≠ 1</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Log Properties</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">log(xy) = log(x) + log(y)</li>
                  <li className="break-words">log(x/y) = log(x) - log(y)</li>
                  <li className="break-words">log(x^n) = n·log(x)</li>
                  <li className="break-words">log_b(x) = ln(x)/ln(b)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">pH calculations</li>
                  <li className="break-words">Earthquake magnitude</li>
                  <li className="break-words">Sound intensity</li>
                  <li className="break-words">Compound interest</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
