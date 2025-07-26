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

type CalculationType = 'points' | 'rise_run';

interface SlopeResult {
  slope: number;
  angle: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rise: number;
  run: number;
  calculationType: CalculationType;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Slope Calculator',
    href: '/slope-calculator',
  },
];

export default function SlopeCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('points');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<SlopeResult | null>(null);
  const [error, setError] = useState<string>('');

  const getInputFields = (type: CalculationType) => {
    switch (type) {
      case 'points':
        return [
          { key: 'x1', label: 'X₁', tooltip: 'X-coordinate of the first point' },
          { key: 'y1', label: 'Y₁', tooltip: 'Y-coordinate of the first point' },
          { key: 'x2', label: 'X₂', tooltip: 'X-coordinate of the second point' },
          { key: 'y2', label: 'Y₂', tooltip: 'Y-coordinate of the second point' },
        ];
      case 'rise_run':
        return [
          { key: 'rise', label: 'Rise', tooltip: 'Vertical change (y₂ - y₁)' },
          { key: 'run', label: 'Run', tooltip: 'Horizontal change (x₂ - x₁)' },
        ];
    }
  };

  const getLineVisualization = (x1: number, y1: number, x2: number, y2: number) => {
    const padding = 2;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    
    const xRange = maxX - minX;
    const yRange = maxY - minY;
    
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
          data: [[x1, y1], [x2, y2]],
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            formatter: (params: any) => {
              const points = ['(X₁,Y₁)', '(X₂,Y₂)'];
              return points[params.dataIndex];
            },
            position: 'top',
          },
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
      let x1: number, y1: number, x2: number, y2: number, rise: number, run: number;

      switch (calculationType) {
        case 'points':
          x1 = parseFloat(dimensions['x1']);
          y1 = parseFloat(dimensions['y1']);
          x2 = parseFloat(dimensions['x2']);
          y2 = parseFloat(dimensions['y2']);
          
          if ([x1, y1, x2, y2].some(isNaN)) {
            throw new Error('Please enter valid numbers for all coordinates');
          }
          
          if (x1 === x2 && y1 === y2) {
            throw new Error('The points cannot be the same');
          }
          
          rise = y2 - y1;
          run = x2 - x1;
          
          steps.push(`Given: Point 1(${x1}, ${y1}), Point 2(${x2}, ${y2})`);
          steps.push(`1. Calculate the rise (vertical change):`);
          steps.push(`   Rise = y₂ - y₁ = ${y2} - ${y1} = ${rise}`);
          steps.push(`2. Calculate the run (horizontal change):`);
          steps.push(`   Run = x₂ - x₁ = ${x2} - ${x1} = ${run}`);
          break;

        case 'rise_run':
          rise = parseFloat(dimensions['rise']);
          run = parseFloat(dimensions['run']);
          
          if (isNaN(rise) || isNaN(run)) {
            throw new Error('Please enter valid numbers for rise and run');
          }
          
          if (run === 0) {
            throw new Error('Run cannot be zero (undefined slope)');
          }
          
          // Create arbitrary points for visualization
          x1 = 0;
          y1 = 0;
          x2 = run;
          y2 = rise;
          
          steps.push(`Given: Rise = ${rise}, Run = ${run}`);
          break;
      }

      if (run === 0) {
        throw new Error('The slope is undefined (vertical line)');
      }

      const slope = rise / run;
      const angle = Math.atan(slope) * (180 / Math.PI);

      steps.push(`3. Calculate the slope:`);
      steps.push(`   Slope = Rise ÷ Run = ${rise} ÷ ${run} = ${slope.toFixed(4)}`);
      steps.push(`4. Calculate the angle:`);
      steps.push(`   Angle = arctan(slope) = ${angle.toFixed(2)}°`);

      setResult({
        slope,
        angle,
        x1,
        y1,
        x2,
        y2,
        rise,
        run,
        calculationType,
        steps,
        chartOption: getLineVisualization(x1, y1, x2, y2),
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
          <h1 className="text-3xl font-bold">Slope Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the slope of a line using points or rise over run.
            The slope formula is m = (y₂ - y₁) ÷ (x₂ - x₁) or rise ÷ run
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
                    Calculation Method{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose how you want to calculate the slope</p>
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
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Using Two Points</SelectItem>
                      <SelectItem value="rise_run">Using Rise and Run</SelectItem>
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
                  {/* Slope Results */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Slope (m)
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.slope.toFixed(4)}
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Angle
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.angle.toFixed(2)}°
                      </div>
                    </div>
                  </div>

                  {/* Line Visualization */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Line Visualization</h3>
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
                  Enter values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Slope</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Concepts</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Slope measures steepness of a line</li>
                  <li>Formula: m = (y₂ - y₁) ÷ (x₂ - x₁)</li>
                  <li>Also written as: rise ÷ run</li>
                  <li>Positive slope: line goes up</li>
                  <li>Negative slope: line goes down</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Special Cases</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Horizontal line: slope = 0</li>
                  <li>Vertical line: undefined slope</li>
                  <li>45° line: slope = 1 or -1</li>
                  <li>Parallel lines: same slope</li>
                  <li>Perpendicular lines: negative reciprocal slopes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Construction and architecture</li>
                  <li>Road and ramp design</li>
                  <li>Data analysis and trends</li>
                  <li>Physics and engineering</li>
                  <li>Geography and topography</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
