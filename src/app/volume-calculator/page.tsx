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

type ShapeType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'rectangular_prism' | 'pyramid' | 'ellipsoid';

interface VolumeResult {
  volume: number;
  surfaceArea: number;
  shape: ShapeType;
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Volume Calculator',
    href: '/volume-calculator',
  },
];

export default function VolumeCalculator() {
  const [shapeType, setShapeType] = useState<ShapeType>('cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<VolumeResult | null>(null);
  const [error, setError] = useState<string>('');

  const getShapeInputs = (shape: ShapeType) => {
    switch (shape) {
      case 'cube':
        return [{ key: 'side', label: 'Side Length', tooltip: 'Length of one side' }];
      case 'sphere':
        return [{ key: 'radius', label: 'Radius', tooltip: 'Radius of the sphere' }];
      case 'cylinder':
        return [
          { key: 'radius', label: 'Radius', tooltip: 'Radius of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the cylinder' }
        ];
      case 'cone':
        return [
          { key: 'radius', label: 'Radius', tooltip: 'Radius of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the cone' }
        ];
      case 'rectangular_prism':
        return [
          { key: 'length', label: 'Length', tooltip: 'Length of the prism' },
          { key: 'width', label: 'Width', tooltip: 'Width of the prism' },
          { key: 'height', label: 'Height', tooltip: 'Height of the prism' }
        ];
      case 'pyramid':
        return [
          { key: 'baseLength', label: 'Base Length', tooltip: 'Length of the base' },
          { key: 'baseWidth', label: 'Base Width', tooltip: 'Width of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the pyramid' }
        ];
      case 'ellipsoid':
        return [
          { key: 'a', label: 'Semi-axis a', tooltip: 'First semi-axis length' },
          { key: 'b', label: 'Semi-axis b', tooltip: 'Second semi-axis length' },
          { key: 'c', label: 'Semi-axis c', tooltip: 'Third semi-axis length' }
        ];
      default:
        return [];
    }
  };

  const getShapeVisualization = (shape: ShapeType, dimensions: { [key: string]: number }) => {
    const baseOption = {
      tooltip: {},
      backgroundColor: '#fff',
      visualMap: {
        show: false,
        dimension: 2,
        min: -1,
        max: 1,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9']
        }
      },
      xAxis3D: {
        type: 'value',
        min: -10,
        max: 10
      },
      yAxis3D: {
        type: 'value',
        min: -10,
        max: 10
      },
      zAxis3D: {
        type: 'value',
        min: -10,
        max: 10
      },
      grid3D: {
        viewControl: {
          projection: 'orthographic',
          autoRotate: true
        },
        boxHeight: 100
      }
    };

    const generateSphereData = (radius: number, count: number = 1000) => {
      const data = [];
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        data.push([x, y, z]);
      }
      return data;
    };

    switch (shape) {
      case 'cube': {
        const s = dimensions.side;
        return {
          ...baseOption,
          series: [{
            type: 'scatter3D',
            data: [
              [-s/2, -s/2, -s/2], [s/2, -s/2, -s/2], [s/2, s/2, -s/2], [-s/2, s/2, -s/2],
              [-s/2, -s/2, s/2], [s/2, -s/2, s/2], [s/2, s/2, s/2], [-s/2, s/2, s/2]
            ],
            symbolSize: 1,
            itemStyle: {
              color: '#3B82F6',
              opacity: 0.7
            }
          }]
        };
      }
      case 'sphere': {
        const r = dimensions.radius;
        return {
          ...baseOption,
          series: [{
            type: 'scatter3D',
            data: generateSphereData(r),
            symbolSize: 3,
            itemStyle: {
              color: '#3B82F6',
              opacity: 0.7
            }
          }]
        };
      }
      // Add more shape visualizations as needed
      default:
        return baseOption;
    }
  };

  const calculate = () => {
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

      let volume = 0;
      let surfaceArea = 0;
      let steps: string[] = [];

      switch (shapeType) {
        case 'cube': {
          const s = dims.side;
          volume = Math.pow(s, 3);
          surfaceArea = 6 * Math.pow(s, 2);
          steps = [
            'Step 1: Use the formula for cube volume',
            'V = s³',
            `V = ${s}³`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Surface Area = 6s²',
            `Surface Area = 6 × ${s}²`,
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'sphere': {
          const r = dims.radius;
          volume = (4/3) * Math.PI * Math.pow(r, 3);
          surfaceArea = 4 * Math.PI * Math.pow(r, 2);
          steps = [
            'Step 1: Use the formula for sphere volume',
            'V = (4/3)πr³',
            `V = (4/3) × π × ${r}³`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Surface Area = 4πr²',
            `Surface Area = 4 × π × ${r}²`,
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'cylinder': {
          const r = dims.radius;
          const h = dims.height;
          volume = Math.PI * Math.pow(r, 2) * h;
          surfaceArea = 2 * Math.PI * r * (r + h);
          steps = [
            'Step 1: Use the formula for cylinder volume',
            'V = πr²h',
            `V = π × ${r}² × ${h}`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Surface Area = 2πr(r + h)',
            `Surface Area = 2 × π × ${r} × (${r} + ${h})`,
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'cone': {
          const r = dims.radius;
          const h = dims.height;
          volume = (1/3) * Math.PI * Math.pow(r, 2) * h;
          const slantHeight = Math.sqrt(Math.pow(r, 2) + Math.pow(h, 2));
          surfaceArea = Math.PI * r * (r + slantHeight);
          steps = [
            'Step 1: Use the formula for cone volume',
            'V = (1/3)πr²h',
            `V = (1/3) × π × ${r}² × ${h}`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Step 2: Calculate slant height',
            's = √(r² + h²)',
            `s = √(${r}² + ${h}²)`,
            `s = ${slantHeight.toFixed(4)}`,
            '',
            'Surface Area = πr(r + s)',
            `Surface Area = π × ${r} × (${r} + ${slantHeight.toFixed(4)})`,
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'rectangular_prism': {
          const l = dims.length;
          const w = dims.width;
          const h = dims.height;
          volume = l * w * h;
          surfaceArea = 2 * (l * w + l * h + w * h);
          steps = [
            'Step 1: Use the formula for rectangular prism volume',
            'V = l × w × h',
            `V = ${l} × ${w} × ${h}`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Surface Area = 2(lw + lh + wh)',
            `Surface Area = 2(${l}×${w} + ${l}×${h} + ${w}×${h})`,
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'pyramid': {
          const l = dims.baseLength;
          const w = dims.baseWidth;
          const h = dims.height;
          volume = (1/3) * l * w * h;
          const slantHeightL = Math.sqrt(Math.pow(h, 2) + Math.pow(l/2, 2));
          const slantHeightW = Math.sqrt(Math.pow(h, 2) + Math.pow(w/2, 2));
          surfaceArea = l * w + l * slantHeightW + w * slantHeightL;
          steps = [
            'Step 1: Use the formula for pyramid volume',
            'V = (1/3) × base area × height',
            `V = (1/3) × ${l} × ${w} × ${h}`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Step 2: Calculate surface area',
            'Base area + triangular faces',
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
        case 'ellipsoid': {
          const a = dims.a;
          const b = dims.b;
          const c = dims.c;
          volume = (4/3) * Math.PI * a * b * c;
          // Approximation of surface area
          surfaceArea = 4 * Math.PI * Math.pow(((Math.pow(a * b, 1.6) + Math.pow(a * c, 1.6) + Math.pow(b * c, 1.6))/3), 1/1.6);
          steps = [
            'Step 1: Use the formula for ellipsoid volume',
            'V = (4/3)π × a × b × c',
            `V = (4/3) × π × ${a} × ${b} × ${c}`,
            `V = ${volume.toFixed(4)} cubic units`,
            '',
            'Surface Area (approximation)',
            `Surface Area = ${surfaceArea.toFixed(4)} square units`
          ];
          break;
        }
      }

      setResult({
        volume,
        surfaceArea,
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Volume Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Volume</h2>
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
                          <p>Select the 3D shape to calculate its volume</p>
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
                      <SelectItem value="cube" className="hover:bg-gray-50">Cube</SelectItem>
                      <SelectItem value="sphere" className="hover:bg-gray-50">Sphere</SelectItem>
                      <SelectItem value="cylinder" className="hover:bg-gray-50">Cylinder</SelectItem>
                      <SelectItem value="cone" className="hover:bg-gray-50">Cone</SelectItem>
                      <SelectItem value="rectangular_prism" className="hover:bg-gray-50">Rectangular Prism</SelectItem>
                      <SelectItem value="pyramid" className="hover:bg-gray-50">Pyramid</SelectItem>
                      <SelectItem value="ellipsoid" className="hover:bg-gray-50">Ellipsoid</SelectItem>
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
                  {/* Volume Result */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Volume
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {result.volume.toFixed(4)} cubic units
                    </div>
                  </div>

                  {/* Surface Area Result */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Surface Area
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {result.surfaceArea.toFixed(4)} square units
                    </div>
                  </div>

                  {/* Shape Visualization */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">3D Visualization</h3>
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
            <h2 className="text-2xl font-semibold">Understanding Volume Calculations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Shapes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Cube: s³</li>
                  <li>Sphere: (4/3)πr³</li>
                  <li>Cylinder: πr²h</li>
                  <li>Cone: (1/3)πr²h</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Shapes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Rectangular Prism: l × w × h</li>
                  <li>Pyramid: (1/3) × base × height</li>
                  <li>Ellipsoid: (4/3)π × a × b × c</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Units must be consistent</li>
                  <li>All dimensions must be positive</li>
                  <li>Check measurements twice</li>
                  <li>Consider scale factors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
