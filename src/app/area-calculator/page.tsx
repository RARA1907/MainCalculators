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

type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle' | 'trapezoid' | 'parallelogram' | 'ellipse';

interface AreaResult {
  area: number;
  perimeter?: number;
  shape: ShapeType;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Area Calculator',
    href: '/area-calculator',
  },
];

export default function AreaCalculator() {
  const [shapeType, setShapeType] = useState<ShapeType>('circle');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<AreaResult | null>(null);
  const [error, setError] = useState<string>('');

  const getShapeInputs = (shape: ShapeType) => {
    switch (shape) {
      case 'circle':
        return [{ key: 'radius', label: 'Radius', tooltip: 'Radius of the circle' }];
      case 'square':
        return [{ key: 'side', label: 'Side Length', tooltip: 'Length of one side' }];
      case 'rectangle':
        return [
          { key: 'length', label: 'Length', tooltip: 'Length of the rectangle' },
          { key: 'width', label: 'Width', tooltip: 'Width of the rectangle' }
        ];
      case 'triangle':
        return [
          { key: 'base', label: 'Base', tooltip: 'Length of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the triangle' }
        ];
      case 'trapezoid':
        return [
          { key: 'a', label: 'Top Base', tooltip: 'Length of the top base' },
          { key: 'b', label: 'Bottom Base', tooltip: 'Length of the bottom base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the trapezoid' }
        ];
      case 'parallelogram':
        return [
          { key: 'base', label: 'Base', tooltip: 'Length of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the parallelogram' }
        ];
      case 'ellipse':
        return [
          { key: 'a', label: 'Semi-major Axis', tooltip: 'Length of the semi-major axis' },
          { key: 'b', label: 'Semi-minor Axis', tooltip: 'Length of the semi-minor axis' }
        ];
      default:
        return [];
    }
  };

  const getShapeVisualization = (shape: ShapeType, dimensions: { [key: string]: number }) => {
    const baseOption = {
      grid: { top: 10, right: 10, bottom: 10, left: 10 },
      xAxis: { show: false, min: -10, max: 10 },
      yAxis: { show: false, min: -10, max: 10 },
      tooltip: { show: true },
    };

    switch (shape) {
      case 'circle': {
        const r = dimensions.radius;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: (params: any, api: any) => ({
              type: 'circle',
              shape: { cx: 0, cy: 0, r: r * 5 },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'square': {
        const side = dimensions.side * 5;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'rect',
              shape: { x: -side/2, y: -side/2, width: side, height: side },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'rectangle': {
        const length = dimensions.length * 5;
        const width = dimensions.width * 5;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'rect',
              shape: { x: -length/2, y: -width/2, width: length, height: width },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'triangle': {
        const base = dimensions.base * 5;
        const height = dimensions.height * 5;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'polygon',
              shape: {
                points: [[-base/2, height/2], [base/2, height/2], [0, -height/2]]
              },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'trapezoid': {
        const a = dimensions.a * 5;
        const b = dimensions.b * 5;
        const h = dimensions.height * 5;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'polygon',
              shape: {
                points: [
                  [-b/2, h/2], [b/2, h/2],
                  [a/2, -h/2], [-a/2, -h/2]
                ]
              },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'parallelogram': {
        const base = dimensions.base * 5;
        const height = dimensions.height * 5;
        const skew = height/2;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'polygon',
              shape: {
                points: [
                  [-base/2 + skew, height/2],
                  [base/2 + skew, height/2],
                  [base/2 - skew, -height/2],
                  [-base/2 - skew, -height/2]
                ]
              },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      case 'ellipse': {
        const a = dimensions.a * 5;
        const b = dimensions.b * 5;
        return {
          ...baseOption,
          series: [{
            type: 'custom',
            renderItem: () => ({
              type: 'ellipse',
              shape: { cx: 0, cy: 0, rx: a, ry: b },
              style: { fill: '#3B82F6', opacity: 0.7 }
            }),
            data: [[0, 0]]
          }]
        };
      }
      default:
        return baseOption;
    }
  };

  const calculateArea = () => {
    try {
      setError('');
      const dims: { [key: string]: number } = {};
      for (const [key, value] of Object.entries(dimensions)) {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
          throw new Error(`Please enter a valid positive number for ${key}`);
        }
        dims[key] = num;
      }

      let area = 0;
      let perimeter = 0;
      let steps: string[] = [];

      switch (shapeType) {
        case 'circle': {
          const r = dims.radius;
          area = Math.PI * r * r;
          perimeter = 2 * Math.PI * r;
          steps = [
            'Step 1: Use the formula for circle area',
            'A = πr²',
            `A = π × ${r}²`,
            `A = ${area.toFixed(4)} square units`,
            '',
            'Perimeter = 2πr',
            `Perimeter = 2 × π × ${r}`,
            `Perimeter = ${perimeter.toFixed(4)} units`
          ];
          break;
        }
        case 'square': {
          const s = dims.side;
          area = s * s;
          perimeter = 4 * s;
          steps = [
            'Step 1: Use the formula for square area',
            'A = s²',
            `A = ${s}²`,
            `A = ${area.toFixed(4)} square units`,
            '',
            'Perimeter = 4s',
            `Perimeter = 4 × ${s}`,
            `Perimeter = ${perimeter.toFixed(4)} units`
          ];
          break;
        }
        case 'rectangle': {
          const l = dims.length;
          const w = dims.width;
          area = l * w;
          perimeter = 2 * (l + w);
          steps = [
            'Step 1: Use the formula for rectangle area',
            'A = l × w',
            `A = ${l} × ${w}`,
            `A = ${area.toFixed(4)} square units`,
            '',
            'Perimeter = 2(l + w)',
            `Perimeter = 2(${l} + ${w})`,
            `Perimeter = ${perimeter.toFixed(4)} units`
          ];
          break;
        }
        case 'triangle': {
          const b = dims.base;
          const h = dims.height;
          area = (b * h) / 2;
          steps = [
            'Step 1: Use the formula for triangle area',
            'A = (b × h) ÷ 2',
            `A = (${b} × ${h}) ÷ 2`,
            `A = ${area.toFixed(4)} square units`
          ];
          break;
        }
        case 'trapezoid': {
          const a = dims.a;
          const b = dims.b;
          const h = dims.height;
          area = ((a + b) * h) / 2;
          steps = [
            'Step 1: Use the formula for trapezoid area',
            'A = [(a + b) × h] ÷ 2',
            `A = [(${a} + ${b}) × ${h}] ÷ 2`,
            `A = ${area.toFixed(4)} square units`
          ];
          break;
        }
        case 'parallelogram': {
          const b = dims.base;
          const h = dims.height;
          area = b * h;
          steps = [
            'Step 1: Use the formula for parallelogram area',
            'A = b × h',
            `A = ${b} × ${h}`,
            `A = ${area.toFixed(4)} square units`
          ];
          break;
        }
        case 'ellipse': {
          const a = dims.a;
          const b = dims.b;
          area = Math.PI * a * b;
          steps = [
            'Step 1: Use the formula for ellipse area',
            'A = π × a × b',
            `A = π × ${a} × ${b}`,
            `A = ${area.toFixed(4)} square units`
          ];
          break;
        }
      }

      setResult({
        area,
        perimeter,
        shape: shapeType,
        steps,
        chartOption: getShapeVisualization(shapeType, dims)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  const handleShapeChange = (shape: ShapeType) => {
    setShapeType(shape);
    setDimensions({});
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Area Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Area</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shape</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the shape to calculate its area</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Select
                    value={shapeType}
                    onValueChange={(value: ShapeType) => handleShapeChange(value)}
                  >
                    <SelectTrigger className="bg-white text-black border border-gray-200 hover:bg-gray-50">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle" className="hover:bg-gray-50">Circle</SelectItem>
                      <SelectItem value="square" className="hover:bg-gray-50">Square</SelectItem>
                      <SelectItem value="rectangle" className="hover:bg-gray-50">Rectangle</SelectItem>
                      <SelectItem value="triangle" className="hover:bg-gray-50">Triangle</SelectItem>
                      <SelectItem value="trapezoid" className="hover:bg-gray-50">Trapezoid</SelectItem>
                      <SelectItem value="parallelogram" className="hover:bg-gray-50">Parallelogram</SelectItem>
                      <SelectItem value="ellipse" className="hover:bg-gray-50">Ellipse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {getShapeInputs(shapeType).map(({ key, label, tooltip }) => (
                  <div key={key} className="form-control">
                    <label className="label">
                      <span className="label-text">{label}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      type="number"
                      placeholder={`Enter ${label.toLowerCase()}`}
                      value={dimensions[key] || ''}
                      onChange={(e) => setDimensions({ ...dimensions, [key]: e.target.value })}
                      className="w-full"
                    />
                  </div>
                ))}

                <Button
                  onClick={calculateArea}
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
                  {/* Area Result */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Area
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {result.area.toFixed(4)} square units
                    </div>
                  </div>

                  {/* Perimeter Result (if applicable) */}
                  {result.perimeter && (
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Perimeter
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.perimeter.toFixed(4)} units
                      </div>
                    </div>
                  )}

                  {/* Shape Visualization */}
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
                  Enter dimensions and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Area Calculations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Shapes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Circle: πr²</li>
                  <li>Square: s²</li>
                  <li>Rectangle: l × w</li>
                  <li>Triangle: (b × h) ÷ 2</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Shapes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Trapezoid: [(a + b) × h] ÷ 2</li>
                  <li>Parallelogram: b × h</li>
                  <li>Ellipse: π × a × b</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Units must be consistent</li>
                  <li>All dimensions must be positive</li>
                  <li>Check your measurements twice</li>
                  <li>Round answers appropriately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
