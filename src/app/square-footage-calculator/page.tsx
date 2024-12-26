'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const breadcrumbItems = [
  {
    label: 'Square Footage Calculator',
    href: '/square-footage-calculator',
  },
];

type Shape = 'rectangle' | 'circle' | 'triangle' | 'custom';
type Unit = 'ft' | 'yd' | 'm' | 'in' | 'acre';

interface Dimensions {
  length?: string;
  width?: string;
  radius?: string;
  base?: string;
  height?: string;
}

interface Result {
  squareFootage: number;
  conversions: {
    [key in Unit]: number;
  };
}

const CONVERSION_FACTORS: { [key in Unit]: number } = {
  'ft': 1,
  'yd': 9,
  'm': 10.76,
  'in': 0.00064516,
  'acre': 43560,
};

export default function SquareFootageCalculator() {
  const [shape, setShape] = useState<Shape>('rectangle');
  const [dimensions, setDimensions] = useState<Dimensions>({});
  const [result, setResult] = useState<Result | null>(null);
  const [sections, setSections] = useState<Result[]>([]);

  const calculateSquareFootage = () => {
    let squareFootage = 0;

    switch (shape) {
      case 'rectangle':
        const length = parseFloat(dimensions.length || '0');
        const width = parseFloat(dimensions.width || '0');
        if (length && width) {
          squareFootage = length * width;
        }
        break;
      case 'circle':
        const radius = parseFloat(dimensions.radius || '0');
        if (radius) {
          squareFootage = Math.PI * radius * radius;
        }
        break;
      case 'triangle':
        const base = parseFloat(dimensions.base || '0');
        const height = parseFloat(dimensions.height || '0');
        if (base && height) {
          squareFootage = (base * height) / 2;
        }
        break;
    }

    const conversions = Object.entries(CONVERSION_FACTORS).reduce((acc, [unit, factor]) => ({
      ...acc,
      [unit]: squareFootage / factor,
    }), {} as { [key in Unit]: number });

    const result = { squareFootage, conversions };
    setResult(result);
    return result;
  };

  const addSection = () => {
    const newSection = calculateSquareFootage();
    setSections([...sections, newSection]);
    setDimensions({});
  };

  const getTotalSquareFootage = () => {
    return sections.reduce((total, section) => total + section.squareFootage, 0);
  };

  const renderDimensionInputs = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Length (ft)</span>
              </label>
              <Input
                type="number"
                value={dimensions.length || ''}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Enter length"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Width (ft)</span>
              </label>
              <Input
                type="number"
                value={dimensions.width || ''}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Enter width"
              />
            </div>
          </>
        );
      case 'circle':
        return (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Radius (ft)</span>
            </label>
            <Input
              type="number"
              value={dimensions.radius || ''}
              onChange={(e) => setDimensions({ ...dimensions, radius: e.target.value })}
              min="0"
              step="0.01"
              placeholder="Enter radius"
            />
          </div>
        );
      case 'triangle':
        return (
          <>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Base (ft)</span>
              </label>
              <Input
                type="number"
                value={dimensions.base || ''}
                onChange={(e) => setDimensions({ ...dimensions, base: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Enter base"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Height (ft)</span>
              </label>
              <Input
                type="number"
                value={dimensions.height || ''}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                min="0"
                step="0.01"
                placeholder="Enter height"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Square Footage Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate square footage for various shapes and convert between different units.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-lg font-semibold">Painting Estimates</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Professional painters use square footage to estimate paint needed. One gallon typically covers 350-400 sq ft.
                Consider multiple coats and surface type when calculating.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-lg font-semibold">Flooring Installation</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add 10% to your square footage for waste factor when ordering flooring materials. Different materials like hardwood,
                laminate, or tile have varying costs per square foot.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-lg font-semibold">Construction Costs</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Building costs typically range from $100-200 per square foot, varying by location and materials.
                Always get detailed quotes from contractors.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Area</h2>
              <p className="text-muted-foreground">
                Select a shape and enter dimensions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shape</span>
                  </label>
                  <Select
                    value={shape}
                    onValueChange={(value: Shape) => {
                      setShape(value);
                      setDimensions({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle/Square</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="triangle">Triangle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {renderDimensionInputs()}
                </div>

                <div className="flex space-x-4">
                  <Button onClick={calculateSquareFootage}>Calculate</Button>
                  <Button 
                    variant="outline" 
                    onClick={addSection}
                    className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500 hover:border-amber-600"
                  >
                    Add Section
                  </Button>
                </div>

                {sections.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Added Sections</h3>
                    <ul className="space-y-2">
                      {sections.map((section, index) => (
                        <li key={index} className="text-sm bg-amber-500/10 p-2 rounded">
                          Section {index + 1}: {section.squareFootage.toFixed(2)} sq ft
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-4 bg-amber-500 text-white rounded-lg">
                      <p className="font-medium">
                        Total Area: {getTotalSquareFootage().toFixed(2)} sq ft
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Results</h2>
                <p className="text-muted-foreground">
                  Area calculations and conversions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Square Footage</h3>
                    <p className="text-3xl font-bold">
                      {result.squareFootage.toFixed(2)} sq ft
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Conversions</h3>
                    <ul className="space-y-2">
                      <li>Square Yards: {result.conversions.yd.toFixed(2)} sq yd</li>
                      <li>Square Meters: {result.conversions.m.toFixed(2)} sq m</li>
                      <li>Square Inches: {result.conversions.in.toFixed(2)} sq in</li>
                      <li>Acres: {result.conversions.acre.toFixed(4)} acres</li>
                    </ul>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Common Applications</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded">
                        <h4 className="font-medium mb-2">Painting</h4>
                        <p className="text-sm text-muted-foreground">
                          For {result.squareFootage.toFixed(0)} sq ft, you'll need approximately {Math.ceil(result.squareFootage / 350)} gallons of paint
                          for one coat coverage.
                        </p>
                      </div>
                      
                      <div className="p-3 bg-muted rounded">
                        <h4 className="font-medium mb-2">Flooring</h4>
                        <p className="text-sm text-muted-foreground">
                          Order {Math.ceil(result.squareFootage * 1.1)} sq ft of flooring materials to account for waste and cuts.
                        </p>
                      </div>

                      <div className="p-3 bg-muted rounded">
                        <h4 className="font-medium mb-2">Cost Estimation</h4>
                        <p className="text-sm text-muted-foreground">
                          Estimated construction cost range: ${(result.squareFootage * 100).toLocaleString()} - ${(result.squareFootage * 200).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Usage Tips</h3>
                    <ul className="text-sm space-y-1">
                      <li>• For complex shapes, break down into simple sections and add them together</li>
                      <li>• Use precise measurements for accurate results</li>
                      <li>• Add 10% extra for materials to account for waste</li>
                      <li>• Consider multiple coats for painting calculations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
