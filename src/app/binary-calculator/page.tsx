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
    description: 'Convert between number systems',
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic',
    description: 'Perform binary arithmetic operations',
  },
  {
    id: 'bitwise',
    name: 'Bitwise',
    description: 'Perform bitwise operations',
  },
];

const breadcrumbItems = [
  {
    label: 'Binary Calculator',
    href: '/binary-calculator',
  },
];

const numberSystems = [
  { id: 'binary', name: 'Binary (Base-2)', base: 2 },
  { id: 'decimal', name: 'Decimal (Base-10)', base: 10 },
  { id: 'octal', name: 'Octal (Base-8)', base: 8 },
  { id: 'hexadecimal', name: 'Hexadecimal (Base-16)', base: 16 },
];

const bitwiseOperations = [
  { id: 'AND', symbol: '&' },
  { id: 'OR', symbol: '|' },
  { id: 'XOR', symbol: '^' },
  { id: 'NOT', symbol: '~' },
  { id: 'LEFT_SHIFT', symbol: '<<' },
  { id: 'RIGHT_SHIFT', symbol: '>>' },
];

export default function BinaryCalculator() {
  // Calculator state
  const [mode, setMode] = useState<'convert' | 'arithmetic' | 'bitwise'>('convert');
  const [fromBase, setFromBase] = useState<number>(10);
  const [toBase, setToBase] = useState<number>(2);
  const [inputNumber, setInputNumber] = useState<string>('');
  const [firstNumber, setFirstNumber] = useState<string>('');
  const [secondNumber, setSecondNumber] = useState<string>('');
  const [operation, setOperation] = useState<string>('+');
  const [bitwiseOp, setBitwiseOp] = useState<string>('AND');
  
  // Results
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Validate binary number
  const isBinaryValid = (num: string): boolean => /^[01]+$/.test(num);
  
  // Validate number for given base
  const isValidForBase = (num: string, base: number): boolean => {
    const regex = base === 16 
      ? /^[0-9A-Fa-f]+$/
      : new RegExp(`^[0-${base - 1}]+$`);
    return regex.test(num);
  };

  // Convert number between bases
  const convertNumber = () => {
    try {
      if (!inputNumber) {
        throw new Error('Please enter a number');
      }

      if (!isValidForBase(inputNumber, fromBase)) {
        throw new Error(`Invalid number for base-${fromBase}`);
      }

      const decimal = parseInt(inputNumber, fromBase);
      const converted = decimal.toString(toBase);

      const steps = [
        `Step 1: Parse input number (${inputNumber})base-${fromBase}`,
        `Step 2: Convert to decimal: ${decimal}`,
        `Step 3: Convert decimal to base-${toBase}: ${converted}`,
        '',
        'Representations in all bases:',
        `Binary (base-2): ${decimal.toString(2)}`,
        `Octal (base-8): ${decimal.toString(8)}`,
        `Decimal (base-10): ${decimal}`,
        `Hexadecimal (base-16): ${decimal.toString(16).toUpperCase()}`
      ];

      setResult(converted.toUpperCase());
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Perform binary arithmetic
  const calculateArithmetic = () => {
    try {
      if (!firstNumber || !secondNumber) {
        throw new Error('Please enter both numbers');
      }

      if (!isBinaryValid(firstNumber) || !isBinaryValid(secondNumber)) {
        throw new Error('Please enter valid binary numbers (0s and 1s only)');
      }

      const num1 = parseInt(firstNumber, 2);
      const num2 = parseInt(secondNumber, 2);
      let result: number;
      let operationName: string;

      switch (operation) {
        case '+':
          result = num1 + num2;
          operationName = 'Addition';
          break;
        case '-':
          result = num1 - num2;
          operationName = 'Subtraction';
          break;
        case '*':
          result = num1 * num2;
          operationName = 'Multiplication';
          break;
        case '/':
          if (num2 === 0) throw new Error('Division by zero');
          result = Math.floor(num1 / num2);
          operationName = 'Division';
          break;
        default:
          throw new Error('Invalid operation');
      }

      const steps = [
        `Step 1: Convert first binary number to decimal`,
        `${firstNumber}(2) = ${num1}(10)`,
        '',
        `Step 2: Convert second binary number to decimal`,
        `${secondNumber}(2) = ${num2}(10)`,
        '',
        `Step 3: Perform ${operationName} in decimal`,
        `${num1} ${operation} ${num2} = ${result}`,
        '',
        `Step 4: Convert result to binary`,
        `${result}(10) = ${result.toString(2)}(2)`
      ];

      setResult(result.toString(2));
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult('');
      setSteps([]);
    }
  };

  // Perform bitwise operations
  const calculateBitwise = () => {
    try {
      if (bitwiseOp === 'NOT') {
        if (!firstNumber) {
          throw new Error('Please enter a number');
        }
        if (!isBinaryValid(firstNumber)) {
          throw new Error('Please enter a valid binary number (0s and 1s only)');
        }
      } else {
        if (!firstNumber || !secondNumber) {
          throw new Error('Please enter both numbers');
        }
        if (!isBinaryValid(firstNumber) || !isBinaryValid(secondNumber)) {
          throw new Error('Please enter valid binary numbers (0s and 1s only)');
        }
      }

      const num1 = parseInt(firstNumber, 2);
      const num2 = bitwiseOp !== 'NOT' ? parseInt(secondNumber, 2) : 0;
      let result: number;

      switch (bitwiseOp) {
        case 'AND':
          result = num1 & num2;
          break;
        case 'OR':
          result = num1 | num2;
          break;
        case 'XOR':
          result = num1 ^ num2;
          break;
        case 'NOT':
          // Using 32-bit NOT operation
          result = ~num1 & ((1 << 32) - 1);
          break;
        case 'LEFT_SHIFT':
          result = num1 << num2;
          break;
        case 'RIGHT_SHIFT':
          result = num1 >> num2;
          break;
        default:
          throw new Error('Invalid operation');
      }

      const steps = [
        `Step 1: Convert binary numbers to decimal`,
        `First number: ${firstNumber}(2) = ${num1}(10)`,
        bitwiseOp !== 'NOT' ? `Second number: ${secondNumber}(2) = ${num2}(10)` : '',
        '',
        `Step 2: Perform ${bitwiseOp} operation`,
        `Operation: ${bitwiseOp}`,
        `Result in decimal: ${result}`,
        '',
        `Step 3: Convert result to binary`,
        `${result}(10) = ${result.toString(2)}(2)`
      ].filter(Boolean);

      setResult(result.toString(2));
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Binary Calculator</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id as 'convert' | 'arithmetic' | 'bitwise');
                        setResult('');
                        setSteps([]);
                        setError('');
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

                {/* Conversion Mode */}
                {mode === 'convert' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">From</span>
                        </label>
                        <select
                          value={fromBase}
                          onChange={(e) => setFromBase(parseInt(e.target.value))}
                          className="select select-bordered w-full"
                        >
                          {numberSystems.map((system) => (
                            <option key={system.id} value={system.base}>
                              {system.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">To</span>
                        </label>
                        <select
                          value={toBase}
                          onChange={(e) => setToBase(parseInt(e.target.value))}
                          className="select select-bordered w-full"
                        >
                          {numberSystems.map((system) => (
                            <option key={system.id} value={system.base}>
                              {system.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Number to Convert</span>
                      </label>
                      <input
                        type="text"
                        value={inputNumber}
                        onChange={(e) => setInputNumber(e.target.value.toUpperCase())}
                        placeholder={`Enter ${numberSystems.find(s => s.base === fromBase)?.name} number`}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Arithmetic Mode */}
                {mode === 'arithmetic' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Binary Number</span>
                      </label>
                      <input
                        type="text"
                        value={firstNumber}
                        onChange={(e) => setFirstNumber(e.target.value)}
                        placeholder="Enter binary number (e.g., 1010)"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Operation</span>
                      </label>
                      <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="+">Addition (+)</option>
                        <option value="-">Subtraction (-)</option>
                        <option value="*">Multiplication (*)</option>
                        <option value="/">Division (/)</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Second Binary Number</span>
                      </label>
                      <input
                        type="text"
                        value={secondNumber}
                        onChange={(e) => setSecondNumber(e.target.value)}
                        placeholder="Enter binary number (e.g., 1010)"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Bitwise Mode */}
                {mode === 'bitwise' && (
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Binary Number</span>
                      </label>
                      <input
                        type="text"
                        value={firstNumber}
                        onChange={(e) => setFirstNumber(e.target.value)}
                        placeholder="Enter binary number (e.g., 1010)"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Operation</span>
                      </label>
                      <select
                        value={bitwiseOp}
                        onChange={(e) => setBitwiseOp(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        {bitwiseOperations.map((op) => (
                          <option key={op.id} value={op.id}>
                            {op.id} ({op.symbol})
                          </option>
                        ))}
                      </select>
                    </div>
                    {bitwiseOp !== 'NOT' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Second Binary Number</span>
                        </label>
                        <input
                          type="text"
                          value={secondNumber}
                          onChange={(e) => setSecondNumber(e.target.value)}
                          placeholder="Enter binary number (e.g., 1010)"
                          className="input input-bordered w-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    switch (mode) {
                      case 'convert':
                        convertNumber();
                        break;
                      case 'arithmetic':
                        calculateArithmetic();
                        break;
                      case 'bitwise':
                        calculateBitwise();
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
                    <h3 className="text-sm font-semibold mb-1">Result</h3>
                    <div className="text-2xl font-bold font-mono">
                      {result}
                    </div>
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="text-sm font-mono">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Binary Operations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Number Systems</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Binary: Base-2 (0,1)</li>
                  <li>Octal: Base-8 (0-7)</li>
                  <li>Decimal: Base-10 (0-9)</li>
                  <li>Hexadecimal: Base-16 (0-9,A-F)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Arithmetic Operations</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Addition: 1 + 1 = 10 (binary)</li>
                  <li>Subtraction: Uses 2's complement</li>
                  <li>Multiplication: Similar to decimal</li>
                  <li>Division: Returns quotient only</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Bitwise Operations</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>AND (&): 1 if both bits are 1</li>
                  <li>OR (|): 1 if any bit is 1</li>
                  <li>XOR (^): 1 if bits are different</li>
                  <li>NOT (~): Inverts all bits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
