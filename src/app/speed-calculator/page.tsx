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

interface SpeedUnit {
  name: string;
  symbol: string;
  toMPS: number; // conversion factor to meters per second
  category: 'common' | 'scientific' | 'aviation';
  description: string;
}

const speedUnits: { [key: string]: SpeedUnit } = {
  mps: {
    name: 'Meters per Second',
    symbol: 'm/s',
    toMPS: 1,
    category: 'scientific',
    description: 'SI unit of speed'
  },
  kph: {
    name: 'Kilometers per Hour',
    symbol: 'km/h',
    toMPS: 0.277778,
    category: 'common',
    description: 'Common unit in many countries'
  },
  mph: {
    name: 'Miles per Hour',
    symbol: 'mph',
    toMPS: 0.44704,
    category: 'common',
    description: 'Common unit in US and UK'
  },
  fps: {
    name: 'Feet per Second',
    symbol: 'ft/s',
    toMPS: 0.3048,
    category: 'scientific',
    description: 'Used in engineering'
  },
  knots: {
    name: 'Knots',
    symbol: 'kn',
    toMPS: 0.514444,
    category: 'aviation',
    description: 'Used in aviation and marine navigation'
  },
  mach: {
    name: 'Mach',
    symbol: 'M',
    toMPS: 343, // at sea level, 20°C
    category: 'aviation',
    description: 'Speed of sound, varies with altitude'
  }
};

export default function SpeedCalculator() {
  const breadcrumbItems = [
    {
      label: 'Speed Calculator',
      href: '/speed-calculator'
    }
  ];

  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('kph');
  const [calculationType, setCalculationType] = useState<'convert' | 'distance' | 'time'>('convert');
  const [distance, setDistance] = useState<number>(100);
  const [time, setTime] = useState<number>(1);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [timeUnit, setTimeUnit] = useState<'h' | 'min' | 's'>('h');
  const [results, setResults] = useState<{ [key: string]: number }>({});

  const calculateConversions = () => {
    // Convert input to meters per second first
    const valueInMPS = value * speedUnits[fromUnit].toMPS;
    const newResults: { [key: string]: number } = {};

    Object.entries(speedUnits).forEach(([unit, data]) => {
      newResults[unit] = valueInMPS / data.toMPS;
    });

    setResults(newResults);
  };

  const calculateSpeed = () => {
    let distanceInMeters = distance * (distanceUnit === 'km' ? 1000 : 1609.34);
    let timeInSeconds = time * (
      timeUnit === 'h' ? 3600 : 
      timeUnit === 'min' ? 60 : 1
    );
    
    const speedInMPS = distanceInMeters / timeInSeconds;
    const newResults: { [key: string]: number } = {};

    Object.entries(speedUnits).forEach(([unit, data]) => {
      newResults[unit] = speedInMPS / data.toMPS;
    });

    setResults(newResults);
  };

  useEffect(() => {
    if (calculationType === 'convert') {
      calculateConversions();
    } else {
      calculateSpeed();
    }
  }, [value, fromUnit, calculationType, distance, time, distanceUnit, timeUnit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Speed Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Speed</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calculation Type</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`btn flex-1 ${calculationType === 'convert' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setCalculationType('convert')}
                    >
                      Convert Units
                    </button>
                    <button
                      className={`btn flex-1 ${calculationType === 'distance' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setCalculationType('distance')}
                    >
                      Distance & Time
                    </button>
                  </div>
                </div>

                {calculationType === 'convert' ? (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Speed Value</span>
                      </label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        placeholder="Enter speed"
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">From Unit</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                      >
                        {Object.entries(speedUnits).map(([key, unit]) => (
                          <option key={key} value={key}>
                            {unit.name} ({unit.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Distance</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={distance}
                          onChange={(e) => setDistance(Number(e.target.value))}
                          placeholder="Enter distance"
                          min="0"
                        />
                        <select
                          className="select select-bordered w-32"
                          value={distanceUnit}
                          onChange={(e) => setDistanceUnit(e.target.value as 'km' | 'mi')}
                        >
                          <option value="km">km</option>
                          <option value="mi">mi</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Time</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={time}
                          onChange={(e) => setTime(Number(e.target.value))}
                          placeholder="Enter time"
                          min="0"
                        />
                        <select
                          className="select select-bordered w-32"
                          value={timeUnit}
                          onChange={(e) => setTimeUnit(e.target.value as 'h' | 'min' | 's')}
                        >
                          <option value="h">hours</option>
                          <option value="min">minutes</option>
                          <option value="s">seconds</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Speed in Different Units</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(results).map(([unit, value]) => (
                  <motion.div
                    key={unit}
                    className="flex justify-between items-center p-3 border-b last:border-b-0 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{speedUnits[unit].name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 inline-block" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{speedUnits[unit].description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        )
                      </span>
                    </div>
                    <span className="text-right font-semibold">
                      {value.toFixed(2)} {speedUnits[unit].symbol}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Speed Units</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Common Units</h3>
                  <p>Kilometers per hour (km/h) and miles per hour (mph) are the most commonly used units for everyday speed measurements like vehicle speeds.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Scientific Units</h3>
                  <p>Meters per second (m/s) is the SI unit of speed. It's commonly used in physics and scientific calculations.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Aviation Units</h3>
                  <p>Knots (nautical miles per hour) are used in aviation and marine navigation. Mach number represents the ratio of speed to the speed of sound.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
