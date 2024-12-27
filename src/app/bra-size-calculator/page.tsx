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
import { motion } from 'framer-motion';

interface MeasurementInput {
  underbust: string;
  bust: string;
  unit: 'inches' | 'cm';
}

interface SizeResult {
  bandSize: number;
  cupSize: string;
  fullSize: string;
  sisterSizes: string[];
}

const cupSizes = ['AA', 'A', 'B', 'C', 'D', 'DD/E', 'DDD/F', 'G', 'H', 'I', 'J', 'K'];

const calculateBraSize = (measurements: MeasurementInput): SizeResult | null => {
  const underbust = parseFloat(measurements.underbust);
  const bust = parseFloat(measurements.bust);

  if (isNaN(underbust) || isNaN(bust)) {
    return null;
  }

  // Convert cm to inches if needed
  const factor = measurements.unit === 'cm' ? 0.393701 : 1;
  const underbustInches = underbust * factor;
  const bustInches = bust * factor;

  // Calculate band size (round to nearest even number)
  let bandSize = Math.round(underbustInches / 2) * 2;
  
  // Calculate cup size (difference between bust and band size)
  const difference = Math.round(bustInches - bandSize);
  const cupIndex = Math.max(0, difference - 1);
  const cupSize = cupSizes[cupIndex] || 'K+';

  // Calculate sister sizes
  const sisterSizes = [
    `${bandSize - 2}${cupSizes[cupIndex + 1] || 'K+'}`,
    `${bandSize}${cupSize}`,
    `${bandSize + 2}${cupSizes[cupIndex - 1] || 'AA'}`
  ].filter(size => !size.includes('undefined'));

  return {
    bandSize,
    cupSize,
    fullSize: `${bandSize}${cupSize}`,
    sisterSizes
  };
};

export default function BraSizeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Bra Size Calculator',
      href: '/bra-size-calculator'
    }
  ];

  const [measurements, setMeasurements] = useState<MeasurementInput>({
    underbust: '',
    bust: '',
    unit: 'inches'
  });

  const [result, setResult] = useState<SizeResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (field: keyof MeasurementInput, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleUnitChange = (unit: 'inches' | 'cm') => {
    setMeasurements(prev => ({
      ...prev,
      unit,
      underbust: '',
      bust: ''
    }));
    setResult(null);
    setError('');
  };

  const calculateSize = () => {
    setError('');

    if (!measurements.underbust || !measurements.bust) {
      setError('Please enter both measurements');
      return;
    }

    const underbust = parseFloat(measurements.underbust);
    const bust = parseFloat(measurements.bust);

    if (isNaN(underbust) || isNaN(bust)) {
      setError('Please enter valid numbers');
      return;
    }

    if (underbust >= bust) {
      setError('Bust measurement should be larger than underbust measurement');
      return;
    }

    const minValue = measurements.unit === 'inches' ? 20 : 50;
    const maxValue = measurements.unit === 'inches' ? 60 : 150;

    if (underbust < minValue || underbust > maxValue || bust < minValue || bust > maxValue) {
      setError(`Measurements should be between ${minValue} and ${maxValue} ${measurements.unit}`);
      return;
    }

    const calculatedResult = calculateBraSize(measurements);
    setResult(calculatedResult);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Bra Size Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Measurements</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Unit Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn ${measurements.unit === 'inches' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleUnitChange('inches')}
                  >
                    Inches
                  </button>
                  <button
                    className={`btn ${measurements.unit === 'cm' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handleUnitChange('cm')}
                  >
                    Centimeters
                  </button>
                </div>

                {/* Measurement Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Underbust Measurement
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="inline-block ml-2 h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Measure directly under your bust, around your ribcage</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={measurements.underbust}
                      onChange={(e) => handleInputChange('underbust', e.target.value)}
                      placeholder={`Enter underbust (${measurements.unit})`}
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bust Measurement
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="inline-block ml-2 h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Measure around the fullest part of your bust</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={measurements.bust}
                      onChange={(e) => handleInputChange('bust', e.target.value)}
                      placeholder={`Enter bust (${measurements.unit})`}
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
                  onClick={calculateSize}
                >
                  Calculate Size
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Bra Size Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-primary mb-2"
                      >
                        {result.fullSize}
                      </motion.div>
                      <p className="text-gray-500">Your Recommended Bra Size</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Size Breakdown:</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Band Size: {result.bandSize}</li>
                        <li>Cup Size: {result.cupSize}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Sister Sizes:</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Sister sizes have the same cup volume but different band sizes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.sisterSizes.map((size, index) => (
                          <div
                            key={index}
                            className={`px-3 py-1 rounded-full ${
                              size === result.fullSize
                                ? 'bg-primary text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter your measurements to see your recommended bra size
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">How to Measure</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Measuring Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wear an unpadded bra or no bra for most accurate measurements</li>
                      <li>Keep the measuring tape parallel to the ground</li>
                      <li>Breathe normally and stand straight while measuring</li>
                      <li>Use a soft measuring tape for best results</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Signs of a Good Fit</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>The band should be snug but not tight</li>
                      <li>Cups should fully contain breast tissue without gaps or overflow</li>
                      <li>The center gore should lay flat against your sternum</li>
                      <li>Straps should stay in place without digging in</li>
                    </ul>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Common Fitting Issues</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Band Too Loose</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Rides up in back</li>
                          <li>Lacks support</li>
                          <li>Try smaller band size</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Cup Too Small</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Overflow at top/sides</li>
                          <li>Center doesn't lay flat</li>
                          <li>Try larger cup size</li>
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
