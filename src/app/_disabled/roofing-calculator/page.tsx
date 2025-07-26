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

interface RoofingMaterial {
  name: string;
  lifespan: string;
  costPerUnit: number;
  unit: string;
  squareFootPerUnit: number;
  color: string;
  features: string[];
}

const roofingMaterials: { [key: string]: RoofingMaterial } = {
  asphaltShingles: {
    name: 'Asphalt Shingles',
    lifespan: '20-30 years',
    costPerUnit: 100,
    unit: 'square',
    squareFootPerUnit: 100,
    color: '#22C55E',
    features: [
      'Most common residential roofing material',
      'Cost-effective',
      'Easy installation',
      'Various colors and styles available'
    ]
  },
  metalRoofing: {
    name: 'Metal Roofing',
    lifespan: '40-70 years',
    costPerUnit: 300,
    unit: 'square',
    squareFootPerUnit: 100,
    color: '#3B82F6',
    features: [
      'Extremely durable',
      'Energy efficient',
      'Fire resistant',
      'Environmentally friendly'
    ]
  },
  slate: {
    name: 'Slate',
    lifespan: '75-200 years',
    costPerUnit: 1000,
    unit: 'square',
    squareFootPerUnit: 100,
    color: '#6B7280',
    features: [
      'Longest lasting material',
      'Natural appearance',
      'Fire resistant',
      'Low maintenance'
    ]
  },
  tileClay: {
    name: 'Clay Tile',
    lifespan: '50-100 years',
    costPerUnit: 500,
    unit: 'square',
    squareFootPerUnit: 100,
    color: '#EF4444',
    features: [
      'Excellent durability',
      'Great for hot climates',
      'Low maintenance',
      'Distinctive appearance'
    ]
  }
};

export default function RoofingCalculator() {
  const breadcrumbItems = [
    {
      label: 'Roofing Calculator',
      href: '/roofing-calculator'
    }
  ];

  // Input values
  const [length, setLength] = useState<number>(40);
  const [width, setWidth] = useState<number>(30);
  const [pitch, setPitch] = useState<number>(4); // 4/12 pitch
  const [material, setMaterial] = useState<string>('asphaltShingles');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [overhang, setOverhang] = useState<number>(1);
  const [valleys, setValleys] = useState<number>(0);
  const [wastePercentage, setWastePercentage] = useState<number>(10);

  // Results
  const [roofArea, setRoofArea] = useState<number>(0);
  const [squares, setSquares] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [materialNeeded, setMaterialNeeded] = useState<number>(0);

  // Calculate roof dimensions
  const calculateRoof = () => {
    // Calculate the roof's pitch factor
    const pitchFactor = Math.sqrt(1 + Math.pow(pitch/12, 2));
    
    // Add overhang to dimensions
    const adjustedLength = length + (overhang * 2);
    const adjustedWidth = width + (overhang * 2);
    
    // Calculate base area
    let baseArea = adjustedLength * adjustedWidth;
    
    // Apply pitch factor to get actual roof area
    let actualArea = baseArea * pitchFactor;
    
    // Add extra area for valleys if present (typically 1 square per valley)
    actualArea += (valleys * 100);
    
    // Add waste percentage
    actualArea *= (1 + (wastePercentage / 100));
    
    // Convert to squares (1 square = 100 sq ft)
    const calculatedSquares = actualArea / 100;
    
    // Calculate material needed and cost
    const selectedMaterial = roofingMaterials[material];
    const materialUnits = Math.ceil(actualArea / selectedMaterial.squareFootPerUnit);
    const calculatedCost = materialUnits * selectedMaterial.costPerUnit;

    setRoofArea(Number(actualArea.toFixed(2)));
    setSquares(Number(calculatedSquares.toFixed(2)));
    setMaterialNeeded(materialUnits);
    setTotalCost(Number(calculatedCost.toFixed(2)));
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    if (newUnit === 'metric' && unit === 'imperial') {
      setLength(Math.round(length * 0.3048));
      setWidth(Math.round(width * 0.3048));
      setOverhang(Math.round(overhang * 0.3048));
    } else if (newUnit === 'imperial' && unit === 'metric') {
      setLength(Math.round(length / 0.3048));
      setWidth(Math.round(width / 0.3048));
      setOverhang(Math.round(overhang / 0.3048));
    }
    setUnit(newUnit);
  };

  useEffect(() => {
    calculateRoof();
  }, [length, width, pitch, material, overhang, valleys, wastePercentage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Roofing Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Roofing Requirements</h2>
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
                    <span className="label-text">Roofing Material</span>
                  </label>
                  <Select
                    value={material}
                    onValueChange={(value) => setMaterial(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select roofing material" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roofingMaterials).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Roof Length</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the roof surface</p>
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
                    <span className="label-text-alt">{unit === 'imperial' ? 'feet' : 'meters'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Roof Width</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Width of the roof surface</p>
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
                    <span className="label-text-alt">{unit === 'imperial' ? 'feet' : 'meters'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Roof Pitch</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rise in inches per 12 inches of run (e.g., 4 means 4/12 pitch)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={pitch}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    min="0"
                    max="24"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">rise per 12 inches run</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Overhang</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Roof extension beyond the walls</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={overhang}
                    onChange={(e) => setOverhang(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">{unit === 'imperial' ? 'feet' : 'meters'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Number of Valleys</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of valleys in the roof design</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={valleys}
                    onChange={(e) => setValleys(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Waste Percentage</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Additional material for waste and mistakes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={wastePercentage}
                    onChange={(e) => setWastePercentage(Number(e.target.value))}
                    min="0"
                    max="20"
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
                    <h3 className="text-sm font-medium mb-2">Total Roof Area</h3>
                    <p className="text-2xl font-bold">
                      {roofArea} {unit === 'imperial' ? 'sq ft' : 'm²'}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Squares Needed</h3>
                    <p className="text-2xl font-bold">{squares}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Material Units</h3>
                    <p className="text-2xl font-bold">
                      {materialNeeded} {roofingMaterials[material].unit}s
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Estimated Cost</h3>
                    <p className="text-2xl font-bold">${totalCost}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Material Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Material:</span> {roofingMaterials[material].name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Expected Lifespan:</span> {roofingMaterials[material].lifespan}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Cost per {roofingMaterials[material].unit}:</span> ${roofingMaterials[material].costPerUnit}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Material Features</h3>
                  <div className="space-y-2">
                    {roofingMaterials[material].features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                        <p className="text-sm">{feature}</p>
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
