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

interface ErrorResult {
  absoluteError: number;
  percentError: number;
  relativeError: number;
  steps: string[];
}

const breadcrumbItems = [
  {
    label: 'Percent Error Calculator',
    href: '/percent-error-calculator',
  },
];

export default function PercentErrorCalculator() {
  // Input values
  const [experimentalValue, setExperimentalValue] = useState<string>('');
  const [theoreticalValue, setTheoreticalValue] = useState<string>('');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('2');

  // Results
  const [result, setResult] = useState<ErrorResult | null>(null);
  const [error, setError] = useState<string>('');

  // Calculate percent error
  const calculateError = () => {
    try {
      const experimental = parseFloat(experimentalValue);
      const theoretical = parseFloat(theoreticalValue);
      const decimals = parseInt(decimalPlaces);

      if (isNaN(experimental) || isNaN(theoretical)) {
        throw new Error('Please enter valid numbers');
      }

      if (theoretical === 0) {
        throw new Error('Theoretical value cannot be zero');
      }

      if (decimals < 0 || decimals > 10) {
        throw new Error('Decimal places must be between 0 and 10');
      }

      const absoluteError = Math.abs(experimental - theoretical);
      const percentError = (absoluteError / Math.abs(theoretical)) * 100;
      const relativeError = (experimental - theoretical) / theoretical;

      const steps = [
        'Step 1: Calculate Absolute Error',
        `|Experimental Value - Theoretical Value|`,
        `|${experimental} - ${theoretical}| = ${absoluteError.toFixed(decimals)}`,
        '',
        'Step 2: Calculate Percent Error',
        `(Absolute Error ÷ |Theoretical Value|) × 100`,
        `(${absoluteError.toFixed(decimals)} ÷ |${theoretical}|) × 100 = ${percentError.toFixed(decimals)}%`,
        '',
        'Step 3: Calculate Relative Error',
        `(Experimental Value - Theoretical Value) ÷ Theoretical Value`,
        `(${experimental} - ${theoretical}) ÷ ${theoretical} = ${relativeError.toFixed(decimals)}`,
      ];

      setResult({
        absoluteError,
        percentError,
        relativeError,
        steps,
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  // Get error visualization chart
  const getErrorChart = () => {
    if (!result) return {};

    const experimental = parseFloat(experimentalValue);
    const theoretical = parseFloat(theoreticalValue);
    const min = Math.min(experimental, theoretical);
    const max = Math.max(experimental, theoretical);
    const range = max - min;
    const padding = range * 0.2;

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 40,
        bottom: 40,
        left: 60,
        right: 20
      },
      xAxis: {
        type: 'value',
        min: min - padding,
        max: max + padding,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'category',
        data: ['Experimental', 'Theoretical'],
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [
        {
          name: 'Value',
          type: 'bar',
          data: [
            {
              value: experimental,
              itemStyle: { color: '#3B82F6' }
            },
            {
              value: theoretical,
              itemStyle: { color: '#10B981' }
            }
          ],
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          }
        }
      ]
    };
  };

  // Get error gauge chart
  const getErrorGauge = () => {
    if (!result) return {};

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.2, '#10B981'],  // 0-20%: Green
                [0.5, '#3B82F6'],  // 20-50%: Blue
                [0.8, '#FBBF24'],  // 50-80%: Yellow
                [1, '#EF4444']     // 80-100%: Red
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function(value: number) {
              return value + '%';
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function(value: number) {
              return value.toFixed(2) + '%';
            },
            color: 'auto'
          },
          data: [
            {
              value: result.percentError,
              name: 'Error'
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Percent Error Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Error</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Experimental Value</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The measured or observed value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={experimentalValue}
                    onChange={(e) => setExperimentalValue(e.target.value)}
                    placeholder="Enter experimental value"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Theoretical Value</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The accepted or true value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={theoreticalValue}
                    onChange={(e) => setTheoreticalValue(e.target.value)}
                    placeholder="Enter theoretical value"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Decimal Places</span>
                  </label>
                  <input
                    type="number"
                    value={decimalPlaces}
                    onChange={(e) => setDecimalPlaces(e.target.value)}
                    min="0"
                    max="10"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={calculateError}
                  className="btn btn-primary w-full"
                >
                  Calculate Error
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Absolute Error</h3>
                      <div className="text-2xl font-bold">
                        {result.absoluteError.toFixed(parseInt(decimalPlaces))}
                      </div>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Percent Error</h3>
                      <div className="text-2xl font-bold">
                        {result.percentError.toFixed(parseInt(decimalPlaces))}%
                      </div>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold mb-1">Relative Error</h3>
                      <div className="text-2xl font-bold">
                        {result.relativeError.toFixed(parseInt(decimalPlaces))}
                      </div>
                    </div>
                  </div>

                  {/* Value Comparison Chart */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Value Comparison</h3>
                    <ReactECharts option={getErrorChart()} style={{ height: '200px' }} />
                  </div>

                  {/* Error Gauge */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Percent Error Gauge</h3>
                    <ReactECharts option={getErrorGauge()} style={{ height: '300px' }} />
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {result.steps.map((step, index) => (
                        <div key={index} className="text-sm">
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
            <h2 className="text-2xl font-semibold">Understanding Error Calculations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Absolute Error</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>The magnitude of difference between values</li>
                  <li>|Experimental - Theoretical|</li>
                  <li>Always positive</li>
                  <li>Units same as original values</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Percent Error</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Error expressed as percentage</li>
                  <li>(Absolute Error ÷ |Theoretical|) × 100</li>
                  <li>Always positive</li>
                  <li>Useful for comparing different measurements</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Relative Error</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Signed error ratio</li>
                  <li>(Experimental - Theoretical) ÷ Theoretical</li>
                  <li>Can be positive or negative</li>
                  <li>Shows direction of error</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
