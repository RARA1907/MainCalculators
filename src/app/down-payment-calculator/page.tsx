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

export default function DownPaymentCalculator() {
  const breadcrumbItems = [
    {
      label: 'Down Payment Calculator',
      href: '/down-payment-calculator'
    }
  ];

  // Property Details
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [loanType, setLoanType] = useState<string>('conventional');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6000);
  const [monthlySavings, setMonthlySavings] = useState<number>(1000);
  const [currentSavings, setCurrentSavings] = useState<number>(20000);

  // Results
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [minimumDownPayment, setMinimumDownPayment] = useState<number>(0);
  const [monthsToSave, setMonthsToSave] = useState<number>(0);
  const [pmiRequired, setPmiRequired] = useState<boolean>(false);
  const [additionalCosts, setAdditionalCosts] = useState<number>(0);

  const calculateMinimumDownPayment = (price: number, type: string) => {
    let minPercent = 0;
    switch (type) {
      case 'conventional':
        minPercent = 3;
        break;
      case 'fha':
        minPercent = 3.5;
        break;
      case 'jumbo':
        minPercent = 10;
        break;
      case 'va':
        minPercent = 0;
        break;
      default:
        minPercent = 3;
    }
    return (price * minPercent) / 100;
  };

  const calculateResults = () => {
    // Calculate down payment amount
    const downPaymentCalc = (homePrice * downPaymentPercent) / 100;
    setDownPaymentAmount(downPaymentCalc);

    // Calculate minimum down payment
    const minDown = calculateMinimumDownPayment(homePrice, loanType);
    setMinimumDownPayment(minDown);

    // Calculate months needed to save
    const remaining = Math.max(0, downPaymentCalc - currentSavings);
    const monthsNeeded = monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
    setMonthsToSave(monthsNeeded);

    // Determine if PMI is required (conventional loans with less than 20% down)
    setPmiRequired(loanType === 'conventional' && downPaymentPercent < 20);

    // Calculate additional costs (closing costs estimated at 2-5% of loan amount)
    const closingCostsPercent = 3; // Using 3% as an average
    const closingCosts = ((homePrice - downPaymentCalc) * closingCostsPercent) / 100;
    setAdditionalCosts(closingCosts);
  };

  // Chart for down payment breakdown
  const getDownPaymentBreakdownChart = () => {
    return {
      title: {
        text: 'Down Payment Analysis',
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
              value: currentSavings, 
              name: 'Current Savings',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: Math.max(0, downPaymentAmount - currentSavings), 
              name: 'Amount to Save',
              itemStyle: { color: '#2196F3' }
            },
            { 
              value: additionalCosts, 
              name: 'Estimated Closing Costs',
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

  // Chart for savings timeline
  const getSavingsTimelineChart = () => {
    const months = monthsToSave;
    const targetAmount = downPaymentAmount;
    const monthlyData = [];
    let currentAmount = currentSavings;

    for (let i = 0; i <= months; i++) {
      monthlyData.push([i, Math.min(currentAmount, targetAmount)]);
      currentAmount += monthlySavings;
    }

    return {
      title: {
        text: 'Savings Timeline',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          return `Month ${params[0].value[0]}: $${params[0].value[1].toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Months',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: 'Savings ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: monthlyData,
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#4CAF50'
          },
          areaStyle: {
            color: '#4CAF50',
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Down Payment Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Property & Savings Details</h2>
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
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Loan Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Different loan types have different minimum down payment requirements</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="conventional">Conventional</option>
                    <option value="fha">FHA</option>
                    <option value="va">VA</option>
                    <option value="jumbo">Jumbo</option>
                  </select>
                </div>

                {/* Down Payment Percentage */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Down Payment (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Desired down payment percentage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                  />
                </div>

                <Separator />

                {/* Current Savings */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Savings ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How much you currently have saved</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Monthly Savings */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Savings ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How much you can save each month</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateResults}
                >
                  Calculate Down Payment
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Down Payment Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Required Down Payment</div>
                    <div className="stat-value text-lg">
                      ${downPaymentAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Minimum Down Payment</div>
                    <div className="stat-value text-lg">
                      ${minimumDownPayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Months to Save</div>
                    <div className="stat-value text-lg">
                      {monthsToSave}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Additional Costs</div>
                    <div className="stat-value text-lg">
                      ${additionalCosts.toFixed(2)}
                    </div>
                  </div>
                </div>

                {pmiRequired && (
                  <div className="alert alert-warning">
                    <span>PMI will be required with less than 20% down payment on conventional loans.</span>
                  </div>
                )}

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getDownPaymentBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getSavingsTimelineChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Down Payments</h2>
              <p className="mb-4">
                A down payment is the initial upfront portion of the total home purchase price that 
                you pay at closing. The amount required varies by loan type and can significantly 
                impact your monthly payments and overall costs.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Minimum Down Payments by Loan Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Conventional Loans</h3>
                    <ul className="list-disc pl-6">
                      <li>Minimum 3% down</li>
                      <li>20% down to avoid PMI</li>
                      <li>Better rates with larger down payments</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">FHA Loans</h3>
                    <ul className="list-disc pl-6">
                      <li>Minimum 3.5% down with 580+ credit score</li>
                      <li>10% down with 500-579 credit score</li>
                      <li>MIP required regardless of down payment</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">VA Loans</h3>
                    <ul className="list-disc pl-6">
                      <li>No down payment required</li>
                      <li>VA funding fee may be required</li>
                      <li>Must meet service requirements</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Jumbo Loans</h3>
                    <ul className="list-disc pl-6">
                      <li>Typically 10-20% minimum</li>
                      <li>Varies by lender</li>
                      <li>Higher credit score requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Additional Costs to Consider</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Closing costs (2-5% of loan amount)</li>
                  <li>Private Mortgage Insurance (PMI)</li>
                  <li>Moving expenses</li>
                  <li>Home inspection fees</li>
                  <li>Property taxes</li>
                  <li>Homeowners insurance</li>
                  <li>Home maintenance and repairs</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Saving a Down Payment</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Set up automatic savings transfers</li>
                  <li>Consider down payment assistance programs</li>
                  <li>Look into first-time homebuyer programs</li>
                  <li>Cut unnecessary expenses</li>
                  <li>Consider a side hustle</li>
                  <li>Research local and state housing programs</li>
                  <li>Explore gift funds from family</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
