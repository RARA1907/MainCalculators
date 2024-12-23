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

export default function DebtToIncomeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Debt-to-Income Ratio Calculator',
      href: '/debt-to-income-ratio-calculator'
    }
  ];

  // State for income
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);

  // State for monthly debts
  const [mortgagePayment, setMortgagePayment] = useState<number>(1200);
  const [carPayment, setCarPayment] = useState<number>(300);
  const [studentLoanPayment, setStudentLoanPayment] = useState<number>(200);
  const [creditCardPayments, setCreditCardPayments] = useState<number>(150);
  const [otherDebts, setOtherDebts] = useState<number>(100);

  // State for results
  const [dtiRatio, setDtiRatio] = useState<number>(0);
  const [totalMonthlyDebts, setTotalMonthlyDebts] = useState<number>(0);
  const [dtiStatus, setDtiStatus] = useState<string>('');

  // Calculate DTI ratio
  const calculateDTI = () => {
    const totalDebts = mortgagePayment + carPayment + studentLoanPayment + 
                      creditCardPayments + otherDebts;
    
    const calculatedDTI = (totalDebts / monthlyIncome) * 100;
    
    // Determine DTI status
    let status = '';
    if (calculatedDTI <= 36) {
      status = 'Excellent';
    } else if (calculatedDTI <= 43) {
      status = 'Good';
    } else if (calculatedDTI <= 50) {
      status = 'Concerning';
    } else {
      status = 'Poor';
    }

    setTotalMonthlyDebts(totalDebts);
    setDtiRatio(calculatedDTI);
    setDtiStatus(status);
  };

  // Chart options for debt breakdown
  const getChartOptions = () => {
    return {
      title: {
        text: 'Monthly Debt Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
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
            { value: mortgagePayment, name: 'Mortgage' },
            { value: carPayment, name: 'Car Payment' },
            { value: studentLoanPayment, name: 'Student Loans' },
            { value: creditCardPayments, name: 'Credit Cards' },
            { value: otherDebts, name: 'Other Debts' }
          ].filter(item => item.value > 0),
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

  // Get status color based on DTI ratio
  const getStatusColor = () => {
    if (dtiRatio <= 36) return 'text-green-500';
    if (dtiRatio <= 43) return 'text-yellow-500';
    if (dtiRatio <= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Debt-to-Income Ratio Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Financial Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Monthly Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Gross Income ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total monthly income before taxes and deductions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <Separator />
                <h3 className="text-lg font-semibold">Monthly Debt Payments</h3>

                {/* Mortgage Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Mortgage/Rent Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your monthly mortgage or rent payment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={mortgagePayment}
                    onChange={(e) => setMortgagePayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Car Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Car Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your monthly car loan payment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={carPayment}
                    onChange={(e) => setCarPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Student Loan Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Student Loan Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your monthly student loan payment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={studentLoanPayment}
                    onChange={(e) => setStudentLoanPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Credit Card Payments Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Credit Card Payments ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total monthly credit card payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={creditCardPayments}
                    onChange={(e) => setCreditCardPayments(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Other Debts Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Other Monthly Debts ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Any other monthly debt payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={otherDebts}
                    onChange={(e) => setOtherDebts(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateDTI}
                >
                  Calculate DTI Ratio
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">DTI Ratio</div>
                    <div className={`stat-value text-lg ${getStatusColor()}`}>
                      {dtiRatio.toFixed(1)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Status</div>
                    <div className={`stat-value text-lg ${getStatusColor()}`}>
                      {dtiStatus}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Monthly Debts</div>
                    <div className="stat-value text-lg">
                      ${totalMonthlyDebts.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Income</div>
                    <div className="stat-value text-lg">
                      ${monthlyIncome.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">DTI Ratio Guide</h3>
                  <ul className="space-y-2">
                    <li className="text-green-500">≤ 36%: Excellent - Ideal for most loans</li>
                    <li className="text-yellow-500">37-43%: Good - Still acceptable for many loans</li>
                    <li className="text-orange-500">44-50%: Concerning - May face lending challenges</li>
                    <li className="text-red-500">&gt; 50%: Poor - Serious financial risk</li>
                  </ul>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Debt Breakdown</h3>
                  <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Your Debt-to-Income Ratio</h2>
              <p className="mb-4">
                Your debt-to-income (DTI) ratio is a key financial metric that compares your monthly debt 
                payments to your monthly gross income. This ratio is one of the main ways lenders evaluate 
                your ability to manage monthly payments and repay debts.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Why DTI Matters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Mortgage Approval</h3>
                    <p>Most mortgage lenders prefer a DTI ratio of 43% or lower</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Financial Health</h3>
                    <p>Lower DTI ratios indicate better financial stability</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Loan Terms</h3>
                    <p>Better DTI ratios often lead to more favorable loan terms</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Credit Applications</h3>
                    <p>Lenders use DTI to assess new credit applications</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How to Improve Your DTI Ratio</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pay down existing debts</li>
                  <li>Increase your income through side jobs or raises</li>
                  <li>Avoid taking on new debt</li>
                  <li>Refinance or consolidate existing debts for lower payments</li>
                  <li>Create and stick to a budget</li>
                  <li>Consider selling assets to pay off debt</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What's Included in DTI Calculations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Included Debts</h3>
                  <ul className="list-disc pl-6">
                    <li>Mortgage or rent payments</li>
                    <li>Car loans</li>
                    <li>Student loans</li>
                    <li>Credit card minimum payments</li>
                    <li>Personal loans</li>
                    <li>Child support or alimony</li>
                  </ul>
                </div>
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Not Included</h3>
                  <ul className="list-disc pl-6">
                    <li>Utilities</li>
                    <li>Insurance premiums</li>
                    <li>Healthcare costs</li>
                    <li>Food and groceries</li>
                    <li>Entertainment expenses</li>
                    <li>Retirement contributions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Managing Your DTI</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Track your monthly debt payments and income carefully</li>
                  <li>Set up automatic payments to avoid missed payments</li>
                  <li>Review your budget regularly to identify areas for improvement</li>
                  <li>Consider debt consolidation if you have multiple high-interest debts</li>
                  <li>Build an emergency fund to avoid taking on new debt</li>
                  <li>Seek professional financial advice if your DTI is too high</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
