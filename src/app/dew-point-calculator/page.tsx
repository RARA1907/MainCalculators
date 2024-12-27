'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Thermometer, Droplets, CloudRain } from 'lucide-react';
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

interface DewPointResult {
  dewPoint: number;
  comfort: string;
  color: string;
  description: string;
  recommendations: string[];
}

const comfortLevels = {
  dry: {
    label: 'Very Dry',
    color: '#EF4444',
    description: 'The air feels very dry and may cause discomfort',
    recommendations: [
      'Use a humidifier',
      'Stay hydrated',
      'Moisturize skin',
      'Watch for static electricity'
    ]
  },
  comfortable: {
    label: 'Comfortable',
    color: '#22C55E',
    description: 'Ideal comfort level with good air quality',
    recommendations: [
      'Maintain current conditions',
      'Enjoy outdoor activities',
      'Perfect for most activities',
      'No special measures needed'
    ]
  },
  humid: {
    label: 'Humid',
    color: '#EAB308',
    description: 'The air feels somewhat humid but still manageable',
    recommendations: [
      'Use dehumidifier if indoors',
      'Ensure good ventilation',
      'Consider air conditioning',
      'Stay hydrated'
    ]
  },
  veryHumid: {
    label: 'Very Humid',
    color: '#EF4444',
    description: 'High humidity may cause significant discomfort',
    recommendations: [
      'Use air conditioning',
      'Avoid strenuous activities',
      'Stay in ventilated areas',
      'Watch for mold growth'
    ]
  }
};

export default function DewPointCalculator() {
  const breadcrumbItems = [
    {
      label: 'Dew Point Calculator',
      href: '/dew-point-calculator'
    }
  ];

  const [temperature, setTemperature] = useState<string>('');
  const [humidity, setHumidity] = useState<string>('');
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [result, setResult] = useState<DewPointResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateDewPoint = (temp: number, rh: number, isMetric: boolean) => {
    // Convert to Celsius if imperial
    if (!isMetric) {
      temp = (temp - 32) * 5/9;
    }

    // Magnus formula for dew point
    const a = 17.27;
    const b = 237.7;
    
    const alpha = ((a * temp) / (b + temp)) + Math.log(rh/100);
    const dewPoint = (b * alpha) / (a - alpha);

    // Convert back to Fahrenheit if needed
    if (!isMetric) {
      return (dewPoint * 9/5) + 32;
    }
    
    return dewPoint;
  };

  const getComfortLevel = (dewPoint: number, isMetric: boolean): keyof typeof comfortLevels => {
    // Convert to Fahrenheit for comfort assessment if metric
    const dp = isMetric ? (dewPoint * 9/5) + 32 : dewPoint;
    
    if (dp < 50) return 'dry';
    if (dp < 65) return 'comfortable';
    if (dp < 70) return 'humid';
    return 'veryHumid';
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

    const dewPoint = calculateDewPoint(temp, rh, unit === 'metric');
    const comfortLevel = getComfortLevel(dewPoint, unit === 'metric');

    setResult({
      dewPoint: Number(dewPoint.toFixed(1)),
      comfort: comfortLevels[comfortLevel].label,
      color: comfortLevels[comfortLevel].color,
      description: comfortLevels[comfortLevel].description,
      recommendations: comfortLevels[comfortLevel].recommendations
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Dew Point Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Dew Point</h2>
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
                  Calculate Dew Point
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Dew Point Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-48">
                        <CircularProgressbar
                          value={100}
                          text={`${result.dewPoint}${unit === 'imperial' ? '°F' : '°C'}`}
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
                        {result.comfort}
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.description}
                      </div>
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
                    Enter temperature and humidity to calculate dew point
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Dew Point</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Comfort Levels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(comfortLevels).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${value.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: value.color }}>
                            {value.label}
                          </h4>
                          <p className="text-sm">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">What is Dew Point?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Definition</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Temperature at which water vapor condenses</li>
                          <li>Measure of atmospheric moisture</li>
                          <li>Indicator of human comfort</li>
                          <li>Related to relative humidity</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Applications</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Weather forecasting</li>
                          <li>Indoor climate control</li>
                          <li>Agriculture</li>
                          <li>Industrial processes</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Practical Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Monitor indoor humidity levels (30-50% is ideal)</li>
                      <li>Use dehumidifiers in humid conditions</li>
                      <li>Ensure proper ventilation</li>
                      <li>Watch for condensation on windows and surfaces</li>
                      <li>Consider dew point when planning outdoor activities</li>
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
