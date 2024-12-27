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

interface Element {
  symbol: string;
  name: string;
  atomicWeight: number;
  category: string;
  description: string;
}

const elements: { [key: string]: Element } = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicWeight: 1.008,
    category: 'Nonmetal',
    description: 'Lightest and most abundant element'
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicWeight: 12.011,
    category: 'Nonmetal',
    description: 'Basis of organic chemistry'
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicWeight: 14.007,
    category: 'Nonmetal',
    description: 'Essential for amino acids'
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicWeight: 15.999,
    category: 'Nonmetal',
    description: 'Vital for respiration'
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicWeight: 22.990,
    category: 'Alkali Metal',
    description: 'Common in salts'
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicWeight: 24.305,
    category: 'Alkaline Earth Metal',
    description: 'Essential for chlorophyll'
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicWeight: 30.974,
    category: 'Nonmetal',
    description: 'Important for DNA/RNA'
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicWeight: 32.065,
    category: 'Nonmetal',
    description: 'Found in amino acids'
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicWeight: 35.453,
    category: 'Halogen',
    description: 'Common in salts'
  },
  K: {
    symbol: 'K',
    name: 'Potassium',
    atomicWeight: 39.098,
    category: 'Alkali Metal',
    description: 'Essential for nerve function'
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicWeight: 40.078,
    category: 'Alkaline Earth Metal',
    description: 'Important for bones'
  },
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicWeight: 55.845,
    category: 'Transition Metal',
    description: 'Essential for hemoglobin'
  }
};

interface ParsedElement {
  symbol: string;
  count: number;
}

export default function MolecularWeightCalculator() {
  const breadcrumbItems = [
    {
      label: 'Molecular Weight Calculator',
      href: '/molecular-weight-calculator'
    }
  ];

  const [formula, setFormula] = useState<string>('');
  const [parsedFormula, setParsedFormula] = useState<ParsedElement[]>([]);
  const [molecularWeight, setMolecularWeight] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const parseChemicalFormula = (formula: string): ParsedElement[] => {
    const result: ParsedElement[] = [];
    let currentElement = '';
    let currentNumber = '';
    let i = 0;

    while (i < formula.length) {
      if (formula[i].match(/[A-Z]/)) {
        // Process previous element if exists
        if (currentElement) {
          result.push({
            symbol: currentElement,
            count: currentNumber ? parseInt(currentNumber) : 1
          });
          currentElement = '';
          currentNumber = '';
        }
        currentElement = formula[i];
        if (i + 1 < formula.length && formula[i + 1].match(/[a-z]/)) {
          currentElement += formula[i + 1];
          i++;
        }
      } else if (formula[i].match(/[0-9]/)) {
        currentNumber += formula[i];
      } else if (formula[i] !== ' ') {
        throw new Error(`Invalid character: ${formula[i]}`);
      }
      i++;
    }

    // Process last element
    if (currentElement) {
      result.push({
        symbol: currentElement,
        count: currentNumber ? parseInt(currentNumber) : 1
      });
    }

    return result;
  };

  const calculateMolecularWeight = (parsedFormula: ParsedElement[]): number => {
    return parsedFormula.reduce((total, element) => {
      if (!elements[element.symbol]) {
        throw new Error(`Unknown element: ${element.symbol}`);
      }
      return total + (elements[element.symbol].atomicWeight * element.count);
    }, 0);
  };

  useEffect(() => {
    if (!formula) {
      setParsedFormula([]);
      setMolecularWeight(0);
      setError('');
      return;
    }

    try {
      const parsed = parseChemicalFormula(formula);
      setParsedFormula(parsed);
      const weight = calculateMolecularWeight(parsed);
      setMolecularWeight(weight);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setParsedFormula([]);
      setMolecularWeight(0);
    }
  }, [formula]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Molecular Weight Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Molecular Weight</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Chemical Formula</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter a chemical formula (e.g., H2O, NaCl, C6H12O6)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    placeholder="Enter chemical formula (e.g., H2O)"
                    className={error ? 'border-red-500' : ''}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                {parsedFormula.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Composition</h3>
                    <div className="space-y-2">
                      {parsedFormula.map((element, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded-lg">
                          <div className="flex items-center">
                            <span className="font-medium">{element.symbol}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({elements[element.symbol].name})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">×{element.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
              {molecularWeight > 0 && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Molecular Weight</h3>
                    <p className="text-3xl font-bold text-primary">
                      {molecularWeight.toFixed(3)} g/mol
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Element Contributions</h3>
                    {parsedFormula.map((element, index) => {
                      const contribution = (elements[element.symbol].atomicWeight * element.count) / molecularWeight * 100;
                      return (
                        <div key={index} className="flex justify-between items-center mb-2">
                          <span>{element.symbol}</span>
                          <span>{contribution.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Common Elements</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(elements).map(([symbol, element]) => (
                  <div key={symbol} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{element.name}</h3>
                      <span className="text-lg font-bold">{element.symbol}</span>
                    </div>
                    <p className="text-sm mb-1">Atomic Weight: {element.atomicWeight} g/mol</p>
                    <p className="text-sm text-muted-foreground">{element.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
