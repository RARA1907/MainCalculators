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

interface WireSize {
  awg: string;
  diameter: number;
  resistance: number;
  currentRating: number;
  description: string;
}

const wireSizes: { [key: string]: WireSize } = {
  '14': {
    awg: '14',
    diameter: 1.628,
    resistance: 8.286,
    currentRating: 15,
    description: 'Common in residential lighting circuits'
  },
  '12': {
    awg: '12',
    diameter: 2.053,
    resistance: 5.211,
    currentRating: 20,
    description: 'Standard for household power outlets'
  },
  '10': {
    awg: '10',
    diameter: 2.588,
    resistance: 3.277,
    currentRating: 30,
    description: 'Used for water heaters and AC units'
  },
  '8': {
    awg: '8',
    diameter: 3.264,
    resistance: 2.061,
    currentRating: 40,
    description: 'Common in larger appliance circuits'
  },
  '6': {
    awg: '6',
    diameter: 4.115,
    resistance: 1.296,
    currentRating: 55,
    description: 'Used for sub-panels and heavy equipment'
  },
  '4': {
    awg: '4',
    diameter: 5.189,
    resistance: 0.815,
    currentRating: 70,
    description: 'For high-current applications'
  },
  '2': {
    awg: '2',
    diameter: 6.544,
    resistance: 0.513,
    currentRating: 95,
    description: 'Heavy-duty industrial applications'
  },
  '1/0': {
    awg: '1/0',
    diameter: 8.251,
    resistance: 0.323,
    currentRating: 125,
    description: 'Used in service entrances'
  }
};

interface Material {
  name: string;
  resistivity: number;
  description: string;
}

const materials: { [key: string]: Material } = {
  copper: {
    name: 'Copper',
    resistivity: 1,
    description: 'Most common conductor, excellent conductivity'
  },
  aluminum: {
    name: 'Aluminum',
    resistivity: 1.64,
    description: 'Lighter but higher resistance than copper'
  }
};

export default function VoltageDropCalculator() {
  const breadcrumbItems = [
    {
      label: 'Voltage Drop Calculator',
      href: '/voltage-drop-calculator'
    }
  ];

  const [wireSize, setWireSize] = useState<string>('12');
  const [material, setMaterial] = useState<string>('copper');
  const [voltage, setVoltage] = useState<number>(120);
  const [current, setCurrent] = useState<number>(15);
  const [length, setLength] = useState<number>(50);
  const [lengthUnit, setLengthUnit] = useState<'ft' | 'm'>('ft');
  const [circuitType, setCircuitType] = useState<'single-phase' | 'three-phase'>('single-phase');
  const [results, setResults] = useState<{
    voltageDrop: number;
    voltageDropPercent: number;
    powerLoss: number;
    efficiency: number;
  }>({
    voltageDrop: 0,
    voltageDropPercent: 0,
    powerLoss: 0,
    efficiency: 100
  });

  const calculateVoltageDrop = () => {
    // Convert length to feet if in meters
    const lengthInFeet = lengthUnit === 'm' ? length * 3.28084 : length;
    
    // Get wire resistance per 1000 feet
    const wireResistance = wireSizes[wireSize].resistance * materials[material].resistivity;
    
    // Calculate voltage drop
    const multiplier = circuitType === 'single-phase' ? 2 : 1.732;
    const voltageDrop = (current * wireResistance * lengthInFeet * multiplier) / 1000;
    
    // Calculate percentage voltage drop
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    
    // Calculate power loss
    const powerLoss = voltageDrop * current;
    
    // Calculate efficiency
    const efficiency = 100 - voltageDropPercent;

    setResults({
      voltageDrop,
      voltageDropPercent,
      powerLoss,
      efficiency
    });
  };

  useEffect(() => {
    calculateVoltageDrop();
  }, [wireSize, material, voltage, current, length, lengthUnit, circuitType]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Voltage Drop Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Circuit Parameters</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Wire Size (AWG)</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={wireSize}
                    onChange={(e) => setWireSize(e.target.value)}
                  >
                    {Object.entries(wireSizes).map(([awg, data]) => (
                      <option key={awg} value={awg}>
                        {data.awg} AWG ({data.currentRating}A)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Conductor Material</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    {Object.entries(materials).map(([key, data]) => (
                      <option key={key} value={key}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Circuit Type</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={circuitType}
                    onChange={(e) => setCircuitType(e.target.value as 'single-phase' | 'three-phase')}
                  >
                    <option value="single-phase">Single Phase</option>
                    <option value="three-phase">Three Phase</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">System Voltage (V)</span>
                  </label>
                  <Input
                    type="number"
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    placeholder="Enter voltage"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current (A)</span>
                  </label>
                  <Input
                    type="number"
                    value={current}
                    onChange={(e) => setCurrent(Number(e.target.value))}
                    placeholder="Enter current"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Conductor Length</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      placeholder="Enter length"
                      min="0"
                    />
                    <select
                      className="select select-bordered w-32"
                      value={lengthUnit}
                      onChange={(e) => setLengthUnit(e.target.value as 'ft' | 'm')}
                    >
                      <option value="ft">feet</option>
                      <option value="m">meters</option>
                    </select>
                  </div>
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
              <div className="space-y-4">
                <motion.div
                  className="p-4 border rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Voltage Drop</span>
                    <span className="text-xl font-bold">{results.voltageDrop.toFixed(2)} V</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Voltage Drop Percentage</span>
                    <span className={`text-xl font-bold ${results.voltageDropPercent > 3 ? 'text-red-500' : 'text-green-500'}`}>
                      {results.voltageDropPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Power Loss</span>
                    <span className="text-xl font-bold">{results.powerLoss.toFixed(2)} W</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Circuit Efficiency</span>
                    <span className="text-xl font-bold">{results.efficiency.toFixed(2)}%</span>
                  </div>
                </motion.div>

                {results.voltageDropPercent > 3 && (
                  <div className="p-4 border border-red-500 rounded-lg bg-red-50 text-red-700">
                    <p className="font-medium">Warning: Voltage drop exceeds recommended 3% limit</p>
                    <p className="text-sm mt-1">Consider using a larger wire size or reducing the circuit length.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Wire Specifications</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(wireSizes).map(([awg, data]) => (
                  <div key={awg} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{data.awg} AWG</h3>
                      <span className="text-sm font-medium">{data.currentRating}A</span>
                    </div>
                    <p className="text-sm mb-1">Diameter: {data.diameter} mm</p>
                    <p className="text-sm mb-1">Resistance: {data.resistance} Ω/1000ft</p>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Voltage Drop Limits</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Maximum 3% for branch circuits</li>
                      <li>Maximum 5% for combined feeder and branch</li>
                      <li>Lower voltage drop means better efficiency</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Material Properties</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Copper: Better conductivity, higher cost</li>
                      <li>Aluminum: Lighter weight, lower cost</li>
                      <li>Temperature affects resistance</li>
                    </ul>
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
