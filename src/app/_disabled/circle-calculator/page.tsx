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

type CalculationType = 'radius' | 'diameter' | 'circumference' | 'area' | 'arc';

interface CircleResult {
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
  arcLength?: number;
  sectorArea?: number;
  steps: string[];
  chartOption: any;
}

interface EChartsSeries {
  type: 'line';
  data: [number, number][];
  smooth: boolean;
  symbol: 'none';
  itemStyle: {
    color: string;
  };
  areaStyle?: {
    color: string;
    opacity: number;
  };
}

const breadcrumbItems = [
  {
    label: 'Circle Calculator',
    href: '/circle-calculator',
  },
];

export default function CircleCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>('radius');
  const [value, setValue] = useState<string>('');
  const [angle, setAngle] = useState<string>('');
  const [result, setResult] = useState<CircleResult | null>(null);
  const [error, setError] = useState<string>('');

  const getCircleVisualization = (radius: number, angle?: number) => {
    // Generate points for circle
    const points = 100;
    const data: [number, number][] = [];
    const arcData: [number, number][] = [];
    
    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * 2 * Math.PI;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      data.push([x, y]);

      if (angle && i <= (angle / 360) * points) {
        arcData.push([x, y]);
      }
    }

    const option = {
      animation: false,
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: -radius * 1.2,
        max: radius * 1.2,
        axisLine: { show: true },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        min: -radius * 1.2,
        max: radius * 1.2,
        axisLine: { show: true },
        splitLine: { show: false }
      },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#3B82F6'
          }
        },
        // Draw radius line
        {
          type: 'line',
          data: [[0, 0], [radius, 0]],
          lineStyle: {
            color: '#EF4444',
            type: 'dashed'
          },
          symbol: 'circle'
        }
      ]
    };

    if (angle) {
      option.series.push({
        type: 'line',
        data: arcData,
        smooth: true,
        symbol: 'none',
        itemStyle: {
          color: '#10B981'
        },
        areaStyle: {
          color: '#10B981',
          opacity: 0.2
        }
      } as EChartsSeries);
    }

    return option;
  };

  const calculate = () => {
    try {
      setError('');
      const inputValue = parseFloat(value);
      const angleValue = angle ? parseFloat(angle) : undefined;

      if (isNaN(inputValue) || inputValue <= 0) {
        throw new Error('Please enter a valid positive number');
      }
      if (angleValue !== undefined && (isNaN(angleValue) || angleValue <= 0 || angleValue > 360)) {
        throw new Error('Angle must be between 0 and 360 degrees');
      }

      let radius = 0;
      let steps: string[] = [];

      switch (calcType) {
        case 'radius':
          radius = inputValue;
          steps = [
            'Given radius:',
            `r = ${radius} units`
          ];
          break;

        case 'diameter':
          radius = inputValue / 2;
          steps = [
            'Step 1: Convert diameter to radius',
            'r = d ÷ 2',
            `r = ${inputValue} ÷ 2`,
            `r = ${radius} units`
          ];
          break;

        case 'circumference':
          radius = inputValue / (2 * Math.PI);
          steps = [
            'Step 1: Convert circumference to radius',
            'C = 2πr',
            'r = C ÷ (2π)',
            `r = ${inputValue} ÷ (2π)`,
            `r = ${radius.toFixed(4)} units`
          ];
          break;

        case 'area':
          radius = Math.sqrt(inputValue / Math.PI);
          steps = [
            'Step 1: Convert area to radius',
            'A = πr²',
            'r = √(A ÷ π)',
            `r = √(${inputValue} ÷ π)`,
            `r = ${radius.toFixed(4)} units`
          ];
          break;

        case 'arc':
          radius = inputValue;
          if (!angleValue) {
            throw new Error('Please enter an angle for arc calculations');
          }
          steps = [
            'Given:',
            `Radius = ${radius} units`,
            `Central Angle = ${angleValue}°`
          ];
          break;
      }

      const diameter = radius * 2;
      const circumference = 2 * Math.PI * radius;
      const area = Math.PI * radius * radius;
      
      let arcLength, sectorArea;
      if (angleValue) {
        arcLength = (angleValue / 360) * circumference;
        sectorArea = (angleValue / 360) * area;
        steps.push(
          '',
          'Arc Length Calculation:',
          'Arc Length = (angle ÷ 360°) × circumference',
          `Arc Length = (${angleValue} ÷ 360) × ${circumference.toFixed(4)}`,
          `Arc Length = ${arcLength.toFixed(4)} units`,
          '',
          'Sector Area Calculation:',
          'Sector Area = (angle ÷ 360°) × circle area',
          `Sector Area = (${angleValue} ÷ 360) × ${area.toFixed(4)}`,
          `Sector Area = ${sectorArea.toFixed(4)} square units`
        );
      }

      steps.push(
        '',
        'Additional Calculations:',
        `Diameter = ${diameter.toFixed(4)} units`,
        `Circumference = ${circumference.toFixed(4)} units`,
        `Area = ${area.toFixed(4)} square units`
      );

      setResult({
        radius,
        diameter,
        circumference,
        area,
        arcLength,
        sectorArea,
        steps,
        chartOption: getCircleVisualization(radius, angleValue)
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Circle Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Circle Properties</h2>
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
                          <p>Select what you want to calculate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={calcType}
                    onValueChange={(value: CalculationType) => {
                      setCalcType(value);
                      setValue('');
                      setAngle('');
                      setResult(null);
                    }}
                  >
                    <SelectTrigger className="bg-white text-black border border-gray-200 hover:bg-gray-50">
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radius" className="hover:bg-gray-50">Given Radius</SelectItem>
                      <SelectItem value="diameter" className="hover:bg-gray-50">Given Diameter</SelectItem>
                      <SelectItem value="circumference" className="hover:bg-gray-50">Given Circumference</SelectItem>
                      <SelectItem value="area" className="hover:bg-gray-50">Given Area</SelectItem>
                      <SelectItem value="arc" className="hover:bg-gray-50">Arc and Sector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {calcType === 'radius' ? 'Radius' :
                       calcType === 'diameter' ? 'Diameter' :
                       calcType === 'circumference' ? 'Circumference' :
                       calcType === 'area' ? 'Area' :
                       'Radius'}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the known value</p>
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

                {calcType === 'arc' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Central Angle (degrees)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter angle in degrees (0-360)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter angle"
                      value={angle}
                      onChange={(e) => setAngle(e.target.value)}
                      className="w-full"
                    />
                  </div>
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
                  {/* Basic Properties */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Radius
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.radius.toFixed(4)} units
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Diameter
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.diameter.toFixed(4)} units
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Circumference
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.circumference.toFixed(4)} units
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Area
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {result.area.toFixed(4)} sq. units
                      </div>
                    </div>
                  </div>

                  {/* Arc Properties */}
                  {result.arcLength && result.sectorArea && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 ">
                        <div className="text-sm font-medium text-muted-foreground">
                          Arc Length
                        </div>
                        <div className="text-xl font-bold mt-1">
                          {result.arcLength.toFixed(4)} units
                        </div>
                      </div>
                      <div className="bg-gray-50 ">
                        <div className="text-sm font-medium text-muted-foreground">
                          Sector Area
                        </div>
                        <div className="text-xl font-bold mt-1">
                          {result.sectorArea.toFixed(4)} sq. units
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Circle Visualization */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Visualization</h3>
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
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Circle Properties</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Properties</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Diameter = 2 × radius</li>
                  <li>Circumference = 2πr</li>
                  <li>Area = πr²</li>
                  <li>π ≈ 3.14159</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Arc Properties</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Arc Length = (θ/360°) × C</li>
                  <li>Sector Area = (θ/360°) × A</li>
                  <li>θ = central angle in degrees</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Units must be consistent</li>
                  <li>All dimensions must be positive</li>
                  <li>Angles must be in degrees</li>
                  <li>Round answers as needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
