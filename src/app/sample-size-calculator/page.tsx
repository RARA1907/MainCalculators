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

interface SampleSizeResult {
  sampleSize: number;
  zScore: number;
  marginOfError: number;
  confidenceLevel: number;
  populationSize: number;
  steps: string[];
}

const breadcrumbItems = [
  {
    label: 'Sample Size Calculator',
    href: '/sample-size-calculator',
  },
];

const zScores: { [key: string]: number } = {
  '80': 1.28,
  '85': 1.44,
  '90': 1.645,
  '95': 1.96,
  '99': 2.576
};

export default function SampleSizeCalculator() {
  const [populationSize, setPopulationSize] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('95');
  const [marginOfError, setMarginOfError] = useState<string>('5');
  const [result, setResult] = useState<SampleSizeResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateSampleSize = () => {
    try {
      setError('');
      
      // Validate inputs
      const population = parseInt(populationSize);
      const margin = parseFloat(marginOfError);
      const confidence = parseFloat(confidenceLevel);

      if (isNaN(population) || population <= 0) {
        throw new Error('Please enter a valid population size');
      }
      if (isNaN(margin) || margin <= 0 || margin >= 100) {
        throw new Error('Margin of error must be between 0 and 100');
      }
      if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
        throw new Error('Confidence level must be between 0 and 100');
      }

      const z = zScores[confidenceLevel] || 1.96;
      const p = 0.5; // Use 0.5 for maximum sample size

      const steps = [
        'Step 1: Identify Input Values',
        `Population Size (N) = ${population.toLocaleString()}`,
        `Confidence Level = ${confidence}% (Z = ${z})`,
        `Margin of Error (E) = ${margin}%`,
        '',
        'Step 2: Apply Sample Size Formula',
        'Formula: n = (Z²×p(1-p)×N) / (E²(N-1) + Z²×p(1-p))',
        `where:`,
        `Z = ${z} (z-score for ${confidence}% confidence)`,
        `p = 0.5 (assumed proportion)`,
        `E = ${margin/100} (margin of error as decimal)`,
        '',
        'Step 3: Calculate',
      ];

      // Calculate sample size using the formula
      const numerator = Math.pow(z, 2) * p * (1 - p) * population;
      const denominator = Math.pow(margin / 100, 2) * (population - 1) + Math.pow(z, 2) * p * (1 - p);
      const sampleSize = Math.ceil(numerator / denominator);

      steps.push(`Numerator = ${z}² × 0.5(1-0.5) × ${population} = ${numerator.toFixed(2)}`);
      steps.push(`Denominator = (${margin/100})² × (${population}-1) + ${z}² × 0.5(1-0.5) = ${denominator.toFixed(2)}`);
      steps.push(`Sample Size = ceiling(${numerator.toFixed(2)} / ${denominator.toFixed(2)}) = ${sampleSize}`);

      setResult({
        sampleSize,
        zScore: z,
        marginOfError: margin,
        confidenceLevel: confidence,
        populationSize: population,
        steps
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const getMarginChart = () => {
    if (!result) return {};

    const margins = [];
    const sizes = [];
    const baseMargin = result.marginOfError;
    
    for (let m = baseMargin/2; m <= baseMargin*2; m += baseMargin/10) {
      const z = zScores[confidenceLevel] || 1.96;
      const p = 0.5;
      const numerator = Math.pow(z, 2) * p * (1 - p) * result.populationSize;
      const denominator = Math.pow(m / 100, 2) * (result.populationSize - 1) + Math.pow(z, 2) * p * (1 - p);
      const size = Math.ceil(numerator / denominator);
      margins.push(m);
      sizes.push(size);
    }

    return {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          return `Margin of Error: ${params[0].data[0].toFixed(2)}%<br/>
                  Sample Size: ${params[0].data[1].toLocaleString()}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Margin of Error (%)',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: 'Sample Size',
        nameLocation: 'middle',
        nameGap: 45
      },
      series: [{
        type: 'line',
        data: margins.map((m, i) => [m, sizes[i]]),
        smooth: true,
        lineStyle: {
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6'
        }
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Sample Size Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Sample Size</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Population Size</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total number of individuals in the target population</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 1000"
                    value={populationSize}
                    onChange={(e) => setPopulationSize(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confidence Level (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How confident you want to be in the results</p>
                          <p>95% is most common in research</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={confidenceLevel}
                    onValueChange={setConfidenceLevel}
                  >
                    <SelectTrigger className="bg-blue-600 text-white hover:bg-blue-700">
                      <SelectValue placeholder="Select confidence level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80" className="hover:bg-blue-50">80%</SelectItem>
                      <SelectItem value="85" className="hover:bg-blue-50">85%</SelectItem>
                      <SelectItem value="90" className="hover:bg-blue-50">90%</SelectItem>
                      <SelectItem value="95" className="hover:bg-blue-50">95%</SelectItem>
                      <SelectItem value="99" className="hover:bg-blue-50">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Margin of Error (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Acceptable margin of error in results</p>
                          <p>5% is typical for most studies</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={marginOfError}
                    onChange={(e) => setMarginOfError(e.target.value)}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={calculateSampleSize}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate Sample Size
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
                        Required Sample Size
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.sampleSize.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Z-Score
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.zScore.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Population Size
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.populationSize.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Margin of Error
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        ±{result.marginOfError}%
                      </div>
                    </div>
                  </div>

                  {/* Sample Size vs Margin of Error Chart */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Sample Size vs Margin of Error</h3>
                    <ReactECharts option={getMarginChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-gray-50 ">
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
            <h2 className="text-2xl font-semibold">Understanding Sample Size Calculation</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Concepts</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Sample size determines accuracy</li>
                  <li>Larger samples = more precise results</li>
                  <li>Balance cost vs. precision</li>
                  <li>Consider practical constraints</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Choosing Parameters</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>95% confidence is standard</li>
                  <li>5% margin typical for surveys</li>
                  <li>Higher confidence needs larger sample</li>
                  <li>Lower margin needs larger sample</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Common Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Market research surveys</li>
                  <li>Academic research</li>
                  <li>Quality control sampling</li>
                  <li>Political polling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
