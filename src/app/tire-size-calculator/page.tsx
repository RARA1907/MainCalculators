'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Car, Ruler } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface TireSize {
  width: number;
  aspectRatio: number;
  wheelDiameter: number;
}

interface TireComparison {
  diameter: number;
  circumference: number;
  revPerMile: number;
  speedoDiff: number;
  sidewallHeight: number;
  overallHeight: number;
  sectionWidth: number;
}

export default function TireSizeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Tire Size Calculator',
      href: '/tire-size-calculator'
    }
  ];

  const [currentTire, setCurrentTire] = useState<TireSize>({
    width: 0,
    aspectRatio: 0,
    wheelDiameter: 0
  });
  const [newTire, setNewTire] = useState<TireSize>({
    width: 0,
    aspectRatio: 0,
    wheelDiameter: 0
  });
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [comparison, setComparison] = useState<TireComparison | null>(null);
  const [error, setError] = useState<string>('');

  const calculateTireComparison = (current: TireSize, next: TireSize): TireComparison => {
    // Convert tire width from mm to inches if metric
    const currentWidth = unit === 'metric' ? current.width / 25.4 : current.width;
    const newWidth = unit === 'metric' ? next.width / 25.4 : next.width;

    // Calculate sidewall heights (section height)
    const currentSidewall = (currentWidth * (current.aspectRatio / 100));
    const newSidewall = (newWidth * (next.aspectRatio / 100));

    // Calculate overall diameters
    const currentDiameter = current.wheelDiameter + (2 * currentSidewall);
    const newDiameter = next.wheelDiameter + (2 * newSidewall);

    // Calculate circumferences
    const currentCircumference = Math.PI * currentDiameter;
    const newCircumference = Math.PI * newDiameter;

    // Calculate revolutions per mile
    const currentRevPerMile = 63360 / currentCircumference; // 63360 inches per mile
    const newRevPerMile = 63360 / newCircumference;

    // Calculate speedometer difference (percentage)
    const speedoDiff = ((newDiameter - currentDiameter) / currentDiameter) * 100;

    return {
      diameter: Number((newDiameter - currentDiameter).toFixed(2)),
      circumference: Number((newCircumference - currentCircumference).toFixed(2)),
      revPerMile: Number((newRevPerMile - currentRevPerMile).toFixed(2)),
      speedoDiff: Number(speedoDiff.toFixed(2)),
      sidewallHeight: Number((newSidewall - currentSidewall).toFixed(2)),
      overallHeight: Number(newDiameter.toFixed(2)),
      sectionWidth: Number((newWidth - currentWidth).toFixed(2))
    };
  };

  const handleCalculate = () => {
    setError('');

    // Validate inputs
    if (!currentTire.width || !currentTire.aspectRatio || !currentTire.wheelDiameter ||
        !newTire.width || !newTire.aspectRatio || !newTire.wheelDiameter) {
      setError('Please fill in all tire measurements');
      return;
    }

    // Validate ranges
    const validateTireSize = (tire: TireSize) => {
      if (unit === 'imperial') {
        if (tire.width < 5 || tire.width > 15) return false;
      } else {
        if (tire.width < 125 || tire.width > 380) return false;
      }
      if (tire.aspectRatio < 25 || tire.aspectRatio > 100) return false;
      if (tire.wheelDiameter < 13 || tire.wheelDiameter > 24) return false;
      return true;
    };

    if (!validateTireSize(currentTire) || !validateTireSize(newTire)) {
      setError('Please enter valid tire measurements');
      return;
    }

    setComparison(calculateTireComparison(currentTire, newTire));
  };

  const getDifferenceColor = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue <= 2) return 'text-green-500';
    if (absValue <= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Tire Size Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Compare Tire Sizes</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (inches)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (mm)
                  </button>
                </div>

                {/* Current Tire Size */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Tire Size</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Width
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="inline-block ml-2 h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tire width in {unit === 'imperial' ? 'inches' : 'millimeters'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={currentTire.width || ''}
                        onChange={(e) => setCurrentTire({...currentTire, width: parseFloat(e.target.value)})}
                        placeholder={unit === 'imperial' ? '8.5' : '215'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Aspect Ratio
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="inline-block ml-2 h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tire aspect ratio (height/width percentage)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={currentTire.aspectRatio || ''}
                        onChange={(e) => setCurrentTire({...currentTire, aspectRatio: parseFloat(e.target.value)})}
                        placeholder="55"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Wheel Diameter
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="inline-block ml-2 h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Wheel diameter in inches</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={currentTire.wheelDiameter || ''}
                        onChange={(e) => setCurrentTire({...currentTire, wheelDiameter: parseFloat(e.target.value)})}
                        placeholder="17"
                      />
                    </div>
                  </div>
                </div>

                {/* New Tire Size */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">New Tire Size</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Width</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={newTire.width || ''}
                        onChange={(e) => setNewTire({...newTire, width: parseFloat(e.target.value)})}
                        placeholder={unit === 'imperial' ? '9.0' : '225'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={newTire.aspectRatio || ''}
                        onChange={(e) => setNewTire({...newTire, aspectRatio: parseFloat(e.target.value)})}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Wheel Diameter</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={newTire.wheelDiameter || ''}
                        onChange={(e) => setNewTire({...newTire, wheelDiameter: parseFloat(e.target.value)})}
                        placeholder="18"
                      />
                    </div>
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
                >
                  Compare Tire Sizes
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Tire Comparison Results</h2>
              </CardHeader>
              <CardContent>
                {comparison ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Size Differences</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Diameter Difference:</span>
                            <span className={getDifferenceColor(comparison.diameter)}>
                              {comparison.diameter > 0 ? '+' : ''}{comparison.diameter}"
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Sidewall Height Diff:</span>
                            <span className={getDifferenceColor(comparison.sidewallHeight)}>
                              {comparison.sidewallHeight > 0 ? '+' : ''}{comparison.sidewallHeight}"
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Section Width Diff:</span>
                            <span className={getDifferenceColor(comparison.sectionWidth)}>
                              {comparison.sectionWidth > 0 ? '+' : ''}{comparison.sectionWidth}"
                            </span>
                          </li>
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Performance Impact</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Speedometer Error:</span>
                            <span className={getDifferenceColor(comparison.speedoDiff)}>
                              {comparison.speedoDiff > 0 ? '+' : ''}{comparison.speedoDiff}%
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Revs/Mile Difference:</span>
                            <span>{comparison.revPerMile}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Overall Height:</span>
                            <span>{comparison.overallHeight}"</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>

                    {Math.abs(comparison.speedoDiff) > 2 && (
                      <div className="alert alert-warning">
                        <span>
                          Speedometer error of {Math.abs(comparison.speedoDiff)}% means your actual speed will be{' '}
                          {comparison.speedoDiff > 0 ? 'higher' : 'lower'} than indicated.
                          Consider recalibration if installing these tires.
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter tire sizes to see comparison
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Tire Size Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Understanding Tire Sizes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Tire Size Format</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Width: Tire width in mm or inches</li>
                          <li>Aspect Ratio: Height as % of width</li>
                          <li>Wheel Diameter: In inches</li>
                          <li>Example: 225/50R17</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Common Ranges</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Width: 175-315mm</li>
                          <li>Aspect Ratio: 30-70</li>
                          <li>Wheel Diameter: 14-22"</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Impact of Size Changes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Performance Effects</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Handling characteristics</li>
                          <li>Acceleration/braking</li>
                          <li>Fuel efficiency</li>
                          <li>Ride comfort</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Fitment Considerations</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Wheel well clearance</li>
                          <li>Suspension geometry</li>
                          <li>Brake clearance</li>
                          <li>Fender clearance</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Always check vehicle manufacturer specifications</li>
                      <li>Consider load rating requirements</li>
                      <li>Verify speedometer calibration needs</li>
                      <li>Check local regulations regarding tire size modifications</li>
                      <li>Consider impact on vehicle warranty</li>
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
