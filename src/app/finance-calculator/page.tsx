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

type CalculationType = 'FV' | 'PMT' | 'IY' | 'N' | 'PV';

export default function FinanceCalculator() {
  const breadcrumbItems = [
    {
      label: 'Finance Calculator',
      href: '/finance-calculator'
    }
  ];

  // Calculator State
  const [calculationType, setCalculationType] = useState<CalculationType>('FV');
  const [presentValue, setPresentValue] = useState<number>(10000);
  const [futureValue, setFutureValue] = useState<number>(0);
  const [periodicPayment, setPeriodicPayment] = useState<number>(100);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [periods, setPeriods] = useState<number>(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('annual');
  const [paymentType, setPaymentType] = useState<'beginning' | 'end'>('end');

  // Results
  const [result, setResult] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculate = () => {
    let calculatedValue = 0;
    let yearlyBalances = [];

    const i = interestRate / 100;
    const n = periods;
    const pmt = periodicPayment;
    const pv = presentValue;
    const fv = futureValue;
    const paymentFactor = paymentType === 'beginning' ? 1 : 0;

    switch (calculationType) {
      case 'FV':
        // Calculate Future Value
        calculatedValue = calculateFV(pv, pmt, i, n, paymentFactor);
        break;
      case 'PMT':
        // Calculate Payment
        calculatedValue = calculatePMT(pv, fv, i, n, paymentFactor);
        break;
      case 'IY':
        // Calculate Interest Rate (using numerical method)
        calculatedValue = calculateInterestRate(pv, fv, pmt, n, paymentFactor);
        break;
      case 'N':
        // Calculate Number of Periods (using numerical method)
        calculatedValue = calculatePeriods(pv, fv, pmt, i, paymentFactor);
        break;
      case 'PV':
        // Calculate Present Value
        calculatedValue = calculatePV(fv, pmt, i, n, paymentFactor);
        break;
    }

    setResult(calculatedValue);
    generateYearlyData(calculatedValue);
  };

  const calculateFV = (pv: number, pmt: number, i: number, n: number, type: number): number => {
    const fvPV = pv * Math.pow(1 + i, n);
    const fvPMT = pmt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i * type);
    return fvPV + fvPMT;
  };

  const calculatePMT = (pv: number, fv: number, i: number, n: number, type: number): number => {
    return (fv - pv * Math.pow(1 + i, n)) / (((Math.pow(1 + i, n) - 1) / i) * (1 + i * type));
  };

  const calculatePV = (fv: number, pmt: number, i: number, n: number, type: number): number => {
    const pvFV = fv / Math.pow(1 + i, n);
    const pvPMT = pmt * (((Math.pow(1 + i, n) - 1) / i) * (1 + i * type)) / Math.pow(1 + i, n);
    return pvFV - pvPMT;
  };

  const calculateInterestRate = (pv: number, fv: number, pmt: number, n: number, type: number): number => {
    // Newton-Raphson method to find interest rate
    let guess = 0.1; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    let iteration = 0;

    while (iteration < maxIterations) {
      const f = calculateFV(pv, pmt, guess, n, type) - fv;
      const df = n * pv * Math.pow(1 + guess, n - 1) + 
                 pmt * (n * Math.pow(1 + guess, n - 1) / guess - 
                 (Math.pow(1 + guess, n) - 1) / (guess * guess)) * (1 + guess * type);
      
      const newGuess = guess - f / df;
      
      if (Math.abs(newGuess - guess) < tolerance) {
        return newGuess * 100; // Convert to percentage
      }
      
      guess = newGuess;
      iteration++;
    }

    return 0; // Return 0 if no solution found
  };

  const calculatePeriods = (pv: number, fv: number, pmt: number, i: number, type: number): number => {
    // Use logarithm for simple cases
    if (pmt === 0) {
      return Math.log(fv / pv) / Math.log(1 + i);
    }

    // Newton-Raphson method for cases with payments
    let guess = 10; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    let iteration = 0;

    while (iteration < maxIterations) {
      const f = calculateFV(pv, pmt, i, guess, type) - fv;
      const df = pv * Math.pow(1 + i, guess) * Math.log(1 + i) +
                 pmt * (Math.pow(1 + i, guess) * Math.log(1 + i) / i);
      
      const newGuess = guess - f / df;
      
      if (Math.abs(newGuess - guess) < tolerance) {
        return newGuess;
      }
      
      guess = newGuess;
      iteration++;
    }

    return 0; // Return 0 if no solution found
  };

  const generateYearlyData = (calculatedValue: number) => {
    const data = [];
    const i = interestRate / 100;
    const n = periods;
    const pmt = periodicPayment;
    const pv = presentValue;
    const type = paymentType === 'beginning' ? 1 : 0;

    for (let year = 0; year <= n; year++) {
      let balance;
      switch (calculationType) {
        case 'FV':
          balance = calculateFV(pv, pmt, i, year, type);
          break;
        case 'PV':
          balance = calculateFV(calculatedValue, pmt, i, year, type);
          break;
        case 'PMT':
          balance = calculateFV(pv, calculatedValue, i, year, type);
          break;
        case 'IY':
          balance = calculateFV(pv, pmt, calculatedValue / 100, year, type);
          break;
        case 'N':
          if (year <= calculatedValue) {
            balance = calculateFV(pv, pmt, i, year, type);
          }
          break;
        default:
          balance = 0;
      }
      data.push({
        year,
        balance: balance || 0
      });
    }
    setYearlyData(data);
  };

  // Chart for growth visualization
  const getGrowthChart = () => {
    const years = yearlyData.map(data => data.year);
    const balances = yearlyData.map(data => data.balance);

    return {
      title: {
        text: 'Growth Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          return `Year ${params[0].axisValue}<br/>Balance: $${params[0].value.toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Years'
      },
      yAxis: {
        type: 'value',
        name: 'Amount ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Balance',
          type: 'line',
          data: balances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' },
          areaStyle: {
            opacity: 0.2
          }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Finance Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Financial Values</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calculator Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calculate</span>
                  </label>
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                    className="select select-bordered w-full"
                  >
                    <option value="FV">Future Value (FV)</option>
                    <option value="PMT">Periodic Payment (PMT)</option>
                    <option value="IY">Interest Rate (I/Y)</option>
                    <option value="N">Number of Periods (N)</option>
                    <option value="PV">Present Value (PV)</option>
                  </select>
                </div>

                {/* Present Value Input */}
                {calculationType !== 'PV' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Present Value (PV)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Initial investment amount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={presentValue}
                      onChange={(e) => setPresentValue(Number(e.target.value))}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                {/* Future Value Input */}
                {calculationType !== 'FV' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Future Value (FV)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Target amount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={futureValue}
                      onChange={(e) => setFutureValue(Number(e.target.value))}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                {/* Payment Input */}
                {calculationType !== 'PMT' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Periodic Payment (PMT)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Regular payment amount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={periodicPayment}
                      onChange={(e) => setPeriodicPayment(Number(e.target.value))}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                {/* Interest Rate Input */}
                {calculationType !== 'IY' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Interest Rate (I/Y) %</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Annual interest rate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="input input-bordered w-full"
                      step="0.1"
                    />
                  </div>
                )}

                {/* Number of Periods Input */}
                {calculationType !== 'N' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number of Periods (N)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total number of periods</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <input
                      type="number"
                      value={periods}
                      onChange={(e) => setPeriods(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="1"
                    />
                  </div>
                )}

                {/* Payment Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Timing</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>When payments are made</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as 'beginning' | 'end')}
                    className="select select-bordered w-full"
                  >
                    <option value="beginning">Beginning of Period</option>
                    <option value="end">End of Period</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculate}
                >
                  Calculate
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">
                    {calculationType === 'FV' ? 'Future Value' :
                     calculationType === 'PMT' ? 'Periodic Payment' :
                     calculationType === 'IY' ? 'Interest Rate' :
                     calculationType === 'N' ? 'Number of Periods' :
                     'Present Value'}
                  </div>
                  <div className="stat-value text-lg">
                    {calculationType === 'IY' ? 
                      `${result.toFixed(2)}%` :
                      calculationType === 'N' ?
                      `${result.toFixed(2)} periods` :
                      `$${result.toFixed(2)}`
                    }
                  </div>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <ReactECharts option={getGrowthChart()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Time Value of Money</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Key Components</h3>
                    <ul className="list-disc pl-6">
                      <li>Present Value (PV)</li>
                      <li>Future Value (FV)</li>
                      <li>Periodic Payment (PMT)</li>
                      <li>Interest Rate (I/Y)</li>
                      <li>Number of Periods (N)</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Common Applications</h3>
                    <ul className="list-disc pl-6">
                      <li>Investment Planning</li>
                      <li>Loan Calculations</li>
                      <li>Retirement Planning</li>
                      <li>Business Valuations</li>
                      <li>Financial Analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Calculator Functions</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Future Value (FV):</strong> Calculate the future worth of an investment
                  </li>
                  <li>
                    <strong>Present Value (PV):</strong> Determine today's value of future money
                  </li>
                  <li>
                    <strong>Payment (PMT):</strong> Calculate periodic payment amounts
                  </li>
                  <li>
                    <strong>Interest Rate (I/Y):</strong> Find the rate of return
                  </li>
                  <li>
                    <strong>Number of Periods (N):</strong> Calculate the time needed
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Using the Calculator</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enter known values accurately</li>
                  <li>Consider payment timing (beginning vs. end of period)</li>
                  <li>Use consistent period units (monthly, annually, etc.)</li>
                  <li>Account for inflation in long-term calculations</li>
                  <li>Verify results with alternative methods</li>
                  <li>Consider tax implications</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
