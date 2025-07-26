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

type CalculationType = 'two_sides' | 'side_angle' | 'hypotenuse_angle';

interface RightTriangleResult {
  sideA: number;
  sideB: number;
  hypotenuse: number;
  angleA: number;
  angleB: number;
  area: number;
  perimeter: number;
  height: number;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Right Triangle Calculator',
    href: '/right-triangle-calculator',
  },
];

const PI = Math.PI;
const RAD_TO_DEG = 180 / PI;
const DEG_TO_RAD = PI / 180;

export default function RightTriangleCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('two_sides');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<RightTriangleResult | null>(null);
  const [error, setError] = useState<string>('');

  const getInputFields = (type: CalculationType) => {
    switch (type) {
      case 'two_sides':
        return [
          { key: 'sideA', label: 'Side a', tooltip: 'Length of the first leg' },
          { key: 'sideB', label: 'Side b', tooltip: 'Length of the second leg' },
        ];
      case 'side_angle':
        return [
          { key: 'side', label: 'Side', tooltip: 'Length of one leg' },
          { key: 'angle', label: 'Angle', tooltip: 'One of the acute angles (in degrees)' },
        ];
      case 'hypotenuse_angle':
        return [
          { key: 'hypotenuse', label: 'Hypotenuse', tooltip: 'Length of the hypotenuse' },
          { key: 'angle', label: 'Angle', tooltip: 'One of the acute angles (in degrees)' },
        ];
    }
  };

  const getTriangleVisualization = (
    sideA: number,
    sideB: number,
    hypotenuse: number,
    angleA: number,
    angleB: number
  ) => {
    // Scale the triangle to fit the visualization
    const maxSide = Math.max(sideA, sideB, hypotenuse);
    const scale = 50 / maxSide;
    
    const scaledA = sideA * scale;
    const scaledB = sideB * scale;

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
        min: -10,
        max: scaledB + 10,
        name: 'X',
        nameLocation: 'middle',
        nameGap: 25,
        axisLine: { show: true },
      },
      yAxis: {
        type: 'value',
        min: -10,
        max: scaledA + 10,
        name: 'Y',
        nameLocation: 'middle',
        nameGap: 25,
        axisLine: { show: true },
      },
      series: [
        {
          type: 'line',
          data: [
            [0, 0],
            [scaledB, 0],
            [0, scaledA],
            [0, 0],
          ],
          symbol: 'circle',
          symbolSize: 8,
          label: {
            show: true,
            formatter: (params: any) => {
              switch (params.dataIndex) {
                case 0: return '90°';
                case 1: return `${angleB.toFixed(1)}°`;
                case 2: return `${angleA.toFixed(1)}°`;
                default: return '';
              }
            },
            position: 'inside',
          },
          lineStyle: {
            color: '#10B981',
            width: 2,
          },
        },
        {
          type: 'line',
          data: [[0, 0], [10, 10]],
          symbol: 'none',
          lineStyle: {
            color: '#10B981',
            width: 2,
            type: 'solid',
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
      let sideA: number, sideB: number, hypotenuse: number, angleA: number, angleB: number;

      switch (calculationType) {
        case 'two_sides': {
          sideA = parseFloat(dimensions['sideA']);
          sideB = parseFloat(dimensions['sideB']);
          
          if (isNaN(sideA) || isNaN(sideB) || sideA <= 0 || sideB <= 0) {
            throw new Error('Please enter valid positive numbers for both sides');
          }
          
          hypotenuse = Math.sqrt(sideA * sideA + sideB * sideB);
          angleA = Math.atan(sideA / sideB) * RAD_TO_DEG;
          angleB = Math.atan(sideB / sideA) * RAD_TO_DEG;
          
          steps.push(`Given: Side a = ${sideA} units, Side b = ${sideB} units`);
          steps.push('1. Calculate hypotenuse using Pythagorean theorem:');
          steps.push(`   c² = a² + b²`);
          steps.push(`   c² = ${sideA}² + ${sideB}²`);
          steps.push(`   c² = ${sideA * sideA} + ${sideB * sideB}`);
          steps.push(`   c = √${sideA * sideA + sideB * sideB}`);
          steps.push(`   c = ${hypotenuse.toFixed(4)} units`);
          steps.push('2. Calculate angles using trigonometry:');
          steps.push(`   angle A = arctan(a/b) = arctan(${sideA}/${sideB})`);
          steps.push(`   angle A = ${angleA.toFixed(2)}°`);
          steps.push(`   angle B = arctan(b/a) = arctan(${sideB}/${sideA})`);
          steps.push(`   angle B = ${angleB.toFixed(2)}°`);
          break;
        }
        
        case 'side_angle': {
          const side = parseFloat(dimensions['side']);
          const angle = parseFloat(dimensions['angle']);
          
          if (isNaN(side) || isNaN(angle) || side <= 0) {
            throw new Error('Please enter valid numbers');
          }
          if (angle <= 0 || angle >= 90) {
            throw new Error('Angle must be between 0 and 90 degrees');
          }
          
          const angleRad = angle * DEG_TO_RAD;
          sideA = side;
          sideB = side / Math.tan(angleRad);
          hypotenuse = side / Math.sin(angleRad);
          angleA = angle;
          angleB = 90 - angle;
          
          steps.push(`Given: Side = ${side} units, Angle = ${angle}°`);
          steps.push('1. Calculate other sides using trigonometry:');
          steps.push(`   Adjacent side = Given side ÷ tan(angle)`);
          steps.push(`   Adjacent side = ${side} ÷ tan(${angle}°)`);
          steps.push(`   Adjacent side = ${sideB.toFixed(4)} units`);
          steps.push(`   Hypotenuse = Given side ÷ sin(angle)`);
          steps.push(`   Hypotenuse = ${side} ÷ sin(${angle}°)`);
          steps.push(`   Hypotenuse = ${hypotenuse.toFixed(4)} units`);
          break;
        }
        
        case 'hypotenuse_angle': {
          const hypot = parseFloat(dimensions['hypotenuse']);
          const angle = parseFloat(dimensions['angle']);
          
          if (isNaN(hypot) || isNaN(angle) || hypot <= 0) {
            throw new Error('Please enter valid numbers');
          }
          if (angle <= 0 || angle >= 90) {
            throw new Error('Angle must be between 0 and 90 degrees');
          }
          
          const angleRad = angle * DEG_TO_RAD;
          hypotenuse = hypot;
          sideA = hypot * Math.sin(angleRad);
          sideB = hypot * Math.cos(angleRad);
          angleA = angle;
          angleB = 90 - angle;
          
          steps.push(`Given: Hypotenuse = ${hypot} units, Angle = ${angle}°`);
          steps.push('1. Calculate legs using trigonometry:');
          steps.push(`   Side a = Hypotenuse × sin(angle)`);
          steps.push(`   Side a = ${hypot} × sin(${angle}°)`);
          steps.push(`   Side a = ${sideA.toFixed(4)} units`);
          steps.push(`   Side b = Hypotenuse × cos(angle)`);
          steps.push(`   Side b = ${hypot} × cos(${angle}°)`);
          steps.push(`   Side b = ${sideB.toFixed(4)} units`);
          break;
        }
      }

      // Calculate additional properties
      const area = (sideA * sideB) / 2;
      const perimeter = sideA + sideB + hypotenuse;
      const height = (2 * area) / hypotenuse;

      steps.push('3. Calculate additional properties:');
      steps.push(`   Area = (a × b) ÷ 2 = (${sideA} × ${sideB}) ÷ 2 = ${area.toFixed(4)} square units`);
      steps.push(`   Perimeter = a + b + c = ${sideA} + ${sideB} + ${hypotenuse.toFixed(4)} = ${perimeter.toFixed(4)} units`);
      steps.push(`   Height to hypotenuse = (2 × Area) ÷ c = ${height.toFixed(4)} units`);

      setResult({
        sideA,
        sideB,
        hypotenuse,
        angleA,
        angleB,
        area,
        perimeter,
        height,
        steps,
        chartOption: getTriangleVisualization(sideA, sideB, hypotenuse, angleA, angleB),
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
          <h1 className="text-3xl font-bold">Right Triangle Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate all properties of a right triangle including sides, angles,
            area, perimeter, and height using different input methods
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
                          <p>Choose what information you have about the triangle</p>
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
                      <SelectItem value="two_sides">Using Two Legs</SelectItem>
                      <SelectItem value="side_angle">Using One Leg and Angle</SelectItem>
                      <SelectItem value="hypotenuse_angle">Using Hypotenuse and Angle</SelectItem>
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
                  {/* Triangle Properties */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Sides
                      </div>
                      <div className="mt-1 space-y-1">
                        <div>Side a: {result.sideA.toFixed(4)} units</div>
                        <div>Side b: {result.sideB.toFixed(4)} units</div>
                        <div>Hypotenuse: {result.hypotenuse.toFixed(4)} units</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Angles
                      </div>
                      <div className="mt-1 space-y-1">
                        <div>Angle A: {result.angleA.toFixed(2)}°</div>
                        <div>Angle B: {result.angleB.toFixed(2)}°</div>
                        <div>Right Angle: 90°</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Other Properties
                      </div>
                      <div className="mt-1 space-y-1">
                        <div>Area: {result.area.toFixed(4)} square units</div>
                        <div>Perimeter: {result.perimeter.toFixed(4)} units</div>
                        <div>Height to hypotenuse: {result.height.toFixed(4)} units</div>
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
                  Enter values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Right Triangles</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Key Properties</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>One angle is always 90°</li>
                  <li>Other angles sum to 90°</li>
                  <li>Follows Pythagorean theorem</li>
                  <li>Area = (base × height) ÷ 2</li>
                  <li>Perimeter = sum of all sides</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Trigonometric Ratios</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>sin(θ) = opposite / hypotenuse</li>
                  <li>cos(θ) = adjacent / hypotenuse</li>
                  <li>tan(θ) = opposite / adjacent</li>
                  <li>θ represents any acute angle</li>
                  <li>Ratios help find missing sides</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Construction and architecture</li>
                  <li>Navigation and surveying</li>
                  <li>Engineering calculations</li>
                  <li>Physics problems</li>
                  <li>Height and distance measurement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
