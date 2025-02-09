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

interface ConfidenceIntervalResult {
  mean: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  confidenceLevel: number;
  sampleSize: number;
  steps: string[];
  normalDistData: any;
}

const breadcrumbItems = [
  {
    label: 'Confidence Interval Calculator',
    href: '/confidence-interval-calculator',
  },
];

const confidenceLevels = [
  { value: '0.90', label: '90%', zScore: 1.645 },
  { value: '0.95', label: '95%', zScore: 1.96 },
  { value: '0.99', label: '99%', zScore: 2.576 }
];

export default function ConfidenceIntervalCalculator() {
  const [mean, setMean] = useState<string>('');
  const [stdDev, setStdDev] = useState<string>('');
  const [sampleSize, setSampleSize] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('0.95');
  const [result, setResult] = useState<ConfidenceIntervalResult | null>(null);
  const [error, setError] = useState<string>('');

  // Function to calculate the normal distribution PDF
  const normalPDF = (x: number, mean: number, stdDev: number): number => {
    const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return coefficient * Math.exp(exponent);
  };

  const getNormalDistributionData = (
    mean: number,
    stdError: number,
    lowerBound: number,
    upperBound: number,
    confidenceLevel: number
  ) => {
    const points = 100;
    const range = 4; // Show ±4 standard errors
    const data: [number, number][] = [];
    const confidenceData: [number, number][] = [];

    for (let i = 0; i <= points; i++) {
      const xVal = mean - range * stdError + (i / points) * (2 * range * stdError);
      const yVal = normalPDF(xVal, mean, stdError);
      data.push([xVal, yVal]);

      // Add points for confidence interval shading
      if (xVal >= lowerBound && xVal <= upperBound) {
        confidenceData.push([xVal, yVal]);
      }
    }

    return {
      tooltip: {
        formatter: function(params: any) {
          if (params.seriesName === 'Mean') {
            return `Mean = ${mean.toFixed(2)}`;
          }
          if (params.seriesName === 'Bounds') {
            return `${params.name}: ${params.data[0].toFixed(2)}`;
          }
          return `X = ${params.data[0].toFixed(2)}<br/>Density = ${params.data[1].toFixed(4)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Value'
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
          name: 'Confidence Interval',
          type: 'line',
          smooth: true,
          data: confidenceData,
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
          name: 'Mean',
          type: 'scatter',
          data: [[mean, normalPDF(mean, mean, stdError)]],
          itemStyle: {
            color: '#EF4444'
          },
          symbolSize: 10
        },
        {
          name: 'Bounds',
          type: 'scatter',
          data: [
            [lowerBound, normalPDF(lowerBound, mean, stdError)],
            [upperBound, normalPDF(upperBound, mean, stdError)]
          ],
          itemStyle: {
            color: '#10B981'
          },
          symbolSize: 10
        }
      ]
    };
  };

  const calculate = () => {
    try {
      setError('');
      const μ = parseFloat(mean);
      const σ = parseFloat(stdDev);
      const n = parseInt(sampleSize);
      const level = parseFloat(confidenceLevel);

      if (isNaN(μ) || isNaN(σ) || isNaN(n)) {
        throw new Error('Please enter valid numbers');
      }
      if (σ <= 0) {
        throw new Error('Standard deviation must be greater than 0');
      }
      if (n <= 0) {
        throw new Error('Sample size must be greater than 0');
      }

      const selectedLevel = confidenceLevels.find(l => l.value === confidenceLevel);
      if (!selectedLevel) {
        throw new Error('Invalid confidence level');
      }

      const standardError = σ / Math.sqrt(n);
      const marginOfError = selectedLevel.zScore * standardError;
      const lowerBound = μ - marginOfError;
      const upperBound = μ + marginOfError;

      const steps = [
        'Step 1: Identify Values',
        `Sample Mean (x̄) = ${μ}`,
        `Standard Deviation (σ) = ${σ}`,
        `Sample Size (n) = ${n}`,
        `Confidence Level = ${selectedLevel.label}`,
        `Critical Z-value = ${selectedLevel.zScore}`,
        '',
        'Step 2: Calculate Standard Error',
        'SE = σ / √n',
        `SE = ${σ} / √${n}`,
        `SE = ${standardError.toFixed(4)}`,
        '',
        'Step 3: Calculate Margin of Error',
        'ME = Z × SE',
        `ME = ${selectedLevel.zScore} × ${standardError.toFixed(4)}`,
        `ME = ${marginOfError.toFixed(4)}`,
        '',
        'Step 4: Calculate Confidence Interval',
        'CI = x̄ ± ME',
        `CI = ${μ} ± ${marginOfError.toFixed(4)}`,
        `CI = (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})`,
        '',
        'Interpretation:',
        `We can be ${selectedLevel.label} confident that the true population mean`,
        `falls between ${lowerBound.toFixed(4)} and ${upperBound.toFixed(4)}.`
      ];

      setResult({
        mean: μ,
        standardError,
        marginOfError,
        lowerBound,
        upperBound,
        confidenceLevel: level,
        sampleSize: n,
        steps,
        normalDistData: getNormalDistributionData(μ, standardError, lowerBound, upperBound, level)
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Confidence Interval Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Confidence Interval</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sample Mean (x̄)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The mean (average) of your sample data</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter sample mean"
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
                          <p>The standard deviation of your sample data</p>
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sample Size (n)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The number of observations in your sample</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter sample size"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confidence Level</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The probability that the interval contains the true population parameter</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={confidenceLevel}
                    onValueChange={(value) => setConfidenceLevel(value)}
                  >
                    <SelectTrigger className="bg-blue-600 text-white hover:bg-blue-700">
                      <SelectValue placeholder="Select confidence level" />
                    </SelectTrigger>
                    <SelectContent>
                      {confidenceLevels.map((level) => (
                        <SelectItem 
                          key={level.value} 
                          value={level.value}
                          className="hover:bg-blue-50"
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {/* Confidence Interval */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Confidence Interval
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      ({result.lowerBound.toFixed(4)}, {result.upperBound.toFixed(4)})
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      With {(result.confidenceLevel * 100).toFixed(0)}% confidence
                    </div>
                  </div>

                  {/* Additional Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Standard Error
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.standardError.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Margin of Error
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.marginOfError.toFixed(4)}
                      </div>
                    </div>
                  </div>

                  {/* Normal Distribution Chart */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Visualization</h3>
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
            <h2 className="text-2xl font-semibold">Understanding Confidence Intervals</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">What is a Confidence Interval?</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Range of likely values</li>
                  <li>Based on sample statistics</li>
                  <li>Contains true population parameter</li>
                  <li>Measures estimation precision</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Components</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Point estimate (mean)</li>
                  <li>Margin of error</li>
                  <li>Confidence level</li>
                  <li>Standard error</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Common Uses</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Research studies</li>
                  <li>Quality control</li>
                  <li>Survey analysis</li>
                  <li>Medical trials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
