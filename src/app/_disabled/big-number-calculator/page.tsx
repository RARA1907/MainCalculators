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
import Big from 'big.js';

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'arithmetic',
    name: 'Basic Arithmetic',
    description: 'Add, subtract, multiply, divide',
  },
  {
    id: 'power',
    name: 'Powers',
    description: 'Calculate powers and roots',
  },
  {
    id: 'factorial',
    name: 'Factorial',
    description: 'Calculate factorial of large numbers',
  },
  {
    id: 'compare',
    name: 'Compare',
    description: 'Compare two large numbers',
  },
];

const breadcrumbItems = [
  {
    label: 'Big Number Calculator',
    href: '/big-number-calculator',
  },
];

// Set Big.js configuration
Big.DP = 50; // Decimal places
Big.RM = Big.roundDown; // Rounding mode

export default function BigNumberCalculator() {
  // Calculator state
  const [mode, setMode] = useState<string>('arithmetic');
  const [number1, setNumber1] = useState<string>('');
  const [number2, setNumber2] = useState<string>('');
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/' | '^' | 'root'>('+');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Format big number with commas
  const formatBigNumber = (num: string): string => {
    const [integerPart, decimalPart] = num.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  // Basic arithmetic operations
  const calculateArithmetic = () => {
    try {
      if (!number1 || !number2 || !operation) {
        throw new Error('Please enter both numbers and select an operation');
      }

      const num1 = new Big(number1);
      const num2 = new Big(number2);
      let result: Big;
      const steps: string[] = [
        'Step 1: Parse numbers',
        `Number 1: ${formatBigNumber(number1)}`,
        `Number 2: ${formatBigNumber(number2)}`,
        ''
      ];

      switch (operation) {
        case '+':
          result = num1.plus(num2);
          steps.push('Step 2: Add the numbers');
          break;
        case '-':
          result = num1.minus(num2);
          steps.push('Step 2: Subtract the numbers');
          break;
        case '*':
          result = num1.times(num2);
          steps.push('Step 2: Multiply the numbers');
          break;
        case '/':
          if (num2.eq(0)) throw new Error('Cannot divide by zero');
          result = num1.div(num2);
          steps.push('Step 2: Divide the numbers');
          break;
        default:
          throw new Error('Invalid operation');
      }

      steps.push(`Result: ${formatBigNumber(result.toString())}`);

      setResult(formatBigNumber(result.toString()));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Power and root calculations
  const calculatePower = () => {
    try {
      if (!number1 || !number2 || !operation) {
        throw new Error('Please enter both numbers and select an operation');
      }

      const num1 = new Big(number1);
      let result: Big;
      const steps: string[] = [
        'Step 1: Parse numbers',
        `Base: ${formatBigNumber(number1)}`,
        `Exponent/Root: ${number2}`,
        ''
      ];

      if (operation === '^') {
        if (parseFloat(number2) > 1000) {
          throw new Error('Exponent too large');
        }
        result = num1.pow(Number(number2));
        steps.push('Step 2: Calculate power');
      } else { // root
        if (parseFloat(number2) <= 0) {
          throw new Error('Root must be positive');
        }
        result = num1.pow(1 / Number(number2));
        steps.push('Step 2: Calculate root');
      }

      steps.push(`Result: ${formatBigNumber(result.toString())}`);

      setResult(formatBigNumber(result.toString()));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Calculate factorial
  const calculateFactorial = () => {
    try {
      if (!number1) {
        throw new Error('Please enter a number');
      }

      const num = parseInt(number1);
      if (isNaN(num)) {
        throw new Error('Please enter a valid integer');
      }
      if (num < 0) {
        throw new Error('Factorial is not defined for negative numbers');
      }
      if (num > 1000) {
        throw new Error('Number too large for factorial calculation');
      }

      const steps: string[] = [
        'Step 1: Parse number',
        `Input: ${num}`,
        '',
        'Step 2: Calculate factorial'
      ];

      let result = new Big(1);
      for (let i = 2; i <= num; i++) {
        result = result.times(i);
        if (i <= 5 || i > num - 5) {
          steps.push(`${i}! = ${formatBigNumber(result.toString())}`);
        } else if (i === 6) {
          steps.push('...');
        }
      }

      setResult(formatBigNumber(result.toString()));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Compare numbers
  const compareNumbers = () => {
    try {
      if (!number1 || !number2) {
        throw new Error('Please enter both numbers');
      }

      const num1 = new Big(number1);
      const num2 = new Big(number2);

      const steps = [
        'Step 1: Parse numbers',
        `Number 1: ${formatBigNumber(number1)}`,
        `Number 2: ${formatBigNumber(number2)}`,
        '',
        'Step 2: Compare numbers'
      ];

      let comparisonResult: string;
      if (num1.eq(num2)) {
        comparisonResult = 'Numbers are equal';
      } else if (num1.gt(num2)) {
        comparisonResult = 'First number is greater';
      } else {
        comparisonResult = 'Second number is greater';
      }

      const difference = num1.minus(num2).abs();
      steps.push(`Result: ${comparisonResult}`);
      steps.push(`Absolute difference: ${formatBigNumber(difference.toString())}`);

      setResult(comparisonResult);
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Big Number Calculator</h1>
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
                        setOperation('+');
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

                {/* Operation Selection for Arithmetic and Power modes */}
                {(mode === 'arithmetic' || mode === 'power') && (
                  <div className="flex justify-center space-x-4">
                    {mode === 'arithmetic' ? (
                      <>
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
                        <button
                          onClick={() => setOperation('*')}
                          className={`btn ${operation === '*' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          ×
                        </button>
                        <button
                          onClick={() => setOperation('/')}
                          className={`btn ${operation === '/' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          ÷
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setOperation('^')}
                          className={`btn ${operation === '^' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          x^n
                        </button>
                        <button
                          onClick={() => setOperation('root')}
                          className={`btn ${operation === 'root' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                          n√x
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {mode === 'factorial' ? 'Number' : 'Number 1'}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a number (can be very large)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="text"
                      value={number1}
                      onChange={(e) => setNumber1(e.target.value)}
                      placeholder="Enter a number"
                      className="input input-bordered w-full font-mono"
                    />
                  </div>

                  {mode !== 'factorial' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Number 2</span>
                      </label>
                      <input
                        type="text"
                        value={number2}
                        onChange={(e) => setNumber2(e.target.value)}
                        placeholder="Enter a number"
                        className="input input-bordered w-full font-mono"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'arithmetic':
                        calculateArithmetic();
                        break;
                      case 'power':
                        calculatePower();
                        break;
                      case 'factorial':
                        calculateFactorial();
                        break;
                      case 'compare':
                        compareNumbers();
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
                    <pre className="text-sm font-mono whitespace-pre-wrap break-all">
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
            <h2 className="text-2xl font-semibold">Understanding Big Numbers</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Operations</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Addition and subtraction</li>
                  <li className="break-words">Multiplication and division</li>
                  <li className="break-words">High precision results</li>
                  <li className="break-words">No rounding errors</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Advanced Operations</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Powers and roots</li>
                  <li className="break-words">Factorial calculations</li>
                  <li className="break-words">Number comparisons</li>
                  <li className="break-words">Absolute differences</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Features</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">50 decimal precision</li>
                  <li className="break-words">Formatted output</li>
                  <li className="break-words">Step-by-step solutions</li>
                  <li className="break-words">Error handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
