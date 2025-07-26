'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Thermometer, Droplets } from 'lucide-react';
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

interface HeatIndexResult {
  heatIndex: number;
  riskLevel: string;
  color: string;
  recommendations: string[];
  warning?: string;
}

const riskLevels = {
  safe: {
    label: 'Safe',
    color: '#22C55E',
    recommendations: [
      'Normal outdoor activities can be conducted',
      'Stay hydrated',
      'Use sunscreen if needed'
    ]
  },
  caution: {
    label: 'Caution',
    color: '#EAB308',
    recommendations: [
      'Take breaks in shade',
      'Drink plenty of water',
      'Limit strenuous activities',
      'Watch for heat exhaustion signs'
    ]
  },
  warning: {
    label: 'Warning',
    color: '#FB923C',
    recommendations: [
      'Reduce outdoor activities',
      'Drink water frequently',
      'Take frequent breaks',
      'Watch for heat-related illness'
    ]
  },
  danger: {
    label: 'Danger',
    color: '#EF4444',
    recommendations: [
      'Avoid outdoor activities',
      'Stay in air-conditioned areas',
      'Check on vulnerable people',
      'Contact emergency services if needed'
    ]
  }
};

export default function HeatIndexCalculator() {
  const breadcrumbItems = [
    {
      label: 'Heat Index Calculator',
      href: '/heat-index-calculator'
    }
  ];

  const [temperature, setTemperature] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [result, setResult] = useState<HeatIndexResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateHeatIndex = (temp: number, rh: number, isMetric: boolean) => {
    // Convert to Fahrenheit if metric
    if (isMetric) {
      temp = (temp * 9/5) + 32;
    }

    // Simple formula for heat index
    let heatIndex = 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (rh * 0.094));

    // If temperature is high enough, use more complex formula
    if (temp >= 80) {
      heatIndex = -42.379 + (2.04901523 * temp) + (10.14333127 * rh) +
                  (-0.22475541 * temp * rh) + (-0.00683783 * temp * temp) +
                  (-0.05481717 * rh * rh) + (0.00122874 * temp * temp * rh) +
                  (0.00085282 * temp * rh * rh) + (-0.00000199 * temp * temp * rh * rh);
    }

    // Convert back to Celsius if needed
    if (isMetric) {
      heatIndex = (heatIndex - 32) * 5/9;
    }

    return heatIndex;
  };

  const getRiskLevel = (heatIndex: number, isMetric: boolean): keyof typeof riskLevels => {
    const temp = isMetric ? (heatIndex * 9/5) + 32 : heatIndex;
    
    if (temp < 80) return 'safe';
    if (temp < 91) return 'caution';
    if (temp < 103) return 'warning';
    return 'danger';
  };

  const handleCalculate = () => {
    setError('');

    const temp = parseFloat(temperature);
    const rh = parseFloat(humidity);

    if (isNaN(temp) || isNaN(rh)) {
      setError('Please enter valid numbers for temperature and humidity');
      return;
    }

    if (rh < 0 || rh > 100) {
      setError('Relative humidity must be between 0 and 100%');
      return;
    }

    const heatIndex = calculateHeatIndex(temp, rh, unit === 'metric');
    const riskLevel = getRiskLevel(heatIndex, unit === 'metric');

    let warning;
    if (riskLevel === 'danger') {
      warning = 'Extreme danger! Heat stroke highly likely.';
    } else if (riskLevel === 'warning') {
      warning = 'Heat exhaustion and heat cramps possible.';
    }

    setResult({
      heatIndex: Number(heatIndex.toFixed(1)),
      riskLevel: riskLevels[riskLevel].label,
      color: riskLevels[riskLevel].color,
      recommendations: riskLevels[riskLevel].recommendations,
      warning
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Heat Index Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Heat Index</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (°F)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (°C)
                  </button>
                </div>

                {/* Temperature Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperature
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the air temperature in {unit === 'imperial' ? '°F' : '°C'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder={`Temperature in ${unit === 'imperial' ? '°F' : '°C'}`}
                      step="0.1"
                    />
                  </div>
                </div>

                {/* Humidity Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Relative Humidity (%)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the relative humidity (0-100%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={humidity}
                      onChange={(e) => setHumidity(e.target.value)}
                      placeholder="Relative humidity (%)"
                      min="0"
                      max="100"
                      step="1"
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
                  disabled={!temperature || !humidity}
                >
                  Calculate Heat Index
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Heat Index Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-48">
                        <CircularProgressbar
                          value={100}
                          text={`${result.heatIndex}${unit === 'imperial' ? '°F' : '°C'}`}
                          styles={buildStyles({
                            textColor: result.color,
                            pathColor: result.color,
                            trailColor: '#d6d6d6'
                          })}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className="text-xl font-semibold mb-1"
                        style={{ color: result.color }}
                      >
                        {result.riskLevel}
                      </div>
                      {result.warning && (
                        <div className="text-sm text-red-500 mt-2">
                          {result.warning}
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Recommendations:</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {rec}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter temperature and humidity to calculate heat index
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Heat Index</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Risk Levels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(riskLevels).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${value.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: value.color }}>
                            {value.label}
                          </h4>
                          <ul className="text-sm list-disc pl-4">
                            {value.recommendations.slice(0, 2).map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Heat-Related Illness Signs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Heat Exhaustion</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Heavy sweating</li>
                          <li>Cool, pale skin</li>
                          <li>Dizziness, headache</li>
                          <li>Muscle cramps</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Heat Stroke</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>High body temperature</li>
                          <li>Hot, red skin</li>
                          <li>Rapid pulse</li>
                          <li>Confusion or unconsciousness</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Prevention Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Stay hydrated with water and electrolytes</li>
                      <li>Avoid alcohol and caffeine</li>
                      <li>Wear light, loose-fitting clothing</li>
                      <li>Schedule outdoor activities during cooler hours</li>
                      <li>Take frequent breaks in air-conditioned areas</li>
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
