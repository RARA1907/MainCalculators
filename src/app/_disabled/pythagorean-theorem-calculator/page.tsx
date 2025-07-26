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

type CalculationType = 'leg_a' | 'leg_b' | 'hypotenuse';

interface PythagoreanResult {
  a: number;
  b: number;
  c: number;
  calculationType: CalculationType;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Pythagorean Theorem Calculator',
    href: '/pythagorean-theorem-calculator',
  },
];

export default function PythagoreanTheoremCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('leg_a');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<PythagoreanResult | null>(null);
  const [error, setError] = useState<string>('');

  const getInputFields = (type: CalculationType) => {
    switch (type) {
      case 'leg_a':
        return [
          { key: 'b', label: 'Leg b', tooltip: 'Enter the length of leg b' },
          { key: 'c', label: 'Hypotenuse c', tooltip: 'Enter the length of the hypotenuse' },
        ];
      case 'leg_b':
        return [
          { key: 'a', label: 'Leg a', tooltip: 'Enter the length of leg a' },
          { key: 'c', label: 'Hypotenuse c', tooltip: 'Enter the length of the hypotenuse' },
        ];
      case 'hypotenuse':
        return [
          { key: 'a', label: 'Leg a', tooltip: 'Enter the length of leg a' },
          { key: 'b', label: 'Leg b', tooltip: 'Enter the length of leg b' },
        ];
    }
  };

  const getTriangleVisualization = (a: number, b: number, c: number) => {
    const scale = 100 / Math.max(a, b, c);
    const scaledA = a * scale;
    const scaledB = b * scale;

    const option = {
      animation: false,
      grid: {
        top: 10,
        right: 20,
        bottom: 20,
        left: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: Math.max(scaledA, 100),
        axisLine: { show: true },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: Math.max(scaledB, 100),
        axisLine: { show: true },
      },
      series: [
        {
          type: 'line',
          data: [
            [0, 0],
            [scaledA, 0],
            [scaledA, scaledB],
            [0, scaledB],
            [0, 0],
          ],
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            formatter: (params: any) => {
              const points = ['A', 'B', 'C', 'D'];
              return points[params.dataIndex] || '';
            },
          },
          lineStyle: {
            color: '#10B981',
            width: 2,
          },
        },
        {
          type: 'line',
          data: [[0, 0], [scaledA, scaledB]],
          lineStyle: {
            color: '#10B981',
            width: 2,
          },
        },
      ],
    };

    return option;
  };

  const calculate = () => {
    try {
      setError('');
      const steps: string[] = [];
      let a: number, b: number, c: number;

      switch (calculationType) {
        case 'leg_a':
          b = parseFloat(dimensions['b']);
          c = parseFloat(dimensions['c']);
          
          if (isNaN(b) || isNaN(c)) {
            throw new Error('Please enter valid numbers for leg b and hypotenuse c');
          }
          
          if (c <= b) {
            throw new Error('The hypotenuse must be greater than leg b');
          }
          
          steps.push(`Given: b = ${b}, c = ${c}`);
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`a² = c² - b²`);
          steps.push(`a² = ${c * c} - ${b * b} = ${c * c - b * b}`);
          a = Math.sqrt(c * c - b * b);
          steps.push(`a = √${c * c - b * b} = ${a.toFixed(4)}`);
          break;

        case 'leg_b':
          a = parseFloat(dimensions['a']);
          c = parseFloat(dimensions['c']);
          
          if (isNaN(a) || isNaN(c)) {
            throw new Error('Please enter valid numbers for leg a and hypotenuse c');
          }
          
          if (c <= a) {
            throw new Error('The hypotenuse must be greater than leg a');
          }
          
          steps.push(`Given: a = ${a}, c = ${c}`);
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`b² = c² - a²`);
          steps.push(`b² = ${c * c} - ${a * a} = ${c * c - a * a}`);
          b = Math.sqrt(c * c - a * a);
          steps.push(`b = √${c * c - a * a} = ${b.toFixed(4)}`);
          break;

        case 'hypotenuse':
          a = parseFloat(dimensions['a']);
          b = parseFloat(dimensions['b']);
          
          if (isNaN(a) || isNaN(b)) {
            throw new Error('Please enter valid numbers for legs a and b');
          }
          
          steps.push(`Given: a = ${a}, b = ${b}`);
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`c² = a² + b²`);
          steps.push(`c² = ${a * a} + ${b * b} = ${a * a + b * b}`);
          c = Math.sqrt(a * a + b * b);
          steps.push(`c = √${a * a + b * b} = ${c.toFixed(4)}`);
          break;

        default:
          throw new Error('Invalid calculation type');
      }

      setResult({
        a,
        b,
        c,
        calculationType,
        steps,
        chartOption: getTriangleVisualization(a, b, c),
      });
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setDimensions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type);
    setDimensions({});
    setResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Pythagorean Theorem Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the sides of a right triangle using the Pythagorean theorem:
            a² + b² = c²
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-xl font-semibold">Calculator</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="calculationType">
                    What would you like to calculate?{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select which side of the right triangle you want to calculate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select
                    value={calculationType}
                    onValueChange={(value) =>
                      handleCalculationTypeChange(value as CalculationType)
                    }
                  >
                    <SelectTrigger 
                      id="calculationType" 
                      className="bg-white text-black "
                    >
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leg_a">Leg a</SelectItem>
                      <SelectItem value="leg_b">Leg b</SelectItem>
                      <SelectItem value="hypotenuse">Hypotenuse c</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {getInputFields(calculationType).map(({ key, label, tooltip }) => (
                  <div key={key} className="grid gap-1.5">
                    <Label htmlFor={key}>
                      {label}{' '}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 inline" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      step="any"
                      value={dimensions[key] || ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                ))}

                <Button onClick={calculate} className="w-full">
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
              <h2 className="text-xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Triangle Sides Results */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Leg a
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.a.toFixed(4)} units
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Leg b
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.b.toFixed(4)} units
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Hypotenuse c
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.c.toFixed(4)} units
                      </div>
                    </div>
                  </div>

                  {/* Triangle Visualization */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Triangle Visualization</h3>
                    <ReactECharts 
                      option={result.chartOption} 
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
                  Enter dimensions and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding the Pythagorean Theorem</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">The Basic Formula</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>a² + b² = c²</li>
                  <li>c is the hypotenuse (longest side)</li>
                  <li>a and b are the legs (shorter sides)</li>
                  <li>The theorem only works for right triangles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Common Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Construction and architecture</li>
                  <li>Navigation and surveying</li>
                  <li>Engineering and design</li>
                  <li>Distance calculations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Units must be consistent</li>
                  <li>All sides must be positive</li>
                  <li>The hypotenuse is always the longest side</li>
                  <li>Double-check your measurements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
