'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Car, Fuel, MapPin, DollarSign, BarChart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface MileageResult {
  mpg: number;
  kmpl: number;
  l100km: number;
  costPerMile: number;
  costPerKm: number;
  co2Emissions: number;
}

export default function GasMileageCalculator() {
  const breadcrumbItems = [
    {
      label: 'Gas Mileage Calculator',
      href: '/gas-mileage-calculator'
    }
  ];

  const [distance, setDistance] = useState<string>('');
  const [fuelAmount, setFuelAmount] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [result, setResult] = useState<MileageResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateMileage = (
    dist: number,
    fuel: number,
    price: number,
    isMetric: boolean
  ): MileageResult => {
    let mpg: number;
    let kmpl: number;
    let l100km: number;
    let costPerMile: number;
    let costPerKm: number;

    if (isMetric) {
      // Convert kilometers to miles and liters to gallons
      const miles = dist * 0.621371;
      const gallons = fuel * 0.264172;
      mpg = miles / gallons;
      kmpl = dist / fuel;
      l100km = (fuel * 100) / dist;
      costPerKm = (price * fuel) / dist;
      costPerMile = costPerKm * 1.60934;
    } else {
      mpg = dist / fuel;
      kmpl = (dist * 1.60934) / (fuel * 3.78541);
      l100km = (fuel * 3.78541 * 100) / (dist * 1.60934);
      costPerMile = (price * fuel) / dist;
      costPerKm = costPerMile * 0.621371;
    }

    // Calculate CO2 emissions (rough estimate: 19.64 pounds CO2 per gallon of gasoline)
    const co2Emissions = isMetric ? 
      fuel * 2.31 : // kg CO2 per liter
      fuel * 8.91;  // kg CO2 per gallon

    return {
      mpg: Number(mpg.toFixed(2)),
      kmpl: Number(kmpl.toFixed(2)),
      l100km: Number(l100km.toFixed(2)),
      costPerMile: Number(costPerMile.toFixed(3)),
      costPerKm: Number(costPerKm.toFixed(3)),
      co2Emissions: Number(co2Emissions.toFixed(1))
    };
  };

  const handleCalculate = () => {
    setError('');

    const dist = parseFloat(distance);
    const fuel = parseFloat(fuelAmount);
    const price = parseFloat(fuelPrice || '0');

    if (isNaN(dist) || isNaN(fuel)) {
      setError('Please enter valid numbers for distance and fuel amount');
      return;
    }

    if (dist <= 0 || fuel <= 0) {
      setError('Distance and fuel amount must be greater than zero');
      return;
    }

    const mileageResult = calculateMileage(dist, fuel, price, unit === 'metric');
    setResult(mileageResult);
  };

  const getEfficiencyRating = (mpg: number): string => {
    if (mpg >= 45) return 'Excellent';
    if (mpg >= 35) return 'Very Good';
    if (mpg >= 25) return 'Good';
    if (mpg >= 15) return 'Fair';
    return 'Poor';
  };

  const getEfficiencyColor = (mpg: number): string => {
    if (mpg >= 45) return '#10B981';
    if (mpg >= 35) return '#34D399';
    if (mpg >= 25) return '#FBBF24';
    if (mpg >= 15) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Gas Mileage Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Gas Mileage</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (mi, gal)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (km, L)
                  </button>
                </div>

                {/* Distance Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Distance Traveled
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the distance traveled in {unit === 'imperial' ? 'miles' : 'kilometers'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      placeholder={`Distance in ${unit === 'imperial' ? 'miles' : 'kilometers'}`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Fuel Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuel Used
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the amount of fuel used in {unit === 'imperial' ? 'gallons' : 'liters'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={fuelAmount}
                      onChange={(e) => setFuelAmount(e.target.value)}
                      placeholder={`Fuel in ${unit === 'imperial' ? 'gallons' : 'liters'}`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Fuel Price Input (Optional) */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuel Price (Optional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the price per {unit === 'imperial' ? 'gallon' : 'liter'} to calculate cost per mile/km</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                      placeholder={`Price per ${unit === 'imperial' ? 'gallon' : 'liter'} (optional)`}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                  disabled={!distance || !fuelAmount}
                >
                  Calculate Gas Mileage
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Mileage Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Circular Progress */}
                    <div className="w-48 h-48 mx-auto">
                      <CircularProgressbar
                        value={Math.min(result.mpg, 50)}
                        maxValue={50}
                        text={`${result.mpg} MPG`}
                        styles={buildStyles({
                          pathColor: getEfficiencyColor(result.mpg),
                          textColor: getEfficiencyColor(result.mpg),
                          trailColor: '#d6d6d6',
                        })}
                      />
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold">
                        Efficiency Rating: {getEfficiencyRating(result.mpg)}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Efficiency Metrics</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Miles per Gallon:</span>
                            <span className="font-semibold">{result.mpg} MPG</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Kilometers per Liter:</span>
                            <span>{result.kmpl} km/L</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Liters per 100km:</span>
                            <span>{result.l100km} L/100km</span>
                          </li>
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Cost & Environmental Impact</h3>
                        <ul className="space-y-2">
                          {fuelPrice && (
                            <>
                              <li className="flex justify-between">
                                <span>Cost per Mile:</span>
                                <span>${result.costPerMile}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Cost per Kilometer:</span>
                                <span>${result.costPerKm}</span>
                              </li>
                            </>
                          )}
                          <li className="flex justify-between">
                            <span>CO2 Emissions:</span>
                            <span>{result.co2Emissions} kg</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter trip details to calculate gas mileage
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips and Information */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Improve Your Gas Mileage</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Driving Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Efficient Driving Habits</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Maintain steady speed</li>
                          <li>Use cruise control on highways</li>
                          <li>Avoid rapid acceleration</li>
                          <li>Anticipate traffic conditions</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Speed Considerations</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Optimal speed: 55-65 mph</li>
                          <li>Higher speeds reduce efficiency</li>
                          <li>Use highest gear when possible</li>
                          <li>Avoid excessive idling</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Vehicle Maintenance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Regular Maintenance</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Keep tires properly inflated</li>
                          <li>Regular oil changes</li>
                          <li>Clean air filters</li>
                          <li>Tune-up engine regularly</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Weight Management</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Remove unnecessary cargo</li>
                          <li>Avoid roof cargo when possible</li>
                          <li>Remove roof racks when unused</li>
                          <li>Distribute weight evenly</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Understanding MPG Ratings</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <ul className="list-disc pl-4 space-y-2">
                          <li><span className="font-medium">Excellent (45+ MPG):</span> Typical for hybrid and efficient vehicles</li>
                          <li><span className="font-medium">Very Good (35-44 MPG):</span> Modern compact cars and efficient sedans</li>
                          <li><span className="font-medium">Good (25-34 MPG):</span> Average for modern vehicles</li>
                          <li><span className="font-medium">Fair (15-24 MPG):</span> Larger vehicles and older models</li>
                          <li><span className="font-medium">Poor (&lt;15 MPG):</span> Large SUVs, performance vehicles, or vehicles needing maintenance</li>
                        </ul>
                      </div>
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
