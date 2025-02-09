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

interface ZScoreResult {
  zScore: number;
  percentile: number;
  interpretation: string;
  steps: string[];
  normalDistData: any;
}

const breadcrumbItems = [
  {
    label: 'Z-score Calculator',
    href: '/z-score-calculator',
  },
];

export default function ZScoreCalculator() {
  const [value, setValue] = useState<string>('');
  const [mean, setMean] = useState<string>('');
  const [stdDev, setStdDev] = useState<string>('');
  const [result, setResult] = useState<ZScoreResult | null>(null);
  const [error, setError] = useState<string>('');

  // Function to calculate the normal distribution PDF
  const normalPDF = (x: number, mean: number, stdDev: number): number => {
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return coefficient * Math.exp(exponent);
  };

  // Function to calculate the cumulative normal distribution (error function approximation)
  const erf = (x: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  // Function to calculate the cumulative normal distribution
  const cumulativeNormal = (x: number): number => {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  };

  const getNormalDistributionData = (mean: number, stdDev: number, zScore: number) => {
    const points = 100;
    const range = 4; // Show ±4 standard deviations
    const data: [number, number][] = [];
    const shadeData: [number, number][] = [];
    const x = parseFloat(value);

    for (let i = 0; i <= points; i++) {
      const xVal = mean - range * stdDev + (i / points) * (2 * range * stdDev);
      const yVal = normalPDF(xVal, mean, stdDev);
      data.push([xVal, yVal]);

      // Add points for shading if x is less than or equal to the current value
      if (xVal <= x) {
        shadeData.push([xVal, yVal]);
      }
    }

    return {
      tooltip: {
        formatter: function(params: any) {
          if (params.seriesName === 'Value') {
            return `X = ${params.data[0].toFixed(2)}<br/>Z-score = ${zScore.toFixed(2)}`;
          }
          return `X = ${params.data[0].toFixed(2)}<br/>Density = ${params.data[1].toFixed(4)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'X Value'
      },
      yAxis: {
        type: 'value',
        name: 'Probability Density'
      },
      series: [
        {
          name: 'Normal Distribution',
          type: 'line',
          smooth: true,
          data: data,
          itemStyle: {
            color: '#3B82F6'
          }
        },
        {
          name: 'Area',
          type: 'line',
          smooth: true,
          data: shadeData,
          areaStyle: {
            color: '#93C5FD',
            opacity: 0.5
          },
          lineStyle: {
            opacity: 0
          },
          stack: 'confidence-band'
        },
        {
          name: 'Value',
          type: 'scatter',
          data: [[x, normalPDF(x, mean, stdDev)]],
          itemStyle: {
            color: '#EF4444'
          },
          symbolSize: 10
        }
      ]
    };
  };

  const getInterpretation = (zScore: number): string => {
    const absZ = Math.abs(zScore);
    if (absZ < 1) {
      return 'Within one standard deviation of the mean (typical value)';
    } else if (absZ < 2) {
      return 'Between one and two standard deviations from the mean (moderately unusual)';
    } else if (absZ < 3) {
      return 'Between two and three standard deviations from the mean (unusual)';
    } else {
      return 'More than three standard deviations from the mean (very unusual)';
    }
  };

  const calculate = () => {
    try {
      setError('');
      const x = parseFloat(value);
      const μ = parseFloat(mean);
      const σ = parseFloat(stdDev);

      if (isNaN(x) || isNaN(μ) || isNaN(σ)) {
        throw new Error('Please enter valid numbers');
      }
      if (σ <= 0) {
        throw new Error('Standard deviation must be greater than 0');
      }

      const zScore = (x - μ) / σ;
      const percentile = cumulativeNormal(zScore) * 100;

      const steps = [
        'Step 1: Identify Values',
        `X (Value) = ${x}`,
        `μ (Mean) = ${μ}`,
        `σ (Standard Deviation) = ${σ}`,
        '',
        'Step 2: Apply Z-score Formula',
        'Z = (X - μ) / σ',
        `Z = (${x} - ${μ}) / ${σ}`,
        `Z = ${(x - μ).toFixed(4)} / ${σ}`,
        `Z = ${zScore.toFixed(4)}`,
        '',
        'Step 3: Calculate Percentile',
        `Percentile = ${percentile.toFixed(2)}%`,
        `This means approximately ${percentile.toFixed(2)}% of values fall below ${x}`
      ];

      setResult({
        zScore,
        percentile,
        interpretation: getInterpretation(zScore),
        steps,
        normalDistData: getNormalDistributionData(μ, σ, zScore)
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Z-score Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Z-score</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Value (X)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The value to calculate Z-score for</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Population Mean (μ)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The mean (average) of the population</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter mean"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Standard Deviation (σ)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The standard deviation of the population</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter standard deviation"
                    value={stdDev}
                    onChange={(e) => setStdDev(e.target.value)}
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
                        Z-score
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.zScore.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Percentile
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.percentile.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Interpretation
                    </div>
                    <div className="mt-1">
                      {result.interpretation}
                    </div>
                  </div>

                  {/* Normal Distribution Chart */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Normal Distribution</h3>
                    <ReactECharts 
                      option={result.normalDistData} 
                      style={{ height: '300px' }} 
                    />
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
            <h2 className="text-2xl font-semibold">Understanding Z-scores</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">What is a Z-score?</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Measures distance from mean</li>
                  <li>In standard deviation units</li>
                  <li>Shows relative position</li>
                  <li>Standardizes comparisons</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Interpretation</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>0 = exactly at mean</li>
                  <li>±1 = typical range</li>
                  <li>±2 = unusual</li>
                  <li>±3 = very unusual</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Common Uses</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Test scores</li>
                  <li>Quality control</li>
                  <li>Research analysis</li>
                  <li>Performance evaluation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
