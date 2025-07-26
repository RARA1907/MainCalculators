'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const breadcrumbItems = [
  {
    label: 'Concrete Calculator',
    href: '/concrete-calculator',
  },
];

interface ConcreteResult {
  volume: number;
  weight: number;
  bags: number;
  recommendedVolume: number;
}

type ShapeType = 'rectangular' | 'circular' | 'tube';

export default function ConcreteCalculator() {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rectangular');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<ConcreteResult | null>(null);

  // Rectangular dimensions
  const [rectangularDimensions, setRectangularDimensions] = useState({
    length: '',
    width: '',
    height: '',
    quantity: '1',
  });

  // Circular dimensions
  const [circularDimensions, setCircularDimensions] = useState({
    diameter: '',
    height: '',
    quantity: '1',
  });

  // Tube dimensions
  const [tubeDimensions, setTubeDimensions] = useState({
    outerDiameter: '',
    innerDiameter: '',
    height: '',
    quantity: '1',
  });

  const calculateVolume = () => {
    let volume = 0;
    let quantity = 1;

    switch (selectedShape) {
      case 'rectangular':
        const { length, width, height, quantity: rectQuantity } = rectangularDimensions;
        volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        quantity = parseInt(rectQuantity);
        break;

      case 'circular':
        const { diameter, height: circHeight, quantity: circQuantity } = circularDimensions;
        const radius = parseFloat(diameter) / 2;
        volume = Math.PI * radius * radius * parseFloat(circHeight);
        quantity = parseInt(circQuantity);
        break;

      case 'tube':
        const { outerDiameter, innerDiameter, height: tubeHeight, quantity: tubeQuantity } = tubeDimensions;
        const outerRadius = parseFloat(outerDiameter) / 2;
        const innerRadius = parseFloat(innerDiameter) / 2;
        volume = Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * parseFloat(tubeHeight);
        quantity = parseInt(tubeQuantity);
        break;
    }

    // Convert to appropriate units and calculate weight
    let finalVolume: number;
    let weight: number;

    if (unit === 'metric') {
      finalVolume = volume / 1000000; // Convert to cubic meters
      weight = finalVolume * 2400; // kg/m³
    } else {
      finalVolume = volume / 27; // Convert to cubic yards
      weight = finalVolume * 4050; // lbs/yd³
    }

    // Multiply by quantity
    finalVolume *= quantity;
    weight *= quantity;

    // Add 10% extra for safety margin
    const recommendedVolume = finalVolume * 1.1;

    // Calculate number of bags needed (assuming 40kg/88lb bags)
    const bagsNeeded = unit === 'metric'
      ? Math.ceil(weight / 40)
      : Math.ceil(weight / 88);

    setResult({
      volume: Number(finalVolume.toFixed(2)),
      weight: Number(weight.toFixed(2)),
      bags: bagsNeeded,
      recommendedVolume: Number(recommendedVolume.toFixed(2)),
    });
  };

  const getUnitLabel = (dimension: string) => {
    if (unit === 'metric') {
      return dimension.toLowerCase().includes('diameter') ? 'cm' : 'cm';
    }
    return dimension.toLowerCase().includes('diameter') ? 'inches' : 'inches';
  };

  const getResultUnitLabels = () => {
    if (unit === 'metric') {
      return {
        volume: 'm³',
        weight: 'kg',
      };
    }
    return {
      volume: 'yd³',
      weight: 'lbs',
    };
  };

  const renderDimensionInput = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label} ({getUnitLabel(label)})</span>
      </label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered w-full"
        min="0"
        step="0.01"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Concrete Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Concrete Volume</h2>
              <p className="text-muted-foreground">
                Select shape and enter dimensions to calculate concrete volume
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit System</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setUnit('metric')}
                    >
                      Metric
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setUnit('imperial')}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                <Tabs
                  defaultValue="rectangular"
                  value={selectedShape}
                  onValueChange={(value) => setSelectedShape(value as ShapeType)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rectangular">Rectangular</TabsTrigger>
                    <TabsTrigger value="circular">Circular</TabsTrigger>
                    <TabsTrigger value="tube">Tube</TabsTrigger>
                  </TabsList>

                  <TabsContent value="rectangular" className="space-y-4 mt-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 border-2 border-gray-400 relative flex items-center justify-center">
                        <div className="text-sm text-gray-600">l × w × h</div>
                        {/* Dimension arrows */}
                        <div className="absolute top-0 left-1/2 h-full border-l border-gray-400"></div>
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-400"></div>
                      </div>
                    </div>
                    {renderDimensionInput('Length', rectangularDimensions.length,
                      (value) => setRectangularDimensions(prev => ({ ...prev, length: value })))}
                    {renderDimensionInput('Width', rectangularDimensions.width,
                      (value) => setRectangularDimensions(prev => ({ ...prev, width: value })))}
                    {renderDimensionInput('Height', rectangularDimensions.height,
                      (value) => setRectangularDimensions(prev => ({ ...prev, height: value })))}
                    {renderDimensionInput('Quantity', rectangularDimensions.quantity,
                      (value) => setRectangularDimensions(prev => ({ ...prev, quantity: value })))}
                  </TabsContent>

                  <TabsContent value="circular" className="space-y-4 mt-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 rounded-full border-2 border-gray-400 relative flex items-center justify-center">
                        <div className="text-sm text-gray-600">d × h</div>
                        {/* Dimension arrows */}
                        <div className="absolute top-0 left-1/2 h-full border-l border-gray-400"></div>
                        <div className="absolute top-1/2 left-0 w-full border-t border-gray-400"></div>
                      </div>
                    </div>
                    {renderDimensionInput('Diameter', circularDimensions.diameter,
                      (value) => setCircularDimensions(prev => ({ ...prev, diameter: value })))}
                    {renderDimensionInput('Height', circularDimensions.height,
                      (value) => setCircularDimensions(prev => ({ ...prev, height: value })))}
                    {renderDimensionInput('Quantity', circularDimensions.quantity,
                      (value) => setCircularDimensions(prev => ({ ...prev, quantity: value })))}
                  </TabsContent>

                  <TabsContent value="tube" className="space-y-4 mt-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32 rounded-full border-2 border-gray-400 relative flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-gray-400 absolute"></div>
                        <div className="text-sm text-gray-600">d₁ - d₂ × h</div>
                        {/* Dimension arrows */}
                        <div className="absolute top-0 left-1/2 h-full border-l border-gray-400"></div>
                      </div>
                    </div>
                    {renderDimensionInput('Outer Diameter', tubeDimensions.outerDiameter,
                      (value) => setTubeDimensions(prev => ({ ...prev, outerDiameter: value })))}
                    {renderDimensionInput('Inner Diameter', tubeDimensions.innerDiameter,
                      (value) => setTubeDimensions(prev => ({ ...prev, innerDiameter: value })))}
                    {renderDimensionInput('Height', tubeDimensions.height,
                      (value) => setTubeDimensions(prev => ({ ...prev, height: value })))}
                    {renderDimensionInput('Quantity', tubeDimensions.quantity,
                      (value) => setTubeDimensions(prev => ({ ...prev, quantity: value })))}
                  </TabsContent>
                </Tabs>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateVolume}
                >
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Volume and Weight Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <div className="text-sm text-muted-foreground">Volume</div>
                          <div className="text-2xl font-bold text-primary">
                            {result.volume} {getResultUnitLabels().volume}
                          </div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <div className="text-sm text-muted-foreground">Weight</div>
                          <div className="text-2xl font-bold text-primary">
                            {result.weight} {getResultUnitLabels().weight}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Additional Information */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-muted p-4 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Additional Details:</h3>
                        <ul className="space-y-2">
                          <li>Recommended Volume (+ 10%): {result.recommendedVolume} {getResultUnitLabels().volume}</li>
                          <li>Estimated Bags Needed: {result.bags} bags</li>
                          <li>Bag Size: {unit === 'metric' ? '40 kg' : '88 lbs'}</li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">About Concrete Calculations</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Important Considerations</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Always add 10% extra for wastage and variations</li>
                        <li>Consider concrete thickness based on usage</li>
                        <li>Account for ground preparation</li>
                        <li>Check local building codes</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Concrete Mix Tips</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Use the right water-to-cement ratio</li>
                        <li>Consider weather conditions</li>
                        <li>Allow for proper curing time</li>
                        <li>Use appropriate reinforcement</li>
                        <li>Consider using additives when needed</li>
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
