'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Gauge, RotateCw, Zap } from 'lucide-react';
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

interface PowerResult {
  horsepower: number;
  kilowatts: number;
  psHorsepower: number;
  ftLbTorque?: number;
  nmTorque?: number;
}

export default function HorsepowerCalculator() {
  const breadcrumbItems = [
    {
      label: 'Horsepower Calculator',
      href: '/horsepower-calculator'
    }
  ];

  const [calculationType, setCalculationType] = useState<'torque' | 'power'>('torque');
  const [torque, setTorque] = useState<string>('');
  const [rpm, setRpm] = useState<string>('');
  const [power, setPower] = useState<string>('');
  const [torqueUnit, setTorqueUnit] = useState<'ft-lb' | 'nm'>('ft-lb');
  const [powerUnit, setPowerUnit] = useState<'hp' | 'kw' | 'ps'>('hp');
  const [result, setResult] = useState<PowerResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateFromTorque = (torqueValue: number, rpmValue: number, isFtLb: boolean): PowerResult => {
    // Convert torque to ft-lb if it's in Nm
    const torqueFtLb = isFtLb ? torqueValue : torqueValue * 0.737562;
    
    // Calculate horsepower (HP = Torque × RPM ÷ 5252)
    const hp = (torqueFtLb * rpmValue) / 5252;
    
    // Convert to other units
    const kw = hp * 0.745699872; // HP to Kilowatts
    const ps = hp * 1.01387; // HP to PS (Pferdestärke)
    
    // Calculate torque in both units
    const nmTorque = isFtLb ? torqueValue * 1.355818 : torqueValue;
    const ftLbTorque = isFtLb ? torqueValue : torqueValue * 0.737562;

    return {
      horsepower: Number(hp.toFixed(2)),
      kilowatts: Number(kw.toFixed(2)),
      psHorsepower: Number(ps.toFixed(2)),
      ftLbTorque: Number(ftLbTorque.toFixed(2)),
      nmTorque: Number(nmTorque.toFixed(2))
    };
  };

  const calculateFromPower = (powerValue: number, unit: 'hp' | 'kw' | 'ps'): PowerResult => {
    let hp: number;

    // Convert to HP first
    switch (unit) {
      case 'kw':
        hp = powerValue * 1.34102; // kW to HP
        break;
      case 'ps':
        hp = powerValue * 0.986320; // PS to HP
        break;
      default:
        hp = powerValue;
    }

    const kw = hp * 0.745699872; // HP to Kilowatts
    const ps = hp * 1.01387; // HP to PS

    return {
      horsepower: Number(hp.toFixed(2)),
      kilowatts: Number(kw.toFixed(2)),
      psHorsepower: Number(ps.toFixed(2))
    };
  };

  const handleCalculate = () => {
    setError('');

    if (calculationType === 'torque') {
      const torqueValue = parseFloat(torque);
      const rpmValue = parseFloat(rpm);

      if (isNaN(torqueValue) || isNaN(rpmValue)) {
        setError('Please enter valid numbers for torque and RPM');
        return;
      }

      if (torqueValue <= 0 || rpmValue <= 0) {
        setError('Values must be greater than zero');
        return;
      }

      if (rpmValue > 20000) {
        setError('RPM value seems unusually high. Please verify.');
        return;
      }

      setResult(calculateFromTorque(torqueValue, rpmValue, torqueUnit === 'ft-lb'));
    } else {
      const powerValue = parseFloat(power);

      if (isNaN(powerValue)) {
        setError('Please enter a valid number for power');
        return;
      }

      if (powerValue <= 0) {
        setError('Power must be greater than zero');
        return;
      }

      setResult(calculateFromPower(powerValue, powerUnit));
    }
  };

  const getPowerRating = (hp: number): string => {
    if (hp >= 500) return 'High Performance';
    if (hp >= 300) return 'Sports Car';
    if (hp >= 200) return 'Performance';
    if (hp >= 150) return 'Standard';
    return 'Economy';
  };

  const getPowerColor = (hp: number): string => {
    if (hp >= 500) return '#EF4444';
    if (hp >= 300) return '#F59E0B';
    if (hp >= 200) return '#10B981';
    if (hp >= 150) return '#3B82F6';
    return '#6B7280';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Horsepower Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Engine Power</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Calculation Type Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${calculationType === 'torque' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCalculationType('torque')}
                  >
                    Calculate from Torque & RPM
                  </button>
                  <button
                    className={`btn flex-1 ${calculationType === 'power' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCalculationType('power')}
                  >
                    Convert Power Units
                  </button>
                </div>

                {calculationType === 'torque' ? (
                  <>
                    {/* Torque Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Torque
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="inline-block ml-2 h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter the engine torque value</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="flex space-x-4">
                        <div className="relative flex-1">
                          <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                          <input
                            type="number"
                            className="input input-bordered w-full pl-10"
                            value={torque}
                            onChange={(e) => setTorque(e.target.value)}
                            placeholder="Enter torque value"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <select
                          className="select select-bordered w-32"
                          value={torqueUnit}
                          onChange={(e) => setTorqueUnit(e.target.value as 'ft-lb' | 'nm')}
                        >
                          <option value="ft-lb">ft-lb</option>
                          <option value="nm">Nm</option>
                        </select>
                      </div>
                    </div>

                    {/* RPM Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        RPM
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="inline-block ml-2 h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter the engine RPM (Revolutions Per Minute)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="relative">
                        <RotateCw className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <input
                          type="number"
                          className="input input-bordered w-full pl-10"
                          value={rpm}
                          onChange={(e) => setRpm(e.target.value)}
                          placeholder="Enter RPM"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Power Input */
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Power
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="inline-block ml-2 h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the power value to convert</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <div className="flex space-x-4">
                      <div className="relative flex-1">
                        <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <input
                          type="number"
                          className="input input-bordered w-full pl-10"
                          value={power}
                          onChange={(e) => setPower(e.target.value)}
                          placeholder="Enter power value"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <select
                        className="select select-bordered w-32"
                        value={powerUnit}
                        onChange={(e) => setPowerUnit(e.target.value as 'hp' | 'kw' | 'ps')}
                      >
                        <option value="hp">HP</option>
                        <option value="kw">kW</option>
                        <option value="ps">PS</option>
                      </select>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                  disabled={calculationType === 'torque' ? !torque || !rpm : !power}
                >
                  Calculate Power
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Power Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Circular Progress */}
                    <div className="w-48 h-48 mx-auto">
                      <CircularProgressbar
                        value={Math.min(result.horsepower, 600)}
                        maxValue={600}
                        text={`${result.horsepower} HP`}
                        styles={buildStyles({
                          pathColor: getPowerColor(result.horsepower),
                          textColor: getPowerColor(result.horsepower),
                          trailColor: '#d6d6d6',
                        })}
                      />
                    </div>

                    <div className="text-center mt-4">
                      <h3 className="text-xl font-semibold">
                        Power Rating: {getPowerRating(result.horsepower)}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-200 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Power Measurements</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Horsepower:</span>
                            <span className="font-semibold">{result.horsepower} HP</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Kilowatts:</span>
                            <span>{result.kilowatts} kW</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Metric Horsepower:</span>
                            <span>{result.psHorsepower} PS</span>
                          </li>
                        </ul>
                      </motion.div>

                      {result.ftLbTorque && result.nmTorque && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="p-4 bg-base-200 rounded-lg"
                        >
                          <h3 className="font-semibold mb-2">Torque Values</h3>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span>Foot-Pounds:</span>
                              <span>{result.ftLbTorque} ft-lb</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Newton-Meters:</span>
                              <span>{result.nmTorque} Nm</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter values to calculate engine power
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Power & Torque Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Understanding Power Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Power Categories</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Economy: Less than 150 HP</li>
                          <li>Standard: 150-199 HP</li>
                          <li>Performance: 200-299 HP</li>
                          <li>Sports Car: 300-499 HP</li>
                          <li>High Performance: 500+ HP</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Common Applications</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Compact Cars: 100-180 HP</li>
                          <li>Family Sedans: 170-250 HP</li>
                          <li>Sports Cars: 300-500 HP</li>
                          <li>Supercars: 500+ HP</li>
                          <li>Heavy Trucks: 400-600 HP</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Power Unit Conversions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Power Units</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>1 HP = 0.7457 kW</li>
                          <li>1 HP = 1.014 PS</li>
                          <li>1 kW = 1.341 HP</li>
                          <li>1 PS = 0.9863 HP</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Torque Units</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>1 ft-lb = 1.356 Nm</li>
                          <li>1 Nm = 0.7376 ft-lb</li>
                          <li>HP = (Torque × RPM) ÷ 5252</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Horsepower and torque are related but measure different aspects of engine performance</li>
                      <li>Peak horsepower typically occurs at higher RPMs than peak torque</li>
                      <li>Different regions use different power measurements (HP, PS, kW)</li>
                      <li>Engine power can vary based on atmospheric conditions and altitude</li>
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
