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

export default function RefinanceCalculator() {
  const breadcrumbItems = [
    {
      label: 'Refinance Calculator',
      href: '/refinance-calculator'
    }
  ];

  // Current Mortgage State
  const [currentBalance, setCurrentBalance] = useState<number>(300000);
  const [currentRate, setCurrentRate] = useState<number>(6.5);
  const [currentTerm, setCurrentTerm] = useState<number>(30);
  const [monthsRemaining, setMonthsRemaining] = useState<number>(300);
  const [currentPayment, setCurrentPayment] = useState<number>(0);

  // New Mortgage State
  const [newRate, setNewRate] = useState<number>(5.5);
  const [newTerm, setNewTerm] = useState<number>(30);
  const [closingCosts, setClosingCosts] = useState<number>(4000);
  const [newPayment, setNewPayment] = useState<number>(0);

  // Results State
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [breakEvenMonths, setBreakEvenMonths] = useState<number>(0);
  const [lifetimeSavings, setLifetimeSavings] = useState<number>(0);
  const [totalInterestSaved, setTotalInterestSaved] = useState<number>(0);

  const calculateRefinance = () => {
    // Calculate current monthly payment
    const monthlyCurrentRate = currentRate / 100 / 12;
    const currentMonthlyPayment = currentBalance * 
      (monthlyCurrentRate * Math.pow(1 + monthlyCurrentRate, monthsRemaining)) / 
      (Math.pow(1 + monthlyCurrentRate, monthsRemaining) - 1);

    // Calculate new monthly payment
    const monthlyNewRate = newRate / 100 / 12;
    const newMonthlyPayment = currentBalance * 
      (monthlyNewRate * Math.pow(1 + monthlyNewRate, newTerm * 12)) / 
      (Math.pow(1 + monthlyNewRate, newTerm * 12) - 1);

    // Calculate monthly savings
    const monthlySavingsCalc = currentMonthlyPayment - newMonthlyPayment;

    // Calculate break-even point
    const breakEvenMonthsCalc = Math.ceil(closingCosts / monthlySavingsCalc);

    // Calculate total payments for both scenarios
    const totalCurrentPayments = currentMonthlyPayment * monthsRemaining;
    const totalNewPayments = newMonthlyPayment * (newTerm * 12);

    // Calculate lifetime savings
    const lifetimeSavingsCalc = totalCurrentPayments - totalNewPayments - closingCosts;

    // Calculate total interest saved
    const totalCurrentInterest = (currentMonthlyPayment * monthsRemaining) - currentBalance;
    const totalNewInterest = (newMonthlyPayment * (newTerm * 12)) - currentBalance;
    const totalInterestSavedCalc = totalCurrentInterest - totalNewInterest;

    // Update state with calculations
    setCurrentPayment(currentMonthlyPayment);
    setNewPayment(newMonthlyPayment);
    setMonthlySavings(monthlySavingsCalc);
    setBreakEvenMonths(breakEvenMonthsCalc);
    setLifetimeSavings(lifetimeSavingsCalc);
    setTotalInterestSaved(totalInterestSavedCalc);
  };

  // Chart options for payment comparison
  const getPaymentComparisonChart = () => {
    return {
      title: {
        text: 'Monthly Payment Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['Current Mortgage', 'New Mortgage']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: [
            { value: currentPayment, itemStyle: { color: '#ff6b6b' } },
            { value: newPayment, itemStyle: { color: '#51cf66' } }
          ],
          type: 'bar'
        }
      ]
    };
  };

  // Chart options for savings breakdown
  const getSavingsBreakdownChart = () => {
    return {
      title: {
        text: 'Savings Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c}'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: totalInterestSaved, name: 'Interest Saved' },
            { value: closingCosts, name: 'Closing Costs' },
            { value: lifetimeSavings, name: 'Net Savings' }
          ],
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Refinance Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Mortgage Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Mortgage</h3>
                
                {/* Current Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Balance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current mortgage balance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Current Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current mortgage interest rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={currentRate}
                    onChange={(e) => setCurrentRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.125"
                  />
                </div>

                {/* Months Remaining Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Months Remaining</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of months left on your current mortgage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthsRemaining}
                    onChange={(e) => setMonthsRemaining(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <Separator />
                <h3 className="text-lg font-semibold">New Mortgage</h3>

                {/* New Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The interest rate for your new mortgage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.125"
                  />
                </div>

                {/* New Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Loan Term (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The term length of your new mortgage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={newTerm}
                    onChange={(e) => setNewTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Closing Costs Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Closing Costs ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated costs to close the refinance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={closingCosts}
                    onChange={(e) => setClosingCosts(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRefinance}
                >
                  Calculate Refinance Savings
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Refinance Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Savings</div>
                    <div className="stat-value text-lg text-green-500">
                      ${monthlySavings.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Break-even Time</div>
                    <div className="stat-value text-lg">
                      {breakEvenMonths} months
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Lifetime Savings</div>
                    <div className="stat-value text-lg text-green-500">
                      ${lifetimeSavings.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Interest Saved</div>
                    <div className="stat-value text-lg text-green-500">
                      ${totalInterestSaved.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPaymentComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getSavingsBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Mortgage Refinancing</h2>
              <p className="mb-4">
                Refinancing your mortgage means replacing your current loan with a new one, typically 
                with better terms. The main reasons to refinance include getting a lower interest rate, 
                changing your loan term, or accessing home equity.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">When to Consider Refinancing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Lower Interest Rates</h3>
                    <p>When market rates are significantly lower than your current rate</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Improved Credit Score</h3>
                    <p>If your credit score has improved since your original mortgage</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Change Loan Terms</h3>
                    <p>To switch between fixed and adjustable rates or adjust loan length</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Cash-Out Need</h3>
                    <p>When you need to access home equity for major expenses</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Refinancing Costs to Consider</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Application fees</li>
                  <li>Loan origination fees</li>
                  <li>Home appraisal costs</li>
                  <li>Title search and insurance</li>
                  <li>Credit report fees</li>
                  <li>Attorney and notary fees</li>
                  <li>Points (prepaid interest)</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Successful Refinancing</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Shop around with multiple lenders</li>
                  <li>Check your credit score before applying</li>
                  <li>Calculate your break-even point</li>
                  <li>Consider your long-term plans</li>
                  <li>Gather all necessary documentation early</li>
                  <li>Compare APRs, not just interest rates</li>
                  <li>Ask about rate locks</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
