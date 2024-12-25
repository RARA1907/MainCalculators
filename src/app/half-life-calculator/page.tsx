'use client';

import { useState } from 'react';
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

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'remaining',
    name: 'Remaining Amount',
    description: 'Calculate remaining amount after decay',
  },
  {
    id: 'time',
    name: 'Time Period',
    description: 'Calculate time needed for specific decay',
  },
  {
    id: 'halfLife',
    name: 'Half-Life',
    description: 'Calculate half-life from measurements',
  },
];

const breadcrumbItems = [
  {
    label: 'Half-Life Calculator',
    href: '/half-life-calculator',
  },
];

const timeUnits = [
  { id: 'seconds', name: 'Seconds', multiplier: 1 },
  { id: 'minutes', name: 'Minutes', multiplier: 60 },
  { id: 'hours', name: 'Hours', multiplier: 3600 },
  { id: 'days', name: 'Days', multiplier: 86400 },
  { id: 'years', name: 'Years', multiplier: 31536000 },
];

export default function HalfLifeCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'remaining' | 'time' | 'halfLife'>('remaining');
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [finalAmount, setFinalAmount] = useState<string>('');
  const [halfLife, setHalfLife] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [timeUnit, setTimeUnit] = useState<string>('hours');
  const [halfLifeUnit, setHalfLifeUnit] = useState<string>('hours');
  
  // Results
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Convert time to seconds
  const convertToSeconds = (value: number, unit: string): number => {
    const unitData = timeUnits.find(u => u.id === unit);
    return value * (unitData?.multiplier || 1);
  };

  // Convert seconds to specified unit
  const convertFromSeconds = (seconds: number, unit: string): number => {
    const unitData = timeUnits.find(u => u.id === unit);
    return seconds / (unitData?.multiplier || 1);
  };

  // Calculate remaining amount
  const calculateRemaining = () => {
    try {
      if (!initialAmount || !halfLife || !time) {
        throw new Error('Please fill in all fields');
      }

      const N0 = parseFloat(initialAmount);
      const t = convertToSeconds(parseFloat(time), timeUnit);
      const t12 = convertToSeconds(parseFloat(halfLife), halfLifeUnit);

      if (N0 <= 0 || t < 0 || t12 <= 0) {
        throw new Error('Please enter valid positive numbers');
      }

      const decayConstant = Math.log(2) / t12;
      const Nt = N0 * Math.exp(-decayConstant * t);
      const percentRemaining = (Nt / N0) * 100;
      const numberOfHalfLives = t / t12;

      const steps = [
        'Calculation Steps:',
        `1. Initial amount (N₀) = ${N0}`,
        `2. Time period (t) = ${time} ${timeUnit}`,
        `3. Half-life (t₁/₂) = ${halfLife} ${halfLifeUnit}`,
        '',
        'Using the exponential decay formula: Nt = N₀ × e^(-λt)',
        `4. Calculate decay constant (λ) = ln(2)/t₁/₂ = ${decayConstant.toFixed(6)}`,
        `5. Number of half-lives elapsed = ${numberOfHalfLives.toFixed(2)}`,
        `6. Final amount (Nt) = ${Nt.toFixed(4)}`,
        `7. Percentage remaining = ${percentRemaining.toFixed(2)}%`
      ];

      setResult(`${Nt.toFixed(4)} (${percentRemaining.toFixed(2)}% remaining)`);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Calculate time period
  const calculateTime = () => {
    try {
      if (!initialAmount || !finalAmount || !halfLife) {
        throw new Error('Please fill in all fields');
      }

      const N0 = parseFloat(initialAmount);
      const Nt = parseFloat(finalAmount);
      const t12 = convertToSeconds(parseFloat(halfLife), halfLifeUnit);

      if (N0 <= 0 || Nt <= 0 || t12 <= 0 || Nt > N0) {
        throw new Error('Please enter valid values (final amount must be less than initial amount)');
      }

      const decayConstant = Math.log(2) / t12;
      const timeInSeconds = -Math.log(Nt / N0) / decayConstant;
      const timeInSelectedUnit = convertFromSeconds(timeInSeconds, timeUnit);
      const numberOfHalfLives = timeInSeconds / t12;

      const steps = [
        'Calculation Steps:',
        `1. Initial amount (N₀) = ${N0}`,
        `2. Final amount (Nt) = ${Nt}`,
        `3. Half-life (t₁/₂) = ${halfLife} ${halfLifeUnit}`,
        '',
        'Using the formula: t = -ln(Nt/N₀)/λ',
        `4. Calculate decay constant (λ) = ln(2)/t₁/₂ = ${decayConstant.toFixed(6)}`,
        `5. Calculate time = ${timeInSeconds.toFixed(2)} seconds`,
        `6. Convert to ${timeUnit} = ${timeInSelectedUnit.toFixed(4)}`,
        `7. Number of half-lives elapsed = ${numberOfHalfLives.toFixed(2)}`
      ];

      setResult(`${timeInSelectedUnit.toFixed(4)} ${timeUnit}`);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Calculate half-life
  const calculateHalfLife = () => {
    try {
      if (!initialAmount || !finalAmount || !time) {
        throw new Error('Please fill in all fields');
      }

      const N0 = parseFloat(initialAmount);
      const Nt = parseFloat(finalAmount);
      const t = convertToSeconds(parseFloat(time), timeUnit);

      if (N0 <= 0 || Nt <= 0 || t <= 0 || Nt > N0) {
        throw new Error('Please enter valid values (final amount must be less than initial amount)');
      }

      const decayConstant = -Math.log(Nt / N0) / t;
      const halfLifeInSeconds = Math.log(2) / decayConstant;
      const halfLifeInSelectedUnit = convertFromSeconds(halfLifeInSeconds, halfLifeUnit);

      const steps = [
        'Calculation Steps:',
        `1. Initial amount (N₀) = ${N0}`,
        `2. Final amount (Nt) = ${Nt}`,
        `3. Time period (t) = ${time} ${timeUnit}`,
        '',
        'Using the formula: t₁/₂ = ln(2)/λ where λ = -ln(Nt/N₀)/t',
        `4. Calculate decay constant (λ) = ${decayConstant.toFixed(6)}`,
        `5. Calculate half-life = ${halfLifeInSeconds.toFixed(2)} seconds`,
        `6. Convert to ${halfLifeUnit} = ${halfLifeInSelectedUnit.toFixed(4)}`
      ];

      setResult(`${halfLifeInSelectedUnit.toFixed(4)} ${halfLifeUnit}`);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Half-Life Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id as 'remaining' | 'time' | 'halfLife');
                        setResult('');
                        setSteps([]);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === calcMode.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Initial Amount</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Initial quantity of the substance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      placeholder="Enter initial amount"
                      className="input input-bordered w-full"
                      min="0"
                      step="any"
                    />
                  </div>

                  {mode !== 'remaining' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Final Amount</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Final quantity of the substance</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        value={finalAmount}
                        onChange={(e) => setFinalAmount(e.target.value)}
                        placeholder="Enter final amount"
                        className="input input-bordered w-full"
                        min="0"
                        step="any"
                      />
                    </div>
                  )}

                  {mode !== 'halfLife' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Half-Life</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Time taken for half of the substance to decay</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={halfLife}
                          onChange={(e) => setHalfLife(e.target.value)}
                          placeholder="Enter half-life"
                          className="input input-bordered flex-1"
                          min="0"
                          step="any"
                        />
                        <select
                          value={halfLifeUnit}
                          onChange={(e) => setHalfLifeUnit(e.target.value)}
                          className="select select-bordered w-32"
                        >
                          {timeUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {mode !== 'time' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Time Period</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Time elapsed since initial measurement</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="number"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          placeholder="Enter time period"
                          className="input input-bordered flex-1"
                          min="0"
                          step="any"
                        />
                        <select
                          value={timeUnit}
                          onChange={(e) => setTimeUnit(e.target.value)}
                          className="select select-bordered w-32"
                        >
                          {timeUnits.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'remaining':
                        calculateRemaining();
                        break;
                      case 'time':
                        calculateTime();
                        break;
                      case 'halfLife':
                        calculateHalfLife();
                        break;
                    }
                  }}
                  className="btn w-full bg-[#0EA5E9] hover:bg-blue-600 text-white"
                >
                  Calculate
                </button>

                {error && (
                  <div className="text-error text-sm mt-2">{error}</div>
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
              {result && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-1">Result</h3>
                    <div className="text-2xl font-bold font-mono break-all overflow-hidden">
                      {result}
                    </div>
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="text-sm font-mono break-words">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Half-Life</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Time for half of substance to decay</li>
                  <li className="break-words">Constant rate of decay</li>
                  <li className="break-words">Independent of initial amount</li>
                  <li className="break-words">Used in radioactive decay</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Decay Formula</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">N(t) = N₀ × e^(-λt)</li>
                  <li className="break-words">λ = ln(2)/t₁/₂</li>
                  <li className="break-words">t₁/₂ = half-life</li>
                  <li className="break-words">N₀ = initial amount</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applications</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Carbon dating</li>
                  <li className="break-words">Nuclear medicine</li>
                  <li className="break-words">Radioactive waste</li>
                  <li className="break-words">Drug metabolism</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
