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

const breadcrumbItems = [
  {
    label: 'Quadratic Formula Calculator',
    href: '/quadratic-formula-calculator',
  },
];

export default function QuadraticFormulaCalculator() {
  // Calculator state
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [c, setC] = useState<string>('');
  const [decimalPlaces, setDecimalPlaces] = useState<string>('4');
  
  // Results
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Format number with proper decimal places
  const formatNumber = (num: number): string => {
    const places = parseInt(decimalPlaces);
    if (Math.abs(num) < 0.00001) return '0';
    return num.toFixed(places);
  };

  // Format complex number
  const formatComplex = (real: number, imag: number): string => {
    const realPart = formatNumber(real);
    const imagPart = formatNumber(Math.abs(imag));
    
    if (imag === 0) return realPart;
    if (real === 0) return `${imagPart}i`;
    return `${realPart} ${imag > 0 ? '+' : '-'} ${imagPart}i`;
  };

  // Get chart options for visualization
  const getChartOptions = () => {
    if (!a || !b || !c) return {};

    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);

    // Generate points for parabola
    const data: [number, number][] = [];
    const x1 = (-bNum - Math.sqrt(bNum * bNum - 4 * aNum * cNum)) / (2 * aNum);
    const x2 = (-bNum + Math.sqrt(bNum * bNum - 4 * aNum * cNum)) / (2 * aNum);
    const xMin = Math.min(x1, x2) - 2;
    const xMax = Math.max(x1, x2) + 2;
    
    for (let x = xMin; x <= xMax; x += 0.1) {
      const y = aNum * x * x + bNum * x + cNum;
      data.push([x, y]);
    }

    return {
      title: {
        text: `f(x) = ${aNum}x² ${bNum >= 0 ? '+' : ''}${bNum}x ${cNum >= 0 ? '+' : ''}${cNum}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const point = params[0];
          return `(${formatNumber(point.value[0])}, ${formatNumber(point.value[1])})`;
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'x'
      },
      yAxis: {
        type: 'value',
        name: 'y'
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#0EA5E9'
          },
          itemStyle: {
            color: '#0EA5E9'
          }
        }
      ]
    };
  };

  // Calculate quadratic formula
  const calculate = () => {
    try {
      if (!a || !b || !c) {
        throw new Error('Please fill in all coefficients');
      }

      const aNum = parseFloat(a);
      const bNum = parseFloat(b);
      const cNum = parseFloat(c);

      if (aNum === 0) {
        throw new Error('Coefficient "a" cannot be zero (not a quadratic equation)');
      }

      const steps: string[] = [];
      steps.push(`Given quadratic equation: ${aNum}x² ${bNum >= 0 ? '+' : ''}${bNum}x ${cNum >= 0 ? '+' : ''}${cNum} = 0`);
      steps.push('Using quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)');
      steps.push('');

      steps.push('Step 1: Calculate discriminant (b² - 4ac)');
      const discriminant = bNum * bNum - 4 * aNum * cNum;
      steps.push(`b² = ${bNum}² = ${bNum * bNum}`);
      steps.push(`4ac = 4 × ${aNum} × ${cNum} = ${4 * aNum * cNum}`);
      steps.push(`discriminant = ${bNum * bNum} - ${4 * aNum * cNum} = ${discriminant}`);
      steps.push('');

      let resultText = '';
      if (discriminant > 0) {
        // Two real solutions
        const x1 = (-bNum - Math.sqrt(discriminant)) / (2 * aNum);
        const x2 = (-bNum + Math.sqrt(discriminant)) / (2 * aNum);

        steps.push('Step 2: Calculate two real solutions');
        steps.push(`x₁ = (-${bNum} - √${discriminant}) / (2 × ${aNum})`);
        steps.push(`x₁ = ${formatNumber(x1)}`);
        steps.push('');
        steps.push(`x₂ = (-${bNum} + √${discriminant}) / (2 × ${aNum})`);
        steps.push(`x₂ = ${formatNumber(x2)}`);

        resultText = `x₁ = ${formatNumber(x1)}, x₂ = ${formatNumber(x2)}`;
      } else if (discriminant === 0) {
        // One real solution
        const x = -bNum / (2 * aNum);

        steps.push('Step 2: Calculate one real solution (discriminant = 0)');
        steps.push(`x = -${bNum} / (2 × ${aNum})`);
        steps.push(`x = ${formatNumber(x)}`);

        resultText = `x = ${formatNumber(x)}`;
      } else {
        // Complex solutions
        const realPart = -bNum / (2 * aNum);
        const imagPart = Math.sqrt(-discriminant) / (2 * aNum);

        steps.push('Step 2: Calculate complex solutions');
        steps.push(`Real part = -${bNum} / (2 × ${aNum}) = ${formatNumber(realPart)}`);
        steps.push(`Imaginary part = √${-discriminant} / (2 × ${aNum}) = ${formatNumber(imagPart)}`);
        steps.push('');
        steps.push(`x₁ = ${formatComplex(realPart, -imagPart)}`);
        steps.push(`x₂ = ${formatComplex(realPart, imagPart)}`);

        resultText = `x₁ = ${formatComplex(realPart, -imagPart)}, x₂ = ${formatComplex(realPart, imagPart)}`;
      }

      steps.push('');
      if (discriminant > 0) {
        steps.push('Note: Since discriminant > 0, there are two distinct real solutions.');
      } else if (discriminant === 0) {
        steps.push('Note: Since discriminant = 0, there is one repeated real solution.');
      } else {
        steps.push('Note: Since discriminant < 0, there are two complex conjugate solutions.');
      }

      setResult(resultText);
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Quadratic Formula Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center text-sm">
                  Enter coefficients for ax² + bx + c = 0
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">a</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coefficient of x²</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={a}
                      onChange={(e) => setA(e.target.value)}
                      placeholder="Enter a"
                      className="input input-bordered w-full"
                      step="any"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">b</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coefficient of x</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={b}
                      onChange={(e) => setB(e.target.value)}
                      placeholder="Enter b"
                      className="input input-bordered w-full"
                      step="any"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">c</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Constant term</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={c}
                      onChange={(e) => setC(e.target.value)}
                      placeholder="Enter c"
                      className="input input-bordered w-full"
                      step="any"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Decimal Places</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of decimal places (0-15)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={decimalPlaces}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 15) {
                        setDecimalPlaces(e.target.value);
                      }
                    }}
                    min="0"
                    max="15"
                    className="input input-bordered w-full"
                  />
                </div>

                <button
                  onClick={calculate}
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
                    <h3 className="text-sm font-semibold mb-1">Solutions</h3>
                    <div className="text-xl font-bold font-mono break-all overflow-hidden">
                      {result}
                    </div>
                  </div>

                  {/* Visualization */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Graph</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
                    </div>
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
                  Enter coefficients and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Quadratic Equations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Form</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">ax² + bx + c = 0</li>
                  <li className="break-words">a ≠ 0</li>
                  <li className="break-words">x is the variable</li>
                  <li className="break-words">a, b, c are constants</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Quadratic Formula</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">x = (-b ± √(b² - 4ac)) / (2a)</li>
                  <li className="break-words">discriminant = b² - 4ac</li>
                  <li className="break-words">If d  0: two real solutions</li>
                  <li className="break-words">If d = 0: one real solution</li>
                  <li className="break-words">If d  0: two complex solutions</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Examples</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">x² + 2x + 1 = 0 (one solution)</li>
                  <li className="break-words">x² - 4 = 0 (two real solutions)</li>
                  <li className="break-words">x² + 1 = 0 (complex solutions)</li>
                  <li className="break-words">2x² - 3x - 5 = 0 (real solutions)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
