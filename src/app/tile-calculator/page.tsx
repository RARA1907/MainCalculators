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

interface TilePattern {
  name: string;
  description: string;
  wasteFactor: number;
  color: string;
  features: string[];
}

const tilePatterns: { [key: string]: TilePattern } = {
  straight: {
    name: 'Straight (Grid)',
    description: 'Traditional grid pattern',
    wasteFactor: 10,
    color: '#22C55E',
    features: [
      'Simple and classic look',
      'Easiest to install',
      'Works with all tile sizes',
      'Minimal waste'
    ]
  },
  diagonal: {
    name: 'Diagonal (45°)',
    description: 'Tiles laid at 45-degree angle',
    wasteFactor: 15,
    color: '#3B82F6',
    features: [
      'Creates visual interest',
      'Makes space appear larger',
      'More complex installation',
      'Higher waste factor'
    ]
  },
  herringbone: {
    name: 'Herringbone',
    description: 'V-shaped zigzag pattern',
    wasteFactor: 20,
    color: '#6B7280',
    features: [
      'Sophisticated look',
      'Complex installation',
      'Higher waste factor',
      'Best with rectangular tiles'
    ]
  },
  basketWeave: {
    name: 'Basket Weave',
    description: 'Alternating orientation pattern',
    wasteFactor: 15,
    color: '#EF4444',
    features: [
      'Intricate appearance',
      'Moderate complexity',
      'Medium waste factor',
      'Works best with square tiles'
    ]
  }
};

export default function TileCalculator() {
  const breadcrumbItems = [
    {
      label: 'Tile Calculator',
      href: '/tile-calculator'
    }
  ];

  // Input values
  const [roomLength, setRoomLength] = useState<number>(20);
  const [roomWidth, setRoomWidth] = useState<number>(15);
  const [tileLength, setTileLength] = useState<number>(12);
  const [tileWidth, setTileWidth] = useState<number>(12);
  const [pattern, setPattern] = useState<string>('straight');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [groutWidth, setGroutWidth] = useState<number>(0.25);
  const [tilePrice, setTilePrice] = useState<number>(5);
  const [additionalWaste, setAdditionalWaste] = useState<number>(0);

  // Results
  const [totalArea, setTotalArea] = useState<number>(0);
  const [tilesNeeded, setTilesNeeded] = useState<number>(0);
  const [boxesNeeded, setBoxesNeeded] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [groutNeeded, setGroutNeeded] = useState<number>(0);

  // Constants
  const TILES_PER_BOX = 12;
  const GROUT_COVERAGE_PER_LB = 50; // sq ft per lb for 1/4" joint

  // Calculate tile requirements
  const calculateTiles = () => {
    // Calculate room area
    const area = roomLength * roomWidth;
    
    // Calculate single tile area including grout
    const tileAreaWithGrout = (
      (tileLength + groutWidth) * 
      (tileWidth + groutWidth)
    ) / 144; // Convert to sq ft if imperial
    
    // Calculate base number of tiles needed
    let baseTiles = area / tileAreaWithGrout;
    
    // Apply pattern waste factor
    const wasteFactor = (tilePatterns[pattern].wasteFactor + additionalWaste) / 100;
    const totalTiles = Math.ceil(baseTiles * (1 + wasteFactor));
    
    // Calculate boxes needed
    const boxes = Math.ceil(totalTiles / TILES_PER_BOX);
    
    // Calculate grout needed
    const groutArea = area - (totalTiles * ((tileLength * tileWidth) / 144));
    const groutNeededLbs = Math.ceil(groutArea / GROUT_COVERAGE_PER_LB);
    
    // Calculate total cost
    const tileCost = boxes * TILES_PER_BOX * tilePrice;
    
    setTotalArea(Number(area.toFixed(2)));
    setTilesNeeded(totalTiles);
    setBoxesNeeded(boxes);
    setGroutNeeded(groutNeededLbs);
    setTotalCost(Number(tileCost.toFixed(2)));
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    if (newUnit === 'metric' && unit === 'imperial') {
      setRoomLength(Math.round(roomLength * 0.3048));
      setRoomWidth(Math.round(roomWidth * 0.3048));
      setTileLength(Math.round(tileLength * 2.54));
      setTileWidth(Math.round(tileWidth * 2.54));
      setGroutWidth(Math.round(groutWidth * 2.54 * 10) / 10);
    } else if (newUnit === 'imperial' && unit === 'metric') {
      setRoomLength(Math.round(roomLength / 0.3048));
      setRoomWidth(Math.round(roomWidth / 0.3048));
      setTileLength(Math.round(tileLength / 2.54));
      setTileWidth(Math.round(tileWidth / 2.54));
      setGroutWidth(Math.round(groutWidth / 2.54 * 10) / 10);
    }
    setUnit(newUnit);
  };

  useEffect(() => {
    calculateTiles();
  }, [roomLength, roomWidth, tileLength, tileWidth, pattern, groutWidth, additionalWaste]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Tile Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Tile Requirements</h2>
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
                    <span className="label-text">Pattern</span>
                  </label>
                  <Select
                    value={pattern}
                    onValueChange={(value) => setPattern(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tile pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tilePatterns).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Room Length</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the room to be tiled</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
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
                    <span className="label-text">Room Width</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Width of the room to be tiled</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
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
                    <span className="label-text">Tile Length</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of individual tiles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={tileLength}
                    onChange={(e) => setTileLength(Number(e.target.value))}
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
                    <span className="label-text">Tile Width</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Width of individual tiles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={tileWidth}
                    onChange={(e) => setTileWidth(Number(e.target.value))}
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
                    <span className="label-text">Grout Width</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Width of grout lines between tiles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={groutWidth}
                    onChange={(e) => setGroutWidth(Number(e.target.value))}
                    min="0"
                    step="0.125"
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
                    <span className="label-text">Tile Price</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price per individual tile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={tilePrice}
                    onChange={(e) => setTilePrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">$ per tile</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Additional Waste Factor</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Extra percentage for cuts, breaks, and future repairs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={additionalWaste}
                    onChange={(e) => setAdditionalWaste(Number(e.target.value))}
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
                    <h3 className="text-sm font-medium mb-2">Total Area</h3>
                    <p className="text-2xl font-bold">
                      {totalArea} {unit === 'imperial' ? 'sq ft' : 'm²'}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Tiles Needed</h3>
                    <p className="text-2xl font-bold">{tilesNeeded}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Boxes Needed</h3>
                    <p className="text-2xl font-bold">{boxesNeeded}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Grout Needed</h3>
                    <p className="text-2xl font-bold">{groutNeeded} lbs</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Estimated Cost</h3>
                  <p className="text-3xl font-bold">${totalCost}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    *Excludes grout, tools, and labor costs
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pattern Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Pattern:</span> {tilePatterns[pattern].name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Base Waste Factor:</span> {tilePatterns[pattern].wasteFactor}%
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Total Waste Factor:</span> {tilePatterns[pattern].wasteFactor + additionalWaste}%
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pattern Features</h3>
                  <div className="space-y-2">
                    {tilePatterns[pattern].features.map((feature, index) => (
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
