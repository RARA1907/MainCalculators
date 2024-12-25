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

export default function StandardDeviationCalculator() {
  const [numbers, setNumbers] = useState<string>('');
  const [type, setType] = useState<'population' | 'sample'>('population');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const calculateMean = (nums: number[]): number => {
    return nums.reduce((acc, val) => acc + val, 0) / nums.length;
  };

  const calculateStandardDeviation = (nums: number[], type: 'population' | 'sample'): number => {
    const mean = calculateMean(nums);
    const squaredDifferences = nums.map(num => Math.pow(num - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
    
    // For population standard deviation, divide by n
    // For sample standard deviation, divide by (n-1)
    const divisor = type === 'population' ? nums.length : nums.length - 1;
    
    return Math.sqrt(sumSquaredDiff / divisor);
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

      const stdDev = calculateStandardDeviation(numberArray, type);
      setResult(stdDev.toFixed(6));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Standard Deviation Calculator</h1>
          <p className="text-gray-600 text-center mt-2">
            Calculate the standard deviation of a dataset
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numbers">Enter Numbers (separated by commas or spaces)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 1, 2, 3, 4, 5"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type of Standard Deviation</Label>
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
            className="w-full"
            onClick={handleCalculate}
          >
            Calculate
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-center">
                <span className="font-semibold">
                  {type === 'population' ? 'Population' : 'Sample'} Standard Deviation:
                </span>
                <br />
                <span className="text-xl">{result}</span>
              </p>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600">
            <h2 className="font-semibold mb-2">About Standard Deviation</h2>
            <p>
              Standard deviation is a measure of the amount of variation in a dataset. A low standard
              deviation indicates that the values tend to be close to the mean, while a high standard
              deviation indicates that the values are spread out over a wider range.
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                <strong>Population Standard Deviation (σ):</strong> Use when you have data for an entire
                population.
              </li>
              <li>
                <strong>Sample Standard Deviation (s):</strong> Use when you have data for only a sample
                of the population.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
