'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

interface StatisticsResult {
  mean: number;
  median: number;
  mode: number[];
  range: number;
  sortedData: number[];
  steps: {
    mean: string[];
    median: string[];
    mode: string[];
    range: string[];
  };
}

const breadcrumbItems = [
  {
    label: 'Mean, Median, Mode, Range Calculator',
    href: '/mean-median-mode-range-calculator',
  },
];

export default function MMRCalculator() {
  const [numbers, setNumbers] = useState<string>('');
  const [result, setResult] = useState<StatisticsResult | null>(null);
  const [error, setError] = useState<string>('');

  const parseNumbers = (input: string): number[] => {
    return input
      .split(/[,\s]+/)
      .map(num => num.trim())
      .filter(num => num !== '')
      .map(num => {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) {
          throw new Error(`Invalid number: ${num}`);
        }
        return parsed;
      });
  };

  const calculateMean = (numbers: number[]): { value: number; steps: string[] } => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / numbers.length;

    return {
      value: mean,
      steps: [
        'Step 1: Add all numbers',
        `Sum = ${numbers.join(' + ')} = ${sum}`,
        '',
        'Step 2: Divide by count of numbers',
        `Mean = ${sum} ÷ ${numbers.length} = ${mean.toFixed(4)}`
      ]
    };
  };

  const calculateMedian = (numbers: number[]): { value: number; steps: string[] } => {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    let median: number;
    let steps: string[] = [
      'Step 1: Sort numbers in ascending order',
      `Sorted = ${sorted.join(', ')}`,
      ''
    ];

    if (sorted.length % 2 === 0) {
      median = (sorted[middle - 1] + sorted[middle]) / 2;
      steps.push(
        'Step 2: With even count, take average of middle two numbers',
        `Middle positions: ${middle - 1} and ${middle}`,
        `Median = (${sorted[middle - 1]} + ${sorted[middle]}) ÷ 2 = ${median}`
      );
    } else {
      median = sorted[middle];
      steps.push(
        'Step 2: With odd count, take middle number',
        `Middle position: ${middle}`,
        `Median = ${median}`
      );
    }

    return { value: median, steps };
  };

  const calculateMode = (numbers: number[]): { value: number[]; steps: string[] } => {
    const frequency: { [key: number]: number } = {};
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });

    let maxFrequency = 0;
    let modes: number[] = [];

    Object.entries(frequency).forEach(([num, freq]) => {
      if (freq > maxFrequency) {
        maxFrequency = freq;
        modes = [parseFloat(num)];
      } else if (freq === maxFrequency) {
        modes.push(parseFloat(num));
      }
    });

    const steps = [
      'Step 1: Count frequency of each number',
      ...Object.entries(frequency).map(([num, freq]) => `${num}: ${freq} time(s)`),
      '',
      'Step 2: Find number(s) with highest frequency',
      `Highest frequency: ${maxFrequency}`,
      `Mode(s): ${modes.join(', ')}`
    ];

    return { value: modes, steps };
  };

  const calculateRange = (numbers: number[]): { value: number; steps: string[] } => {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;

    return {
      value: range,
      steps: [
        'Step 1: Find minimum and maximum values',
        `Minimum = ${min}`,
        `Maximum = ${max}`,
        '',
        'Step 2: Subtract minimum from maximum',
        `Range = ${max} - ${min} = ${range}`
      ]
    };
  };

  const getHistogramOption = (data: number[]) => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const binCount = Math.min(Math.ceil(Math.sqrt(data.length)), 10);
    const binSize = (maxValue - minValue) / binCount;
    
    const bins = Array(binCount).fill(0);
    data.forEach(value => {
      const binIndex = Math.min(Math.floor((value - minValue) / binSize), binCount - 1);
      bins[binIndex]++;
    });

    const binLabels = Array(binCount).fill(0).map((_, i) => {
      const start = (minValue + i * binSize).toFixed(2);
      const end = (minValue + (i + 1) * binSize).toFixed(2);
      return `${start}-${end}`;
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: binLabels,
        name: 'Value Ranges',
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Frequency'
      },
      series: [{
        data: bins,
        type: 'bar',
        barWidth: '90%',
        itemStyle: {
          color: '#3B82F6'
        }
      }]
    };
  };

  const getBoxPlotOption = (data: number[]) => {
    const sortedData = [...data].sort((a, b) => a - b);
    const q1Index = Math.floor(sortedData.length * 0.25);
    const q3Index = Math.floor(sortedData.length * 0.75);
    const q1 = sortedData[q1Index];
    const q3 = sortedData[q3Index];
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(...sortedData.filter(v => v >= q1 - 1.5 * iqr));
    const upperWhisker = Math.min(...sortedData.filter(v => v <= q3 + 1.5 * iqr));

    return {
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          if (params.componentSubType === 'boxplot') {
            return `Min: ${params.data[1]}<br/>
                    Q1: ${params.data[2]}<br/>
                    Median: ${params.data[3]}<br/>
                    Q3: ${params.data[4]}<br/>
                    Max: ${params.data[5]}`;
          }
          return `Outlier: ${params.data[1]}`;
        }
      },
      xAxis: {
        type: 'category',
        data: ['Data Distribution']
      },
      yAxis: {
        type: 'value',
        name: 'Values'
      },
      series: [{
        name: 'boxplot',
        type: 'boxplot',
        data: [[
          lowerWhisker,
          q1,
          result?.median || 0,
          q3,
          upperWhisker
        ]],
        itemStyle: {
          color: '#3B82F6',
          borderColor: '#2563EB'
        }
      }]
    };
  };

  const calculate = () => {
    try {
      setError('');
      const numberArray = parseNumbers(numbers);
      
      if (numberArray.length === 0) {
        throw new Error('Please enter at least one number');
      }

      const meanResult = calculateMean(numberArray);
      const medianResult = calculateMedian(numberArray);
      const modeResult = calculateMode(numberArray);
      const rangeResult = calculateRange(numberArray);

      setResult({
        mean: meanResult.value,
        median: medianResult.value,
        mode: modeResult.value,
        range: rangeResult.value,
        sortedData: [...numberArray].sort((a, b) => a - b),
        steps: {
          mean: meanResult.steps,
          median: medianResult.steps,
          mode: modeResult.steps,
          range: rangeResult.steps
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Mean, Median, Mode, Range Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Numbers</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Numbers</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter numbers separated by commas or spaces</p>
                          <p>Example: 1, 2, 3, 4, 5</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter numbers (e.g., 1, 2, 3, 4, 5)"
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={calculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
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
              {result ? (
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Mean
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.mean.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Median
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.median.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Mode
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.mode.length > 0 ? result.mode.join(', ') : 'No mode'}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Range
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.range.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Data Distribution */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Data Distribution</h3>
                    <ReactECharts 
                      option={getHistogramOption(result.sortedData)} 
                      style={{ height: '300px' }} 
                    />
                  </div>

                  {/* Box Plot */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Box Plot</h3>
                    <ReactECharts 
                      option={getBoxPlotOption(result.sortedData)} 
                      style={{ height: '300px' }} 
                    />
                  </div>

                  {/* Step by Step Solutions */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mean Calculation</h3>
                      <div className="bg-gray-50 ">
                        {result.steps.mean.map((step, index) => (
                          <div key={index} className="text-sm whitespace-pre-wrap">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Median Calculation</h3>
                      <div className="bg-gray-50 ">
                        {result.steps.median.map((step, index) => (
                          <div key={index} className="text-sm whitespace-pre-wrap">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Mode Calculation</h3>
                      <div className="bg-gray-50 ">
                        {result.steps.mode.map((step, index) => (
                          <div key={index} className="text-sm whitespace-pre-wrap">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Range Calculation</h3>
                      <div className="bg-gray-50 ">
                        {result.steps.range.map((step, index) => (
                          <div key={index} className="text-sm whitespace-pre-wrap">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Enter numbers and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Statistical Measures</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Mean</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Average of all numbers</li>
                  <li>Sum divided by count</li>
                  <li>Affected by outliers</li>
                  <li>Used for balanced data</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Median</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Middle value when sorted</li>
                  <li>Not affected by outliers</li>
                  <li>Good for skewed data</li>
                  <li>Splits data in half</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Mode</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Most frequent value(s)</li>
                  <li>Can have multiple modes</li>
                  <li>Good for categorical data</li>
                  <li>Shows data clusters</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Range</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Spread of data</li>
                  <li>Maximum - minimum</li>
                  <li>Affected by outliers</li>
                  <li>Simple dispersion measure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
