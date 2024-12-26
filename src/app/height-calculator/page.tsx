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

interface HeightPercentile {
  age: number;
  male: {
    p3: number;
    p15: number;
    p50: number;
    p85: number;
    p97: number;
  };
  female: {
    p3: number;
    p15: number;
    p50: number;
    p85: number;
    p97: number;
  };
}

// Sample height percentile data (you would want to expand this with real medical data)
const heightPercentiles: HeightPercentile[] = [
  {
    age: 2,
    male: { p3: 82.5, p15: 85.1, p50: 88.9, p85: 92.7, p97: 95.3 },
    female: { p3: 81.0, p15: 83.6, p50: 87.4, p85: 91.2, p97: 93.8 }
  },
  {
    age: 5,
    male: { p3: 102.5, p15: 105.7, p50: 110.3, p85: 114.9, p97: 118.1 },
    female: { p3: 101.1, p15: 104.3, p50: 108.9, p85: 113.5, p97: 116.7 }
  },
  {
    age: 10,
    male: { p3: 127.6, p15: 132.0, p50: 138.4, p85: 144.8, p97: 149.2 },
    female: { p3: 126.4, p15: 130.8, p50: 137.2, p85: 143.6, p97: 148.0 }
  },
  {
    age: 15,
    male: { p3: 156.7, p15: 162.3, p50: 170.1, p85: 177.9, p97: 183.5 },
    female: { p3: 150.2, p15: 155.0, p50: 161.8, p85: 168.6, p97: 173.4 }
  },
  {
    age: 20,
    male: { p3: 163.1, p15: 168.9, p50: 177.0, p85: 185.1, p97: 190.9 },
    female: { p3: 151.4, p15: 156.2, p50: 163.0, p85: 169.8, p97: 174.6 }
  }
];

export default function HeightCalculator() {
  const breadcrumbItems = [
    {
      label: 'Height Calculator',
      href: '/height-calculator'
    }
  ];

  // Input values
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');

  // Results
  const [centimeters, setCentimeters] = useState<number>(0);
  const [meters, setMeters] = useState<number>(0);
  const [percentile, setPercentile] = useState<number>(0);
  const [heightCategory, setHeightCategory] = useState<string>('');

  // Calculate height conversions and percentile
  const calculateHeight = () => {
    // Convert height to centimeters
    let heightInCm: number;
    if (unit === 'imperial') {
      heightInCm = ((feet * 12) + inches) * 2.54;
    } else {
      heightInCm = (feet * 100) + inches;
    }
    
    // Set metric values
    setCentimeters(Number(heightInCm.toFixed(1)));
    setMeters(Number((heightInCm / 100).toFixed(2)));

    // Find closest age in percentile data
    const closestAge = heightPercentiles.reduce((prev, curr) => {
      return (Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev);
    });

    // Calculate percentile
    const heightData = gender === 'male' ? closestAge.male : closestAge.female;
    let calculatedPercentile = 50; // Default to 50th percentile

    if (heightInCm <= heightData.p3) {
      calculatedPercentile = 3;
    } else if (heightInCm <= heightData.p15) {
      calculatedPercentile = 15;
    } else if (heightInCm <= heightData.p50) {
      calculatedPercentile = 50;
    } else if (heightInCm <= heightData.p85) {
      calculatedPercentile = 85;
    } else if (heightInCm <= heightData.p97) {
      calculatedPercentile = 97;
    } else {
      calculatedPercentile = 99;
    }

    setPercentile(calculatedPercentile);

    // Determine height category
    if (calculatedPercentile < 5) {
      setHeightCategory('Below Average');
    } else if (calculatedPercentile < 85) {
      setHeightCategory('Average');
    } else {
      setHeightCategory('Above Average');
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'imperial' | 'metric') => {
    if (newUnit === 'metric' && unit === 'imperial') {
      const totalInches = (feet * 12) + inches;
      const totalCm = totalInches * 2.54;
      setFeet(Math.floor(totalCm / 100));
      setInches(Math.round(totalCm % 100));
    } else if (newUnit === 'imperial' && unit === 'metric') {
      const totalCm = (feet * 100) + inches;
      const totalInches = totalCm / 2.54;
      setFeet(Math.floor(totalInches / 12));
      setInches(Math.round(totalInches % 12));
    }
    setUnit(newUnit);
  };

  useEffect(() => {
    calculateHeight();
  }, [feet, inches, age, gender, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Height Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Height Details</h2>
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
                    <span className="label-text">Gender</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${gender === 'male' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGender('male')}
                    >
                      Male
                    </button>
                    <button
                      className={`btn flex-1 ${gender === 'female' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGender('female')}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Age in years</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min="2"
                    max="20"
                    className="input input-bordered w-full"
                  />
                  <label className="label">
                    <span className="label-text-alt">years</span>
                  </label>
                </div>

                {unit === 'imperial' ? (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Feet</span>
                      </label>
                      <Input
                        type="number"
                        value={feet}
                        onChange={(e) => setFeet(Number(e.target.value))}
                        min="0"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Inches</span>
                      </label>
                      <Input
                        type="number"
                        value={inches}
                        onChange={(e) => setInches(Number(e.target.value))}
                        min="0"
                        max="11"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Meters</span>
                      </label>
                      <Input
                        type="number"
                        value={feet}
                        onChange={(e) => setFeet(Number(e.target.value))}
                        min="0"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Centimeters</span>
                      </label>
                      <Input
                        type="number"
                        value={inches}
                        onChange={(e) => setInches(Number(e.target.value))}
                        min="0"
                        max="99"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </>
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
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Height in Centimeters</h3>
                    <p className="text-2xl font-bold">{centimeters} cm</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Height in Meters</h3>
                    <p className="text-2xl font-bold">{meters} m</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Height Percentile</h3>
                  <p className="text-3xl font-bold">{percentile}th</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Compared to {gender === 'male' ? 'males' : 'females'} of the same age
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Height Category</h3>
                  <p className="text-2xl font-bold">{heightCategory}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on age and gender-specific growth charts
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Height Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Height percentiles help compare an individual's height with others of the same age and gender.
                      The 50th percentile represents the median height, while percentiles above 85 or below 15
                      might warrant discussion with a healthcare provider.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Percentile Ranges</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Below 3rd:</span> Significantly below average
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">3rd to 15th:</span> Below average
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">15th to 85th:</span> Average range
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">85th to 97th:</span> Above average
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Above 97th:</span> Significantly above average
                    </p>
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
