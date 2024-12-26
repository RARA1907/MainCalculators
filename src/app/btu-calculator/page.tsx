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

const breadcrumbItems = [
  {
    label: 'BTU Calculator',
    href: '/btu-calculator',
  },
];

interface RoomFactors {
  [key: string]: number;
  kitchen: number;
  livingRoom: number;
  bedroom: number;
  bathroom: number;
  office: number;
}

interface InsulationFactors {
  [key: string]: number;
  poor: number;
  average: number;
  good: number;
  excellent: number;
}

interface ClimateFactors {
  [key: string]: number;
  mild: number;
  moderate: number;
  severe: number;
}

const ENERGY_STAR_BTU_TABLE = [
  { minSqFt: 100, maxSqFt: 150, btu: 5000 },
  { minSqFt: 150, maxSqFt: 250, btu: 6000 },
  { minSqFt: 250, maxSqFt: 300, btu: 7000 },
  { minSqFt: 300, maxSqFt: 350, btu: 8000 },
  { minSqFt: 350, maxSqFt: 400, btu: 9000 },
  { minSqFt: 400, maxSqFt: 450, btu: 10000 },
  { minSqFt: 450, maxSqFt: 550, btu: 12000 },
  { minSqFt: 550, maxSqFt: 700, btu: 14000 },
  { minSqFt: 700, maxSqFt: 1000, btu: 18000 },
  { minSqFt: 1000, maxSqFt: 1200, btu: 21000 },
  { minSqFt: 1200, maxSqFt: 1400, btu: 23000 },
  { minSqFt: 1400, maxSqFt: 1500, btu: 24000 },
  { minSqFt: 1500, maxSqFt: 2000, btu: 30000 },
  { minSqFt: 2000, maxSqFt: 2500, btu: 34000 },
];

const roomFactors: RoomFactors = {
  kitchen: 1.3, // Higher due to appliances and heat generation
  livingRoom: 1.0,
  bedroom: 0.95,
  bathroom: 1.2, // Higher due to humidity
  office: 1.1, // Slightly higher due to equipment
};

const insulationFactors: InsulationFactors = {
  poor: 1.3,
  average: 1.0,
  good: 0.85,
  excellent: 0.7,
};

const climateFactors: ClimateFactors = {
  mild: 0.85,
  moderate: 1.0,
  severe: 1.25,
};

interface BTUResult {
  baseBTU: number;
  adjustedBTU: number;
  recommendedBTU: number;
  coverage: string;
  efficiency: string;
  squareFootage: number;
}

export default function BTUCalculator() {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
  });
  const [roomType, setRoomType] = useState<keyof RoomFactors>('livingRoom');
  const [insulation, setInsulation] = useState<keyof InsulationFactors>('average');
  const [climate, setClimate] = useState<keyof ClimateFactors>('moderate');
  const [result, setResult] = useState<BTUResult | null>(null);

  const calculateBTU = () => {
    const { length, width } = dimensions;
    const l = parseFloat(length);
    const w = parseFloat(width);

    if (isNaN(l) || isNaN(w)) {
      return;
    }

    // Calculate square footage
    const squareFootage = l * w;
    
    // Find base BTU from Energy Star table
    let baseBTU = 0;
    for (const entry of ENERGY_STAR_BTU_TABLE) {
      if (squareFootage >= entry.minSqFt && squareFootage <= entry.maxSqFt) {
        baseBTU = entry.btu;
        break;
      }
    }
    
    // If square footage is larger than table maximum, use the highest BTU rate per square foot
    if (baseBTU === 0) {
      const highestRate = ENERGY_STAR_BTU_TABLE[ENERGY_STAR_BTU_TABLE.length - 1].btu / 
                         ENERGY_STAR_BTU_TABLE[ENERGY_STAR_BTU_TABLE.length - 1].maxSqFt;
      baseBTU = Math.round(squareFootage * highestRate);
    }
    
    // Apply adjustment factors
    const adjustedBTU = baseBTU * 
      roomFactors[roomType] * 
      insulationFactors[insulation] * 
      climateFactors[climate];
    
    // Round up to nearest 1000 BTU for recommended size
    const recommendedBTU = Math.ceil(adjustedBTU / 1000) * 1000;

    setResult({
      baseBTU: Math.round(baseBTU),
      adjustedBTU: Math.round(adjustedBTU),
      recommendedBTU,
      coverage: getCoverageRating(recommendedBTU, squareFootage),
      efficiency: getEfficiencyRating(insulation, climate),
      squareFootage,
    });
  };

  const getCoverageRating = (btu: number, squareFootage: number) => {
    const btuPerSqFt = btu / squareFootage;
    if (btuPerSqFt >= 40) return 'Very High';
    if (btuPerSqFt >= 30) return 'High';
    if (btuPerSqFt >= 20) return 'Adequate';
    return 'Low';
  };

  const getEfficiencyRating = (
    insulation: keyof InsulationFactors,
    climate: keyof ClimateFactors
  ) => {
    const score = 
      (1 / insulationFactors[insulation]) * 
      (1 / climateFactors[climate]) * 
      10;
    
    if (score >= 8) return 'Highly Efficient';
    if (score >= 6) return 'Efficient';
    if (score >= 4) return 'Moderate';
    return 'Less Efficient';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">BTU Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Required BTU</h2>
              <p className="text-muted-foreground">
                Enter room dimensions and characteristics
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Room Dimensions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Room Dimensions (feet)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter the length and width of your room to calculate the square footage.
                  </p>
                  <div className="space-y-4">
                    {Object.entries(dimensions).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="label">
                          <span className="label-text">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => setDimensions(prev => ({ ...prev, [key]: e.target.value }))}
                          className="input input-bordered w-full"
                          min="0"
                          step="0.1"
                          placeholder={`Enter ${key} in feet`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Room Characteristics */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Room Characteristics</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    These factors will help determine the appropriate BTU adjustment for your space.
                  </p>
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Room Type</span>
                      </label>
                      <Select
                        value={roomType}
                        onValueChange={(value) => setRoomType(value as keyof RoomFactors)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="livingRoom">Living Room</SelectItem>
                          <SelectItem value="bedroom">Bedroom</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Insulation Quality</span>
                      </label>
                      <Select
                        value={insulation}
                        onValueChange={(value) => setInsulation(value as keyof InsulationFactors)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select insulation quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Climate Condition</span>
                      </label>
                      <Select
                        value={climate}
                        onValueChange={(value) => setClimate(value as keyof ClimateFactors)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select climate condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateBTU}
                >
                  Calculate BTU
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Results</h3>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="bg-card rounded-lg p-6 shadow-sm"
                        >
                          <p className="text-2xl font-bold mb-4">
                            Recommended BTU: {result.recommendedBTU.toLocaleString()} BTU/hr
                          </p>
                          <ul className="space-y-2 text-muted-foreground">
                            <li>Room Size: {result.squareFootage.toFixed(1)} sq ft</li>
                            <li>Base BTU: {result.baseBTU.toLocaleString()} BTU/hr</li>
                            <li>Adjusted BTU: {result.adjustedBTU.toLocaleString()} BTU/hr</li>
                            <li>Coverage Rating: {result.coverage}</li>
                            <li>Efficiency Rating: {result.efficiency}</li>
                          </ul>
                          <div className="mt-4 p-4 bg-muted rounded-md">
                            <p className="text-sm">
                              This calculation is based on Energy Star guidelines and takes into account your room type,
                              insulation quality, and climate conditions. The recommended BTU is rounded to the nearest 1,000
                              to match available AC unit sizes.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding BTU Calculations</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What is BTU?</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="mb-2">
                        BTU (British Thermal Unit) is a measure of heat energy. One BTU is the amount of heat required to raise the temperature of one pound of water by one degree Fahrenheit.
                      </p>
                      <ul className="list-disc pl-6">
                        <li>Higher BTU = More powerful heating/cooling</li>
                        <li>Room size directly affects BTU needs</li>
                        <li>Insulation quality impacts efficiency</li>
                        <li>Climate affects required capacity</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Factors Affecting BTU Needs</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Room dimensions and volume</li>
                        <li>Window size and quantity</li>
                        <li>Ceiling height</li>
                        <li>Sun exposure</li>
                        <li>Local climate conditions</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
