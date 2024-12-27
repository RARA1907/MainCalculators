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

interface FuelCostResult {
  totalCost: number;
  fuelNeeded: number;
  costPerPerson: number;
  roundTripValues?: {
    totalCost: number;
    fuelNeeded: number;
    costPerPerson: number;
  };
}

export default function FuelCostCalculator() {
  const breadcrumbItems = [
    {
      label: 'Fuel Cost Calculator',
      href: '/fuel-cost-calculator'
    }
  ];

  const [distance, setDistance] = useState<string>('');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('1');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [roundTrip, setRoundTrip] = useState<boolean>(false);
  const [result, setResult] = useState<FuelCostResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateFuelCost = (
    dist: number,
    efficiency: number,
    price: number,
    numPassengers: number,
    isMetric: boolean
  ) => {
    // Convert to imperial if metric
    if (isMetric) {
      dist = dist * 0.621371; // km to miles
      efficiency = efficiency * 2.35215; // L/100km to mpg
    }

    const fuelNeeded = dist / efficiency;
    const totalCost = fuelNeeded * price;
    const costPerPerson = totalCost / numPassengers;

    return {
      fuelNeeded: Number(fuelNeeded.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      costPerPerson: Number(costPerPerson.toFixed(2))
    };
  };

  const handleCalculate = () => {
    setError('');

    const dist = parseFloat(distance);
    const efficiency = parseFloat(fuelEfficiency);
    const price = parseFloat(fuelPrice);
    const numPassengers = parseInt(passengers);

    if (isNaN(dist) || isNaN(efficiency) || isNaN(price) || isNaN(numPassengers)) {
      setError('Please enter valid numbers for all fields');
      return;
    }

    if (dist <= 0 || efficiency <= 0 || price <= 0 || numPassengers <= 0) {
      setError('All values must be greater than zero');
      return;
    }

    const oneWayResult = calculateFuelCost(dist, efficiency, price, numPassengers, unit === 'metric');

    if (roundTrip) {
      const roundTripResult = calculateFuelCost(dist * 2, efficiency, price, numPassengers, unit === 'metric');
      setResult({
        ...oneWayResult,
        roundTripValues: roundTripResult
      });
    } else {
      setResult(oneWayResult);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Fuel Cost Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Fuel Cost</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (mi, mpg)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (km, L/100km)
                  </button>
                </div>

                {/* Distance Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Distance
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the distance in {unit === 'imperial' ? 'miles' : 'kilometers'}</p>
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

                {/* Fuel Efficiency Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuel Efficiency
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter fuel efficiency in {unit === 'imperial' ? 'miles per gallon (mpg)' : 'liters per 100 kilometers (L/100km)'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={fuelEfficiency}
                      onChange={(e) => setFuelEfficiency(e.target.value)}
                      placeholder={`Fuel efficiency in ${unit === 'imperial' ? 'mpg' : 'L/100km'}`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Fuel Price Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuel Price
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter fuel price per {unit === 'imperial' ? 'gallon' : 'liter'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
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

                {/* Number of Passengers */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Passengers
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the number of passengers to split the cost</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>

                {/* Round Trip Toggle */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Calculate Round Trip</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                    />
                  </label>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                  disabled={!distance || !fuelEfficiency || !fuelPrice}
                >
                  Calculate Fuel Cost
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Cost Breakdown</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">One Way Trip</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Total Cost:</span>
                            <span className="font-semibold">${result.totalCost}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Fuel Needed:</span>
                            <span>{result.fuelNeeded} {unit === 'imperial' ? 'gal' : 'L'}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Cost per Person:</span>
                            <span>${result.costPerPerson}</span>
                          </li>
                        </ul>
                      </motion.div>

                      {result.roundTripValues && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="p-4 bg-base-200 rounded-lg"
                        >
                          <h3 className="font-semibold mb-2">Round Trip</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span>Total Cost:</span>
                              <span className="font-semibold">${result.roundTripValues.totalCost}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Fuel Needed:</span>
                              <span>{result.roundTripValues.fuelNeeded} {unit === 'imperial' ? 'gal' : 'L'}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Cost per Person:</span>
                              <span>${result.roundTripValues.costPerPerson}</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter trip details to calculate fuel costs
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips and Information */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Fuel Saving Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Driving Habits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Efficient Driving</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Maintain steady speed</li>
                          <li>Avoid rapid acceleration</li>
                          <li>Use cruise control</li>
                          <li>Anticipate traffic</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Vehicle Maintenance</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Regular tune-ups</li>
                          <li>Proper tire pressure</li>
                          <li>Clean air filters</li>
                          <li>Remove excess weight</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Trip Planning</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Plan routes to avoid traffic</li>
                      <li>Combine multiple errands</li>
                      <li>Check tire pressure before long trips</li>
                      <li>Consider carpooling</li>
                      <li>Use apps to find cheaper fuel prices</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Additional Considerations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Weather Impact</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Wind resistance affects efficiency</li>
                          <li>AC usage increases consumption</li>
                          <li>Cold weather reduces efficiency</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Vehicle Loading</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Remove roof racks when unused</li>
                          <li>Distribute weight evenly</li>
                          <li>Avoid overloading</li>
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
