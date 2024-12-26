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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Height percentile data (sample data - should be expanded with real medical data)
const heightPercentiles = [
  {
    age: 2,
    male: { p3: 82.5, p15: 85.1, p50: 88.9, p85: 92.7, p97: 95.3 },
    female: { p3: 81.0, p15: 83.6, p50: 87.4, p85: 91.2, p97: 93.8 }
  },
  // ... (previous percentile data)
];

export default function HeightCalculator() {
  const breadcrumbItems = [{ label: 'Height Calculator', href: '/height-calculator' }];

  // State for Height Calculator
  const [age, setAge] = useState<number>(20);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);
  const [showResults, setShowResults] = useState(false);

  // State for Height Converter
  const [fromUnit, setFromUnit] = useState<'cm' | 'ft-in' | 'm'>('ft-in');
  const [toUnit, setToUnit] = useState<'cm' | 'ft-in' | 'm'>('cm');
  const [convertValue, setConvertValue] = useState<string>('');
  const [convertResult, setConvertResult] = useState<string>('');

  // State for Parent Height Calculator
  const [fatherHeight, setFatherHeight] = useState<number>(70); // in inches
  const [motherHeight, setMotherHeight] = useState<number>(64); // in inches
  const [childGender, setChildGender] = useState<'male' | 'female'>('male');
  const [predictedHeight, setPredictedHeight] = useState<number | null>(null);

  // Results state
  const [centimeters, setCentimeters] = useState<number>(0);
  const [meters, setMeters] = useState<number>(0);
  const [percentile, setPercentile] = useState<number>(0);
  const [heightCategory, setHeightCategory] = useState<string>('');

  // Calculate height statistics
  const calculateHeight = () => {
    // Convert height to centimeters
    const heightInCm = ((feet * 12) + inches) * 2.54;
    
    setCentimeters(Number(heightInCm.toFixed(1)));
    setMeters(Number((heightInCm / 100).toFixed(2)));

    // Find closest age in percentile data
    const closestAge = heightPercentiles.reduce((prev, curr) => {
      return (Math.abs(curr.age - age) < Math.abs(prev.age - age) ? curr : prev);
    });

    // Calculate percentile
    const heightData = gender === 'male' ? closestAge.male : closestAge.female;
    let calculatedPercentile = 50;

    if (heightInCm <= heightData.p3) calculatedPercentile = 3;
    else if (heightInCm <= heightData.p15) calculatedPercentile = 15;
    else if (heightInCm <= heightData.p50) calculatedPercentile = 50;
    else if (heightInCm <= heightData.p85) calculatedPercentile = 85;
    else if (heightInCm <= heightData.p97) calculatedPercentile = 97;
    else calculatedPercentile = 99;

    setPercentile(calculatedPercentile);
    setHeightCategory(
      calculatedPercentile < 5 ? 'Below Average' :
      calculatedPercentile < 85 ? 'Average' :
      'Above Average'
    );
    setShowResults(true);
  };

  // Convert height between units
  const convertHeight = () => {
    const value = parseFloat(convertValue);
    if (isNaN(value)) return;

    let result = '';
    if (fromUnit === 'cm') {
      if (toUnit === 'ft-in') {
        const totalInches = value / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        result = `${feet}' ${inches}"`;
      } else if (toUnit === 'm') {
        result = (value / 100).toFixed(2) + ' m';
      }
    } else if (fromUnit === 'ft-in') {
      const [ft, inch] = convertValue.split('-').map(Number);
      const cm = ((ft * 12) + (inch || 0)) * 2.54;
      if (toUnit === 'cm') {
        result = cm.toFixed(1) + ' cm';
      } else if (toUnit === 'm') {
        result = (cm / 100).toFixed(2) + ' m';
      }
    } else if (fromUnit === 'm') {
      if (toUnit === 'cm') {
        result = (value * 100).toFixed(1) + ' cm';
      } else if (toUnit === 'ft-in') {
        const totalInches = value * 39.3701;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        result = `${feet}' ${inches}"`;
      }
    }
    setConvertResult(result);
  };

  // Calculate predicted adult height
  const calculatePredictedHeight = () => {
    // Simplified height prediction formula
    let predictedHeightInches: number;
    if (childGender === 'male') {
      predictedHeightInches = ((fatherHeight + (motherHeight * 1.08)) / 2) + 2.75;
    } else {
      predictedHeightInches = ((motherHeight + (fatherHeight * 0.923)) / 2) - 2.75;
    }
    setPredictedHeight(predictedHeightInches);
  };

  // Get visual representation for height comparison
  const getHeightVisual = () => {
    const heightInCm = centimeters;
    const averageHeight = gender === 'male' ? 175 : 162; // Example average heights
    const percentage = Math.min((heightInCm / averageHeight) * 100, 120);

    return (
      <div className="relative h-64 w-8 mx-auto bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 w-full bg-primary rounded-t-full"
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Height Calculator</h1>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Height Calculator</TabsTrigger>
            <TabsTrigger value="converter">Height Converter</TabsTrigger>
            <TabsTrigger value="predictor">Child Height Predictor</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Height Calculator Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Calculate Height Statistics</h2>
                </CardHeader>
                <CardContent>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculateHeight();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Gender</span>
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className={`btn flex-1 ${gender === 'male' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setGender('male')}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`btn flex-1 ${gender === 'female' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setGender('female')}
                        >
                          Female
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Age</span>
                      </label>
                      <Input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        min="2"
                        max="20"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Feet</span>
                        </label>
                        <Input
                          type="number"
                          value={feet}
                          onChange={(e) => setFeet(Number(e.target.value))}
                          min="0"
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Inches</span>
                        </label>
                        <Input
                          type="number"
                          value={inches}
                          onChange={(e) => setInches(Number(e.target.value))}
                          min="0"
                          max="11"
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Height Calculator Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium mb-2">Height in CM</h3>
                          <p className="text-2xl font-bold">{centimeters} cm</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h3 className="text-sm font-medium mb-2">Height in Meters</h3>
                          <p className="text-2xl font-bold">{meters} m</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Percentile</h3>
                            <p className="text-3xl font-bold">{percentile}th</p>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Category</h3>
                            <p className="text-2xl font-bold">{heightCategory}</p>
                          </div>
                        </div>
                        <div>{getHeightVisual()}</div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter your height details and click Calculate to see results
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="converter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Height Converter Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Convert Height</h2>
                </CardHeader>
                <CardContent>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      convertHeight();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">From</span>
                      </label>
                      <Select
                        value={fromUnit}
                        onValueChange={(value: 'cm' | 'ft-in' | 'm') => setFromUnit(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="ft-in">Feet & Inches</SelectItem>
                          <SelectItem value="m">Meters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">To</span>
                      </label>
                      <Select
                        value={toUnit}
                        onValueChange={(value: 'cm' | 'ft-in' | 'm') => setToUnit(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="ft-in">Feet & Inches</SelectItem>
                          <SelectItem value="m">Meters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Value</span>
                      </label>
                      <Input
                        type="text"
                        value={convertValue}
                        onChange={(e) => setConvertValue(e.target.value)}
                        placeholder={fromUnit === 'ft-in' ? "Enter as 5-8 for 5'8\"" : "Enter value"}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Convert
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Height Converter Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Conversion Result</h2>
                </CardHeader>
                <CardContent>
                  {convertResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-8"
                    >
                      <p className="text-4xl font-bold">{convertResult}</p>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter a value and click Convert to see the result
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictor">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Child Height Predictor Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Predict Child's Adult Height</h2>
                </CardHeader>
                <CardContent>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculatePredictedHeight();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Child's Gender</span>
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className={`btn flex-1 ${childGender === 'male' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setChildGender('male')}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`btn flex-1 ${childGender === 'female' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setChildGender('female')}
                        >
                          Female
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Father's Height (inches)</span>
                        </label>
                        <Input
                          type="number"
                          value={fatherHeight}
                          onChange={(e) => setFatherHeight(Number(e.target.value))}
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Mother's Height (inches)</span>
                        </label>
                        <Input
                          type="number"
                          value={motherHeight}
                          onChange={(e) => setMotherHeight(Number(e.target.value))}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate Predicted Height
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Child Height Predictor Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Predicted Height</h2>
                </CardHeader>
                <CardContent>
                  {predictedHeight ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-4">Predicted Adult Height</h3>
                        <p className="text-4xl font-bold mb-2">
                          {Math.floor(predictedHeight / 12)}' {Math.round(predictedHeight % 12)}"
                        </p>
                        <p className="text-2xl">
                          ({(predictedHeight * 2.54).toFixed(1)} cm)
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Height Range</h3>
                        <p className="text-sm">
                          This prediction has a margin of error of approximately ±2 inches.
                          The actual adult height may vary based on various factors including
                          nutrition, environment, and overall health.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter parent heights and click Calculate to see predicted height
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
