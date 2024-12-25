'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'basic',
    name: 'Basic Statistics',
    description: 'Mean, median, mode, range, sum',
  },
  {
    id: 'advanced',
    name: 'Advanced Statistics',
    description: 'Standard deviation, variance, quartiles',
  },
  {
    id: 'frequency',
    name: 'Frequency Analysis',
    description: 'Distribution and percentages',
  },
  {
    id: 'correlation',
    name: 'Correlation Analysis',
    description: 'Pearson correlation, covariance',
  },
  {
    id: 'descriptive',
    name: 'Descriptive Stats',
    description: 'Skewness, kurtosis, percentiles',
  },
  {
    id: 'summary',
    name: 'Summary Statistics',
    description: 'Comprehensive statistical overview',
  }
];

interface StatisticalResult {
  label: string;
  value: string | number;
}

const breadcrumbItems = [
  {
    label: 'Statistics Calculator',
    href: '/statistics-calculator',
  },
];

export default function StatisticsCalculator() {
  // Calculator state
  const [mode, setMode] = useState<string>('basic');
  const [numbers, setNumbers] = useState<string>('');
  const [numbers2, setNumbers2] = useState<string>(''); // For correlation calculations
  const [results, setResults] = useState<StatisticalResult[]>([]);
  const [error, setError] = useState<string>('');

  // Parse input string into number array
  const parseNumbers = (input: string): number[] => {
    if (!input.trim()) return [];
    
    const nums = input.split(/[,\s]+/)
      .map(num => num.trim())
      .filter(num => num !== '')
      .map(num => {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) throw new Error(`Invalid number: ${num}`);
        return parsed;
      });
    
    return nums;
  };

  // Statistical calculations
  const calculateMean = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    return nums.reduce((sum, num) => sum + num, 0) / nums.length;
  };

  const calculateMedian = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  const calculateMode = (nums: number[]): number[] => {
    if (nums.length === 0) return [];
    const frequency: { [key: number]: number } = {};
    nums.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.entries(frequency)
      .filter(([_, freq]) => freq === maxFreq)
      .map(([num, _]) => parseFloat(num));
  };

  const calculateRange = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    return Math.max(...nums) - Math.min(...nums);
  };

  const calculateStandardDeviation = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    const mean = calculateMean(nums);
    const squareDiffs = nums.map(num => Math.pow(num - mean, 2));
    const variance = calculateMean(squareDiffs);
    return Math.sqrt(variance);
  };

  const calculateQuartiles = (nums: number[]): number[] => {
    if (nums.length === 0) return [0, 0, 0];
    const sorted = [...nums].sort((a, b) => a - b);
    const q2 = calculateMedian(sorted);
    const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const upperHalf = sorted.slice(Math.ceil(sorted.length / 2));
    return [
      calculateMedian(lowerHalf), // Q1
      q2,                         // Q2
      calculateMedian(upperHalf)  // Q3
    ];
  };

  const calculateCorrelation = (nums1: number[], nums2: number[]): number => {
    if (nums1.length !== nums2.length || nums1.length === 0) return 0;
    
    const mean1 = calculateMean(nums1);
    const mean2 = calculateMean(nums2);
    const std1 = calculateStandardDeviation(nums1);
    const std2 = calculateStandardDeviation(nums2);
    
    const covariance = nums1.reduce((sum, _, i) => 
      sum + (nums1[i] - mean1) * (nums2[i] - mean2), 0) / nums1.length;
    
    return covariance / (std1 * std2);
  };

  const calculateFrequencyDistribution = (nums: number[]): Map<number, number> => {
    const frequency = new Map<number, number>();
    nums.forEach(num => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
    return new Map(Array.from(frequency.entries()).sort((a, b) => a[0] - b[0]));
  };

  const calculateSkewness = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    const mean = calculateMean(nums);
    const std = calculateStandardDeviation(nums);
    const n = nums.length;
    
    const skewness = nums.reduce((sum, num) => 
      sum + Math.pow((num - mean) / std, 3), 0) * (n / ((n - 1) * (n - 2)));
    
    return skewness;
  };

  const calculateKurtosis = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    const mean = calculateMean(nums);
    const std = calculateStandardDeviation(nums);
    const n = nums.length;
    
    const kurtosis = (nums.reduce((sum, num) => 
      sum + Math.pow((num - mean) / std, 4), 0) * (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
    
    return kurtosis;
  };

  const calculatePercentile = (nums: number[], percentile: number): number => {
    if (nums.length === 0) return 0;
    const sorted = [...nums].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) return sorted[floor];
    return sorted[floor] + (index - floor) * (sorted[ceil] - sorted[floor]);
  };

  const calculateCovariance = (nums1: number[], nums2: number[]): number => {
    if (nums1.length !== nums2.length || nums1.length === 0) return 0;
    const mean1 = calculateMean(nums1);
    const mean2 = calculateMean(nums2);
    return nums1.reduce((sum, _, i) => 
      sum + (nums1[i] - mean1) * (nums2[i] - mean2), 0) / nums1.length;
  };

  const handleCalculate = () => {
    try {
      setError('');
      const nums = parseNumbers(numbers);
      if (nums.length === 0) {
        setError('Please enter at least one number');
        return;
      }

      let newResults: StatisticalResult[] = [];

      switch (mode) {
        case 'basic':
          newResults = [
            { label: 'Mean', value: calculateMean(nums).toFixed(4) },
            { label: 'Median', value: calculateMedian(nums).toFixed(4) },
            { label: 'Mode', value: calculateMode(nums).join(', ') },
            { label: 'Range', value: calculateRange(nums).toFixed(4) },
            { label: 'Count', value: nums.length },
            { label: 'Sum', value: nums.reduce((a, b) => a + b, 0).toFixed(4) },
            { label: 'Minimum', value: Math.min(...nums).toFixed(4) },
            { label: 'Maximum', value: Math.max(...nums).toFixed(4) }
          ];
          break;

        case 'advanced':
          const quartiles = calculateQuartiles(nums);
          const variance = Math.pow(calculateStandardDeviation(nums), 2);
          newResults = [
            { label: 'Standard Deviation', value: calculateStandardDeviation(nums).toFixed(4) },
            { label: 'Variance', value: variance.toFixed(4) },
            { label: 'First Quartile (Q1)', value: quartiles[0].toFixed(4) },
            { label: 'Second Quartile (Q2)', value: quartiles[1].toFixed(4) },
            { label: 'Third Quartile (Q3)', value: quartiles[2].toFixed(4) },
            { label: 'Interquartile Range', value: (quartiles[2] - quartiles[0]).toFixed(4) },
            { label: 'Coefficient of Variation', value: ((calculateStandardDeviation(nums) / calculateMean(nums)) * 100).toFixed(2) + '%' }
          ];
          break;

        case 'descriptive':
          newResults = [
            { label: 'Skewness', value: calculateSkewness(nums).toFixed(4) },
            { label: 'Kurtosis', value: calculateKurtosis(nums).toFixed(4) },
            { label: '10th Percentile', value: calculatePercentile(nums, 10).toFixed(4) },
            { label: '25th Percentile', value: calculatePercentile(nums, 25).toFixed(4) },
            { label: '75th Percentile', value: calculatePercentile(nums, 75).toFixed(4) },
            { label: '90th Percentile', value: calculatePercentile(nums, 90).toFixed(4) },
            { label: 'Data Range', value: `${Math.min(...nums).toFixed(2)} to ${Math.max(...nums).toFixed(2)}` }
          ];
          break;

        case 'correlation':
          const nums2 = parseNumbers(numbers2);
          if (nums2.length === 0) {
            setError('Please enter numbers for both datasets');
            return;
          }
          if (nums.length !== nums2.length) {
            setError('Both datasets must have the same number of values');
            return;
          }
          newResults = [
            { label: 'Pearson Correlation', value: calculateCorrelation(nums, nums2).toFixed(4) },
            { label: 'Covariance', value: calculateCovariance(nums, nums2).toFixed(4) },
            { label: 'Sample Size', value: nums.length },
            { label: 'Dataset 1 Mean', value: calculateMean(nums).toFixed(4) },
            { label: 'Dataset 2 Mean', value: calculateMean(nums2).toFixed(4) },
            { label: 'Dataset 1 Std Dev', value: calculateStandardDeviation(nums).toFixed(4) },
            { label: 'Dataset 2 Std Dev', value: calculateStandardDeviation(nums2).toFixed(4) }
          ];
          break;

        case 'summary':
          const summaryQuartiles = calculateQuartiles(nums);
          newResults = [
            { label: 'Sample Size', value: nums.length },
            { label: 'Mean', value: calculateMean(nums).toFixed(4) },
            { label: 'Median', value: calculateMedian(nums).toFixed(4) },
            { label: 'Mode', value: calculateMode(nums).join(', ') },
            { label: 'Standard Deviation', value: calculateStandardDeviation(nums).toFixed(4) },
            { label: 'Variance', value: Math.pow(calculateStandardDeviation(nums), 2).toFixed(4) },
            { label: 'Skewness', value: calculateSkewness(nums).toFixed(4) },
            { label: 'Kurtosis', value: calculateKurtosis(nums).toFixed(4) },
            { label: 'Range', value: calculateRange(nums).toFixed(4) },
            { label: 'Quartiles', value: `Q1: ${summaryQuartiles[0].toFixed(2)}, Q2: ${summaryQuartiles[1].toFixed(2)}, Q3: ${summaryQuartiles[2].toFixed(2)}` },
            { label: 'Coefficient of Variation', value: ((calculateStandardDeviation(nums) / calculateMean(nums)) * 100).toFixed(2) + '%' }
          ];
          break;
      }

      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Statistics Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Statistics</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id);
                        setResults([]);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === calcMode.id
                          ? 'bg-amber-600 text-white shadow-lg scale-105'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90 mt-1">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Enter numbers (separated by commas or spaces)</span>
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

                {mode === 'correlation' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Enter second dataset</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the second dataset for correlation analysis</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      value={numbers2}
                      onChange={(e) => setNumbers2(e.target.value)}
                      placeholder="e.g., 2, 4, 6, 8, 10"
                      className="w-full"
                    />
                  </div>
                )}

                <Button
                  onClick={handleCalculate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate Statistics
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
              {results.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="text-sm font-medium text-muted-foreground">
                          {result.label}
                        </div>
                        <div className="text-lg font-semibold mt-1">
                          {result.value}
                        </div>
                      </div>
                    ))}
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
            <h2 className="text-2xl font-semibold">Understanding Statistical Measures</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Statistics</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Mean: Average of all values</li>
                  <li>Median: Middle value when sorted</li>
                  <li>Mode: Most frequent value(s)</li>
                  <li>Range: Difference between max and min</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Advanced Statistics</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Standard Deviation: Spread of data</li>
                  <li>Variance: Square of standard deviation</li>
                  <li>Quartiles: Data divided into four parts</li>
                  <li>Coefficient of Variation: Relative variability</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Distribution Measures</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Skewness: Asymmetry of distribution</li>
                  <li>Kurtosis: Tailedness of distribution</li>
                  <li>Percentiles: Values dividing data</li>
                  <li>Correlation: Relationship between variables</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
