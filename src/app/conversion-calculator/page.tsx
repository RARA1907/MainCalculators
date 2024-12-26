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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ConversionCategory {
  name: string;
  units: {
    [key: string]: {
      name: string;
      toBase: (value: number) => number;
      fromBase: (value: number) => number;
      symbol: string;
    };
  };
  baseUnit: string;
}

const conversionCategories: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    baseUnit: 'meters',
    units: {
      meters: {
        name: 'Meters',
        toBase: (v) => v,
        fromBase: (v) => v,
        symbol: 'm'
      },
      kilometers: {
        name: 'Kilometers',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
        symbol: 'km'
      },
      feet: {
        name: 'Feet',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
        symbol: 'ft'
      },
      inches: {
        name: 'Inches',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
        symbol: 'in'
      },
      yards: {
        name: 'Yards',
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
        symbol: 'yd'
      },
      miles: {
        name: 'Miles',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
        symbol: 'mi'
      }
    }
  },
  weight: {
    name: 'Weight',
    baseUnit: 'kilograms',
    units: {
      kilograms: {
        name: 'Kilograms',
        toBase: (v) => v,
        fromBase: (v) => v,
        symbol: 'kg'
      },
      grams: {
        name: 'Grams',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
        symbol: 'g'
      },
      pounds: {
        name: 'Pounds',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
        symbol: 'lb'
      },
      ounces: {
        name: 'Ounces',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
        symbol: 'oz'
      }
    }
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: {
      celsius: {
        name: 'Celsius',
        toBase: (v) => v,
        fromBase: (v) => v,
        symbol: '°C'
      },
      fahrenheit: {
        name: 'Fahrenheit',
        toBase: (v) => (v - 32) * 5/9,
        fromBase: (v) => (v * 9/5) + 32,
        symbol: '°F'
      },
      kelvin: {
        name: 'Kelvin',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
        symbol: 'K'
      }
    }
  },
  volume: {
    name: 'Volume',
    baseUnit: 'liters',
    units: {
      liters: {
        name: 'Liters',
        toBase: (v) => v,
        fromBase: (v) => v,
        symbol: 'L'
      },
      milliliters: {
        name: 'Milliliters',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
        symbol: 'mL'
      },
      gallons: {
        name: 'Gallons',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
        symbol: 'gal'
      },
      cups: {
        name: 'Cups',
        toBase: (v) => v * 0.236588,
        fromBase: (v) => v / 0.236588,
        symbol: 'cup'
      }
    }
  }
};

export default function ConversionCalculator() {
  const breadcrumbItems = [
    {
      label: 'Conversion Calculator',
      href: '/conversion-calculator'
    }
  ];

  // State
  const [category, setCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('feet');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Calculate conversion
  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    const categoryData = conversionCategories[category];
    const fromUnitData = categoryData.units[fromUnit];
    const toUnitData = categoryData.units[toUnit];

    // Convert to base unit first, then to target unit
    const baseValue = fromUnitData.toBase(value);
    const convertedValue = toUnitData.fromBase(baseValue);

    setResult(Number(convertedValue.toFixed(6)));
    setShowResult(true);
  };

  // Get visual representation of the conversion
  const getVisualRepresentation = () => {
    if (!showResult || result === null) return null;

    const value = parseFloat(inputValue);
    if (category === 'temperature') {
      const tempScale = ['❄️', '🌡️', '🔥'];
      const getTemp = () => {
        if (result < 0) return tempScale[0];
        if (result > 30) return tempScale[2];
        return tempScale[1];
      };
      return (
        <div className="text-center text-4xl my-4">
          {getTemp()}
        </div>
      );
    }

    if (category === 'length') {
      return (
        <div className="relative h-8 bg-primary/20 rounded-full my-4">
          <motion.div
            className="absolute left-0 h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      );
    }

    if (category === 'weight') {
      return (
        <div className="text-center text-4xl my-4">
          {value < 1 ? '🪶' : value < 10 ? '📦' : '🏋️‍♂️'}
        </div>
      );
    }

    if (category === 'volume') {
      return (
        <div className="text-center text-4xl my-4">
          {value < 1 ? '💧' : value < 10 ? '🥤' : '🪣'}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Conversion Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Convert Units</h2>
            </CardHeader>
            <CardContent>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  calculateConversion();
                }}
                className="space-y-4"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setFromUnit(conversionCategories[value].baseUnit);
                      setToUnit(Object.keys(conversionCategories[value].units)[1]);
                      setShowResult(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conversionCategories).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">From</span>
                  </label>
                  <Select
                    value={fromUnit}
                    onValueChange={(value) => {
                      setFromUnit(value);
                      setShowResult(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conversionCategories[category].units).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">To</span>
                  </label>
                  <Select
                    value={toUnit}
                    onValueChange={(value) => {
                      setToUnit(value);
                      setShowResult(false);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conversionCategories[category].units).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Value</span>
                  </label>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setShowResult(false);
                    }}
                    placeholder="Enter value"
                    className="input input-bordered w-full"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Calculate
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {showResult && result !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-muted p-6 rounded-lg text-center">
                      <p className="text-lg mb-2">
                        {inputValue} {conversionCategories[category].units[fromUnit].symbol} =
                      </p>
                      <p className="text-4xl font-bold">
                        {result} {conversionCategories[category].units[toUnit].symbol}
                      </p>
                    </div>

                    {getVisualRepresentation()}

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Quick Reference</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Common Values</p>
                          <ul className="text-sm space-y-1">
                            <li>1 {fromUnit} = {
                              conversionCategories[category].units[toUnit].fromBase(
                                conversionCategories[category].units[fromUnit].toBase(1)
                              ).toFixed(4)
                            } {toUnit}</li>
                            <li>10 {fromUnit} = {
                              conversionCategories[category].units[toUnit].fromBase(
                                conversionCategories[category].units[fromUnit].toBase(10)
                              ).toFixed(4)
                            } {toUnit}</li>
                            <li>100 {fromUnit} = {
                              conversionCategories[category].units[toUnit].fromBase(
                                conversionCategories[category].units[fromUnit].toBase(100)
                              ).toFixed(4)
                            } {toUnit}</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Reverse Values</p>
                          <ul className="text-sm space-y-1">
                            <li>1 {toUnit} = {
                              conversionCategories[category].units[fromUnit].fromBase(
                                conversionCategories[category].units[toUnit].toBase(1)
                              ).toFixed(4)
                            } {fromUnit}</li>
                            <li>10 {toUnit} = {
                              conversionCategories[category].units[fromUnit].fromBase(
                                conversionCategories[category].units[toUnit].toBase(10)
                              ).toFixed(4)
                            } {fromUnit}</li>
                            <li>100 {toUnit} = {
                              conversionCategories[category].units[fromUnit].fromBase(
                                conversionCategories[category].units[toUnit].toBase(100)
                              ).toFixed(4)
                            } {fromUnit}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!showResult && (
                  <div className="text-center text-muted-foreground">
                    Enter a value and click Calculate to see the conversion result
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
