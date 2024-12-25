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

interface SequenceResult {
  nextTerm: number;
  commonDifference?: number;
  commonRatio?: number;
  sequence: number[];
  nthTerm?: string;
  sum?: number;
  steps: string[];
}

const breadcrumbItems = [
  {
    label: 'Number Sequence Calculator',
    href: '/number-sequence-calculator',
  },
];

export default function NumberSequenceCalculator() {
  const [numbers, setNumbers] = useState<string>('');
  const [sequenceType, setSequenceType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [error, setError] = useState<string>('');
  const [termNumber, setTermNumber] = useState<string>('');

  const calculateNthTerm = (sequence: number[], type: 'arithmetic' | 'geometric'): string => {
    if (type === 'arithmetic') {
      const a1 = sequence[0];
      const d = sequence[1] - sequence[0];
      return `an = ${a1} + (n-1)(${d})`;
    } else {
      const a1 = sequence[0];
      const r = sequence[1] / sequence[0];
      return `an = ${a1} × ${r}^(n-1)`;
    }
  };

  const calculateSum = (sequence: number[]): number => {
    return sequence.reduce((acc, val) => acc + val, 0);
  };

  const calculateSequence = () => {
    try {
      setError('');
      const sequence = numbers
        .split(',')
        .map(num => num.trim())
        .filter(num => num !== '')
        .map(num => {
          const parsed = parseFloat(num);
          if (isNaN(parsed)) throw new Error('Please enter valid numbers');
          return parsed;
        });

      if (sequence.length < 2) {
        throw new Error('Please enter at least 2 numbers');
      }

      const steps: string[] = [];
      steps.push('Step 1: Identify the sequence pattern');
      steps.push(`Input sequence: ${sequence.join(', ')}`);

      if (sequenceType === 'arithmetic') {
        const differences = sequence.slice(1).map((num, i) => num - sequence[i]);
        const isArithmetic = differences.every(diff => Math.abs(diff - differences[0]) < 0.0001);
        
        if (!isArithmetic) {
          throw new Error('The numbers do not form an arithmetic sequence');
        }

        const commonDifference = differences[0];
        const nextTerm = sequence[sequence.length - 1] + commonDifference;

        steps.push('Step 2: Calculate common difference (d)');
        steps.push(`d = ${differences[0]} (difference between consecutive terms)`);
        steps.push('Step 3: Calculate next term');
        steps.push(`Next term = ${sequence[sequence.length - 1]} + ${commonDifference} = ${nextTerm}`);

        const nthTerm = calculateNthTerm(sequence, 'arithmetic');
        const sum = calculateSum([...sequence, nextTerm]);

        setResult({
          nextTerm,
          commonDifference,
          sequence: [...sequence, nextTerm],
          nthTerm,
          sum,
          steps
        });
      } else {
        const ratios = sequence.slice(1).map((num, i) => num / sequence[i]);
        const isGeometric = ratios.every(ratio => Math.abs(ratio - ratios[0]) < 0.0001);

        if (!isGeometric) {
          throw new Error('The numbers do not form a geometric sequence');
        }

        const commonRatio = ratios[0];
        const nextTerm = sequence[sequence.length - 1] * commonRatio;

        steps.push('Step 2: Calculate common ratio (r)');
        steps.push(`r = ${commonRatio} (ratio between consecutive terms)`);
        steps.push('Step 3: Calculate next term');
        steps.push(`Next term = ${sequence[sequence.length - 1]} × ${commonRatio} = ${nextTerm}`);

        const nthTerm = calculateNthTerm(sequence, 'geometric');
        const sum = calculateSum([...sequence, nextTerm]);

        setResult({
          nextTerm,
          commonRatio,
          sequence: [...sequence, nextTerm],
          nthTerm,
          sum,
          steps
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const getSequenceChart = () => {
    if (!result) return {};

    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{c}',
      },
      xAxis: {
        type: 'category',
        data: result.sequence.map((_, index) => `Term ${index + 1}`),
        name: 'Term Number'
      },
      yAxis: {
        type: 'value',
        name: 'Value'
      },
      series: [
        {
          data: result.sequence,
          type: 'line',
          smooth: true,
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          lineStyle: {
            color: '#3B82F6'
          },
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Number Sequence Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Sequence</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sequence Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Arithmetic: Terms differ by a constant</p>
                          <p>Geometric: Terms differ by a constant ratio</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={sequenceType}
                    onValueChange={(value: 'arithmetic' | 'geometric') => setSequenceType(value)}
                  >
                    <SelectTrigger className="bg-blue-600 text-white hover:bg-blue-700">
                      <SelectValue placeholder="Select sequence type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arithmetic" className="hover:bg-blue-50">Arithmetic Sequence</SelectItem>
                      <SelectItem value="geometric" className="hover:bg-blue-50">Geometric Sequence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Enter numbers (comma-separated)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter at least 2 numbers separated by commas</p>
                          <p>Example: 2, 4, 6, 8</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="e.g., 2, 4, 6, 8"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={calculateSequence}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate Sequence
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
                        Next Term
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.nextTerm}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        {sequenceType === 'arithmetic' ? 'Common Difference' : 'Common Ratio'}
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {sequenceType === 'arithmetic' 
                          ? result.commonDifference?.toFixed(2)
                          : result.commonRatio?.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        Sum of Terms
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.sum?.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm font-medium text-muted-foreground">
                        nth Term Formula
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.nthTerm}
                      </div>
                    </div>
                  </div>

                  {/* Sequence Chart */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Sequence Visualization</h3>
                    <ReactECharts option={getSequenceChart()} style={{ height: '300px' }} />
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
            <h2 className="text-2xl font-semibold">Understanding Number Sequences</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Arithmetic Sequences</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Difference between terms is constant</li>
                  <li>Example: 2, 5, 8, 11 (d=3)</li>
                  <li>nth term: an = a1 + (n-1)d</li>
                  <li>Common in linear patterns</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Geometric Sequences</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Ratio between terms is constant</li>
                  <li>Example: 2, 6, 18, 54 (r=3)</li>
                  <li>nth term: an = a1 × r^(n-1)</li>
                  <li>Common in exponential growth</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Financial calculations</li>
                  <li>Population growth models</li>
                  <li>Pattern recognition</li>
                  <li>Problem-solving in math</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
