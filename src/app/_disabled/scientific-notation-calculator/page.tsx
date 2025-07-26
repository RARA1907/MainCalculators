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

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'convert',
    name: 'Convert',
    description: 'Convert between standard and scientific notation',
  },
  {
    id: 'multiply',
    name: 'Multiply',
    description: 'Multiply numbers in scientific notation',
  },
  {
    id: 'divide',
    name: 'Divide',
    description: 'Divide numbers in scientific notation',
  },
  {
    id: 'add',
    name: 'Add/Subtract',
    description: 'Add or subtract numbers in scientific notation',
  },
];

const breadcrumbItems = [
  {
    label: 'Scientific Notation Calculator',
    href: '/scientific-notation-calculator',
  },
];

interface ScientificNumber {
  coefficient: number;
  exponent: number;
}

export default function ScientificNotationCalculator() {
  // Calculator state
  const [mode, setMode] = useState<string>('convert');
  const [number1, setNumber1] = useState<string>('');
  const [number2, setNumber2] = useState<string>('');
  const [operation, setOperation] = useState<'+' | '-' | ''>('');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Parse scientific notation string
  const parseScientificNotation = (input: string): ScientificNumber => {
    // Handle standard notation
    if (!input.toLowerCase().includes('e')) {
      const num = parseFloat(input);
      if (isNaN(num)) throw new Error('Invalid number');
      
      let exponent = 0;
      let coefficient = num;
      
      // Convert to scientific notation
      while (Math.abs(coefficient) >= 10) {
        coefficient /= 10;
        exponent++;
      }
      while (Math.abs(coefficient) > 0 && Math.abs(coefficient) < 1) {
        coefficient *= 10;
        exponent--;
      }
      
      return { coefficient, exponent };
    }
    
    // Handle scientific notation
    const parts = input.toLowerCase().split('e');
    if (parts.length !== 2) throw new Error('Invalid scientific notation');
    
    const coefficient = parseFloat(parts[0]);
    const exponent = parseInt(parts[1]);
    
    if (isNaN(coefficient) || isNaN(exponent)) {
      throw new Error('Invalid scientific notation');
    }
    
    return { coefficient, exponent };
  };

  // Format scientific notation
  const formatScientificNotation = (num: ScientificNumber): string => {
    if (num.coefficient === 0) return '0';
    return `${num.coefficient.toFixed(4)}e${num.exponent}`;
  };

  // Convert to standard notation
  const toStandardNotation = (num: ScientificNumber): string => {
    if (num.coefficient === 0) return '0';
    const result = num.coefficient * Math.pow(10, num.exponent);
    return result.toString();
  };

  // Normalize scientific notation
  const normalizeScientificNotation = (num: ScientificNumber): ScientificNumber => {
    let { coefficient, exponent } = num;
    
    while (Math.abs(coefficient) >= 10) {
      coefficient /= 10;
      exponent++;
    }
    while (Math.abs(coefficient) > 0 && Math.abs(coefficient) < 1) {
      coefficient *= 10;
      exponent--;
    }
    
    return { coefficient, exponent };
  };

  // Convert number
  const convertNumber = () => {
    try {
      if (!number1) {
        throw new Error('Please enter a number');
      }

      const num = parseScientificNotation(number1);
      const steps = [
        'Step 1: Parse the number',
        `Input: ${number1}`,
        '',
        'Step 2: Convert to scientific notation',
        `Coefficient: ${num.coefficient.toFixed(4)}`,
        `Exponent: ${num.exponent}`,
        '',
        'Step 3: Format results',
        `Scientific notation: ${formatScientificNotation(num)}`,
        `Standard notation: ${toStandardNotation(num)}`
      ];

      setResult(`Scientific: ${formatScientificNotation(num)}\nStandard: ${toStandardNotation(num)}`);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Multiply numbers
  const multiplyNumbers = () => {
    try {
      if (!number1 || !number2) {
        throw new Error('Please enter both numbers');
      }

      const num1 = parseScientificNotation(number1);
      const num2 = parseScientificNotation(number2);

      const resultNum = normalizeScientificNotation({
        coefficient: num1.coefficient * num2.coefficient,
        exponent: num1.exponent + num2.exponent
      });

      const steps = [
        'Step 1: Parse numbers',
        `Number 1: ${formatScientificNotation(num1)}`,
        `Number 2: ${formatScientificNotation(num2)}`,
        '',
        'Step 2: Multiply coefficients',
        `${num1.coefficient} × ${num2.coefficient} = ${num1.coefficient * num2.coefficient}`,
        '',
        'Step 3: Add exponents',
        `${num1.exponent} + ${num2.exponent} = ${num1.exponent + num2.exponent}`,
        '',
        'Step 4: Normalize result',
        `Final result: ${formatScientificNotation(resultNum)}`
      ];

      setResult(formatScientificNotation(resultNum));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Divide numbers
  const divideNumbers = () => {
    try {
      if (!number1 || !number2) {
        throw new Error('Please enter both numbers');
      }

      const num1 = parseScientificNotation(number1);
      const num2 = parseScientificNotation(number2);

      if (num2.coefficient === 0) {
        throw new Error('Cannot divide by zero');
      }

      const resultNum = normalizeScientificNotation({
        coefficient: num1.coefficient / num2.coefficient,
        exponent: num1.exponent - num2.exponent
      });

      const steps = [
        'Step 1: Parse numbers',
        `Number 1: ${formatScientificNotation(num1)}`,
        `Number 2: ${formatScientificNotation(num2)}`,
        '',
        'Step 2: Divide coefficients',
        `${num1.coefficient} ÷ ${num2.coefficient} = ${num1.coefficient / num2.coefficient}`,
        '',
        'Step 3: Subtract exponents',
        `${num1.exponent} - ${num2.exponent} = ${num1.exponent - num2.exponent}`,
        '',
        'Step 4: Normalize result',
        `Final result: ${formatScientificNotation(resultNum)}`
      ];

      setResult(formatScientificNotation(resultNum));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Add/subtract numbers
  const addSubtractNumbers = () => {
    try {
      if (!number1 || !number2 || !operation) {
        throw new Error('Please enter both numbers and select an operation');
      }

      const num1 = parseScientificNotation(number1);
      const num2 = parseScientificNotation(number2);

      // Convert to same exponent
      const maxExp = Math.max(num1.exponent, num2.exponent);
      const coeff1 = num1.coefficient * Math.pow(10, num1.exponent - maxExp);
      const coeff2 = num2.coefficient * Math.pow(10, num2.exponent - maxExp);

      const resultCoeff = operation === '+' ? coeff1 + coeff2 : coeff1 - coeff2;
      const resultNum = normalizeScientificNotation({
        coefficient: resultCoeff,
        exponent: maxExp
      });

      const steps = [
        'Step 1: Parse numbers',
        `Number 1: ${formatScientificNotation(num1)}`,
        `Number 2: ${formatScientificNotation(num2)}`,
        '',
        'Step 2: Convert to same exponent',
        `Adjusted number 1: ${coeff1}e${maxExp}`,
        `Adjusted number 2: ${coeff2}e${maxExp}`,
        '',
        `Step 3: ${operation === '+' ? 'Add' : 'Subtract'} coefficients`,
        `${coeff1} ${operation} ${coeff2} = ${resultCoeff}`,
        '',
        'Step 4: Normalize result',
        `Final result: ${formatScientificNotation(resultNum)}`
      ];

      setResult(formatScientificNotation(resultNum));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Scientific Notation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id);
                        setResult('');
                        setSteps([]);
                        setError('');
                        setOperation('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === calcMode.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                {mode === 'add' && (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setOperation('+')}
                      className={`btn ${operation === '+' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => setOperation('-')}
                      className={`btn ${operation === '-' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      -
                    </button>
                  </div>
                )}

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number 1</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a number in standard or scientific notation (e.g., 1234 or 1.234e3)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="text"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                      placeholder="Enter a number"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {mode !== 'convert' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Number 2</span>
                      </label>
                      <input
                        type="text"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                        placeholder="Enter a number"
                        className="input input-bordered w-full"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'convert':
                        convertNumber();
                        break;
                      case 'multiply':
                        multiplyNumbers();
                        break;
                      case 'divide':
                        divideNumbers();
                        break;
                      case 'add':
                        addSubtractNumbers();
                        break;
                    }
                  }}
                  className="btn w-full bg-[#0EA5E9] hover:bg-blue-600 text-white"
                >
                  Calculate
                </button>

                {error && (
                  <div className="text-error text-sm mt-2">{error}</div>
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
              {result && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Result</h3>
                    <pre className="text-lg font-mono whitespace-pre-wrap break-all">
                      {result}
                    </pre>
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="text-sm font-mono break-words">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter numbers and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Scientific Notation</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Concepts</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Format: a × 10^n</li>
                  <li className="break-words">1 ≤ |a|  10</li>
                  <li className="break-words">n is an integer</li>
                  <li className="break-words">Used for very large/small numbers</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Operations</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Multiply: multiply a's, add n's</li>
                  <li className="break-words">Divide: divide a's, subtract n's</li>
                  <li className="break-words">Add/Subtract: same exponent first</li>
                  <li className="break-words">Always normalize result</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Examples</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">1234 = 1.234 × 10^3</li>
                  <li className="break-words">0.00123 = 1.23 × 10^-3</li>
                  <li className="break-words">-123.4 = -1.234 × 10^2</li>
                  <li className="break-words">0 = 0 × 10^0</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
