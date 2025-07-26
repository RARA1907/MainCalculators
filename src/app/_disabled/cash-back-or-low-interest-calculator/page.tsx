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

export default function CashBackOrLowInterestCalculator() {
  const breadcrumbItems = [
    {
      label: 'Cash Back or Low Interest Calculator',
      href: '/cash-back-or-low-interest-calculator'
    }
  ];

  // State for inputs
  const [vehiclePrice, setVehiclePrice] = useState<number>(30000);
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [standardRate, setStandardRate] = useState<number>(7.9);
  const [specialRate, setSpecialRate] = useState<number>(1.9);
  const [cashBackAmount, setCashBackAmount] = useState<number>(2500);
  const [salesTax, setSalesTax] = useState<number>(6);

  // State for results
  const [standardPayment, setStandardPayment] = useState<number>(0);
  const [specialPayment, setSpecialPayment] = useState<number>(0);
  const [standardTotalCost, setStandardTotalCost] = useState<number>(0);
  const [specialTotalCost, setSpecialTotalCost] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [betterOption, setBetterOption] = useState<string>('');
  const [breakEvenRate, setBreakEvenRate] = useState<number>(0);

  // Calculate loan details for both scenarios
  const calculateComparison = () => {
    // Calculate taxable amount
    const taxableAmount = vehiclePrice - tradeInValue;
    const taxAmount = taxableAmount * (salesTax / 100);
    
    // Calculate total amount to finance for both scenarios
    const standardAmount = vehiclePrice + taxAmount - downPayment - tradeInValue - cashBackAmount;
    const specialAmount = vehiclePrice + taxAmount - downPayment - tradeInValue;

    // Calculate monthly payments
    const standardMonthlyRate = standardRate / 1200;
    const specialMonthlyRate = specialRate / 1200;

    const standardMonthlyPayment = calculateMonthlyPayment(standardAmount, standardMonthlyRate, loanTerm);
    const specialMonthlyPayment = calculateMonthlyPayment(specialAmount, specialMonthlyRate, loanTerm);

    // Calculate total costs
    const standardTotal = (standardMonthlyPayment * loanTerm) + downPayment + tradeInValue;
    const specialTotal = (specialMonthlyPayment * loanTerm) + downPayment + tradeInValue;

    // Calculate break-even interest rate
    const breakEven = findBreakEvenRate(standardAmount, specialAmount, loanTerm, standardMonthlyPayment);

    setStandardPayment(standardMonthlyPayment);
    setSpecialPayment(specialMonthlyPayment);
    setStandardTotalCost(standardTotal);
    setSpecialTotalCost(specialTotal);
    setSavings(Math.abs(standardTotal - specialTotal));
    setBetterOption(standardTotal < specialTotal ? 'Cash Back' : 'Low Interest');
    setBreakEvenRate(breakEven);
  };

  // Helper function to calculate monthly payment
  const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Helper function to find break-even interest rate
  const findBreakEvenRate = (
    standardAmount: number, 
    specialAmount: number, 
    months: number,
    targetPayment: number
  ): number => {
    let low = 0;
    let high = 30;
    const tolerance = 0.0001;

    while (high - low > tolerance) {
      const mid = (low + high) / 2;
      const monthlyRate = mid / 1200;
      const payment = calculateMonthlyPayment(specialAmount, monthlyRate, months);
      
      if (payment * months < targetPayment * months) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
  };

  // Chart for cost comparison
  const getCostComparisonChart = () => {
    return {
      title: {
        text: 'Total Cost Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const data = params[0];
          return `${data.name}<br/>Total Cost: $${data.value.toLocaleString()}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Cash Back Offer', 'Low Interest Offer'],
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Total Cost ($)',
        axisLabel: {
          formatter: function(value: number) {
            return '$' + value.toLocaleString();
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: [
            {
              value: standardTotalCost,
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: specialTotalCost,
              itemStyle: { color: '#2196F3' }
            }
          ],
          label: {
            show: true,
            position: 'top',
            formatter: function(params: any) {
              return '$' + params.value.toLocaleString();
            }
          }
        }
      ]
    };
  };

  // Chart for monthly payments comparison
  const getMonthlyPaymentsChart = () => {
    return {
      title: {
        text: 'Monthly Payment Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const data = params[0];
          return `${data.name}<br/>Monthly Payment: $${data.value.toLocaleString()}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Cash Back Offer', 'Low Interest Offer'],
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Monthly Payment ($)',
        axisLabel: {
          formatter: function(value: number) {
            return '$' + value.toLocaleString();
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: [
            {
              value: standardPayment,
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: specialPayment,
              itemStyle: { color: '#2196F3' }
            }
          ],
          label: {
            show: true,
            position: 'top',
            formatter: function(params: any) {
              return '$' + params.value.toFixed(2);
            }
          }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Cash Back or Low Interest Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Vehicle & Offer Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Vehicle Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vehicle Price ($)</span>
                  </label>
                  <input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Down Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Down Payment ($)</span>
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                {/* Trade-in Value Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Trade-in Value ($)</span>
                  </label>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                {/* Loan Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (months)</span>
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="select select-bordered w-full"
                  >
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                  </select>
                </div>

                {/* Standard Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Standard Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regular interest rate with cash back offer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={standardRate}
                    onChange={(e) => setStandardRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="30"
                    step="0.1"
                  />
                </div>

                {/* Special Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Special Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Low interest rate offer without cash back</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={specialRate}
                    onChange={(e) => setSpecialRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="30"
                    step="0.1"
                  />
                </div>

                {/* Cash Back Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cash Back Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={cashBackAmount}
                    onChange={(e) => setCashBackAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                {/* Sales Tax Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sales Tax (%)</span>
                  </label>
                  <input
                    type="number"
                    value={salesTax}
                    onChange={(e) => setSalesTax(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="15"
                    step="0.1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateComparison}
                >
                  Compare Options
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Comparison Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Better Option</div>
                    <div className="stat-value text-lg text-green-500">
                      {betterOption}
                    </div>
                    <div className="stat-desc">
                      Saves ${savings.toLocaleString()} over loan term
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Break-even Rate</div>
                    <div className="stat-value text-lg">
                      {breakEvenRate.toFixed(2)}%
                    </div>
                    <div className="stat-desc">
                      Point where options are equal
                    </div>
                  </div>
                </div>

                {/* Detailed Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Cash Back Option</h3>
                    <ul className="space-y-2">
                      <li>Monthly Payment: ${standardPayment.toFixed(2)}</li>
                      <li>Total Cost: ${standardTotalCost.toLocaleString()}</li>
                      <li>Interest Rate: {standardRate}%</li>
                      <li>Cash Back: ${cashBackAmount.toLocaleString()}</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Low Interest Option</h3>
                    <ul className="space-y-2">
                      <li>Monthly Payment: ${specialPayment.toFixed(2)}</li>
                      <li>Total Cost: ${specialTotalCost.toLocaleString()}</li>
                      <li>Interest Rate: {specialRate}%</li>
                      <li>Cash Back: $0</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCostComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getMonthlyPaymentsChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Your Options</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Cash Back vs. Low Interest</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Cash Back Benefits</h4>
                      <ul className="list-disc pl-6">
                        <li>Immediate reduction in purchase price</li>
                        <li>Can be combined with other rebates</li>
                        <li>Good option if you plan to pay off early</li>
                        <li>Better for shorter loan terms</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Low Interest Benefits</h4>
                      <ul className="list-disc pl-6">
                        <li>Lower monthly payments</li>
                        <li>Less total interest paid</li>
                        <li>Better for longer loan terms</li>
                        <li>Good if you plan to keep the loan full term</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Factors to Consider</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Your credit score and qualification for special rates</li>
                      <li>Length of time you plan to keep the loan</li>
                      <li>Current market interest rates</li>
                      <li>Size of the cash back offer</li>
                      <li>Total cost of ownership</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Tips for Decision Making</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Compare total costs, not just monthly payments</li>
                      <li>Consider your long-term financial goals</li>
                      <li>Check if you qualify for special rates before deciding</li>
                      <li>Look for additional manufacturer or dealer incentives</li>
                      <li>Consider refinancing options in the future</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
