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

type CalculationType = 'permutation' | 'combination' | 'permutationWithRepetition' | 'combinationWithRepetition';

interface CalculationResult {
  value: number;
  explanation: string;
  steps: string[];
  chartData: any;
}

const breadcrumbItems = [
  {
    label: 'Permutation and Combination Calculator',
    href: '/permutation-combination-calculator',
  },
];

export default function PermutationCombinationCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('permutation');
  const [n, setN] = useState<string>('');
  const [r, setR] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const factorial = (num: number): number => {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
  };

  const calculatePermutation = (n: number, r: number): number => {
    return factorial(n) / factorial(n - r);
  };

  const calculateCombination = (n: number, r: number): number => {
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const calculatePermutationWithRepetition = (n: number, r: number): number => {
    return Math.pow(n, r);
  };

  const calculateCombinationWithRepetition = (n: number, r: number): number => {
    return calculateCombination(n + r - 1, r);
  };

  const getChartOption = (type: CalculationType, data: any) => {
    switch (type) {
      case 'permutation':
      case 'combination':
        return {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
          },
          series: [
            {
              type: 'tree',
              data: [data],
              top: '1%',
              left: '7%',
              bottom: '1%',
              right: '20%',
              symbolSize: 7,
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 12
              },
              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },
              emphasis: {
                focus: 'descendant'
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        };

      case 'permutationWithRepetition':
      case 'combinationWithRepetition':
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: data.labels,
            name: 'Position'
          },
          yAxis: {
            type: 'value',
            name: 'Options Available'
          },
          series: [{
            data: data.values,
            type: 'bar',
            itemStyle: {
              color: '#3B82F6'
            }
          }]
        };

      default:
        return {};
    }
  };

  const generateTreeData = (n: number, r: number, isPermutation: boolean) => {
    const root = {
      name: `n=${n}, r=${r}`,
      children: []
    };

    // For visualization purposes, limit the tree size
    const maxChildren = Math.min(n, 5);
    const maxDepth = Math.min(r, 3);

    const generateChildren = (node: any, depth: number, used: Set<number>) => {
      if (depth >= maxDepth) return;

      for (let i = 1; i <= maxChildren; i++) {
        if (!isPermutation && i < Math.max(...Array.from(used), 0)) continue;
        if (!isPermutation && used.has(i)) continue;

        const child = {
          name: `${i}`,
          children: []
        };
        node.children.push(child);

        const newUsed = new Set(used);
        newUsed.add(i);
        generateChildren(child, depth + 1, newUsed);
      }
    };

    generateChildren(root, 0, new Set());
    return root;
  };

  const generateRepetitionData = (n: number, r: number) => {
    return {
      labels: Array.from({ length: r }, (_, i) => `Position ${i + 1}`),
      values: Array(r).fill(n)
    };
  };

  const calculate = () => {
    try {
      setError('');
      const nNum = parseInt(n);
      const rNum = parseInt(r);

      if (isNaN(nNum) || isNaN(rNum) || nNum < 0 || rNum < 0) {
        throw new Error('Please enter valid positive numbers');
      }
      if (rNum > nNum && (calculationType === 'permutation' || calculationType === 'combination')) {
        throw new Error('r cannot be greater than n for permutations and combinations without repetition');
      }

      let value: number;
      let explanation: string;
      let steps: string[] = [];
      let chartData: any;

      switch (calculationType) {
        case 'permutation':
          steps = [
            'Step 1: Calculate n!',
            `n! = ${nNum}! = ${factorial(nNum)}`,
            '',
            'Step 2: Calculate (n-r)!',
            `(n-r)! = ${nNum-rNum}! = ${factorial(nNum-rNum)}`,
            '',
            'Step 3: Apply permutation formula: P(n,r) = n! / (n-r)!',
            `P(${nNum},${rNum}) = ${factorial(nNum)} / ${factorial(nNum-rNum)} = ${calculatePermutation(nNum, rNum)}`
          ];
          value = calculatePermutation(nNum, rNum);
          explanation = `Number of ways to arrange ${rNum} items from ${nNum} items where order matters`;
          chartData = generateTreeData(nNum, rNum, true);
          break;

        case 'combination':
          steps = [
            'Step 1: Calculate n!',
            `n! = ${nNum}! = ${factorial(nNum)}`,
            '',
            'Step 2: Calculate r!',
            `r! = ${rNum}! = ${factorial(rNum)}`,
            '',
            'Step 3: Calculate (n-r)!',
            `(n-r)! = ${nNum-rNum}! = ${factorial(nNum-rNum)}`,
            '',
            'Step 4: Apply combination formula: C(n,r) = n! / (r! × (n-r)!)',
            `C(${nNum},${rNum}) = ${factorial(nNum)} / (${factorial(rNum)} × ${factorial(nNum-rNum)}) = ${calculateCombination(nNum, rNum)}`
          ];
          value = calculateCombination(nNum, rNum);
          explanation = `Number of ways to choose ${rNum} items from ${nNum} items where order doesn't matter`;
          chartData = generateTreeData(nNum, rNum, false);
          break;

        case 'permutationWithRepetition':
          steps = [
            'Step 1: For each position (r), we have n choices',
            `Number of choices per position = ${nNum}`,
            `Number of positions = ${rNum}`,
            '',
            'Step 2: Apply formula: n^r',
            `${nNum}^${rNum} = ${calculatePermutationWithRepetition(nNum, rNum)}`
          ];
          value = calculatePermutationWithRepetition(nNum, rNum);
          explanation = `Number of ways to arrange ${rNum} items from ${nNum} items with repetition allowed`;
          chartData = generateRepetitionData(nNum, rNum);
          break;

        case 'combinationWithRepetition':
          steps = [
            'Step 1: Transform to combination problem using n+r-1 choose r',
            `n+r-1 = ${nNum}+${rNum}-1 = ${nNum+rNum-1}`,
            '',
            'Step 2: Calculate (n+r-1)!',
            `(n+r-1)! = ${nNum+rNum-1}! = ${factorial(nNum+rNum-1)}`,
            '',
            'Step 3: Calculate r!',
            `r! = ${rNum}! = ${factorial(rNum)}`,
            '',
            'Step 4: Calculate (n-1)!',
            `(n-1)! = ${nNum-1}! = ${factorial(nNum-1)}`,
            '',
            'Step 5: Apply formula: C(n+r-1,r)',
            `C(${nNum+rNum-1},${rNum}) = ${calculateCombinationWithRepetition(nNum, rNum)}`
          ];
          value = calculateCombinationWithRepetition(nNum, rNum);
          explanation = `Number of ways to choose ${rNum} items from ${nNum} items with repetition allowed`;
          chartData = generateRepetitionData(nNum, rNum);
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Permutation and Combination Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
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
                          <p>Choose the type of calculation</p>
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
                      <SelectItem value="permutation" className="hover:bg-blue-50">Permutation (nPr)</SelectItem>
                      <SelectItem value="combination" className="hover:bg-blue-50">Combination (nCr)</SelectItem>
                      <SelectItem value="permutationWithRepetition" className="hover:bg-blue-50">Permutation with Repetition</SelectItem>
                      <SelectItem value="combinationWithRepetition" className="hover:bg-blue-50">Combination with Repetition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                    <span className="label-text">Items to Choose (r)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of items to select or arrange</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter number of items to choose"
                    value={r}
                    onChange={(e) => setR(e.target.value)}
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
            <h2 className="text-2xl font-semibold">Understanding Permutations and Combinations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Permutations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Without Repetition (nPr)</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Order matters</li>
                      <li>Formula: P(n,r) = n! / (n-r)!</li>
                      <li>Example: Arranging people in a line</li>
                      <li>Each item can be used only once</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">With Repetition</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Order matters</li>
                      <li>Formula: n^r</li>
                      <li>Example: PIN numbers</li>
                      <li>Items can be repeated</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Combinations</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Without Repetition (nCr)</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Order doesn't matter</li>
                      <li>Formula: C(n,r) = n! / (r! × (n-r)!)</li>
                      <li>Example: Selecting team members</li>
                      <li>Each item can be used only once</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">With Repetition</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>Order doesn't matter</li>
                      <li>Formula: C(n+r-1,r)</li>
                      <li>Example: Selecting items from a store</li>
                      <li>Items can be repeated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
