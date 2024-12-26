'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';

interface GravelType {
  name: string;
  size: string;
  density: number; // pounds per cubic foot
  coverage: number; // square feet per cubic yard at 1 inch depth
  pricePerUnit: number;
  color: string;
  applications: string[];
  unit: string;
}

const gravelTypes: { [key: string]: GravelType } = {
  pea: {
    name: 'Pea Gravel',
    size: '1/8" to 3/8"',
    density: 100,
    coverage: 324,
    pricePerUnit: 45,
    color: '#C4A484',
    unit: 'cubic yard',
    applications: [
      'Walkways and paths',
      'Driveways',
      'Playgrounds',
      'Garden decoration'
    ]
  },
  crushed: {
    name: 'Crushed Stone',
    size: '3/4" to 1"',
    density: 105,
    coverage: 324,
    pricePerUnit: 40,
    color: '#808080',
    unit: 'cubic yard',
    applications: [
      'Driveways',
      'Road base',
      'Drainage systems',
      'Construction projects'
    ]
  },
  river: {
    name: 'River Rock',
    size: '1" to 2"',
    density: 95,
    coverage: 324,
    pricePerUnit: 50,
    color: '#8B4513',
    unit: 'cubic yard',
    applications: [
      'Landscaping features',
      'Water features',
      'Garden borders',
      'Erosion control'
    ]
  },
  decomposed: {
    name: 'Decomposed Granite',
    size: 'Fine to 1/4"',
    density: 110,
    coverage: 324,
    pricePerUnit: 55,
    color: '#D2691E',
    unit: 'cubic yard',
    applications: [
      'Natural pathways',
      'Xeriscape gardens',
      'Patio surfaces',
      'Tree surrounds'
    ]
  }
};

export default function GravelCalculator() {
  const breadcrumbItems = [
    {
      label: 'Gravel Calculator',
      href: '/gravel-calculator'
    }
  ];

  // Input values
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(2);
  const [gravelType, setGravelType] = useState<string>('pea');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [compactionFactor, setCompactionFactor] = useState<number>(15);
  const [shapeAdjustment, setShapeAdjustment] = useState<number>(100);

  // Results
  const [area, setArea] = useState<number>(0);
  const [volumeNeeded, setVolumeNeeded] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [tonsNeeded, setTonsNeeded] = useState<number>(0);

  // Constants
  const CUBIC_YARDS_TO_CUBIC_FEET = 27;
  const POUNDS_PER_TON = 2000;

  // Calculate gravel requirements
  const calculateGravel = () => {
    // Calculate base area
    let baseArea = length * width;
    
    // Adjust for irregular shape (percentage of rectangular area)
    baseArea = baseArea * (shapeAdjustment / 100);
    
    // Calculate volume needed in cubic feet
    // depth is in inches, so divide by 12 to convert to feet
    let volume = (baseArea * (depth / 12));
    
    // Add compaction factor
    volume = volume * (1 + (compactionFactor / 100));
    
    // Convert to cubic yards
    const cubicYards = volume / CUBIC_YARDS_TO_CUBIC_FEET;
    
    // Calculate weight in pounds
    const weightLbs = volume * gravelTypes[gravelType].density;
    
    // Convert to tons
    const tons = weightLbs / POUNDS_PER_TON;
    
    // Calculate cost
    const cost = cubicYards * gravelTypes[gravelType].pricePerUnit;
    
    setArea(Number(baseArea.toFixed(2)));
    setVolumeNeeded(Number(cubicYards.toFixed(2)));
    setWeight(Number(weightLbs.toFixed(2)));
    setTonsNeeded(Number(tons.toFixed(2)));
    setTotalCost(Number(cost.toFixed(2)));
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    if (newUnit === 'metric' && unit === 'imperial') {
      setLength(Math.round(length * 0.3048));
      setWidth(Math.round(width * 0.3048));
      setDepth(Math.round(depth * 2.54));
    } else if (newUnit === 'imperial' && unit === 'metric') {
      setLength(Math.round(length / 0.3048));
      setWidth(Math.round(width / 0.3048));
      setDepth(Math.round(depth / 2.54));
    }
    setUnit(newUnit);
  };

  useEffect(() => {
    calculateGravel();
  }, [length, width, depth, gravelType, compactionFactor, shapeAdjustment]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Gravel Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Gravel Requirements</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit System</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUnitChange('imperial')}
                    >
                      Imperial
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUnitChange('metric')}
                    >
                      Metric
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gravel Type</span>
                  </label>
                  <Select
                    value={gravelType}
                    onValueChange={(value) => setGravelType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gravel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(gravelTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name} ({value.size})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Area Length</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the area to be covered</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      {unit === 'imperial' ? 'feet' : 'meters'}
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Area Width</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Width of the area to be covered</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      {unit === 'imperial' ? 'feet' : 'meters'}
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Depth</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desired thickness of gravel layer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      {unit === 'imperial' ? 'inches' : 'cm'}
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Compaction Factor</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Additional material needed for settling and compaction</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={compactionFactor}
                    onChange={(e) => setCompactionFactor(Number(e.target.value))}
                    min="0"
                    max="30"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">%</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shape Adjustment</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of rectangular area (100% = rectangular, less for irregular shapes)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={shapeAdjustment}
                    onChange={(e) => setShapeAdjustment(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">% of rectangular area</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Area to Cover</h3>
                    <p className="text-2xl font-bold">
                      {area} {unit === 'imperial' ? 'sq ft' : 'm²'}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Volume Needed</h3>
                    <p className="text-2xl font-bold">{volumeNeeded} cu. yd</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Weight</h3>
                    <p className="text-2xl font-bold">{weight} lbs</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Tons Needed</h3>
                    <p className="text-2xl font-bold">{tonsNeeded} tons</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Estimated Cost</h3>
                  <p className="text-3xl font-bold">${totalCost}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    *Based on ${gravelTypes[gravelType].pricePerUnit} per {gravelTypes[gravelType].unit}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Material Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {gravelTypes[gravelType].name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Size:</span> {gravelTypes[gravelType].size}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Density:</span> {gravelTypes[gravelType].density} lbs/cu ft
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Common Applications</h3>
                  <div className="space-y-2">
                    {gravelTypes[gravelType].applications.map((application, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                        <p className="text-sm">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
