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

// Common material densities for reference (g/cm³)
const materialDensities = {
  "Water": 1.0,
  "Ice": 0.92,
  "Air": 0.001225,
  "Steel": 7.85,
  "Gold": 19.32,
  "Silver": 10.49,
  "Copper": 8.96,
  "Aluminum": 2.70,
  "Wood": 0.7,
  "Concrete": 2.4
};

// Population density examples (people/km²)
const populationDensities = {
  "Monaco": 26337,
  "Singapore": 8358,
  "Hong Kong": 6659,
  "Gibraltar": 5620,
  "Vatican City": 1818,
  "Bahrain": 2239,
  "Malta": 1380,
  "Maldives": 1802,
  "Bangladesh": 1265,
  "Taiwan": 673
};

export default function DensityCalculator() {
  const breadcrumbItems = [{ label: 'Density Calculator', href: '/density-calculator' }];

  // Mass Density States
  const [mass, setMass] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [massUnit, setMassUnit] = useState<string>('g');
  const [volumeUnit, setVolumeUnit] = useState<string>('cm3');
  const [massDensity, setMassDensity] = useState<number | null>(null);

  // Population Density States
  const [population, setPopulation] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [areaUnit, setAreaUnit] = useState<string>('km2');
  const [populationDensity, setPopulationDensity] = useState<number | null>(null);

  // Relative Density States
  const [substance1Density, setSubstance1Density] = useState<number>(0);
  const [substance2Density, setSubstance2Density] = useState<number>(1); // Default to water
  const [relativeDensity, setRelativeDensity] = useState<number | null>(null);

  // Results state
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("Water");

  // Calculate Mass Density
  const calculateMassDensity = () => {
    if (mass && volume) {
      // Convert mass to grams
      let massInGrams = mass;
      if (massUnit === 'kg') massInGrams *= 1000;
      if (massUnit === 'mg') massInGrams /= 1000;

      // Convert volume to cm³
      let volumeInCm3 = volume;
      if (volumeUnit === 'm3') volumeInCm3 *= 1000000;
      if (volumeUnit === 'ml') volumeInCm3 *= 1;
      if (volumeUnit === 'l') volumeInCm3 *= 1000;

      const density = massInGrams / volumeInCm3;
      setMassDensity(Number(density.toFixed(6)));
      setShowResults(true);
    }
  };

  // Calculate Population Density
  const calculatePopulationDensity = () => {
    if (population && area) {
      // Convert area to km²
      let areaInKm2 = area;
      if (areaUnit === 'm2') areaInKm2 /= 1000000;
      if (areaUnit === 'ha') areaInKm2 /= 100;

      const density = population / areaInKm2;
      setPopulationDensity(Number(density.toFixed(2)));
      setShowResults(true);
    }
  };

  // Calculate Relative Density
  const calculateRelativeDensity = () => {
    if (substance1Density && substance2Density) {
      const density = substance1Density / substance2Density;
      setRelativeDensity(Number(density.toFixed(4)));
      setShowResults(true);
    }
  };

  // Get density comparison visualization
  const getDensityVisual = (density: number, maxDensity: number) => {
    const percentage = Math.min((density / maxDensity) * 100, 100);

    return (
      <div className="relative h-8 bg-primary/20 rounded-full my-4">
        <motion.div
          className="absolute left-0 h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Density Calculator</h1>
        </div>

        <Tabs defaultValue="mass" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mass">Mass Density</TabsTrigger>
            <TabsTrigger value="population">Population Density</TabsTrigger>
            <TabsTrigger value="relative">Relative Density</TabsTrigger>
          </TabsList>

          <TabsContent value="mass">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mass Density Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Calculate Mass Density</h2>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculateMassDensity();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Mass</span>
                      </label>
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          value={mass}
                          onChange={(e) => setMass(Number(e.target.value))}
                          className="input input-bordered flex-1"
                        />
                        <Select
                          value={massUnit}
                          onValueChange={setMassUnit}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="mg">mg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Volume</span>
                      </label>
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="input input-bordered flex-1"
                        />
                        <Select
                          value={volumeUnit}
                          onValueChange={setVolumeUnit}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm3">cm³</SelectItem>
                            <SelectItem value="m3">m³</SelectItem>
                            <SelectItem value="ml">mL</SelectItem>
                            <SelectItem value="l">L</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate Density
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Mass Density Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults && massDensity !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Density</h3>
                        <p className="text-4xl font-bold">
                          {massDensity} g/cm³
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Material Comparison</h3>
                        <Select
                          value={selectedMaterial}
                          onValueChange={setSelectedMaterial}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(materialDensities).map((material) => (
                              <SelectItem key={material} value={material}>
                                {material}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {getDensityVisual(massDensity, materialDensities[selectedMaterial])}
                        <div className="flex justify-between text-sm">
                          <span>Your Material</span>
                          <span>{selectedMaterial}</span>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Common Materials</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(materialDensities).slice(0, 6).map(([material, density]) => (
                            <div key={material} className="flex justify-between">
                              <span>{material}</span>
                              <span>{density} g/cm³</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter mass and volume to calculate density
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="population">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Population Density Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Calculate Population Density</h2>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculatePopulationDensity();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Population</span>
                      </label>
                      <Input
                        type="number"
                        value={population}
                        onChange={(e) => setPopulation(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Area</span>
                      </label>
                      <div className="flex gap-4">
                        <Input
                          type="number"
                          value={area}
                          onChange={(e) => setArea(Number(e.target.value))}
                          className="input input-bordered flex-1"
                        />
                        <Select
                          value={areaUnit}
                          onValueChange={setAreaUnit}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="km2">km²</SelectItem>
                            <SelectItem value="m2">m²</SelectItem>
                            <SelectItem value="ha">ha</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate Density
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Population Density Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults && populationDensity !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Population Density</h3>
                        <p className="text-4xl font-bold">
                          {populationDensity.toLocaleString()} people/km²
                        </p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Densest Regions</h3>
                        <div className="space-y-2">
                          {Object.entries(populationDensities).slice(0, 5).map(([region, density]) => (
                            <div key={region} className="flex justify-between text-sm">
                              <span>{region}</span>
                              <span>{density.toLocaleString()} people/km²</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Density Comparison</h3>
                        {getDensityVisual(populationDensity, Math.max(...Object.values(populationDensities)))}
                        <p className="text-sm text-muted-foreground">
                          Compared to the world's most densely populated regions
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter population and area to calculate density
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Relative Density Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Calculate Relative Density</h2>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculateRelativeDensity();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Substance Density (g/cm³)</span>
                      </label>
                      <Input
                        type="number"
                        value={substance1Density}
                        onChange={(e) => setSubstance1Density(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Reference Density (g/cm³)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Usually water (1 g/cm³)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        value={substance2Density}
                        onChange={(e) => setSubstance2Density(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate Relative Density
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Relative Density Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults && relativeDensity !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Relative Density</h3>
                        <p className="text-4xl font-bold">{relativeDensity}</p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">What does this mean?</h3>
                        <p className="text-sm">
                          {relativeDensity > 1
                            ? "The substance is denser than the reference substance and will sink."
                            : relativeDensity < 1
                            ? "The substance is less dense than the reference substance and will float."
                            : "The substance has the same density as the reference substance."}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Common Relative Densities</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(materialDensities).slice(0, 6).map(([material, density]) => (
                            <div key={material} className="flex justify-between">
                              <span>{material}</span>
                              <span>{(density / materialDensities.Water).toFixed(3)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter densities to calculate relative density
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">What is Density?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Density is a measure of mass per unit volume. It is an important property of matter that helps determine the behavior of materials and substances in various conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">Types of Density</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>
                  <span className="font-medium">Mass Density:</span> Mass per unit volume
                </li>
                <li>
                  <span className="font-medium">Population Density:</span> People per unit area
                </li>
                <li>
                  <span className="font-medium">Relative Density:</span> Ratio of densities
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">Applications</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>Material Science</li>
                <li>Urban Planning</li>
                <li>Fluid Dynamics</li>
                <li>Environmental Studies</li>
                <li>Manufacturing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
