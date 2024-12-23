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
import { ScientificCalculator } from '@/components/calculators/ScientificCalculator';
import { SocialShare } from '@/components/common/SocialShare';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { EmbedDialog } from '@/components/shared/EmbedDialog';

const relatedCalculators = [
  {
    name: 'Basic Calculator',
    description: 'Simple arithmetic calculations for everyday use',
    href: '/basic-calculator'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    href: '/unit-converter'
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, and decreases',
    href: '/percentage-calculator'
  }
];

const breadcrumbItems = [
 
  {
    label: 'Scientific Calculator',
    href: '/scientific-calculator'
  }
];

export default function ScientificCalculatorPage() {
  // Calculator State
  const [display, setDisplay] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [previousOperand, setPreviousOperand] = useState<string>('');
  const [currentOperand, setCurrentOperand] = useState<string>('');
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  // Handle number input
  const handleNumber = (num: string) => {
    if (display === 'Error') {
      setDisplay(num);
      setIsNewNumber(false);
      return;
    }

    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  // Handle operation
  const handleOperation = (op: string) => {
    if (previousOperand && !isNewNumber) {
      handleEquals();
    }
    setPreviousOperand(display);
    setOperation(op);
    setIsNewNumber(true);
  };

  // Handle backspace
  const handleBackspace = () => {
    if (display === 'Error') {
      handleClear();
      return;
    }

    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  // Handle clear
  const handleClear = () => {
    setDisplay('0');
    setPreviousOperand('');
    setOperation(null);
    setIsNewNumber(true);
  };

  // Keyboard event handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;

      // Prevent default behavior for calculator keys
      if (
        /[\d\+\-\*\/\.\(\)=]/.test(key) ||
        key === 'Enter' ||
        key === 'Backspace' ||
        key === 'Delete' ||
        key === 'Escape'
      ) {
        event.preventDefault();
      }

      // Number keys (including numpad)
      if (/^\d$/.test(key) || (key.startsWith('Numpad') && /^\d$/.test(key.slice(-1)))) {
        const digit = key.startsWith('Numpad') ? key.slice(-1) : key;
        handleNumber(digit);
        return;
      }

      // Decimal point (both regular and numpad)
      if (key === '.' || key === 'NumpadDecimal') {
        if (!display.includes('.')) {
          handleNumber('.');
        }
        return;
      }

      // Basic operators (both regular and numpad)
      const operatorMap: { [key: string]: string } = {
        '+': '+',
        'NumpadAdd': '+',
        '-': '-',
        'NumpadSubtract': '-',
        '*': '*',
        'NumpadMultiply': '*',
        '/': '/',
        'NumpadDivide': '/',
        '=': '=',
        'NumpadEnter': '='
      };

      if (key in operatorMap) {
        handleOperation(operatorMap[key]);
        return;
      }

      // Enter key for equals
      if (key === 'Enter' || key === 'NumpadEnter') {
        handleEquals();
        return;
      }

      // Backspace or Delete for delete
      if (key === 'Backspace' || key === 'Delete') {
        handleBackspace();
        return;
      }

      // Escape for clear
      if (key === 'Escape') {
        handleClear();
        return;
      }

      // Scientific functions shortcuts
      const scientificMap: { [key: string]: keyof typeof scientificFunctions } = {
        's': 'sin',
        'c': 'cos',
        't': 'tan',
        'l': 'log',
        'n': 'ln',
        'p': 'pow2',
        'r': 'sqrt'
      };

      if (key.toLowerCase() in scientificMap) {
        handleScientificFunction(scientificMap[key.toLowerCase()]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [display, operation, previousOperand, isNewNumber]);

  // Scientific Functions
  const scientificFunctions = {
    sin: (x: number) => Math.sin(x * Math.PI / 180),
    cos: (x: number) => Math.cos(x * Math.PI / 180),
    tan: (x: number) => Math.tan(x * Math.PI / 180),
    sqrt: (x: number) => Math.sqrt(x),
    log: (x: number) => Math.log10(x),
    ln: (x: number) => Math.log(x),
    exp: (x: number) => Math.exp(x),
    pow2: (x: number) => Math.pow(x, 2),
    pow3: (x: number) => Math.pow(x, 3),
    reciprocal: (x: number) => 1 / x,
  };

  // Update history
  const updateHistory = (calculation: string) => {
    const newHistory = [calculation, ...history].slice(0, 100); // Keep last 100 calculations
    setHistory(newHistory);
    localStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
  };

  // Handle Equals with history update
  const handleEquals = () => {
    if (!operation || !previousOperand) return;

    const prev = parseFloat(previousOperand);
    const current = parseFloat(display);
    let result: number;

    try {
      switch (operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) throw new Error('Cannot divide by zero');
          result = prev / current;
          break;
        default:
          return;
      }

      const calculation = `${prev} ${operation} ${current} = ${result}`;
      updateHistory(calculation);
      setDisplay(result.toString());
      setPreviousOperand('');
      setOperation(null);
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  // Handle Scientific Function with history update
  const handleScientificFunction = (func: keyof typeof scientificFunctions) => {
    try {
      const value = parseFloat(display);
      const result = scientificFunctions[func](value);
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation');
      }

      const calculation = `${func}(${value}) = ${result}`;
      updateHistory(calculation);
      setDisplay(result.toString());
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  // Memory functions
  const handleMemoryOperation = (operation: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    const currentValue = parseFloat(display);
    
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        setIsNewNumber(true);
        break;
      case 'M+':
        setMemory(memory + currentValue);
        updateHistory(`Memory + ${currentValue} = ${memory + currentValue}`);
        setIsNewNumber(true);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        updateHistory(`Memory - ${currentValue} = ${memory - currentValue}`);
        setIsNewNumber(true);
        break;
      case 'MS':
        setMemory(currentValue);
        updateHistory(`Memory Store: ${currentValue}`);
        setIsNewNumber(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Scientific Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculator</h2>
            </CardHeader>
            <CardContent>
              <ScientificCalculator />
            </CardContent>
          </Card>

          {/* History and Help Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">History & Help</h2>
            </CardHeader>
            <CardContent>
              {/* Calculation History */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Calculation History</h3>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem('calculatorHistory');
                    }}
                  >
                    Clear History
                  </button>
                </div>
                <div className="bg-base-200 p-4 rounded-lg h-48 overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div
                        key={index}
                        className="mb-2 font-mono cursor-pointer hover:bg-base-300 p-1 rounded"
                        onClick={() => {
                          const result = item.split('=')[1]?.trim();
                          if (result) {
                            setDisplay(result);
                            setIsNewNumber(true);
                          }
                        }}
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center">
                      No calculation history
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Reference */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Reference</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Trigonometric Functions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>sin, cos, tan</li>
                      <li>asin, acos, atan</li>
                      <li>Switch between DEG/RAD</li>
                    </ul>
                  </div>
                  
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Logarithmic Functions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>log (base 10)</li>
                      <li>ln (natural log)</li>
                      <li>ex (exponential)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Memory Operations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>MC - Memory Clear</li>
                      <li>MR - Memory Recall</li>
                      <li>M+ - Memory Add</li>
                      <li>M- - Memory Subtract</li>
                      <li>MS - Memory Store</li>
                    </ul>
                  </div>
                  
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Constants</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>π (Pi) = 3.14159...</li>
                      <li>e = 2.71828...</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculator Guide</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Operations</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Addition (+)</li>
                    <li>Subtraction (-)</li>
                    <li>Multiplication (×)</li>
                    <li>Division (÷)</li>
                    <li>Square (x²)</li>
                    <li>Cube (x³)</li>
                    <li>Square Root (√)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Scientific Functions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Trigonometric (sin, cos, tan)</li>
                    <li>Inverse Trigonometric</li>
                    <li>Logarithmic (log, ln)</li>
                    <li>Exponential (ex)</li>
                    <li>Factorial (x!)</li>
                    <li>Powers (xy)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tips</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Use DEG/RAD for angle units</li>
                    <li>Memory functions for storing values</li>
                    <li>History tracks calculations</li>
                    <li>Clear (C) to reset</li>
                    <li>Constants (π, e) available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Calculators */}
        <div className="mt-8">
          <RelatedCalculators calculators={relatedCalculators} />
        </div>

      </div>
    </div>
  );
}
