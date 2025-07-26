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

export default function AnnuityCalculator() {
  const breadcrumbItems = [
    {
      label: 'Annuity Calculator',
      href: '/annuity-calculator'
    }
  ];

  // Personal Inputs
  const [currentAge, setCurrentAge] = useState<number>(55);
  const [initialInvestment, setInitialInvestment] = useState<number>(250000);
  const [annuityType, setAnnuityType] = useState<string>('fixed');
  const [payoutStartAge, setPayoutStartAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [expectedReturn, setExpectedReturn] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [payoutFrequency, setPayoutFrequency] = useState<string>('monthly');
  const [jointLife, setJointLife] = useState<boolean>(false);
  const [spouseAge, setSpouseAge] = useState<number>(53);

  // Results
  const [monthlyPayout, setMonthlyPayout] = useState<number>(0);
  const [totalPayouts, setTotalPayouts] = useState<number>(0);
  const [guaranteedReturn, setGuaranteedReturn] = useState<number>(0);
  const [yearlyProjection, setYearlyProjection] = useState<Array<{
    age: number;
    payout: number;
    remainingPrincipal: number;
    cumulativePayouts: number;
  }>>([]);

  const calculateAnnuity = () => {
    // Calculate years until payout starts
    const yearsToStart = payoutStartAge - currentAge;
    
    // Calculate total years of payouts
    const payoutYears = lifeExpectancy - payoutStartAge;
    
    // Calculate future value of initial investment at payout start
    const futureValue = initialInvestment * Math.pow(1 + expectedReturn / 100, yearsToStart);
    
    // Calculate monthly payout based on annuity type and options
    let monthlyAmount = 0;
    if (annuityType === 'fixed') {
      // Simple fixed annuity calculation (PMT formula)
      const monthlyRate = expectedReturn / 100 / 12;
      const totalMonths = payoutYears * 12;
      monthlyAmount = (futureValue * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
    } else {
      // Variable annuity with inflation adjustment
      monthlyAmount = futureValue / (payoutYears * 12);
    }

    // Adjust for joint life if selected (simplified adjustment)
    if (jointLife) {
      monthlyAmount *= 0.85; // Reduce payout for joint life option
    }

    setMonthlyPayout(monthlyAmount);

    // Calculate total payouts
    const totalAmount = monthlyAmount * 12 * payoutYears;
    setTotalPayouts(totalAmount);

    // Calculate guaranteed return
    const guaranteedReturnRate = ((totalAmount / initialInvestment - 1) * 100);
    setGuaranteedReturn(guaranteedReturnRate);

    // Generate yearly projection
    const projection = [];
    let remainingPrincipal = futureValue;
    let cumulativePayouts = 0;
    let currentPayout = monthlyAmount * 12;

    for (let age = payoutStartAge; age <= lifeExpectancy; age++) {
      if (annuityType === 'variable') {
        currentPayout *= (1 + inflationRate / 100); // Adjust for inflation
      }

      cumulativePayouts += currentPayout;
      remainingPrincipal = Math.max(0, remainingPrincipal - currentPayout);

      projection.push({
        age,
        payout: currentPayout,
        remainingPrincipal,
        cumulativePayouts
      });
    }

    setYearlyProjection(projection);
  };

  // Chart for payout projection
  const getPayoutProjectionChart = () => {
    return {
      title: {
        text: 'Annual Payout Projection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          const data = params[0].data;
          return `Age ${data[0]}<br/>
            Annual Payout: $${data[1].toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Age',
        nameLocation: 'middle',
        nameGap: 30,
        min: payoutStartAge,
        max: lifeExpectancy,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Annual Payout ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: function(value: number) {
            if (value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
            return '$' + value;
          }
        }
      },
      series: [
        {
          name: 'Annual Payout',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.payout]),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(76, 175, 80, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(76, 175, 80, 0.05)'
                }
              ]
            }
          },
          itemStyle: {
            color: '#4CAF50'
          }
        }
      ]
    };
  };

  // Chart for cumulative payouts
  const getCumulativePayoutsChart = () => {
    return {
      title: {
        text: 'Cumulative Payouts vs Initial Investment',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Cumulative Payouts', 'Initial Investment'],
        bottom: '5%'
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Age',
        nameLocation: 'middle',
        nameGap: 30,
        min: payoutStartAge,
        max: lifeExpectancy
      },
      yAxis: {
        type: 'value',
        name: 'Amount ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: function(value: number) {
            if (value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
            return '$' + value;
          }
        }
      },
      series: [
        {
          name: 'Cumulative Payouts',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.cumulativePayouts]),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(33, 150, 243, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(33, 150, 243, 0.05)'
                }
              ]
            }
          },
          itemStyle: {
            color: '#2196F3'
          }
        },
        {
          name: 'Initial Investment',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, initialInvestment]),
          lineStyle: {
            type: 'dashed',
            color: '#FFC107'
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Annuity Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Annuity Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Age Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current age</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="18"
                    max="90"
                  />
                </div>

                {/* Initial Investment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Investment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount to invest in the annuity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="10000"
                  />
                </div>

                {/* Annuity Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annuity Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose between fixed or variable annuity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={annuityType}
                    onChange={(e) => setAnnuityType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="fixed">Fixed Annuity</option>
                    <option value="variable">Variable Annuity</option>
                  </select>
                </div>

                {/* Payout Start Age Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payout Start Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Age when you want to start receiving payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={payoutStartAge}
                    onChange={(e) => setPayoutStartAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={currentAge}
                    max="90"
                  />
                </div>

                {/* Expected Return Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Return Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual return rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="15"
                    step="0.1"
                  />
                </div>

                {/* Joint Life Option */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Joint Life Option</span>
                    <input
                      type="checkbox"
                      checked={jointLife}
                      onChange={(e) => setJointLife(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {jointLife && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Spouse's Age</span>
                    </label>
                    <input
                      type="number"
                      value={spouseAge}
                      onChange={(e) => setSpouseAge(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="18"
                      max="90"
                    />
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateAnnuity}
                >
                  Calculate Annuity
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Annuity Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payout</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${monthlyPayout.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Payouts</div>
                    <div className="stat-value text-lg">
                      ${totalPayouts.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Guaranteed Return</div>
                    <div className="stat-value text-lg">
                      {guaranteedReturn.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Years of Payments</div>
                    <div className="stat-value text-lg">
                      {lifeExpectancy - payoutStartAge}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPayoutProjectionChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getCumulativePayoutsChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Annuities</h2>
              <p className="mb-4">
                An annuity is a financial product that provides guaranteed income for a specified 
                period or for life. It's often used as part of a retirement strategy to ensure a 
                steady stream of income during retirement years.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Types of Annuities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Fixed Annuities</h3>
                    <p>
                      Fixed annuities provide guaranteed payments that don't change over time. 
                      They offer predictable income but may not keep pace with inflation.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Variable Annuities</h3>
                    <p>
                      Variable annuities offer payments that can vary based on investment 
                      performance. They provide potential for growth but come with market risk.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Important Considerations</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Consider fees and expenses associated with annuities
                  </li>
                  <li className="mb-2">
                    Understand the impact of inflation on fixed payments
                  </li>
                  <li className="mb-2">
                    Review surrender charges and withdrawal restrictions
                  </li>
                  <li>
                    Consider the financial strength of the insurance company
                  </li>
                </ul>
                <p>
                  This calculator provides estimates based on the information you provide. Actual 
                  annuity terms and payments will vary by provider and product. Consider consulting 
                  with a financial advisor to determine if an annuity is right for your situation.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
