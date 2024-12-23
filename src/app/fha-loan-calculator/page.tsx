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

export default function FHALoanCalculator() {
  const breadcrumbItems = [
    {
      label: 'FHA Loan Calculator',
      href: '/fha-loan-calculator'
    }
  ];

  // Property Details
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPaymentAmount] = useState<number>(10500);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(3.5);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  // FHA Specific
  const [upfrontMIPRate, setUpfrontMIPRate] = useState<number>(1.75);
  const [annualMIPRate, setAnnualMIPRate] = useState<number>(0.85);
  const [creditScore, setCreditScore] = useState<number>(680);

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [upfrontMIP, setUpfrontMIP] = useState<number>(0);
  const [monthlyMIP, setMonthlyMIP] = useState<number>(0);
  const [totalMIP, setTotalMIP] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(true);
  const [eligibilityMessage, setEligibilityMessage] = useState<string>('');

  const updateDownPayment = (amount: number, percent: boolean) => {
    if (percent) {
      const newPercent = amount;
      const newAmount = (homePrice * newPercent) / 100;
      setDownPaymentAmount(newAmount);
      setDownPaymentPercent(newPercent);
    } else {
      const newAmount = amount;
      const newPercent = (newAmount / homePrice) * 100;
      setDownPaymentAmount(newAmount);
      setDownPaymentPercent(newPercent);
    }
  };

  const checkEligibility = () => {
    let eligible = true;
    let message = 'You appear to be eligible for an FHA loan.';

    // Check credit score
    if (creditScore < 500) {
      eligible = false;
      message = 'Credit score must be at least 500 for FHA loan eligibility.';
    } else if (creditScore < 580 && downPaymentPercent < 10) {
      eligible = false;
      message = 'Credit scores between 500-579 require a 10% down payment.';
    }

    // Check down payment
    if (downPaymentPercent < 3.5) {
      eligible = false;
      message = 'Minimum down payment for FHA loans is 3.5% with credit score ≥ 580.';
    }

    setIsEligible(eligible);
    setEligibilityMessage(message);
    return eligible;
  };

  const calculateFHALoan = () => {
    if (!checkEligibility()) return;

    // Calculate base loan amount
    const baseAmount = homePrice - downPaymentAmount;
    setLoanAmount(baseAmount);

    // Calculate Upfront MIP
    const upfrontMIPAmount = (baseAmount * upfrontMIPRate) / 100;
    setUpfrontMIP(upfrontMIPAmount);

    // Calculate total loan amount including upfront MIP
    const totalLoanAmount = baseAmount + upfrontMIPAmount;

    // Calculate monthly principal and interest payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPandI = totalLoanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate monthly MIP
    const monthlyMIPAmount = (baseAmount * (annualMIPRate / 100)) / 12;
    setMonthlyMIP(monthlyMIPAmount);

    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPandI + monthlyMIPAmount;
    setMonthlyPayment(totalMonthlyPayment);

    // Calculate total MIP over loan term
    const totalMIPAmount = upfrontMIPAmount + (monthlyMIPAmount * numberOfPayments);
    setTotalMIP(totalMIPAmount);

    // Calculate total payment over loan term
    const totalPaymentAmount = (totalMonthlyPayment * numberOfPayments) + upfrontMIPAmount;
    setTotalPayment(totalPaymentAmount);
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    return {
      title: {
        text: 'Monthly Payment Breakdown',
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
            { 
              value: monthlyPayment - monthlyMIP, 
              name: 'Principal & Interest',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: monthlyMIP, 
              name: 'Monthly MIP',
              itemStyle: { color: '#2196F3' }
            }
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

  // Chart for total cost breakdown
  const getTotalCostChart = () => {
    const principal = loanAmount;
    const totalInterest = totalPayment - principal - totalMIP;

    return {
      title: {
        text: 'Total Cost Breakdown',
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
            { 
              value: principal, 
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: totalInterest, 
              name: 'Total Interest',
              itemStyle: { color: '#2196F3' }
            },
            { 
              value: totalMIP, 
              name: 'Total MIP',
              itemStyle: { color: '#9C27B0' }
            }
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">FHA Loan Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Home Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Home Price ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The total purchase price of the home</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => {
                      setHomePrice(Number(e.target.value));
                      updateDownPayment(downPaymentPercent, true);
                    }}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Down Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Down Payment</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum 3.5% for credit scores ≥ 580, 10% for scores 500-579</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={downPaymentAmount}
                      onChange={(e) => updateDownPayment(Number(e.target.value), false)}
                      className="input input-bordered w-1/2"
                      min="0"
                      placeholder="Amount ($)"
                    />
                    <input
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => updateDownPayment(Number(e.target.value), true)}
                      className="input input-bordered w-1/2"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Percentage (%)"
                    />
                  </div>
                </div>

                {/* Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual interest rate for the FHA loan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.125"
                  />
                </div>

                {/* Credit Score Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Credit Score</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum 500 required, affects down payment requirement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="300"
                    max="850"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateFHALoan}
                >
                  Calculate FHA Loan
                </button>

                {/* Eligibility Message */}
                {eligibilityMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${isEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {eligibilityMessage}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly MIP</div>
                    <div className="stat-value text-lg">
                      ${monthlyMIP.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Upfront MIP</div>
                    <div className="stat-value text-lg">
                      ${upfrontMIP.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total MIP</div>
                    <div className="stat-value text-lg">
                      ${totalMIP.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPaymentBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getTotalCostChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding FHA Loans</h2>
              <p className="mb-4">
                FHA loans are government-backed mortgages designed to help first-time homebuyers and 
                those with lower credit scores or limited down payments purchase a home. They typically 
                offer more flexible qualifying requirements than conventional loans.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">FHA Loan Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Credit Score</h3>
                    <ul className="list-disc pl-6">
                      <li>Minimum 580 for 3.5% down payment</li>
                      <li>500-579 requires 10% down payment</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Down Payment</h3>
                    <ul className="list-disc pl-6">
                      <li>As low as 3.5% with good credit</li>
                      <li>Can come from gifts or grants</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Mortgage Insurance Premium (MIP)</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Two Types of MIP:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Upfront MIP (UFMIP):</strong>
                    <ul className="pl-6 mt-2">
                      <li>1.75% of the base loan amount</li>
                      <li>Can be financed into the loan</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Annual MIP:</strong>
                    <ul className="pl-6 mt-2">
                      <li>0.85% for most loans</li>
                      <li>Paid monthly with mortgage payment</li>
                      <li>Required for the life of the loan in most cases</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">FHA Loan Benefits</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Lower credit score requirements</li>
                  <li>Smaller down payment needed</li>
                  <li>Competitive interest rates</li>
                  <li>Flexible debt-to-income ratios</li>
                  <li>Assumable by qualified buyers</li>
                  <li>Can be used for various property types</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
