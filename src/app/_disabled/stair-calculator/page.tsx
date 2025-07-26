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
import { motion } from 'framer-motion';

interface StairCategory {
  description: string;
  color: string;
  recommendations: string[];
}

const stairCategories: { [key: string]: StairCategory } = {
  residential: {
    description: 'Residential Stairs',
    color: '#22C55E',
    recommendations: [
      'Rise: 4-7.75 inches (optimal: 7 inches)',
      'Run: 10-14 inches (optimal: 11 inches)',
      'Minimum width: 36 inches',
      'Minimum headroom: 6 feet 8 inches'
    ]
  },
  commercial: {
    description: 'Commercial Stairs',
    color: '#3B82F6',
    recommendations: [
      'Rise: 4-7 inches (optimal: 6.5 inches)',
      'Run: 11-14 inches (optimal: 12 inches)',
      'Minimum width: 44 inches',
      'Minimum headroom: 6 feet 8 inches'
    ]
  }
};

export default function StairCalculator() {
  const breadcrumbItems = [
    {
      label: 'Stair Calculator',
      href: '/stair-calculator'
    }
  ];

  // Input values
  const [totalRise, setTotalRise] = useState<number>(108); // 9 feet in inches
  const [desiredRise, setDesiredRise] = useState<number>(7); // inches per step
  const [desiredRun, setDesiredRun] = useState<number>(11); // inches per step
  const [availableSpace, setAvailableSpace] = useState<number>(144); // 12 feet in inches
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [type, setType] = useState<'residential' | 'commercial'>('residential');

  // Results
  const [numberOfSteps, setNumberOfSteps] = useState<number>(0);
  const [totalRun, setTotalRun] = useState<number>(0);
  const [stairAngle, setStairAngle] = useState<number>(0);
  const [isValid, setIsValid] = useState<boolean>(true);

  // Calculate stair dimensions
  const calculateStairs = () => {
    // Calculate number of risers (steps + 1)
    const calculatedSteps = Math.round(totalRise / desiredRise);
    const actualRise = totalRise / calculatedSteps;
    const calculatedRun = (calculatedSteps - 1) * desiredRun;
    const angle = Math.atan(actualRise / desiredRun) * (180 / Math.PI);

    setNumberOfSteps(calculatedSteps - 1); // Subtract 1 because number of steps is one less than risers
    setTotalRun(calculatedRun);
    setStairAngle(Number(angle.toFixed(1)));

    // Validate against standard requirements
    const isRiseValid = type === 'residential' 
      ? (actualRise >= 4 && actualRise <= 7.75)
      : (actualRise >= 4 && actualRise <= 7);
    
    const isRunValid = type === 'residential'
      ? (desiredRun >= 10 && desiredRun <= 14)
      : (desiredRun >= 11 && desiredRun <= 14);

    const isSpaceValid = calculatedRun <= availableSpace;

    setIsValid(isRiseValid && isRunValid && isSpaceValid);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    if (newUnit === 'metric' && unit === 'imperial') {
      setTotalRise(Math.round(totalRise * 2.54));
      setDesiredRise(Math.round(desiredRise * 2.54));
      setDesiredRun(Math.round(desiredRun * 2.54));
      setAvailableSpace(Math.round(availableSpace * 2.54));
    } else if (newUnit === 'imperial' && unit === 'metric') {
      setTotalRise(Math.round(totalRise / 2.54));
      setDesiredRise(Math.round(desiredRise / 2.54));
      setDesiredRun(Math.round(desiredRun / 2.54));
      setAvailableSpace(Math.round(availableSpace / 2.54));
    }
    setUnit(newUnit);
  };

  useEffect(() => {
    calculateStairs();
  }, [totalRise, desiredRise, desiredRun, availableSpace, type]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Stair Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Stair Dimensions</h2>
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
                    <span className="label-text">Stair Type</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${type === 'residential' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setType('residential')}
                    >
                      Residential
                    </button>
                    <button
                      className={`btn flex-1 ${type === 'commercial' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setType('commercial')}
                    >
                      Commercial
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Total Rise</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total vertical height to be covered by the stairs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={totalRise}
                    onChange={(e) => setTotalRise(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">{unit === 'imperial' ? 'inches' : 'cm'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Desired Rise per Step</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Vertical height of each step</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={desiredRise}
                    onChange={(e) => setDesiredRise(Number(e.target.value))}
                    min="4"
                    max="8"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">{unit === 'imperial' ? 'inches' : 'cm'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Desired Run per Step</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Horizontal depth of each step</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={desiredRun}
                    onChange={(e) => setDesiredRun(Number(e.target.value))}
                    min="10"
                    max="14"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">{unit === 'imperial' ? 'inches' : 'cm'}</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Space</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total horizontal space available for the stairs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={availableSpace}
                    onChange={(e) => setAvailableSpace(Number(e.target.value))}
                    min="0"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">{unit === 'imperial' ? 'inches' : 'cm'}</span>
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
                <div className={`p-4 rounded-lg ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                  <h3 className="text-lg font-semibold mb-2">
                    {isValid ? 'Valid Stair Design' : 'Invalid Stair Design'}
                  </h3>
                  <p className="text-sm">
                    {isValid 
                      ? 'Your stair design meets standard requirements.' 
                      : 'Your design needs adjustment to meet standard requirements.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Number of Steps</h3>
                    <p className="text-2xl font-bold">{numberOfSteps}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Stair Angle</h3>
                    <p className="text-2xl font-bold">{stairAngle}°</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Total Run</h3>
                    <p className="text-2xl font-bold">
                      {totalRun.toFixed(1)} {unit === 'imperial' ? 'in' : 'cm'}
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Space Required</h3>
                    <p className="text-2xl font-bold">
                      {totalRun.toFixed(1)} {unit === 'imperial' ? 'in' : 'cm'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Standard Requirements</h3>
                  <div className="space-y-2">
                    {stairCategories[type].recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                        <p className="text-sm">{rec}</p>
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
