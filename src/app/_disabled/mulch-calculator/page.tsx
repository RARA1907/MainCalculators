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

interface MulchType {
  name: string;
  density: number; // pounds per cubic foot
  coverage: number; // square feet per cubic yard at 1 inch depth
  pricePerUnit: number;
  color: string;
  benefits: string[];
  unit: string;
}

const mulchTypes: { [key: string]: MulchType } = {
  hardwoodBark: {
    name: 'Hardwood Bark',
    density: 30,
    coverage: 324,
    pricePerUnit: 35,
    color: '#8B4513',
    unit: 'cubic yard',
    benefits: [
      'Long-lasting and durable',
      'Excellent moisture retention',
      'Improves soil quality as it decomposes',
      'Natural appearance'
    ]
  },
  pineBark: {
    name: 'Pine Bark',
    density: 20,
    coverage: 324,
    pricePerUnit: 40,
    color: '#A0522D',
    unit: 'cubic yard',
    benefits: [
      'Slow to decompose',
      'Excellent for acid-loving plants',
      'Light and easy to spread',
      'Attractive reddish-brown color'
    ]
  },
  cedarChips: {
    name: 'Cedar Chips',
    density: 25,
    coverage: 324,
    pricePerUnit: 45,
    color: '#DEB887',
    unit: 'cubic yard',
    benefits: [
      'Natural insect repellent',
      'Pleasant aroma',
      'Slow to decompose',
      'Resists compaction'
    ]
  },
  rubberMulch: {
    name: 'Rubber Mulch',
    density: 35,
    coverage: 324,
    pricePerUnit: 55,
    color: '#2F4F4F',
    unit: 'cubic yard',
    benefits: [
      'Extremely long-lasting',
      'Available in various colors',
      'Excellent for playgrounds',
      'Wont attract pests'
    ]
  }
};

export default function MulchCalculator() {
  const breadcrumbItems = [
    {
      label: 'Mulch Calculator',
      href: '/mulch-calculator'
    }
  ];

  // Input values
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(2);
  const [mulchType, setMulchType] = useState<string>('hardwoodBark');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [irregularShape, setIrregularShape] = useState<number>(100);
  const [additionalAmount, setAdditionalAmount] = useState<number>(10);

  // Results
  const [area, setArea] = useState<number>(0);
  const [volumeNeeded, setVolumeNeeded] = useState<number>(0);
  const [bagsNeeded, setBagsNeeded] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  // Constants
  const CUBIC_YARDS_TO_CUBIC_FEET = 27;
  const CUBIC_FEET_PER_BAG = 2;

  // Calculate mulch requirements
  const calculateMulch = () => {
    // Calculate base area
    let baseArea = length * width;
    
    // Adjust for irregular shape (percentage of rectangular area)
    baseArea = baseArea * (irregularShape / 100);
    
    // Calculate volume needed in cubic feet
    // depth is in inches, so divide by 12 to convert to feet
    let volume = (baseArea * (depth / 12));
    
    // Add additional percentage
    volume = volume * (1 + (additionalAmount / 100));
    
    // Convert to cubic yards
    const cubicYards = volume / CUBIC_YARDS_TO_CUBIC_FEET;
    
    // Calculate bags needed (1 bag = 2 cubic feet)
    const bags = Math.ceil(volume / CUBIC_FEET_PER_BAG);
    
    // Calculate weight
    const weightLbs = volume * mulchTypes[mulchType].density;
    
    // Calculate cost
    const cost = cubicYards * mulchTypes[mulchType].pricePerUnit;
    
    setArea(Number(baseArea.toFixed(2)));
    setVolumeNeeded(Number(cubicYards.toFixed(2)));
    setBagsNeeded(bags);
    setWeight(Number(weightLbs.toFixed(2)));
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
    calculateMulch();
  }, [length, width, depth, mulchType, irregularShape, additionalAmount]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Mulch Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Mulch Requirements</h2>
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
                    <span className="label-text">Mulch Type</span>
                  </label>
                  <Select
                    value={mulchType}
                    onValueChange={(value) => setMulchType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mulch type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(mulchTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
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
                          <p>Length of the area to be mulched</p>
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
                          <p>Width of the area to be mulched</p>
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
                    <span className="label-text">Mulch Depth</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desired thickness of mulch layer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    min="0"
                    max="6"
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
                    value={irregularShape}
                    onChange={(e) => setIrregularShape(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">% of rectangular area</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Additional Amount</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Extra percentage for uneven surfaces and settling</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={additionalAmount}
                    onChange={(e) => setAdditionalAmount(Number(e.target.value))}
                    min="0"
                    max="30"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">%</span>
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
                    <h3 className="text-sm font-medium mb-2">Bags Needed</h3>
                    <p className="text-2xl font-bold">{bagsNeeded}</p>
                    <p className="text-xs text-muted-foreground">2 cubic feet per bag</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Total Weight</h3>
                    <p className="text-2xl font-bold">{weight} lbs</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Estimated Cost</h3>
                  <p className="text-3xl font-bold">${totalCost}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    *Based on ${mulchTypes[mulchType].pricePerUnit} per {mulchTypes[mulchType].unit}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mulch Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {mulchTypes[mulchType].name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Density:</span> {mulchTypes[mulchType].density} lbs/cu ft
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Coverage:</span> {mulchTypes[mulchType].coverage} sq ft/cu yd at 1" depth
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Benefits</h3>
                  <div className="space-y-2">
                    {mulchTypes[mulchType].benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                        <p className="text-sm">{benefit}</p>
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
