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

type DistanceType = 'euclidean' | 'manhattan' | 'chebyshev';

interface DistanceResult {
  distance: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  distanceType: DistanceType;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Distance Calculator',
    href: '/distance-calculator',
  },
];

export default function DistanceCalculator() {
  const [distanceType, setDistanceType] = useState<DistanceType>('euclidean');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<DistanceResult | null>(null);
  const [error, setError] = useState<string>('');

  const getInputFields = () => [
    { key: 'x1', label: 'X₁', tooltip: 'X-coordinate of the first point' },
    { key: 'y1', label: 'Y₁', tooltip: 'Y-coordinate of the first point' },
    { key: 'x2', label: 'X₂', tooltip: 'X-coordinate of the second point' },
    { key: 'y2', label: 'Y₂', tooltip: 'Y-coordinate of the second point' },
  ];

  const getDistanceVisualization = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    type: DistanceType
  ) => {
    const padding = 2;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    let pathData: number[][] = [];
    
    switch (type) {
      case 'euclidean':
        // Direct line
        pathData = [[x1, y1], [x2, y2]];
        break;
      case 'manhattan':
        // L-shaped path
        pathData = [[x1, y1], [x2, y1], [x2, y2]];
        break;
      case 'chebyshev':
        // Step-wise path showing maximum coordinate difference
        if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
          pathData = [[x1, y1], [x2, y1], [x2, y2]];
        } else {
          pathData = [[x1, y1], [x1, y2], [x2, y2]];
        }
        break;
    }

    const option = {
      animation: false,
      grid: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        min: minX - padding,
        max: maxX + padding,
        name: 'X',
        nameLocation: 'middle',
        nameGap: 25,
        axisLine: { show: true },
      },
      yAxis: {
        type: 'value',
        min: minY - padding,
        max: maxY + padding,
        name: 'Y',
        nameLocation: 'middle',
        nameGap: 25,
        axisLine: { show: true },
      },
      series: [
        {
          type: 'line',
          data: pathData,
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            formatter: (params: any) => {
              if (params.dataIndex === 0) return '(X₁,Y₁)';
              if (params.dataIndex === pathData.length - 1) return '(X₂,Y₂)';
              return '';
            },
            position: 'top',
          },
          lineStyle: {
            color: '#10B981',
            width: 2,
            type: type === 'manhattan' ? 'dashed' : 'solid',
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
      
      const x1 = parseFloat(dimensions['x1']);
      const y1 = parseFloat(dimensions['y1']);
      const x2 = parseFloat(dimensions['x2']);
      const y2 = parseFloat(dimensions['y2']);

      if ([x1, y1, x2, y2].some(isNaN)) {
        throw new Error('Please enter valid numbers for all coordinates');
      }

      if (x1 === x2 && y1 === y2) {
        throw new Error('The points cannot be the same');
      }

      const dx = x2 - x1;
      const dy = y2 - y1;
      let distance: number;

      steps.push(`Given: Point 1(${x1}, ${y1}), Point 2(${x2}, ${y2})`);
      steps.push(`Horizontal difference (Δx) = ${x2} - ${x1} = ${dx}`);
      steps.push(`Vertical difference (Δy) = ${y2} - ${y1} = ${dy}`);

      switch (distanceType) {
        case 'euclidean':
          distance = Math.sqrt(dx * dx + dy * dy);
          steps.push('Using Euclidean distance formula:');
          steps.push(`d = √[(x₂ - x₁)² + (y₂ - y₁)²]`);
          steps.push(`d = √[(${dx})² + (${dy})²]`);
          steps.push(`d = √[${dx * dx} + ${dy * dy}]`);
          steps.push(`d = √${dx * dx + dy * dy} = ${distance.toFixed(4)}`);
          break;

        case 'manhattan':
          distance = Math.abs(dx) + Math.abs(dy);
          steps.push('Using Manhattan distance formula:');
          steps.push(`d = |x₂ - x₁| + |y₂ - y₁|`);
          steps.push(`d = |${dx}| + |${dy}|`);
          steps.push(`d = ${Math.abs(dx)} + ${Math.abs(dy)} = ${distance}`);
          break;

        case 'chebyshev':
          distance = Math.max(Math.abs(dx), Math.abs(dy));
          steps.push('Using Chebyshev distance formula:');
          steps.push(`d = max(|x₂ - x₁|, |y₂ - y₁|)`);
          steps.push(`d = max(|${dx}|, |${dy}|)`);
          steps.push(`d = max(${Math.abs(dx)}, ${Math.abs(dy)}) = ${distance}`);
          break;
      }

      setResult({
        distance,
        x1,
        y1,
        x2,
        y2,
        distanceType,
        steps,
        chartOption: getDistanceVisualization(x1, y1, x2, y2, distanceType),
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

  const handleDistanceTypeChange = (type: DistanceType) => {
    setDistanceType(type);
    setResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Distance Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the distance between two points using different distance metrics:
            Euclidean, Manhattan, or Chebyshev distance
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
                  <Label htmlFor="distanceType">
                    Distance Metric{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose which distance metric to use for calculation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select
                    value={distanceType}
                    onValueChange={(value) =>
                      handleDistanceTypeChange(value as DistanceType)
                    }
                  >
                    <SelectTrigger 
                      id="distanceType" 
                      className="bg-white text-black dark:bg-gray-800 dark:text-white"
                    >
                      <SelectValue placeholder="Select distance metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                      <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                      <SelectItem value="chebyshev">Chebyshev Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {getInputFields().map(({ key, label, tooltip }) => (
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
                      placeholder={`Enter ${label}`}
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
                  {/* Distance Result */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">
                      {distanceType.charAt(0).toUpperCase() + distanceType.slice(1)} Distance
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {result.distance.toFixed(4)} units
                    </div>
                  </div>

                  {/* Distance Visualization */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Distance Visualization</h3>
                    <ReactECharts 
                      option={result.chartOption} 
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
                  Enter coordinates and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Distance Metrics</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Euclidean Distance</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Straight-line distance between points</li>
                  <li>Uses Pythagorean theorem</li>
                  <li>Formula: √[(x₂-x₁)² + (y₂-y₁)²]</li>
                  <li>Most common in geometry</li>
                  <li>Used in physical measurements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Manhattan Distance</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Sum of horizontal and vertical distances</li>
                  <li>Also called "city block" distance</li>
                  <li>Formula: |x₂-x₁| + |y₂-y₁|</li>
                  <li>Used in grid-based navigation</li>
                  <li>Common in urban planning</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Chebyshev Distance</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Maximum coordinate difference</li>
                  <li>Also called "chessboard" distance</li>
                  <li>Formula: max(|x₂-x₁|, |y₂-y₁|)</li>
                  <li>Used in game development</li>
                  <li>Relevant in chess movements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
