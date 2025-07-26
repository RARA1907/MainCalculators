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

export default function APRCalculator() {
  const breadcrumbItems = [
    {
      label: 'APR Calculator',
      href: '/apr-calculator'
    }
  ];

  // Loan Details
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');

  // Fees and Charges
  const [originationFee, setOriginationFee] = useState<number>(2000);
  const [applicationFee, setApplicationFee] = useState<number>(500);
  const [brokerFee, setBrokerFee] = useState<number>(1500);
  const [otherFees, setOtherFees] = useState<number>(1000);

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const calculateAPR = () => {
    // Calculate total fees
    const totalFeesCalc = originationFee + applicationFee + brokerFee + otherFees;
    setTotalFees(totalFeesCalc);

    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPaymentCalc = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate total cost
    const totalCostCalc = (monthlyPaymentCalc * numberOfPayments) + totalFeesCalc;
    const totalInterestCalc = (monthlyPaymentCalc * numberOfPayments) - loanAmount;

    // Calculate APR using iterative method
    let aprGuess = interestRate;
    const tolerance = 0.0001;
    let maxIterations = 100;
    
    while (maxIterations > 0) {
      const monthlyAprRate = aprGuess / 100 / 12;
      const presentValue = monthlyPaymentCalc * 
        (1 - Math.pow(1 + monthlyAprRate, -numberOfPayments)) / monthlyAprRate;
      
      if (Math.abs(presentValue - (loanAmount - totalFeesCalc)) < tolerance) {
        break;
      }

      if (presentValue > (loanAmount - totalFeesCalc)) {
        aprGuess += 0.01;
      } else {
        aprGuess -= 0.01;
      }

      maxIterations--;
    }

    // Update state with calculations
    setMonthlyPayment(monthlyPaymentCalc);
    setTotalCost(totalCostCalc);
    setApr(aprGuess);
    setTotalInterest(totalInterestCalc);
  };

  // Chart for cost breakdown
  const getCostBreakdownChart = () => {
    return {
      title: {
        text: 'Loan Cost Breakdown',
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
            { value: loanAmount, name: 'Principal' },
            { value: totalInterest, name: 'Total Interest' },
            { value: totalFees, name: 'Total Fees' }
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

  // Chart for APR vs Interest Rate comparison
  const getRateComparisonChart = () => {
    return {
      title: {
        text: 'APR vs Interest Rate',
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
        data: ['Interest Rate', 'APR']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          data: [
            { value: interestRate, itemStyle: { color: '#4CAF50' } },
            { value: apr, itemStyle: { color: '#2196F3' } }
          ],
          type: 'bar'
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">APR Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Details & Fees</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Loan Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Amount ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The total amount you want to borrow</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
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
                          <p>The nominal interest rate for the loan</p>
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

                {/* Loan Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The length of the loan in years</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <Separator />
                <h3 className="text-lg font-semibold">Fees and Charges</h3>

                {/* Origination Fee Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Origination Fee ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fee charged for processing the loan application</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={originationFee}
                    onChange={(e) => setOriginationFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Application Fee Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Application Fee ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fee for submitting the loan application</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={applicationFee}
                    onChange={(e) => setApplicationFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Other Fees Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Other Fees ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Any additional fees or charges</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={otherFees}
                    onChange={(e) => setOtherFees(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateAPR}
                >
                  Calculate APR
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">APR Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">APR</div>
                    <div className="stat-value text-lg text-blue-500">
                      {apr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${totalCost.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Fees</div>
                    <div className="stat-value text-lg">
                      ${totalFees.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCostBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getRateComparisonChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding APR</h2>
              <p className="mb-4">
                Annual Percentage Rate (APR) represents the true cost of borrowing by including both 
                the interest rate and additional fees. It helps you compare different loan offers on 
                an equal basis, even when they have different fee structures.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Common Loan Fees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Origination Fees</h3>
                    <p>Charged by lenders for processing new loan applications</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Application Fees</h3>
                    <p>Covers the cost of processing your application and credit check</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Broker Fees</h3>
                    <p>Paid to mortgage brokers for finding and arranging your loan</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Points</h3>
                    <p>Optional upfront fees paid to reduce your interest rate</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">APR vs. Interest Rate</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Interest rate only shows the cost of borrowing the principal</li>
                  <li>APR includes both the interest rate and other loan costs</li>
                  <li>APR is typically higher than the interest rate</li>
                  <li>APR provides a more accurate picture of total loan costs</li>
                  <li>Required by law to be disclosed to borrowers</li>
                  <li>Helps compare loans with different fee structures</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Evaluating Loans</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compare APRs from multiple lenders</li>
                  <li>Ask for a breakdown of all fees</li>
                  <li>Consider how long you plan to keep the loan</li>
                  <li>Look at both monthly payments and total cost</li>
                  <li>Understand which fees are negotiable</li>
                  <li>Check if fees can be rolled into the loan</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
