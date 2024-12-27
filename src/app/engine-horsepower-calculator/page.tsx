'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Gauge, Settings, Zap } from 'lucide-react';
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

interface EngineResult {
  estimatedHp: number;
  hpPerLiter: number;
  torque: number;
  volumetricEfficiency: number;
}

export default function EngineHorsepowerCalculator() {
  const breadcrumbItems = [
    {
      label: 'Engine Horsepower Calculator',
      href: '/engine-horsepower-calculator'
    }
  ];

  const [calculationType, setCalculationType] = useState<'displacement' | 'dyno'>('displacement');
  const [displacement, setDisplacement] = useState<string>('');
  const [compressionRatio, setCompressionRatio] = useState<string>('');
  const [rpm, setRpm] = useState<string>('');
  const [boost, setBoost] = useState<string>('0');
  const [volumetricEfficiency, setVolumetricEfficiency] = useState<string>('80');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [result, setResult] = useState<EngineResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateFromDisplacement = (
    disp: number,
    cr: number,
    rpmValue: number,
    boostPsi: number,
    ve: number,
    isMetric: boolean
  ): EngineResult => {
    // Convert displacement to cubic inches if metric
    const dispCi = isMetric ? disp * 61.0237 : disp;
    
    // Base calculations
    let baseHp = (dispCi * rpmValue) / 3456; // Basic naturally aspirated formula
    
    // Compression ratio factor (simplified)
    const crFactor = Math.sqrt(cr) / 2;
    
    // Boost factor (if any)
    const boostFactor = boostPsi > 0 ? 1 + (boostPsi * 0.045) : 1;
    
    // Volumetric efficiency factor
    const veFactor = ve / 100;
    
    // Calculate estimated horsepower
    let estimatedHp = baseHp * crFactor * boostFactor * veFactor;
    
    // Calculate horsepower per liter
    const dispLiters = isMetric ? disp : disp * 0.0163871;
    const hpPerLiter = estimatedHp / dispLiters;
    
    // Estimate torque (simplified)
    const torque = (estimatedHp * 5252) / rpmValue;

    return {
      estimatedHp: Number(estimatedHp.toFixed(1)),
      hpPerLiter: Number(hpPerLiter.toFixed(1)),
      torque: Number(torque.toFixed(1)),
      volumetricEfficiency: ve
    };
  };

  const handleCalculate = () => {
    setError('');

    if (calculationType === 'displacement') {
      const disp = parseFloat(displacement);
      const cr = parseFloat(compressionRatio);
      const rpmValue = parseFloat(rpm);
      const boostValue = parseFloat(boost || '0');
      const ve = parseFloat(volumetricEfficiency);

      if (isNaN(disp) || isNaN(cr) || isNaN(rpmValue)) {
        setError('Please enter valid numbers for all required fields');
        return;
      }

      if (disp <= 0 || cr <= 0 || rpmValue <= 0) {
        setError('Values must be greater than zero');
        return;
      }

      if (cr < 6 || cr > 15) {
        setError('Compression ratio should be between 6:1 and 15:1');
        return;
      }

      if (rpmValue > 15000) {
        setError('RPM value seems unusually high. Please verify.');
        return;
      }

      setResult(calculateFromDisplacement(disp, cr, rpmValue, boostValue, ve, unit === 'metric'));
    }
  };

  const getEngineRating = (hp: number): string => {
    if (hp >= 600) return 'High Performance';
    if (hp >= 400) return 'Performance';
    if (hp >= 300) return 'Sport';
    if (hp >= 200) return 'Standard';
    return 'Economy';
  };

  const getEngineColor = (hp: number): string => {
    if (hp >= 600) return '#EF4444';
    if (hp >= 400) return '#F59E0B';
    if (hp >= 300) return '#10B981';
    if (hp >= 200) return '#3B82F6';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Engine Horsepower Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Engine Power</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (cu.in)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (L)
                  </button>
                </div>

                {/* Engine Displacement */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Engine Displacement
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter engine displacement in {unit === 'imperial' ? 'cubic inches' : 'liters'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={displacement}
                      onChange={(e) => setDisplacement(e.target.value)}
                      placeholder={`Displacement in ${unit === 'imperial' ? 'cu.in' : 'L'}`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Compression Ratio */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compression Ratio
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter compression ratio (e.g., 10.5 for 10.5:1)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={compressionRatio}
                      onChange={(e) => setCompressionRatio(e.target.value)}
                      placeholder="Enter compression ratio"
                      min="6"
                      max="15"
                      step="0.1"
                    />
                  </div>
                </div>

                {/* RPM */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximum RPM
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter maximum engine RPM</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={rpm}
                      onChange={(e) => setRpm(e.target.value)}
                      placeholder="Enter maximum RPM"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>

                {/* Boost Pressure (Optional) */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Boost Pressure (PSI) - Optional
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter boost pressure in PSI (0 for naturally aspirated)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={boost}
                    onChange={(e) => setBoost(e.target.value)}
                    placeholder="Enter boost pressure (PSI)"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Volumetric Efficiency */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Volumetric Efficiency (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Typical values: 75-85% for stock engines, 85-95% for modified engines</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={volumetricEfficiency}
                    onChange={(e) => setVolumetricEfficiency(e.target.value)}
                    placeholder="Enter volumetric efficiency"
                    min="50"
                    max="100"
                    step="1"
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                  disabled={!displacement || !compressionRatio || !rpm}
                >
                  Calculate Engine Power
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Engine Power Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Circular Progress */}
                    <div className="w-48 h-48 mx-auto">
                      <CircularProgressbar
                        value={Math.min(result.estimatedHp, 800)}
                        maxValue={800}
                        text={`${result.estimatedHp} HP`}
                        styles={buildStyles({
                          pathColor: getEngineColor(result.estimatedHp),
                          textColor: getEngineColor(result.estimatedHp),
                          trailColor: '#d6d6d6',
                        })}
                      />
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold">
                        Engine Rating: {getEngineRating(result.estimatedHp)}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Power Metrics</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Estimated Power:</span>
                            <span className="font-semibold">{result.estimatedHp} HP</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Power per Liter:</span>
                            <span>{result.hpPerLiter} HP/L</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Estimated Torque:</span>
                            <span>{result.torque} ft-lb</span>
                          </li>
                        </ul>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Engine Efficiency</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Volumetric Efficiency:</span>
                            <span>{result.volumetricEfficiency}%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Power/Displacement Ratio:</span>
                            <span>{(result.hpPerLiter).toFixed(1)} HP/L</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter engine specifications to calculate power
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Engine Power Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Understanding Engine Power</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Power Categories</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>High Performance: 600+ HP</li>
                          <li>Performance: 400-599 HP</li>
                          <li>Sport: 300-399 HP</li>
                          <li>Standard: 200-299 HP</li>
                          <li>Economy: Below 200 HP</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Volumetric Efficiency</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Stock Engines: 75-85%</li>
                          <li>Modified NA: 85-95%</li>
                          <li>Forced Induction: 85-150%+</li>
                          <li>Race Engines: 95-100%</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Factors Affecting Engine Power</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Compression Ratio</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Low: 8:1 - 9:1</li>
                          <li>Medium: 9:1 - 10.5:1</li>
                          <li>High: 10.5:1 - 12:1</li>
                          <li>Race: 12:1+</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Boost Pressure</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Mild: 5-8 PSI</li>
                          <li>Moderate: 8-15 PSI</li>
                          <li>High: 15-25 PSI</li>
                          <li>Extreme: 25+ PSI</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Results are theoretical estimates and may vary from actual dyno results</li>
                      <li>Higher compression ratios require higher octane fuel</li>
                      <li>Boost pressure significantly affects power output</li>
                      <li>Engine modifications can greatly impact actual power output</li>
                      <li>Consider factors like altitude and temperature for real-world performance</li>
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
