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

export default function VAMortgageCalculator() {
  const breadcrumbItems = [
    {
      label: 'VA Mortgage Calculator',
      href: '/va-mortgage-calculator'
    }
  ];

  // Property Details
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);
  const [downPayment, setDownPaymentAmount] = useState<number>(30000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  // VA Specific
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [serviceType, setServiceType] = useState<string>('regular');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [fundingFeeRate, setFundingFeeRate] = useState<number>(2.3);

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [fundingFee, setFundingFee] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

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
    updateFundingFee();
  };

  const updateFundingFee = () => {
    let rate = 2.3; // Default rate for first-time use

    if (isDisabled) {
      rate = 0; // Disabled veterans are exempt
    } else {
      if (isFirstTime) {
        if (downPaymentPercent >= 10) {
          rate = 1.4;
        } else if (downPaymentPercent >= 5) {
          rate = 1.65;
        } else {
          rate = 2.3;
        }
      } else {
        if (downPaymentPercent >= 10) {
          rate = 1.4;
        } else if (downPaymentPercent >= 5) {
          rate = 1.65;
        } else {
          rate = 3.6;
        }
      }
    }

    setFundingFeeRate(rate);
  };

  const calculateVALoan = () => {
    // Calculate base loan amount
    const baseAmount = homePrice - downPayment;
    setLoanAmount(baseAmount);

    // Calculate VA Funding Fee
    const fundingFeeAmount = (baseAmount * fundingFeeRate) / 100;
    setFundingFee(fundingFeeAmount);

    // Calculate total loan amount including funding fee
    const totalLoanAmount = baseAmount + fundingFeeAmount;

    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPaymentCalc = totalLoanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    setMonthlyPayment(monthlyPaymentCalc);

    // Calculate total payment over loan term
    const totalPaymentAmount = monthlyPaymentCalc * numberOfPayments;
    setTotalPayment(totalPaymentAmount);

    // Calculate total interest
    const totalInterestAmount = totalPaymentAmount - totalLoanAmount;
    setTotalInterest(totalInterestAmount);
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
              value: monthlyPayment, 
              name: 'Principal & Interest',
              itemStyle: { color: '#4CAF50' }
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
              value: loanAmount, 
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: totalInterest, 
              name: 'Total Interest',
              itemStyle: { color: '#2196F3' }
            },
            { 
              value: fundingFee, 
              name: 'VA Funding Fee',
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">VA Mortgage Calculator</h1>
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
                    <span className="label-text">Down Payment (Optional)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>VA loans don't require a down payment, but making one reduces your funding fee</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={downPayment}
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
                          <p>Annual interest rate for the VA loan</p>
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

                {/* VA Specific Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">VA Loan Details</h3>
                  
                  {/* First Time Use */}
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">First Time Using VA Loan Benefit</span>
                      <input
                        type="checkbox"
                        checked={isFirstTime}
                        onChange={(e) => {
                          setIsFirstTime(e.target.checked);
                          updateFundingFee();
                        }}
                        className="checkbox"
                      />
                    </label>
                  </div>

                  {/* Disability Status */}
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Service-Connected Disability</span>
                      <input
                        type="checkbox"
                        checked={isDisabled}
                        onChange={(e) => {
                          setIsDisabled(e.target.checked);
                          updateFundingFee();
                        }}
                        className="checkbox"
                      />
                    </label>
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateVALoan}
                >
                  Calculate VA Loan
                </button>
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
                    <div className="stat-title">VA Funding Fee</div>
                    <div className="stat-value text-lg">
                      ${fundingFee.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Loan Amount</div>
                    <div className="stat-value text-lg">
                      ${loanAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${totalPayment.toFixed(2)}
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
              <h2 className="text-2xl font-semibold mb-4">Understanding VA Loans</h2>
              <p className="mb-4">
                VA loans are mortgage loans backed by the U.S. Department of Veterans Affairs, designed 
                to help service members, veterans, and eligible surviving spouses become homeowners. 
                These loans offer competitive terms and often require no down payment.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">VA Loan Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">No Down Payment Required</h3>
                    <p>Eligible borrowers can finance 100% of the home's value</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">No PMI Required</h3>
                    <p>Unlike conventional loans, VA loans don't require private mortgage insurance</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Competitive Rates</h3>
                    <p>VA loans often offer lower interest rates than conventional loans</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Limited Closing Costs</h3>
                    <p>The VA limits the closing costs lenders can charge</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">VA Funding Fee</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Funding Fee Rates:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>First Use:</strong>
                    <ul className="pl-6 mt-2">
                      <li>2.3% with no down payment</li>
                      <li>1.65% with 5% down</li>
                      <li>1.4% with 10% or more down</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Subsequent Use:</strong>
                    <ul className="pl-6 mt-2">
                      <li>3.6% with no down payment</li>
                      <li>1.65% with 5% down</li>
                      <li>1.4% with 10% or more down</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Exemptions:</strong>
                    <ul className="pl-6 mt-2">
                      <li>Veterans receiving VA disability compensation</li>
                      <li>Purple Heart recipients serving in active duty</li>
                      <li>Surviving spouses of veterans who died in service</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Eligibility Requirements</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minimum service requirements based on service period</li>
                  <li>Valid Certificate of Eligibility (COE)</li>
                  <li>Satisfactory credit score (typically 620 or higher)</li>
                  <li>Stable income and employment history</li>
                  <li>Property must meet VA minimum property requirements</li>
                  <li>Property will be primary residence</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
