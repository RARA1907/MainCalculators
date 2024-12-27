'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Car, GasPump, DollarSign } from 'lucide-react';
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
  kmPerLiter: number;
  litersPer100km: number;
  fuelCost: number;
  co2Emissions: number;
  annualFuelCost: number;
}

export default function MileageCalculator() {
  const breadcrumbItems = [
    {
      label: 'Mileage Calculator',
      href: '/mileage-calculator'
    }
  ];

  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [distance, setDistance] = useState<string>('');
  const [fuel, setFuel] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [result, setResult] = useState<MileageResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateMileage = (
    dist: number,
    fuelAmount: number,
    price: number,
    isMetric: boolean
  ): MileageResult => {
    let mpg: number;
    let kmPerLiter: number;
    let litersPer100km: number;

    if (isMetric) {
      // Convert kilometers and liters to miles and gallons
      const miles = dist * 0.621371;
      const gallons = fuelAmount * 0.264172;
      mpg = miles / gallons;
      kmPerLiter = dist / fuelAmount;
      litersPer100km = (fuelAmount * 100) / dist;
    } else {
      mpg = dist / fuelAmount;
      kmPerLiter = (dist * 1.60934) / (fuelAmount * 3.78541);
      litersPer100km = 235.215 / mpg;
    }

    // Calculate fuel cost
    const fuelCost = price * fuelAmount;

    // Estimate annual fuel cost (based on 12,000 miles per year)
    const annualMiles = 12000;
    const annualGallons = annualMiles / mpg;
    const annualFuelCost = annualGallons * price;

    // Estimate CO2 emissions (kg) - average 2.31 kg CO2 per liter of gasoline
    const litersUsed = isMetric ? fuelAmount : fuelAmount * 3.78541;
    const co2Emissions = litersUsed * 2.31;

    return {
      mpg: Number(mpg.toFixed(2)),
      kmPerLiter: Number(kmPerLiter.toFixed(2)),
      litersPer100km: Number(litersPer100km.toFixed(2)),
      fuelCost: Number(fuelCost.toFixed(2)),
      co2Emissions: Number(co2Emissions.toFixed(2)),
      annualFuelCost: Number(annualFuelCost.toFixed(2))
    };
  };

  const handleCalculate = () => {
    setError('');

    const dist = parseFloat(distance);
    const fuelAmount = parseFloat(fuel);
    const price = parseFloat(fuelPrice || '0');

    if (isNaN(dist) || isNaN(fuelAmount)) {
      setError('Please enter valid numbers for distance and fuel');
      return;
    }

    if (dist <= 0 || fuelAmount <= 0) {
      setError('Values must be greater than zero');
      return;
    }

    setResult(calculateMileage(dist, fuelAmount, price, unit === 'metric'));
  };

  const getEfficiencyRating = (mpg: number): string => {
    if (mpg >= 50) return 'Excellent';
    if (mpg >= 40) return 'Very Good';
    if (mpg >= 30) return 'Good';
    if (mpg >= 20) return 'Fair';
    return 'Poor';
  };

  const getEfficiencyColor = (mpg: number): string => {
    if (mpg >= 50) return '#10B981';
    if (mpg >= 40) return '#3B82F6';
    if (mpg >= 30) return '#F59E0B';
    if (mpg >= 20) return '#EF4444';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Mileage Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Fuel Efficiency</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (mi/gal)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (km/L)
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
                          <p>Enter distance in {unit === 'imperial' ? 'miles' : 'kilometers'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
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
                          <p>Enter fuel amount in {unit === 'imperial' ? 'gallons' : 'liters'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <GasPump className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      placeholder={`Fuel in ${unit === 'imperial' ? 'gallons' : 'liters'}`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Fuel Price Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuel Price (Optional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter price per {unit === 'imperial' ? 'gallon' : 'liter'}</p>
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
                      placeholder={`Price per ${unit === 'imperial' ? 'gallon' : 'liter'}`}
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
                  disabled={!distance || !fuel}
                >
                  Calculate Mileage
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Fuel Efficiency Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Circular Progress */}
                    <div className="w-48 h-48 mx-auto">
                      <CircularProgressbar
                        value={Math.min(result.mpg, 60)}
                        maxValue={60}
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
                            <span>{result.kmPerLiter} km/L</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Liters per 100km:</span>
                            <span>{result.litersPer100km} L/100km</span>
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
                                <span>Trip Fuel Cost:</span>
                                <span>${result.fuelCost}</span>
                              </li>
                              <li className="flex justify-between">
                                <span>Est. Annual Fuel Cost:</span>
                                <span>${result.annualFuelCost}</span>
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
                    Enter trip details to calculate fuel efficiency
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Fuel Efficiency Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Understanding Fuel Economy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">MPG Ratings</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Excellent: 50+ MPG</li>
                          <li>Very Good: 40-49 MPG</li>
                          <li>Good: 30-39 MPG</li>
                          <li>Fair: 20-29 MPG</li>
                          <li>Poor: Below 20 MPG</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Vehicle Types</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Hybrid: 45-55 MPG</li>
                          <li>Compact Car: 30-40 MPG</li>
                          <li>Midsize Car: 25-35 MPG</li>
                          <li>SUV: 20-30 MPG</li>
                          <li>Truck: 15-25 MPG</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Improving Fuel Economy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Driving Tips</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Maintain steady speed</li>
                          <li>Avoid rapid acceleration</li>
                          <li>Remove excess weight</li>
                          <li>Use cruise control</li>
                          <li>Plan efficient routes</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Maintenance Tips</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Regular oil changes</li>
                          <li>Proper tire pressure</li>
                          <li>Clean air filters</li>
                          <li>Tune-ups as needed</li>
                          <li>Fix issues promptly</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Results may vary based on driving conditions and vehicle maintenance</li>
                      <li>EPA ratings are typically based on controlled testing conditions</li>
                      <li>Highway MPG is usually higher than city MPG</li>
                      <li>Regular maintenance can improve fuel efficiency</li>
                      <li>Consider tracking multiple trips for more accurate averages</li>
                    </ul>
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
