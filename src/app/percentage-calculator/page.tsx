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

interface CalculationResult {
  result: number;
  explanation: string;
  additionalInfo?: string[];
}

const breadcrumbItems = [
  {
    label: 'Percentage Calculator',
    href: '/percentage-calculator',
  },
];

const calculatorModes = [
  {
    id: 'basic',
    name: 'Basic Percentage',
    description: 'Calculate X% of Y',
  },
  {
    id: 'change',
    name: 'Percentage Change',
    description: 'Calculate % increase/decrease',
  },
  {
    id: 'distribution',
    name: 'Percentage Distribution',
    description: 'Calculate % distribution of values',
  },
];

export default function PercentageCalculator() {
  // Calculator mode
  const [mode, setMode] = useState<'basic' | 'change' | 'distribution'>('basic');

  // Basic percentage calculation
  const [percentage, setPercentage] = useState<string>('');
  const [value, setValue] = useState<string>('');

  // Percentage change calculation
  const [originalValue, setOriginalValue] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  // Percentage distribution calculation
  const [distributionValues, setDistributionValues] = useState<string>('');

  // Results
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  // Handle basic percentage calculation
  const calculateBasicPercentage = () => {
    try {
      const percentageNum = parseFloat(percentage);
      const valueNum = parseFloat(value);

      if (isNaN(percentageNum) || isNaN(valueNum)) {
        throw new Error('Please enter valid numbers');
      }

      const result = (percentageNum / 100) * valueNum;
      
      setResult({
        result,
        explanation: `${percentageNum}% of ${valueNum} = ${result.toFixed(2)}`,
        additionalInfo: [
          `Formula: (${percentageNum} ÷ 100) × ${valueNum}`,
          `Step 1: ${percentageNum} ÷ 100 = ${(percentageNum / 100).toFixed(4)}`,
          `Step 2: ${(percentageNum / 100).toFixed(4)} × ${valueNum} = ${result.toFixed(2)}`,
        ],
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  // Handle percentage change calculation
  const calculatePercentageChange = () => {
    try {
      const original = parseFloat(originalValue);
      const newVal = parseFloat(newValue);

      if (isNaN(original) || isNaN(newVal)) {
        throw new Error('Please enter valid numbers');
      }

      if (original === 0) {
        throw new Error('Original value cannot be zero');
      }

      const change = ((newVal - original) / original) * 100;
      const isIncrease = change >= 0;
      
      setResult({
        result: change,
        explanation: `${Math.abs(change).toFixed(2)}% ${isIncrease ? 'increase' : 'decrease'}`,
        additionalInfo: [
          `Formula: ((${newVal} - ${original}) ÷ ${original}) × 100`,
          `Step 1: ${newVal} - ${original} = ${(newVal - original).toFixed(2)}`,
          `Step 2: ${(newVal - original).toFixed(2)} ÷ ${original} = ${((newVal - original) / original).toFixed(4)}`,
          `Step 3: ${((newVal - original) / original).toFixed(4)} × 100 = ${change.toFixed(2)}%`,
        ],
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  // Handle percentage distribution calculation
  const calculateDistribution = () => {
    try {
      const values = distributionValues
        .split(',')
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v));

      if (values.length === 0) {
        throw new Error('Please enter valid numbers separated by commas');
      }

      const total = values.reduce((sum, val) => sum + val, 0);
      const percentages = values.map(val => (val / total) * 100);

      setResult({
        result: total,
        explanation: 'Distribution calculated successfully',
        additionalInfo: values.map((val, idx) => 
          `Value ${val}: ${percentages[idx].toFixed(2)}%`
        ),
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  // Get distribution chart options
  const getDistributionChart = () => {
    if (!result || mode !== 'distribution') return {};

    const values = distributionValues
      .split(',')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));
    
    const total = values.reduce((sum, val) => sum + val, 0);
    const data = values.map((val, idx) => ({
      value: (val / total) * 100,
      name: `Value ${idx + 1}: ${val}`,
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{c}%',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
            },
          },
          data: data,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Percentage Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Percentages</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Calculator Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculatorModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id as 'basic' | 'change' | 'distribution');
                        setResult(null);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all ${
                        mode === calcMode.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card-secondary hover:bg-primary/10'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                {/* Input Fields based on Mode */}
                {mode === 'basic' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Percentage (%)</span>
                      </label>
                      <input
                        type="number"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                        placeholder="Enter percentage"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Value</span>
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Enter value"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <button
                      onClick={calculateBasicPercentage}
                      className="btn btn-primary w-full"
                    >
                      Calculate
                    </button>
                  </div>
                )}

                {mode === 'change' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Original Value</span>
                      </label>
                      <input
                        type="number"
                        value={originalValue}
                        onChange={(e) => setOriginalValue(e.target.value)}
                        placeholder="Enter original value"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">New Value</span>
                      </label>
                      <input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder="Enter new value"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <button
                      onClick={calculatePercentageChange}
                      className="btn btn-primary w-full"
                    >
                      Calculate Change
                    </button>
                  </div>
                )}

                {mode === 'distribution' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Values (comma-separated)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter values separated by commas (e.g., 25, 50, 25)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="text"
                        value={distributionValues}
                        onChange={(e) => setDistributionValues(e.target.value)}
                        placeholder="Enter values (e.g., 25, 50, 25)"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <button
                      onClick={calculateDistribution}
                      className="btn btn-primary w-full"
                    >
                      Calculate Distribution
                    </button>
                  </div>
                )}

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
                  {/* Result Display */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Result</h3>
                    <div className="text-2xl font-bold">{result.explanation}</div>
                  </div>

                  {/* Distribution Chart */}
                  {mode === 'distribution' && (
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Distribution Chart</h3>
                      <ReactECharts option={getDistributionChart()} style={{ height: '300px' }} />
                    </div>
                  )}

                  {/* Step by Step Explanation */}
                  {result.additionalInfo && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Step by Step</h3>
                      <div className="bg-base-200 p-4 rounded-lg space-y-2">
                        {result.additionalInfo.map((info, index) => (
                          <div key={index} className="text-sm">
                            {info}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter values and click calculate to see the result
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">How to Use</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Percentage</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Enter the percentage value</li>
                  <li>Enter the number to calculate from</li>
                  <li>Get the result with step-by-step explanation</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Percentage Change</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Enter the original value</li>
                  <li>Enter the new value</li>
                  <li>See the percentage increase/decrease</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Percentage Distribution</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Enter values separated by commas</li>
                  <li>View the percentage distribution</li>
                  <li>See visual representation in pie chart</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
