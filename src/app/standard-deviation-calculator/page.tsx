'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface StdDevResult {
  standardDeviation: number;
  mean: number;
  variance: number;
  sum: number;
  count: number;
  min: number;
  max: number;
  range: number;
  steps: string[];
  dataPoints: number[];
}

const breadcrumbItems = [
  {
    label: 'Standard Deviation Calculator',
    href: '/standard-deviation-calculator',
  },
];

export default function StandardDeviationCalculator() {
  const [numbers, setNumbers] = useState<string>('');
  const [type, setType] = useState<'population' | 'sample'>('population');
  const [result, setResult] = useState<StdDevResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateMean = (nums: number[]): number => {
    return nums.reduce((acc, val) => acc + val, 0) / nums.length;
  };

  const calculateStandardDeviation = (nums: number[], type: 'population' | 'sample'): StdDevResult => {
    const mean = calculateMean(nums);
    const squaredDifferences = nums.map(num => Math.pow(num - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
    
    // For population standard deviation, divide by n
    // For sample standard deviation, divide by (n-1)
    const divisor = type === 'population' ? nums.length : nums.length - 1;
    const variance = sumSquaredDiff / divisor;
    const standardDeviation = Math.sqrt(variance);
    
    const steps = [
      'Step 1: Calculate the Mean',
      `Mean = (${nums.join(' + ')}) ÷ ${nums.length} = ${mean.toFixed(4)}`,
      '',
      'Step 2: Calculate Squared Differences from Mean',
      nums.map(num => `(${num} - ${mean.toFixed(4)})² = ${Math.pow(num - mean, 2).toFixed(4)}`).join('\n'),
      '',
      'Step 3: Calculate Average of Squared Differences',
      `Sum of squared differences = ${sumSquaredDiff.toFixed(4)}`,
      `Divide by ${type === 'population' ? 'n' : '(n-1)'} = ${divisor}`,
      `Variance = ${variance.toFixed(4)}`,
      '',
      'Step 4: Take the Square Root',
      `Standard Deviation = √${variance.toFixed(4)} = ${standardDeviation.toFixed(4)}`
    ];

    return {
      standardDeviation,
      mean,
      variance,
      sum: nums.reduce((a, b) => a + b, 0),
      count: nums.length,
      min: Math.min(...nums),
      max: Math.max(...nums),
      range: Math.max(...nums) - Math.min(...nums),
      steps,
      dataPoints: nums
    };
  };

  const handleCalculate = () => {
    try {
      setError('');
      // Convert input string to array of numbers
      const numberArray = numbers
        .split(/[,\s]+/)
        .map(num => num.trim())
        .filter(num => num !== '')
        .map(num => {
          const parsed = parseFloat(num);
          if (isNaN(parsed)) {
            throw new Error('Invalid number in input');
          }
          return parsed;
        });

      if (numberArray.length < 2) {
        throw new Error('Please enter at least two numbers');
      }

      if (type === 'sample' && numberArray.length < 2) {
        throw new Error('Sample standard deviation requires at least two numbers');
      }

      const result = calculateStandardDeviation(numberArray, type);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const getDistributionChart = () => {
    if (!result) return {};

    const data = result.dataPoints;
    const mean = result.mean;
    const stdDev = result.standardDeviation;

    // Create bins for histogram
    const binCount = Math.min(10, Math.ceil(Math.sqrt(data.length)));
    const binSize = (result.max - result.min) / binCount;
    const bins = Array(binCount).fill(0);
    
    data.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - result.min) / binSize),
        binCount - 1
      );
      bins[binIndex]++;
    });

    // Generate normal distribution curve points
    const curvePoints = [];
    const step = (result.max - result.min) / 50;
    for (let x = result.min; x <= result.max; x += step) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
      curvePoints.push([x, y * data.length * binSize]);
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['Frequency', 'Normal Distribution']
      },
      xAxis: {
        type: 'value',
        name: 'Value'
      },
      yAxis: {
        type: 'value',
        name: 'Frequency'
      },
      series: [
        {
          name: 'Frequency',
          type: 'bar',
          barWidth: '99%',
          data: bins.map((value, index) => ({
            value,
            x: result.min + (index + 0.5) * binSize
          })),
          itemStyle: { color: '#3B82F6' }
        },
        {
          name: 'Normal Distribution',
          type: 'line',
          smooth: true,
          data: curvePoints,
          itemStyle: { color: '#10B981' }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Standard Deviation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Standard Deviation</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Enter Numbers (separated by commas or spaces)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter your dataset. You can paste directly from spreadsheets</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="e.g., 1, 2, 3, 4, 5"
                    className="w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type of Standard Deviation</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Population (σ): Use when you have all possible data</p>
                          <p>Sample (s): Use when you have only a subset of data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={type}
                    onValueChange={(value: 'population' | 'sample') => setType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="population">Population Standard Deviation (σ)</SelectItem>
                      <SelectItem value="sample">Sample Standard Deviation (s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate Standard Deviation
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
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Standard Deviation
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.standardDeviation.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Mean
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.mean.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Variance
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.variance.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Range
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.range.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Distribution Chart */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Data Distribution</h3>
                    <ReactECharts option={getDistributionChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      {result.steps.map((step, index) => (
                        <div key={index} className="text-sm whitespace-pre-wrap">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
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
            <h2 className="text-2xl font-semibold">Understanding Standard Deviation</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">What is Standard Deviation?</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Measures spread of data from mean</li>
                  <li>Lower values = data close to mean</li>
                  <li>Higher values = data more spread out</li>
                  <li>Uses same units as original data</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">When to Use Each Type</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Population (σ): Complete dataset</li>
                  <li>Sample (s): Subset of population</li>
                  <li>Sample uses n-1 (Bessel's correction)</li>
                  <li>Most real-world data uses sample</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Interpreting Results</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>±1σ contains ~68% of data</li>
                  <li>±2σ contains ~95% of data</li>
                  <li>±3σ contains ~99.7% of data</li>
                  <li>Compare to mean for context</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
