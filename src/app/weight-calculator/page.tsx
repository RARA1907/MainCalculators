'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface CelestialBody {
  name: string;
  gravity: number;
  description: string;
  surfaceType: string;
  atmosphere: string;
  color: string;
}

const celestialBodies: { [key: string]: CelestialBody } = {
  earth: {
    name: 'Earth',
    gravity: 9.81,
    description: 'Our home planet',
    surfaceType: 'Rocky with water',
    atmosphere: 'Nitrogen and Oxygen',
    color: '#22C55E'
  },
  moon: {
    name: 'Moon',
    gravity: 1.62,
    description: "Earth's natural satellite",
    surfaceType: 'Rocky and dusty',
    atmosphere: 'Very thin',
    color: '#94A3B8'
  },
  mars: {
    name: 'Mars',
    gravity: 3.72,
    description: 'The Red Planet',
    surfaceType: 'Rocky and dusty',
    atmosphere: 'Thin CO2',
    color: '#EF4444'
  },
  venus: {
    name: 'Venus',
    gravity: 8.87,
    description: 'Similar size to Earth',
    surfaceType: 'Rocky volcanic',
    atmosphere: 'Very dense CO2',
    color: '#F59E0B'
  },
  jupiter: {
    name: 'Jupiter',
    gravity: 24.79,
    description: 'Largest planet',
    surfaceType: 'Gas giant',
    atmosphere: 'Hydrogen and Helium',
    color: '#D97706'
  },
  saturn: {
    name: 'Saturn',
    gravity: 10.44,
    description: 'Known for its rings',
    surfaceType: 'Gas giant',
    atmosphere: 'Hydrogen and Helium',
    color: '#FCD34D'
  }
};

export default function WeightCalculator() {
  const breadcrumbItems = [
    {
      label: 'Weight Calculator',
      href: '/weight-calculator'
    }
  ];

  const [mass, setMass] = useState<number>(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [selectedBody, setSelectedBody] = useState<string>('earth');
  const [weights, setWeights] = useState<{ [key: string]: number }>({});

  const convertToKg = (value: number, fromUnit: 'kg' | 'lbs'): number => {
    return fromUnit === 'kg' ? value : value * 0.453592;
  };

  const convertFromKg = (value: number, toUnit: 'kg' | 'lbs'): number => {
    return toUnit === 'kg' ? value : value * 2.20462;
  };

  const calculateWeights = () => {
    const massInKg = convertToKg(mass, unit);
    const newWeights: { [key: string]: number } = {};

    Object.entries(celestialBodies).forEach(([body, data]) => {
      const weightInNewtons = massInKg * data.gravity;
      newWeights[body] = convertFromKg(weightInNewtons / 9.81, unit);
    });

    setWeights(newWeights);
  };

  useEffect(() => {
    calculateWeights();
  }, [mass, unit, selectedBody]);

  const handleUnitChange = (newUnit: 'kg' | 'lbs') => {
    if (newUnit !== unit) {
      const newMass = newUnit === 'kg' ? mass * 0.453592 : mass * 2.20462;
      setMass(Number(newMass.toFixed(2)));
      setUnit(newUnit);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Weight Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Weight</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mass</span>
                  </label>
                  <Input
                    type="number"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    placeholder="Enter your mass"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${unit === 'kg' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUnitChange('kg')}
                    >
                      Kilograms (kg)
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'lbs' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUnitChange('lbs')}
                    >
                      Pounds (lbs)
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Celestial Body</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedBody}
                    onChange={(e) => setSelectedBody(e.target.value)}
                  >
                    {Object.entries(celestialBodies).map(([key, body]) => (
                      <option key={key} value={key}>
                        {body.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Weight on Different Bodies</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(weights).map(([body, weight]) => (
                  <motion.div
                    key={body}
                    className="flex justify-between items-center p-3 border-b last:border-b-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{celestialBodies[body].name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 inline-block" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Gravity: {celestialBodies[body].gravity} m/s²</p>
                              <p>{celestialBodies[body].description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        )
                      </span>
                    </div>
                    <span className="text-right font-semibold">
                      {weight.toFixed(2)} {unit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Weight on Different Bodies</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">What is Weight?</h3>
                  <p>Weight is the force of gravity on an object. It varies depending on the gravitational field strength of the celestial body.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Mass vs Weight</h3>
                  <p>Mass remains constant everywhere, while weight changes based on gravity. Mass is measured in kg or lbs, weight in Newtons.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Gravity Effects</h3>
                  <p>Different celestial bodies have different gravitational fields, affecting how much objects weigh on their surface.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
