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
import * as echarts from 'echarts';
import 'echarts-gl';

type ShapeType = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'rectangular_prism';

interface SurfaceAreaResult {
  totalArea: number;
  lateralArea?: number;
  baseArea?: number;
  shape: ShapeType;
  dimensions: { [key: string]: number };
  steps: string[];
  chartOption: any;
}

const breadcrumbItems = [
  {
    label: 'Surface Area Calculator',
    href: '/surface-area-calculator',
  },
];

const PI = Math.PI;

export default function SurfaceAreaCalculator() {
  const [shapeType, setShapeType] = useState<ShapeType>('cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<SurfaceAreaResult | null>(null);
  const [error, setError] = useState<string>('');

  const getInputFields = (shape: ShapeType) => {
    switch (shape) {
      case 'cube':
        return [
          { key: 'side', label: 'Side Length', tooltip: 'Length of any side of the cube' },
        ];
      case 'sphere':
        return [
          { key: 'radius', label: 'Radius', tooltip: 'Radius of the sphere' },
        ];
      case 'cylinder':
        return [
          { key: 'radius', label: 'Radius', tooltip: 'Radius of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the cylinder' },
        ];
      case 'cone':
        return [
          { key: 'radius', label: 'Radius', tooltip: 'Radius of the base' },
          { key: 'height', label: 'Height', tooltip: 'Height of the cone' },
        ];
      case 'rectangular_prism':
        return [
          { key: 'length', label: 'Length', tooltip: 'Length of the rectangular prism' },
          { key: 'width', label: 'Width', tooltip: 'Width of the rectangular prism' },
          { key: 'height', label: 'Height', tooltip: 'Height of the rectangular prism' },
        ];
    }
  };

  const getShapeVisualization = (shape: ShapeType, dimensions: { [key: string]: number }) => {
    // Generate points based on shape type
    const getShapePoints = () => {
      switch (shape) {
        case 'cube': {
          const side = dimensions.side / 2; // Half-side for center alignment
          return [
            // Front face
            [-side, -side, side], [side, -side, side], [side, side, side], [-side, side, side],
            // Back face
            [-side, -side, -side], [side, -side, -side], [side, side, -side], [-side, side, -side],
          ];
        }
        case 'sphere': {
          const points = [];
          const radius = dimensions.radius;
          const segments = 20;
          
          for (let i = 0; i <= segments; i++) {
            const lat = (i * Math.PI) / segments - Math.PI / 2;
            for (let j = 0; j <= segments; j++) {
              const lon = (j * 2 * Math.PI) / segments;
              points.push([
                radius * Math.cos(lat) * Math.cos(lon),
                radius * Math.cos(lat) * Math.sin(lon),
                radius * Math.sin(lat)
              ]);
            }
          }
          return points;
        }
        case 'cylinder': {
          const points = [];
          const radius = dimensions.radius;
          const height = dimensions.height / 2;
          const segments = 20;
          
          // Top and bottom circles
          for (let i = 0; i <= segments; i++) {
            const angle = (i * 2 * Math.PI) / segments;
            points.push(
              [radius * Math.cos(angle), radius * Math.sin(angle), height],
              [radius * Math.cos(angle), radius * Math.sin(angle), -height]
            );
          }
          return points;
        }
        case 'cone': {
          const points = [];
          const radius = dimensions.radius;
          const height = dimensions.height;
          const segments = 20;
          
          // Base circle
          for (let i = 0; i <= segments; i++) {
            const angle = (i * 2 * Math.PI) / segments;
            points.push([radius * Math.cos(angle), radius * Math.sin(angle), 0]);
          }
          // Apex
          points.push([0, 0, height]);
          return points;
        }
        case 'rectangular_prism': {
          const length = dimensions.length / 2;
          const width = dimensions.width / 2;
          const height = dimensions.height / 2;
          
          return [
            // Front face
            [-length, -width, height], [length, -width, height],
            [length, width, height], [-length, width, height],
            // Back face
            [-length, -width, -height], [length, -width, -height],
            [length, width, -height], [-length, width, -height],
          ];
        }
        default:
          return [];
      }
    };

    const points = getShapePoints();

    return {
      tooltip: {},
      backgroundColor: 'transparent',
      xAxis3D: {
        type: 'value',
        min: -50,
        max: 50,
      },
      yAxis3D: {
        type: 'value',
        min: -50,
        max: 50,
      },
      zAxis3D: {
        type: 'value',
        min: -50,
        max: 50,
      },
      grid3D: {
        viewControl: {
          projection: 'orthographic',
          autoRotate: true,
          autoRotateSpeed: 10,
          distance: 150,
        },
        boxWidth: 100,
        boxHeight: 100,
        boxDepth: 100,
      },
      series: [
        {
          type: 'scatter3D',
          data: points,
          symbolSize: 2,
          itemStyle: {
            color: '#10B981',
          },
          emphasis: {
            itemStyle: {
              color: '#059669',
            },
          },
        },
        // Add lines to connect points for shapes
        {
          type: 'line3D',
          data: points,
          lineStyle: {
            width: 2,
            color: '#10B981',
          },
        },
      ],
    };
  };

  const calculate = () => {
    try {
      setError('');
      const steps: string[] = [];
      const dimensionValues: { [key: string]: number } = {};
      
      // Validate and parse all input dimensions
      getInputFields(shapeType).forEach(({ key, label }) => {
        const value = parseFloat(dimensions[key]);
        if (isNaN(value) || value <= 0) {
          throw new Error(`Please enter a valid positive number for ${label}`);
        }
        dimensionValues[key] = value;
      });

      let totalArea = 0;
      let lateralArea = 0;
      let baseArea = 0;

      switch (shapeType) {
        case 'cube': {
          const side = dimensionValues.side;
          totalArea = 6 * side * side;
          
          steps.push(`Given: Side length = ${side} units`);
          steps.push('For a cube:');
          steps.push(`1. Surface Area = 6 × side²`);
          steps.push(`2. Surface Area = 6 × ${side}²`);
          steps.push(`3. Surface Area = 6 × ${side * side}`);
          steps.push(`4. Surface Area = ${totalArea} square units`);
          break;
        }
        
        case 'sphere': {
          const radius = dimensionValues.radius;
          totalArea = 4 * PI * radius * radius;
          
          steps.push(`Given: Radius = ${radius} units`);
          steps.push('For a sphere:');
          steps.push(`1. Surface Area = 4π × radius²`);
          steps.push(`2. Surface Area = 4 × ${PI.toFixed(4)} × ${radius}²`);
          steps.push(`3. Surface Area = ${(4 * PI).toFixed(4)} × ${radius * radius}`);
          steps.push(`4. Surface Area = ${totalArea.toFixed(4)} square units`);
          break;
        }
        
        case 'cylinder': {
          const radius = dimensionValues.radius;
          const height = dimensionValues.height;
          lateralArea = 2 * PI * radius * height;
          baseArea = PI * radius * radius;
          totalArea = lateralArea + 2 * baseArea;
          
          steps.push(`Given: Radius = ${radius} units, Height = ${height} units`);
          steps.push('For a cylinder:');
          steps.push('1. Lateral Surface Area = 2π × radius × height');
          steps.push(`   = 2 × ${PI.toFixed(4)} × ${radius} × ${height}`);
          steps.push(`   = ${lateralArea.toFixed(4)} square units`);
          steps.push('2. Base Area = π × radius²');
          steps.push(`   = ${PI.toFixed(4)} × ${radius}²`);
          steps.push(`   = ${baseArea.toFixed(4)} square units`);
          steps.push('3. Total Surface Area = Lateral Area + 2 × Base Area');
          steps.push(`   = ${lateralArea.toFixed(4)} + 2 × ${baseArea.toFixed(4)}`);
          steps.push(`   = ${totalArea.toFixed(4)} square units`);
          break;
        }
        
        case 'cone': {
          const radius = dimensionValues.radius;
          const height = dimensionValues.height;
          const slantHeight = Math.sqrt(radius * radius + height * height);
          lateralArea = PI * radius * slantHeight;
          baseArea = PI * radius * radius;
          totalArea = lateralArea + baseArea;
          
          steps.push(`Given: Radius = ${radius} units, Height = ${height} units`);
          steps.push('For a cone:');
          steps.push('1. Calculate slant height (s):');
          steps.push(`   s = √(radius² + height²)`);
          steps.push(`   s = √(${radius}² + ${height}²)`);
          steps.push(`   s = ${slantHeight.toFixed(4)} units`);
          steps.push('2. Lateral Surface Area = π × radius × slant height');
          steps.push(`   = ${PI.toFixed(4)} × ${radius} × ${slantHeight.toFixed(4)}`);
          steps.push(`   = ${lateralArea.toFixed(4)} square units`);
          steps.push('3. Base Area = π × radius²');
          steps.push(`   = ${PI.toFixed(4)} × ${radius}²`);
          steps.push(`   = ${baseArea.toFixed(4)} square units`);
          steps.push('4. Total Surface Area = Lateral Area + Base Area');
          steps.push(`   = ${lateralArea.toFixed(4)} + ${baseArea.toFixed(4)}`);
          steps.push(`   = ${totalArea.toFixed(4)} square units`);
          break;
        }
        
        case 'rectangular_prism': {
          const length = dimensionValues.length;
          const width = dimensionValues.width;
          const height = dimensionValues.height;
          totalArea = 2 * (length * width + length * height + width * height);
          
          steps.push(`Given: Length = ${length} units, Width = ${width} units, Height = ${height} units`);
          steps.push('For a rectangular prism:');
          steps.push('1. Surface Area = 2(length × width + length × height + width × height)');
          steps.push(`2. Surface Area = 2(${length} × ${width} + ${length} × ${height} + ${width} × ${height})`);
          steps.push(`3. Surface Area = 2(${length * width} + ${length * height} + ${width * height})`);
          steps.push(`4. Surface Area = 2(${length * width + length * height + width * height})`);
          steps.push(`5. Surface Area = ${totalArea} square units`);
          break;
        }
      }

      setResult({
        totalArea,
        lateralArea,
        baseArea,
        shape: shapeType,
        dimensions: dimensionValues,
        steps,
        chartOption: getShapeVisualization(shapeType, dimensionValues),
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

  const handleShapeTypeChange = (type: ShapeType) => {
    setShapeType(type);
    setDimensions({});
    setResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Surface Area Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the surface area of various 3D shapes including cubes, spheres,
            cylinders, cones, and rectangular prisms
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
                  <Label htmlFor="shapeType">
                    Shape{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the 3D shape to calculate surface area</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select
                    value={shapeType}
                    onValueChange={(value) =>
                      handleShapeTypeChange(value as ShapeType)
                    }
                  >
                    <SelectTrigger 
                      id="shapeType" 
                      className="bg-white text-black "
                    >
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cube">Cube</SelectItem>
                      <SelectItem value="sphere">Sphere</SelectItem>
                      <SelectItem value="cylinder">Cylinder</SelectItem>
                      <SelectItem value="cone">Cone</SelectItem>
                      <SelectItem value="rectangular_prism">Rectangular Prism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {getInputFields(shapeType).map(({ key, label, tooltip }) => (
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
                  {/* Surface Area Results */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 ">
                      <div className="text-sm font-medium text-muted-foreground">
                        Total Surface Area
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {result.totalArea.toFixed(4)} square units
                      </div>
                    </div>
                    {result.lateralArea !== undefined && (
                      <div className="bg-gray-50 ">
                        <div className="text-sm font-medium text-muted-foreground">
                          Lateral Surface Area
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {result.lateralArea.toFixed(4)} square units
                        </div>
                      </div>
                    )}
                    {result.baseArea !== undefined && (
                      <div className="bg-gray-50 ">
                        <div className="text-sm font-medium text-muted-foreground">
                          Base Area
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {result.baseArea.toFixed(4)} square units
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shape Visualization */}
                  <div className="bg-gray-50 ">
                    <h3 className="text-lg font-semibold mb-4">Shape Visualization</h3>
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
            <h2 className="text-2xl font-semibold">Understanding Surface Area</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Shapes</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Cube: 6 × side²</li>
                  <li>Sphere: 4π × radius²</li>
                  <li>Cylinder: 2πr² + 2πrh</li>
                  <li>Cone: πr² + πrs</li>
                  <li>Rectangular Prism: 2(lw + lh + wh)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Concepts</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Total vs. Lateral Area</li>
                  <li>Base Area importance</li>
                  <li>Units are squared</li>
                  <li>All dimensions must be positive</li>
                  <li>Use consistent units</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Architecture and construction</li>
                  <li>Packaging design</li>
                  <li>Material requirements</li>
                  <li>Heat transfer calculations</li>
                  <li>Cost estimation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
