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
import ReactECharts from 'echarts-for-react';

interface Fraction {
  numerator: number;
  denominator: number;
  whole?: number;
}

interface FractionResult {
  result: Fraction;
  steps: string[];
}

const breadcrumbItems = [
  {
    label: 'Fraction Calculator',
    href: '/fraction-calculator',
  },
];

// Add function to generate pie chart options
const getFractionPieChart = (fraction: Fraction, title: string) => {
  const total = fraction.denominator;
  const filled = fraction.numerator;
  const whole = fraction.whole || 0;

  // For mixed numbers, we need to add the whole number * denominator
  const actualFilled = whole * fraction.denominator + filled;

  // Create data for the pie chart
  const data = [];
  
  // Add filled parts
  for (let i = 0; i < actualFilled; i++) {
    data.push({
      value: 1,
      name: 'Filled',
      itemStyle: { color: '#3B82F6' } // Blue for filled parts
    });
  }
  
  // Add empty parts
  for (let i = actualFilled; i < total; i++) {
    data.push({
      value: 1,
      name: 'Empty',
      itemStyle: { color: '#E5E7EB' } // Gray for empty parts
    });
  }

  return {
    title: {
      text: title,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} parts'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '55%'],
        data: data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
};

export default function FractionCalculator() {
  // State for first fraction
  const [firstNumerator, setFirstNumerator] = useState<string>('');
  const [firstDenominator, setFirstDenominator] = useState<string>('');
  const [firstWhole, setFirstWhole] = useState<string>('');

  // State for second fraction
  const [secondNumerator, setSecondNumerator] = useState<string>('');
  const [secondDenominator, setSecondDenominator] = useState<string>('');
  const [secondWhole, setSecondWhole] = useState<string>('');

  // Operation state
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('*');

  // Result state
  const [result, setResult] = useState<FractionResult | null>(null);
  const [error, setError] = useState<string>('');

  // Helper function to find GCD
  const findGCD = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  // Helper function to find LCM
  const findLCM = (a: number, b: number): number => {
    return Math.abs(a * b) / findGCD(a, b);
  };

  // Convert mixed number to improper fraction
  const toImproperFraction = (whole: number, numerator: number, denominator: number): Fraction => {
    const improperNumerator = whole * denominator + numerator;
    return { numerator: improperNumerator, denominator };
  };

  // Convert improper fraction to mixed number
  const toMixedNumber = (numerator: number, denominator: number): Fraction => {
    const whole = Math.floor(Math.abs(numerator) / denominator);
    const newNumerator = Math.abs(numerator) % denominator;
    return {
      whole: numerator < 0 ? -whole : whole,
      numerator: newNumerator,
      denominator,
    };
  };

  // Simplify fraction
  const simplifyFraction = (fraction: Fraction): Fraction => {
    const gcd = findGCD(fraction.numerator, fraction.denominator);
    const simplified = {
      numerator: fraction.numerator / gcd,
      denominator: fraction.denominator / gcd,
    };

    if (Math.abs(simplified.numerator) >= simplified.denominator) {
      return toMixedNumber(simplified.numerator, simplified.denominator);
    }

    return simplified;
  };

  // Perform fraction operation
  const calculateFraction = () => {
    try {
      setError('');
      
      // Convert inputs to numbers
      const f1Whole = firstWhole ? parseInt(firstWhole) : 0;
      const f1Num = parseInt(firstNumerator) || 0;
      const f1Den = parseInt(firstDenominator) || 1;
      
      const f2Whole = secondWhole ? parseInt(secondWhole) : 0;
      const f2Num = parseInt(secondNumerator) || 0;
      const f2Den = parseInt(secondDenominator) || 1;

      // Validate denominators
      if (f1Den === 0 || f2Den === 0) {
        throw new Error('Denominator cannot be zero');
      }

      // Convert to improper fractions
      const f1 = toImproperFraction(f1Whole, f1Num, f1Den);
      const f2 = toImproperFraction(f2Whole, f2Num, f2Den);

      const steps: string[] = [];
      let resultFraction: Fraction;

      steps.push(`Converting mixed numbers to improper fractions:`);
      steps.push(`First fraction: ${f1.numerator}/${f1.denominator}`);
      steps.push(`Second fraction: ${f2.numerator}/${f2.denominator}`);

      switch (operation) {
        case '+':
          const sumLCM = findLCM(f1.denominator, f2.denominator);
          const sum1 = (f1.numerator * (sumLCM / f1.denominator));
          const sum2 = (f2.numerator * (sumLCM / f2.denominator));
          
          steps.push(`Finding LCM of denominators: ${sumLCM}`);
          steps.push(`Converting fractions to same denominator:`);
          steps.push(`${f1.numerator} × ${sumLCM/f1.denominator}/${f1.denominator} × ${sumLCM/f1.denominator} = ${sum1}/${sumLCM}`);
          steps.push(`${f2.numerator} × ${sumLCM/f2.denominator}/${f2.denominator} × ${sumLCM/f2.denominator} = ${sum2}/${sumLCM}`);
          
          resultFraction = {
            numerator: sum1 + sum2,
            denominator: sumLCM,
          };
          break;

        case '-':
          const subLCM = findLCM(f1.denominator, f2.denominator);
          const sub1 = (f1.numerator * (subLCM / f1.denominator));
          const sub2 = (f2.numerator * (subLCM / f2.denominator));
          
          steps.push(`Finding LCM of denominators: ${subLCM}`);
          steps.push(`Converting fractions to same denominator:`);
          steps.push(`${f1.numerator} × ${subLCM/f1.denominator}/${f1.denominator} × ${subLCM/f1.denominator} = ${sub1}/${subLCM}`);
          steps.push(`${f2.numerator} × ${subLCM/f2.denominator}/${f2.denominator} × ${subLCM/f2.denominator} = ${sub2}/${subLCM}`);
          
          resultFraction = {
            numerator: sub1 - sub2,
            denominator: subLCM,
          };
          break;

        case '*':
          resultFraction = {
            numerator: f1.numerator * f2.numerator,
            denominator: f1.denominator * f2.denominator,
          };
          steps.push(`Multiplying numerators: ${f1.numerator} × ${f2.numerator} = ${resultFraction.numerator}`);
          steps.push(`Multiplying denominators: ${f1.denominator} × ${f2.denominator} = ${resultFraction.denominator}`);
          break;

        case '/':
          if (f2.numerator === 0) {
            throw new Error('Cannot divide by zero');
          }
          resultFraction = {
            numerator: f1.numerator * f2.denominator,
            denominator: f1.denominator * f2.numerator,
          };
          steps.push(`Reciprocal of second fraction: ${f2.denominator}/${f2.numerator}`);
          steps.push(`Multiplying first fraction by reciprocal:`);
          steps.push(`${f1.numerator}/${f1.denominator} × ${f2.denominator}/${f2.numerator}`);
          break;

        default:
          throw new Error('Invalid operation');
      }

      // Simplify the result
      const simplifiedResult = simplifyFraction(resultFraction);
      steps.push('Simplifying the result:');
      if (simplifiedResult.whole !== undefined) {
        steps.push(`Final result: ${simplifiedResult.whole} ${simplifiedResult.numerator}/${simplifiedResult.denominator}`);
      } else {
        steps.push(`Final result: ${simplifiedResult.numerator}/${simplifiedResult.denominator}`);
      }

      setResult({ result: simplifiedResult, steps });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Fraction Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Fractions</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* First Fraction */}
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text font-semibold">First Fraction</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={firstWhole}
                      onChange={(e) => setFirstWhole(e.target.value)}
                      placeholder="Whole"
                      className="input input-bordered w-24"
                    />
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={firstNumerator}
                        onChange={(e) => setFirstNumerator(e.target.value)}
                        placeholder="Numerator"
                        className="input input-bordered w-24 mb-1"
                      />
                      <Separator className="w-24" />
                      <input
                        type="number"
                        value={firstDenominator}
                        onChange={(e) => setFirstDenominator(e.target.value)}
                        placeholder="Denominator"
                        className="input input-bordered w-24 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Operation Selection */}
                <div className="flex justify-center space-x-4">
                  {['+', '-', '*', '/'].map((op) => (
                    <button
                      key={op}
                      onClick={() => setOperation(op as '+' | '-' | '*' | '/')}
                      className={`btn btn-circle ${
                        operation === op ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>

                {/* Second Fraction */}
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text font-semibold">Second Fraction</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={secondWhole}
                      onChange={(e) => setSecondWhole(e.target.value)}
                      placeholder="Whole"
                      className="input input-bordered w-24"
                    />
                    <div className="flex flex-col items-center">
                      <input
                        type="number"
                        value={secondNumerator}
                        onChange={(e) => setSecondNumerator(e.target.value)}
                        placeholder="Numerator"
                        className="input input-bordered w-24 mb-1"
                      />
                      <Separator className="w-24" />
                      <input
                        type="number"
                        value={secondDenominator}
                        onChange={(e) => setSecondDenominator(e.target.value)}
                        placeholder="Denominator"
                        className="input input-bordered w-24 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={calculateFraction}
                  className="btn btn-primary w-full"
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
                  {/* Final Result */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Final Result</h3>
                    <div className="text-2xl font-bold">
                      {result.result.whole !== undefined && result.result.whole !== 0 && (
                        <span>{result.result.whole} </span>
                      )}
                      {result.result.numerator}/{result.result.denominator}
                    </div>
                  </div>

                  {/* Fraction Visualizations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Fraction */}
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ReactECharts 
                        option={getFractionPieChart(
                          toImproperFraction(
                            parseInt(firstWhole) || 0,
                            parseInt(firstNumerator) || 0,
                            parseInt(firstDenominator) || 1
                          ),
                          'First Fraction'
                        )}
                        style={{ height: '200px' }}
                      />
                    </div>

                    {/* Operation */}
                    <div className="flex items-center justify-center">
                      <div className="text-4xl font-bold">{operation}</div>
                    </div>

                    {/* Second Fraction */}
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ReactECharts 
                        option={getFractionPieChart(
                          toImproperFraction(
                            parseInt(secondWhole) || 0,
                            parseInt(secondNumerator) || 0,
                            parseInt(secondDenominator) || 1
                          ),
                          'Second Fraction'
                        )}
                        style={{ height: '200px' }}
                      />
                    </div>
                  </div>

                  {/* Result Visualization */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Result Visualization</h3>
                    <ReactECharts 
                      option={getFractionPieChart(result.result, 'Result')}
                      style={{ height: '250px' }}
                    />
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {result.steps.map((step, index) => (
                        <div key={index} className="text-sm">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter fractions and select an operation to see the result
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">How to Use</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Entering Fractions</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Enter whole numbers (optional)</li>
                  <li>Enter numerator (top number)</li>
                  <li>Enter denominator (bottom number)</li>
                  <li>Leave whole number empty for simple fractions</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Operations</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Addition (+)</li>
                  <li>Subtraction (-)</li>
                  <li>Multiplication (×)</li>
                  <li>Division (÷)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Features</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Automatic simplification</li>
                  <li>Mixed number support</li>
                  <li>Step-by-step solutions</li>
                  <li>Error checking</li>
                  <li>Fraction visualization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
