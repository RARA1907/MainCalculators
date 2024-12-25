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

type CalculationType = 'basic' | 'combination' | 'permutation' | 'conditional';

interface ProbabilityResult {
  value: number;
  explanation: string;
  steps: string[];
  chartData?: any;
}

const breadcrumbItems = [
  {
    label: 'Probability Calculator',
    href: '/probability-calculator',
  },
];

export default function ProbabilityCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('basic');
  const [n, setN] = useState<string>('');
  const [r, setR] = useState<string>('');
  const [probabilityA, setProbabilityA] = useState<string>('');
  const [probabilityB, setProbabilityB] = useState<string>('');
  const [result, setResult] = useState<ProbabilityResult | null>(null);
  const [error, setError] = useState<string>('');

  const factorial = (num: number): number => {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
  };

  const calculateCombination = (n: number, r: number): number => {
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const calculatePermutation = (n: number, r: number): number => {
    return factorial(n) / factorial(n - r);
  };

  const getChartOption = (type: CalculationType, data: any) => {
    switch (type) {
      case 'basic':
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            data: [
              { value: data * 100, name: 'Success', itemStyle: { color: '#3B82F6' } },
              { value: (1 - data) * 100, name: 'Failure', itemStyle: { color: '#E5E7EB' } }
            ]
          }]
        };

      case 'combination':
      case 'permutation':
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          xAxis: {
            type: 'category',
            data: ['Total Possibilities', 'Selected Combination']
          },
          yAxis: {
            type: 'value',
            name: 'Count'
          },
          series: [{
            data: [
              { value: data.total, itemStyle: { color: '#E5E7EB' } },
              { value: data.selected, itemStyle: { color: '#3B82F6' } }
            ],
            type: 'bar',
            barWidth: '60%'
          }]
        };

      case 'conditional':
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}%'
          },
          series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            data: [
              { value: data.joint * 100, name: 'P(A∩B)', itemStyle: { color: '#3B82F6' } },
              { value: (data.probA - data.joint) * 100, name: 'P(A) only', itemStyle: { color: '#93C5FD' } },
              { value: (data.probB - data.joint) * 100, name: 'P(B) only', itemStyle: { color: '#BFDBFE' } },
              { value: (1 - data.probA - data.probB + data.joint) * 100, name: 'Neither', itemStyle: { color: '#E5E7EB' } }
            ]
          }]
        };

      default:
        return {};
    }
  };

  const calculate = () => {
    try {
      setError('');
      let value: number;
      let explanation: string;
      let steps: string[] = [];
      let chartData: any;

      switch (calculationType) {
        case 'combination':
          const nComb = parseInt(n);
          const rComb = parseInt(r);
          
          if (isNaN(nComb) || isNaN(rComb) || nComb < 0 || rComb < 0) {
            throw new Error('Please enter valid positive numbers');
          }
          if (rComb > nComb) {
            throw new Error('r cannot be greater than n');
          }
          
          steps = [
            'Step 1: Calculate n! (total items factorial)',
            `n! = ${nComb}! = ${factorial(nComb)}`,
            '',
            'Step 2: Calculate r! (selected items factorial)',
            `r! = ${rComb}! = ${factorial(rComb)}`,
            '',
            'Step 3: Calculate (n-r)!',
            `(n-r)! = ${nComb-rComb}! = ${factorial(nComb-rComb)}`,
            '',
            'Step 4: Apply combination formula: C(n,r) = n! / (r! × (n-r)!)'
          ];
          
          value = calculateCombination(nComb, rComb);
          explanation = `Number of ways to choose ${rComb} items from ${nComb} items where order doesn't matter`;
          chartData = {
            total: factorial(nComb),
            selected: value
          };
          break;

        case 'permutation':
          const nPerm = parseInt(n);
          const rPerm = parseInt(r);
          
          if (isNaN(nPerm) || isNaN(rPerm) || nPerm < 0 || rPerm < 0) {
            throw new Error('Please enter valid positive numbers');
          }
          if (rPerm > nPerm) {
            throw new Error('r cannot be greater than n');
          }
          
          steps = [
            'Step 1: Calculate n! (total items factorial)',
            `n! = ${nPerm}! = ${factorial(nPerm)}`,
            '',
            'Step 2: Calculate (n-r)!',
            `(n-r)! = ${nPerm-rPerm}! = ${factorial(nPerm-rPerm)}`,
            '',
            'Step 3: Apply permutation formula: P(n,r) = n! / (n-r)!'
          ];
          
          value = calculatePermutation(nPerm, rPerm);
          explanation = `Number of ways to arrange ${rPerm} items from ${nPerm} items where order matters`;
          chartData = {
            total: factorial(nPerm),
            selected: value
          };
          break;

        case 'basic':
          const probA = parseFloat(probabilityA);
          
          if (isNaN(probA) || probA < 0 || probA > 1) {
            throw new Error('Probability must be between 0 and 1');
          }
          
          steps = [
            'Step 1: Validate probability input',
            `0 ≤ P(A) ≤ 1`,
            `P(A) = ${probA}`,
            '',
            'Step 2: Convert to percentage',
            `P(A) = ${probA} × 100 = ${(probA * 100).toFixed(2)}%`
          ];
          
          value = probA;
          explanation = `Simple probability: ${(probA * 100).toFixed(2)}%`;
          chartData = probA;
          break;

        case 'conditional':
          const probAC = parseFloat(probabilityA);
          const probB = parseFloat(probabilityB);
          
          if (isNaN(probAC) || isNaN(probB) || probAC < 0 || probAC > 1 || probB < 0 || probB > 1) {
            throw new Error('Probabilities must be between 0 and 1');
          }
          
          steps = [
            'Step 1: Validate probability inputs',
            `0 ≤ P(A) ≤ 1 and 0 ≤ P(B) ≤ 1`,
            `P(A) = ${probAC}`,
            `P(B) = ${probB}`,
            '',
            'Step 2: Calculate joint probability',
            `P(A∩B) = P(A) × P(B)`,
            `P(A∩B) = ${probAC} × ${probB} = ${(probAC * probB).toFixed(4)}`
          ];
          
          value = probAC * probB;
          explanation = `P(A and B) = P(A) × P(B) = ${(value * 100).toFixed(2)}%`;
          chartData = {
            probA: probAC,
            probB: probB,
            joint: value
          };
          break;

        default:
          throw new Error('Invalid calculation type');
      }

      setResult({ 
        value, 
        explanation, 
        steps,
        chartData
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Probability Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Probability</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calculation Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose the type of probability calculation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={calculationType}
                    onValueChange={(value: CalculationType) => {
                      setCalculationType(value);
                      setResult(null);
                      setError('');
                    }}
                  >
                    <SelectTrigger className="bg-blue-600 text-white hover:bg-blue-700">
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic" className="hover:bg-blue-50">Basic Probability</SelectItem>
                      <SelectItem value="combination" className="hover:bg-blue-50">Combination (nCr)</SelectItem>
                      <SelectItem value="permutation" className="hover:bg-blue-50">Permutation (nPr)</SelectItem>
                      <SelectItem value="conditional" className="hover:bg-blue-50">Conditional Probability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(calculationType === 'combination' || calculationType === 'permutation') && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Total Items (n)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total number of items to choose from</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter total number of items"
                        value={n}
                        onChange={(e) => setN(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Selected Items (r)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of items to select</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter number of items to select"
                        value={r}
                        onChange={(e) => setR(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                {(calculationType === 'basic') && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Probability</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a value between 0 and 1</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter probability (0-1)"
                      value={probabilityA}
                      onChange={(e) => setProbabilityA(e.target.value)}
                      step="0.01"
                      min="0"
                      max="1"
                      className="w-full"
                    />
                  </div>
                )}

                {calculationType === 'conditional' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Probability of A</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Probability of event A occurring</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter P(A) (0-1)"
                        value={probabilityA}
                        onChange={(e) => setProbabilityA(e.target.value)}
                        step="0.01"
                        min="0"
                        max="1"
                        className="w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Probability of B</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Probability of event B occurring</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter P(B) (0-1)"
                        value={probabilityB}
                        onChange={(e) => setProbabilityB(e.target.value)}
                        step="0.01"
                        min="0"
                        max="1"
                        className="w-full"
                      />
                    </div>
                  </>
                )}

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
                  {/* Result Value */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      Result
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {result.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {result.explanation}
                    </div>
                  </div>

                  {/* Visualization */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Visualization</h3>
                    <ReactECharts 
                      option={getChartOption(calculationType, result.chartData)} 
                      style={{ height: '300px' }} 
                    />
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
            <h2 className="text-2xl font-semibold">Understanding Probability Calculations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Basic Probability</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Values between 0 and 1</li>
                  <li>0 = impossible event</li>
                  <li>1 = certain event</li>
                  <li>Example: P(heads) = 0.5</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Combinations & Permutations</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>nCr: Order doesn't matter</li>
                  <li>nPr: Order matters</li>
                  <li>n: Total items available</li>
                  <li>r: Items being chosen</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Conditional Probability</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>P(A∩B) = P(A) × P(B)</li>
                  <li>Events must be independent</li>
                  <li>Both probabilities 0-1</li>
                  <li>Used in decision trees</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
