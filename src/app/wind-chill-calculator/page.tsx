'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Thermometer, Wind } from 'lucide-react';
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

interface WindChillResult {
  windChill: number;
  riskLevel: string;
  color: string;
  recommendations: string[];
  frostbiteTime?: string;
}

const riskLevels = {
  safe: {
    label: 'Safe',
    color: '#22C55E',
    recommendations: [
      'Normal outdoor activities can be conducted',
      'No special precautions needed',
      'Comfortable for most people'
    ]
  },
  caution: {
    label: 'Caution',
    color: '#EAB308',
    recommendations: [
      'Wear warm clothing',
      'Cover exposed skin',
      'Limit prolonged outdoor exposure'
    ]
  },
  warning: {
    label: 'Warning',
    color: '#FB923C',
    recommendations: [
      'Minimize outdoor activities',
      'Wear multiple layers',
      'Keep all skin covered',
      'Watch for signs of cold stress'
    ]
  },
  danger: {
    label: 'Danger',
    color: '#EF4444',
    recommendations: [
      'Avoid outdoor activities',
      'Risk of frostbite within minutes',
      'Seek warm shelter',
      'Contact emergency services if needed'
    ]
  }
};

export default function WindChillCalculator() {
  const breadcrumbItems = [
    {
      label: 'Wind Chill Calculator',
      href: '/wind-chill-calculator'
    }
  ];

  const [temperature, setTemperature] = useState<string>('');
  const [windSpeed, setWindSpeed] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [result, setResult] = useState<WindChillResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateWindChill = (temp: number, speed: number, isMetric: boolean) => {
    // Convert to imperial if metric
    if (isMetric) {
      temp = (temp * 9/5) + 32;
      speed = speed / 1.609344;
    }

    // Wind chill formula (only valid for temps at or below 50°F and wind speeds above 3 mph)
    if (temp > 50 || speed < 3) {
      return temp;
    }

    const windChill = 35.74 + (0.6215 * temp) - (35.75 * Math.pow(speed, 0.16)) + 
                     (0.4275 * temp * Math.pow(speed, 0.16));

    // Convert back to metric if needed
    if (isMetric) {
      return (windChill - 32) * 5/9;
    }

    return windChill;
  };

  const getFrostbiteTime = (windChill: number): string | undefined => {
    if (windChill > -18) return undefined;
    if (windChill > -33) return '30 minutes';
    if (windChill > -48) return '10 minutes';
    if (windChill > -60) return '5 minutes';
    return 'under 2 minutes';
  };

  const getRiskLevel = (windChill: number, isMetric: boolean): keyof typeof riskLevels => {
    const temp = isMetric ? (windChill * 9/5) + 32 : windChill;
    
    if (temp > 32) return 'safe';
    if (temp > 13) return 'caution';
    if (temp > -18) return 'warning';
    return 'danger';
  };

  const handleCalculate = () => {
    setError('');

    const temp = parseFloat(temperature);
    const speed = parseFloat(windSpeed);

    if (isNaN(temp) || isNaN(speed)) {
      setError('Please enter valid numbers for temperature and wind speed');
      return;
    }

    if (speed < 0) {
      setError('Wind speed cannot be negative');
      return;
    }

    const windChill = calculateWindChill(temp, speed, unit === 'metric');
    const riskLevel = getRiskLevel(windChill, unit === 'metric');
    const frostbiteTime = getFrostbiteTime(unit === 'metric' ? windChill : (windChill - 32) * 5/9);

    setResult({
      windChill: Number(windChill.toFixed(1)),
      riskLevel: riskLevels[riskLevel].label,
      color: riskLevels[riskLevel].color,
      recommendations: riskLevels[riskLevel].recommendations,
      frostbiteTime
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Wind Chill Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Wind Chill</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('imperial')}
                  >
                    Imperial (°F, mph)
                  </button>
                  <button
                    className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setUnit('metric')}
                  >
                    Metric (°C, km/h)
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

                {/* Wind Speed Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Wind Speed
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the wind speed in {unit === 'imperial' ? 'mph' : 'km/h'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <Wind className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={windSpeed}
                      onChange={(e) => setWindSpeed(e.target.value)}
                      placeholder={`Wind speed in ${unit === 'imperial' ? 'mph' : 'km/h'}`}
                      min="0"
                      step="0.1"
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
                  disabled={!temperature || !windSpeed}
                >
                  Calculate Wind Chill
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Wind Chill Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-48">
                        <CircularProgressbar
                          value={100}
                          text={`${result.windChill}${unit === 'imperial' ? '°F' : '°C'}`}
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
                      {result.frostbiteTime && (
                        <div className="text-sm text-red-500">
                          Frostbite possible within {result.frostbiteTime}
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
                    Enter temperature and wind speed to calculate wind chill
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Wind Chill</h2>
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
                    <h3 className="text-lg font-semibold mb-3">Cold Weather Safety Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Clothing</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Wear layers of loose-fitting clothing</li>
                          <li>Cover all exposed skin</li>
                          <li>Use a hat and gloves</li>
                          <li>Keep clothes dry</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Warning Signs</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Shivering</li>
                          <li>Numbness or tingling</li>
                          <li>Blue or pale skin</li>
                          <li>Confusion or drowsiness</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">About Wind Chill</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wind chill measures how cold it feels on exposed skin</li>
                      <li>Higher wind speeds make it feel colder than the actual temperature</li>
                      <li>Wind chill can increase risk of frostbite and hypothermia</li>
                      <li>The formula is valid for temperatures at or below 50°F (10°C)</li>
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
