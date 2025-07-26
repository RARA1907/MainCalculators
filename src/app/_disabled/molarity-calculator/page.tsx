'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface CommonSolute {
  name: string;
  formula: string;
  molarMass: number;
  description: string;
  category: string;
}

const commonSolutes: { [key: string]: CommonSolute } = {
  naoh: {
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    molarMass: 40.00,
    description: 'Strong base commonly used in laboratories',
    category: 'Base'
  },
  hcl: {
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    molarMass: 36.46,
    description: 'Strong acid used in various chemical processes',
    category: 'Acid'
  },
  h2so4: {
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    molarMass: 98.08,
    description: 'Strong acid used in industrial applications',
    category: 'Acid'
  },
  nacl: {
    name: 'Sodium Chloride',
    formula: 'NaCl',
    molarMass: 58.44,
    description: 'Table salt, common ionic compound',
    category: 'Salt'
  },
  kcl: {
    name: 'Potassium Chloride',
    formula: 'KCl',
    molarMass: 74.55,
    description: 'Used in medicine and food processing',
    category: 'Salt'
  },
  cacl2: {
    name: 'Calcium Chloride',
    formula: 'CaCl₂',
    molarMass: 110.98,
    description: 'Used in deicing and desiccation',
    category: 'Salt'
  }
};

export default function MolarityCalculator() {
  const breadcrumbItems = [
    {
      label: 'Molarity Calculator',
      href: '/molarity-calculator'
    }
  ];

  const [calculationType, setCalculationType] = useState<'concentration' | 'dilution'>('concentration');
  const [selectedSolute, setSelectedSolute] = useState<string>('naoh');
  const [customMolarMass, setCustomMolarMass] = useState<number>(0);
  const [mass, setMass] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [concentration, setConcentration] = useState<number>(0);
  const [volumeUnit, setVolumeUnit] = useState<'L' | 'mL'>('L');
  const [massUnit, setMassUnit] = useState<'g' | 'mg'>('g');
  
  // Dilution calculation states
  const [initialConcentration, setInitialConcentration] = useState<number>(1);
  const [initialVolume, setInitialVolume] = useState<number>(1);
  const [finalVolume, setFinalVolume] = useState<number>(2);
  const [finalConcentration, setFinalConcentration] = useState<number>(0);

  const calculateMolarity = () => {
    const molarMass = selectedSolute === 'custom' ? customMolarMass : commonSolutes[selectedSolute].molarMass;
    const massInGrams = massUnit === 'g' ? mass : mass / 1000;
    const volumeInLiters = volumeUnit === 'L' ? volume : volume / 1000;
    
    const moles = massInGrams / molarMass;
    const molarity = moles / volumeInLiters;
    
    setConcentration(molarity);
  };

  const calculateDilution = () => {
    // C1V1 = C2V2
    const c2 = (initialConcentration * initialVolume) / finalVolume;
    setFinalConcentration(c2);
  };

  useEffect(() => {
    if (calculationType === 'concentration') {
      calculateMolarity();
    } else {
      calculateDilution();
    }
  }, [
    calculationType,
    selectedSolute,
    customMolarMass,
    mass,
    volume,
    volumeUnit,
    massUnit,
    initialConcentration,
    initialVolume,
    finalVolume
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Molarity Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Molarity</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calculation Type</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      className={`btn flex-1 ${calculationType === 'concentration' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setCalculationType('concentration')}
                    >
                      Concentration
                    </button>
                    <button
                      className={`btn flex-1 ${calculationType === 'dilution' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setCalculationType('dilution')}
                    >
                      Dilution
                    </button>
                  </div>
                </div>

                {calculationType === 'concentration' ? (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Solute</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedSolute}
                        onChange={(e) => setSelectedSolute(e.target.value)}
                      >
                        {Object.entries(commonSolutes).map(([key, solute]) => (
                          <option key={key} value={key}>
                            {solute.name} ({solute.formula})
                          </option>
                        ))}
                        <option value="custom">Custom Solute</option>
                      </select>
                    </div>

                    {selectedSolute === 'custom' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Molar Mass (g/mol)</span>
                        </label>
                        <Input
                          type="number"
                          value={customMolarMass}
                          onChange={(e) => setCustomMolarMass(Number(e.target.value))}
                          placeholder="Enter molar mass"
                          min="0"
                        />
                      </div>
                    )}

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Mass of Solute</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={mass}
                          onChange={(e) => setMass(Number(e.target.value))}
                          placeholder="Enter mass"
                          min="0"
                        />
                        <select
                          className="select select-bordered w-32"
                          value={massUnit}
                          onChange={(e) => setMassUnit(e.target.value as 'g' | 'mg')}
                        >
                          <option value="g">g</option>
                          <option value="mg">mg</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Volume of Solution</span>
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          placeholder="Enter volume"
                          min="0"
                        />
                        <select
                          className="select select-bordered w-32"
                          value={volumeUnit}
                          onChange={(e) => setVolumeUnit(e.target.value as 'L' | 'mL')}
                        >
                          <option value="L">L</option>
                          <option value="mL">mL</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Initial Concentration (M)</span>
                      </label>
                      <Input
                        type="number"
                        value={initialConcentration}
                        onChange={(e) => setInitialConcentration(Number(e.target.value))}
                        placeholder="Enter initial concentration"
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Initial Volume (L)</span>
                      </label>
                      <Input
                        type="number"
                        value={initialVolume}
                        onChange={(e) => setInitialVolume(Number(e.target.value))}
                        placeholder="Enter initial volume"
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Final Volume (L)</span>
                      </label>
                      <Input
                        type="number"
                        value={finalVolume}
                        onChange={(e) => setFinalVolume(Number(e.target.value))}
                        placeholder="Enter final volume"
                        min="0"
                      />
                    </div>
                  </>
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
              <div className="space-y-4">
                {calculationType === 'concentration' ? (
                  <motion.div
                    className="p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold mb-2">Solution Concentration</h3>
                    <p className="text-2xl font-bold text-primary">
                      {concentration.toFixed(4)} M
                    </p>
                    <p className="text-sm mt-2">
                      (moles of solute per liter of solution)
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold mb-2">Final Concentration</h3>
                    <p className="text-2xl font-bold text-primary">
                      {finalConcentration.toFixed(4)} M
                    </p>
                    <p className="text-sm mt-2">
                      (after dilution)
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Molarity</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">What is Molarity?</h3>
                  <p>Molarity (M) is the number of moles of solute per liter of solution. It's a measure of concentration expressed as mol/L.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Dilution Formula</h3>
                  <p>The dilution formula C₁V₁ = C₂V₂ is used to calculate the concentration of a diluted solution.</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Common Applications</h3>
                  <p>Molarity calculations are essential in chemistry for preparing solutions, analyzing concentrations, and performing dilutions.</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Common Solutes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(commonSolutes).map(([key, solute]) => (
                    <div key={key} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold">{solute.name}</h4>
                      <p className="text-sm">Formula: {solute.formula}</p>
                      <p className="text-sm">Molar Mass: {solute.molarMass} g/mol</p>
                      <p className="text-sm text-muted-foreground">{solute.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
