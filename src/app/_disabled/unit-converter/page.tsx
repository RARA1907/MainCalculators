'use client';

import { useState, useEffect } from 'react';
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

interface ConversionCategory {
  name: string;
  units: string[];
  conversions: { [key: string]: number };
}

const conversionCategories: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    conversions: {
      'Meters': 1,
      'Kilometers': 1000,
      'Centimeters': 0.01,
      'Millimeters': 0.001,
      'Miles': 1609.34,
      'Yards': 0.9144,
      'Feet': 0.3048,
      'Inches': 0.0254
    }
  },
  weight: {
    name: 'Weight',
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Stone'],
    conversions: {
      'Kilograms': 1,
      'Grams': 0.001,
      'Milligrams': 0.000001,
      'Pounds': 0.453592,
      'Ounces': 0.0283495,
      'Stone': 6.35029
    }
  },
  temperature: {
    name: 'Temperature',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    conversions: {} // Special handling for temperature
  },
  volume: {
    name: 'Volume',
    units: ['Liters', 'Milliliters', 'Cubic Meters', 'Gallons', 'Quarts', 'Pints', 'Cups'],
    conversions: {
      'Liters': 1,
      'Milliliters': 0.001,
      'Cubic Meters': 1000,
      'Gallons': 3.78541,
      'Quarts': 0.946353,
      'Pints': 0.473176,
      'Cups': 0.236588
    }
  },
  area: {
    name: 'Area',
    units: ['Square Meters', 'Square Kilometers', 'Square Miles', 'Square Feet', 'Square Inches', 'Acres', 'Hectares'],
    conversions: {
      'Square Meters': 1,
      'Square Kilometers': 1000000,
      'Square Miles': 2589988.11,
      'Square Feet': 0.092903,
      'Square Inches': 0.00064516,
      'Acres': 4046.86,
      'Hectares': 10000
    }
  },
  speed: {
    name: 'Speed',
    units: ['Meters per Second', 'Kilometers per Hour', 'Miles per Hour', 'Knots'],
    conversions: {
      'Meters per Second': 1,
      'Kilometers per Hour': 0.277778,
      'Miles per Hour': 0.44704,
      'Knots': 0.514444
    }
  },
  time: {
    name: 'Time',
    units: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'],
    conversions: {
      'Seconds': 1,
      'Minutes': 60,
      'Hours': 3600,
      'Days': 86400,
      'Weeks': 604800,
      'Months': 2592000,
      'Years': 31536000
    }
  },
  digital: {
    name: 'Digital Storage',
    units: ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes'],
    conversions: {
      'Bytes': 1,
      'Kilobytes': 1024,
      'Megabytes': 1048576,
      'Gigabytes': 1073741824,
      'Terabytes': 1099511627776
    }
  }
};

export default function UnitConverter() {
  const breadcrumbItems = [
    {
      label: 'Unit Converter',
      href: '/unit-converter'
    }
  ];

  // State
  const [category, setCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('Meters');
  const [toUnit, setToUnit] = useState<string>('Feet');
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [conversionHistory, setConversionHistory] = useState<string[]>([]);

  // Convert temperature
  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === 'Fahrenheit') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'Kelvin') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target unit
    if (to === 'Fahrenheit') {
      return (celsius * 9/5) + 32;
    } else if (to === 'Kelvin') {
      return celsius + 273.15;
    }
    return celsius;
  };

  // Convert units
  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue('Invalid input');
      return;
    }

    let result: number;
    if (category === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
    } else {
      const fromFactor = conversionCategories[category].conversions[fromUnit];
      const toFactor = conversionCategories[category].conversions[toUnit];
      result = (value * fromFactor) / toFactor;
    }

    const formattedResult = result.toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    });
    setToValue(formattedResult);

    // Add to history
    const historyItem = `${value} ${fromUnit} = ${formattedResult} ${toUnit}`;
    setConversionHistory(prev => [historyItem, ...prev.slice(0, 9)]);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFromUnit(conversionCategories[newCategory].units[0]);
    setToUnit(conversionCategories[newCategory].units[1]);
    setFromValue('1');
    setToValue('');
  };

  // Swap units
  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    convert();
  };

  useEffect(() => {
    convert();
  }, [category, fromUnit, toUnit, fromValue]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Unit Converter</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Converter Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Convert Units</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    {Object.entries(conversionCategories).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">From Unit</span>
                    </label>
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      {conversionCategories[category].units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={fromValue}
                      onChange={(e) => setFromValue(e.target.value)}
                      className="input input-bordered w-full mt-2"
                      placeholder="Enter value"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">To Unit</span>
                    </label>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      {conversionCategories[category].units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={toValue}
                      readOnly
                      className="input input-bordered w-full mt-2 bg-base-200"
                      placeholder="Result"
                    />
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={swapUnits}
                >
                  Swap Units
                </button>
              </div>
            </CardContent>
          </Card>

          {/* History and Common Conversions */}
          <div className="space-y-8">
            {/* Conversion History */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recent Conversions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversionHistory.length > 0 ? (
                    conversionHistory.map((item, index) => (
                      <div key={index} className="bg-base-200 p-3 rounded-lg">
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent conversions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Common Conversions */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Common Conversions</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Length</h3>
                    <ul className="space-y-1 text-sm">
                      <li>1 Mile = 1.609 Kilometers</li>
                      <li>1 Foot = 30.48 Centimeters</li>
                      <li>1 Inch = 2.54 Centimeters</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Weight</h3>
                    <ul className="space-y-1 text-sm">
                      <li>1 Pound = 0.454 Kilograms</li>
                      <li>1 Ounce = 28.35 Grams</li>
                      <li>1 Stone = 6.35 Kilograms</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Volume</h3>
                    <ul className="space-y-1 text-sm">
                      <li>1 Gallon = 3.785 Liters</li>
                      <li>1 Cup = 236.6 Milliliters</li>
                      <li>1 Pint = 473.2 Milliliters</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Temperature</h3>
                    <ul className="space-y-1 text-sm">
                      <li>0°C = 32°F</li>
                      <li>100°C = 212°F</li>
                      <li>0°C = 273.15K</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Conversion Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Always check the units before converting</li>
                        <li>Use the swap button to reverse conversions quickly</li>
                        <li>Scientific notation is supported for very large or small numbers</li>
                        <li>Results are rounded to 6 decimal places</li>
                        <li>History saves your last 10 conversions</li>
                      </ul>
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
