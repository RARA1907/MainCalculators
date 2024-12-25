'use client';

import { useState, useEffect } from 'react';
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

interface GeneratorMode {
  id: string;
  name: string;
  description: string;
}

const generatorModes: GeneratorMode[] = [
  {
    id: 'single',
    name: 'Single Number',
    description: 'Generate one random number',
  },
  {
    id: 'multiple',
    name: 'Multiple Numbers',
    description: 'Generate a set of random numbers',
  },
  {
    id: 'sequence',
    name: 'Unique Sequence',
    description: 'Generate unique numbers in sequence',
  },
];

const distributions = [
  { id: 'uniform', name: 'Uniform' },
  { id: 'normal', name: 'Normal (Gaussian)' },
];

const breadcrumbItems = [
  {
    label: 'Random Number Generator',
    href: '/random-number-generator',
  },
];

export default function RandomNumberGenerator() {
  // Generator mode
  const [mode, setMode] = useState<'single' | 'multiple' | 'sequence'>('single');
  const [distribution, setDistribution] = useState<'uniform' | 'normal'>('uniform');

  // Range settings
  const [minValue, setMinValue] = useState<string>('1');
  const [maxValue, setMaxValue] = useState<string>('100');
  const [count, setCount] = useState<string>('10');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('0');

  // Generated numbers
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  // History of generated numbers
  const [history, setHistory] = useState<number[][]>([]);

  // Generate random number using normal distribution
  const generateNormal = (mean: number, stdDev: number): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * num;
  };

  // Generate random numbers based on current settings
  const generateNumbers = () => {
    try {
      const min = parseFloat(minValue);
      const max = parseFloat(maxValue);
      const numCount = parseInt(count);
      const decimals = parseInt(decimalPlaces);

      if (isNaN(min) || isNaN(max) || (mode !== 'single' && isNaN(numCount))) {
        throw new Error('Please enter valid numbers');
      }

      if (min >= max) {
        throw new Error('Maximum value must be greater than minimum value');
      }

      if (mode === 'sequence' && max - min + 1 < numCount) {
        throw new Error('Range is too small for the requested number of unique values');
      }

      let numbers: number[] = [];
      const mean = (max + min) / 2;
      const stdDev = (max - min) / 6; // 99.7% of values will fall within range

      switch (mode) {
        case 'single':
          const singleNum = distribution === 'uniform'
            ? min + Math.random() * (max - min)
            : Math.min(max, Math.max(min, generateNormal(mean, stdDev)));
          numbers = [Number(singleNum.toFixed(decimals))];
          break;

        case 'multiple':
          for (let i = 0; i < numCount; i++) {
            const num = distribution === 'uniform'
              ? min + Math.random() * (max - min)
              : Math.min(max, Math.max(min, generateNormal(mean, stdDev)));
            numbers.push(Number(num.toFixed(decimals)));
          }
          break;

        case 'sequence':
          const pool = Array.from(
            { length: Math.floor(max - min + 1) },
            (_, i) => min + i
          );
          for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
          }
          numbers = pool.slice(0, numCount).map(n => Number(n.toFixed(decimals)));
          break;
      }

      setGeneratedNumbers(numbers);
      setHistory(prev => [numbers, ...prev].slice(0, 10));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Get distribution chart options
  const getDistributionChart = () => {
    if (generatedNumbers.length <= 1) return {};

    // Create histogram data
    const binCount = Math.min(20, Math.ceil(Math.sqrt(generatedNumbers.length)));
    const min = Math.min(...generatedNumbers);
    const max = Math.max(...generatedNumbers);
    const binSize = (max - min) / binCount;
    
    const bins = Array(binCount).fill(0);
    generatedNumbers.forEach(num => {
      const binIndex = Math.min(
        binCount - 1,
        Math.floor((num - min) / binSize)
      );
      bins[binIndex]++;
    });

    const binLabels = bins.map((_, i) => 
      `${(min + i * binSize).toFixed(2)} - ${(min + (i + 1) * binSize).toFixed(2)}`
    );

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: binLabels,
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 45
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Frequency',
          type: 'bar',
          barWidth: '90%',
          data: bins
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Random Number Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Generator Settings</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Generator Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatorModes.map((genMode) => (
                    <button
                      key={genMode.id}
                      onClick={() => {
                        setMode(genMode.id as 'single' | 'multiple' | 'sequence');
                        setGeneratedNumbers([]);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === genMode.id
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                          : 'bg-blue-600 text-white hover:from-violet-200 hover:to-fuchsia-200 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{genMode.name}</div>
                      <div className="text-sm opacity-90">{genMode.description}</div>
                    </button>
                  ))}
                </div>

                {/* Distribution Selection */}
                {mode !== 'sequence' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Distribution</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Uniform: Equal probability across range</p>
                            <p>Normal: Bell curve distribution</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <select
                      value={distribution}
                      onChange={(e) => setDistribution(e.target.value as 'uniform' | 'normal')}
                      className="select select-bordered w-full"
                    >
                      {distributions.map(dist => (
                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Range Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Minimum Value</span>
                    </label>
                    <input
                      type="number"
                      value={minValue}
                      onChange={(e) => setMinValue(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Maximum Value</span>
                    </label>
                    <input
                      type="number"
                      value={maxValue}
                      onChange={(e) => setMaxValue(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                {mode !== 'single' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number of Values</span>
                    </label>
                    <input
                      type="number"
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      min="1"
                      max={mode === 'sequence' ? maxValue : undefined}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Decimal Places</span>
                  </label>
                  <input
                    type="number"
                    value={decimalPlaces}
                    onChange={(e) => setDecimalPlaces(e.target.value)}
                    min="0"
                    max="10"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={generateNumbers}
                  className="btn w-full bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Generate Numbers
                </button>

                {error && (
                  <div className="text-error text-sm mt-2">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Generated Numbers</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Generated Numbers Display */}
                <div className="bg-base-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Results</h3>
                  <div className="space-y-2">
                    {generatedNumbers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {generatedNumbers.map((num, index) => (
                          <div
                            key={index}
                            className="bg-base-100 px-3 py-1 rounded-full text-sm"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center">
                        Click generate to see random numbers
                      </div>
                    )}
                  </div>
                </div>

                {/* Distribution Chart */}
                {mode !== 'single' && generatedNumbers.length > 1 && (
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Distribution</h3>
                    <ReactECharts option={getDistributionChart()} style={{ height: '300px' }} />
                  </div>
                )}

                {/* Generation History */}
                {history.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">History</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {history.map((numbers, index) => (
                        <div key={index} className="text-sm">
                          Set {index + 1}: {numbers.join(', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                <h3 className="font-semibold">Generation Modes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Single Number: Generate one random number</li>
                  <li>Multiple Numbers: Generate a set of numbers</li>
                  <li>Unique Sequence: Generate non-repeating numbers</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Distributions</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Uniform: Equal probability for all numbers</li>
                  <li>Normal: Bell curve distribution around mean</li>
                  <li>View distribution in histogram</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Custom range settings</li>
                  <li>Decimal place control</li>
                  <li>Generation history</li>
                  <li>Distribution visualization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
