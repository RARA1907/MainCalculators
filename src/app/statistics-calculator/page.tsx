'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'basic',
    name: 'Basic Statistics',
    description: 'Calculate mean, median, mode, and range',
  },
  {
    id: 'advanced',
    name: 'Advanced Statistics',
    description: 'Calculate variance, standard deviation, and quartiles',
  },
  {
    id: 'frequency',
    name: 'Frequency Analysis',
    description: 'Analyze frequency distribution of data',
  },
  {
    id: 'correlation',
    name: 'Correlation',
    description: 'Calculate correlation between two datasets',
  },
];

interface StatisticalResult {
  label: string;
  value: string | number;
}

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
          ];
          break;

        case 'advanced':
          const quartiles = calculateQuartiles(nums);
          newResults = [
            { label: 'Standard Deviation', value: calculateStandardDeviation(nums).toFixed(4) },
            { label: 'First Quartile (Q1)', value: quartiles[0].toFixed(4) },
            { label: 'Second Quartile (Q2)', value: quartiles[1].toFixed(4) },
            { label: 'Third Quartile (Q3)', value: quartiles[2].toFixed(4) },
            { label: 'Interquartile Range', value: (quartiles[2] - quartiles[0]).toFixed(4) },
          ];
          break;

        case 'frequency':
          const freqDist = calculateFrequencyDistribution(nums);
          newResults = Array.from(freqDist.entries()).map(([num, freq]) => ({
            label: `Value ${num}`,
            value: `Count: ${freq} (${((freq / nums.length) * 100).toFixed(2)}%)`,
          }));
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
            { label: 'Correlation Coefficient', value: calculateCorrelation(nums, nums2).toFixed(4) },
          ];
          break;
      }

      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Statistics Calculator</h1>
          <p className="text-muted-foreground text-center">
            Calculate various statistical measures from your data
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                }`}
              >
                <div className="font-semibold">{calcMode.name}</div>
                <div className="text-sm opacity-90">{calcMode.description}</div>
              </button>
            ))}
          </div>

          <Separator />

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter numbers (separated by commas or spaces)
              </label>
              <Input
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                placeholder="e.g., 1, 2, 3, 4, 5"
                className="w-full"
              />
            </div>

            {mode === 'correlation' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter second dataset (separated by commas or spaces)
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
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Calculate
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Results Display */}
          {results.length > 0 && (
            <div className="mt-4 space-y-2">
              <h2 className="text-xl font-semibold mb-2">Results:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800"
                  >
                    <div className="font-medium text-gray-600 dark:text-gray-300">
                      {result.label}
                    </div>
                    <div className="text-lg font-semibold">
                      {result.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
