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

export default function AnnuityPayoutCalculator() {
  const breadcrumbItems = [
    {
      label: 'Annuity Payout Calculator',
      href: '/annuity-payout-calculator'
    }
  ];

  // Personal Inputs
  const [annuityValue, setAnnuityValue] = useState<number>(500000);
  const [payoutStartAge, setPayoutStartAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [payoutOption, setPayoutOption] = useState<string>('life');
  const [payoutPeriod, setPayoutPeriod] = useState<number>(20);
  const [payoutFrequency, setPayoutFrequency] = useState<string>('monthly');
  const [guaranteedPeriod, setGuaranteedPeriod] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [jointLife, setJointLife] = useState<boolean>(false);
  const [spouseAge, setSpouseAge] = useState<number>(63);

  // Results
  const [periodicPayout, setPeriodicPayout] = useState<number>(0);
  const [annualPayout, setAnnualPayout] = useState<number>(0);
  const [totalPayouts, setTotalPayouts] = useState<number>(0);
  const [payoutRate, setPayoutRate] = useState<number>(0);
  const [breakEvenAge, setBreakEvenAge] = useState<number>(0);
  const [yearlyProjection, setYearlyProjection] = useState<Array<{
    age: number;
    payout: number;
    cumulativePayouts: number;
    remainingPrincipal: number;
  }>>([]);

  const calculatePayout = () => {
    // Calculate payout period based on option
    let effectivePayoutPeriod = 0;
    if (payoutOption === 'life') {
      effectivePayoutPeriod = lifeExpectancy - payoutStartAge;
    } else if (payoutOption === 'period') {
      effectivePayoutPeriod = payoutPeriod;
    }

    // Calculate number of payments per year
    const paymentsPerYear = {
      'monthly': 12,
      'quarterly': 4,
      'semi-annual': 2,
      'annual': 1
    }[payoutFrequency];

    // Calculate periodic payment (using simplified annuity formula)
    const totalPayments = effectivePayoutPeriod * paymentsPerYear;
    const periodicRate = expectedReturn / (100 * paymentsPerYear);
    
    let payment = annuityValue * (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
                  (Math.pow(1 + periodicRate, totalPayments) - 1);

    // Adjust for joint life if selected
    if (jointLife) {
      payment *= 0.85; // Reduce payment for joint life option
    }

    // Set results
    setPeriodicPayout(payment);
    setAnnualPayout(payment * paymentsPerYear);
    setTotalPayouts(payment * totalPayments);
    setPayoutRate((payment * paymentsPerYear / annuityValue) * 100);

    // Calculate break-even age
    const breakEven = payoutStartAge + (annuityValue / (payment * paymentsPerYear));
    setBreakEvenAge(Math.round(breakEven));

    // Generate yearly projection
    const projection = [];
    let remainingPrincipal = annuityValue;
    let cumulativePayouts = 0;
    let currentPayout = payment * paymentsPerYear;

    for (let age = payoutStartAge; age <= payoutStartAge + effectivePayoutPeriod; age++) {
      // Adjust for inflation if applicable
      if (age > payoutStartAge) {
        currentPayout *= (1 + inflationRate / 100);
      }

      cumulativePayouts += currentPayout;
      remainingPrincipal = Math.max(0, remainingPrincipal - currentPayout);

      projection.push({
        age,
        payout: currentPayout,
        cumulativePayouts,
        remainingPrincipal
      });
    }

    setYearlyProjection(projection);
  };

  // Chart for payout comparison
  const getPayoutComparisonChart = () => {
    return {
      title: {
        text: 'Payout vs Principal Balance',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Annual Payout', 'Remaining Principal'],
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
        max: Math.max(...yearlyProjection.map(item => item.age))
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
          name: 'Annual Payout',
          type: 'bar',
          data: yearlyProjection.map(item => [item.age, item.payout]),
          itemStyle: {
            color: '#4CAF50'
          }
        },
        {
          name: 'Remaining Principal',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.remainingPrincipal]),
          itemStyle: {
            color: '#2196F3'
          }
        }
      ]
    };
  };

  // Chart for cumulative payouts
  const getCumulativePayoutsChart = () => {
    return {
      title: {
        text: 'Cumulative Payouts Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
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
        max: Math.max(...yearlyProjection.map(item => item.age))
      },
      yAxis: {
        type: 'value',
        name: 'Cumulative Payouts ($)',
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
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Annuity Payout Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payout Options</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Annuity Value Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annuity Value ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total value of your annuity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={annuityValue}
                    onChange={(e) => setAnnuityValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="10000"
                  />
                </div>

                {/* Payout Option Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payout Option</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose how long you want to receive payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={payoutOption}
                    onChange={(e) => setPayoutOption(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="life">Life Only</option>
                    <option value="period">Period Certain</option>
                    <option value="life-period">Life with Period Certain</option>
                  </select>
                </div>

                {/* Payout Period Input (if applicable) */}
                {payoutOption !== 'life' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payout Period (years)</span>
                    </label>
                    <input
                      type="number"
                      value={payoutPeriod}
                      onChange={(e) => setPayoutPeriod(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="5"
                      max="30"
                    />
                  </div>
                )}

                {/* Payout Frequency Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payout Frequency</span>
                  </label>
                  <select
                    value={payoutFrequency}
                    onChange={(e) => setPayoutFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annual">Semi-Annual</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                {/* Expected Return Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Return Rate (%)</span>
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
                  onClick={calculatePayout}
                >
                  Calculate Payout
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payout Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Periodic Payout</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${periodicPayout.toLocaleString()}
                    </div>
                    <div className="stat-desc">Per {payoutFrequency}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Annual Payout</div>
                    <div className="stat-value text-lg">
                      ${annualPayout.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Payout Rate</div>
                    <div className="stat-value text-lg">
                      {payoutRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Break-even Age</div>
                    <div className="stat-value text-lg">
                      {breakEvenAge}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPayoutComparisonChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Annuity Payout Options</h2>
              <p className="mb-4">
                Annuity payout options determine how and when you receive your annuity payments. 
                Different options can significantly affect your payment amount and the total value 
                you or your beneficiaries receive.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Types of Payout Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Life Only</h3>
                    <p>
                      Provides the highest periodic payment but payments stop at death with no 
                      continuation to beneficiaries. Best for maximizing income if you don't need 
                      to provide for others.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Period Certain</h3>
                    <p>
                      Guarantees payments for a specific period. If you die before the period ends, 
                      your beneficiary receives the remaining payments. Provides certainty but may 
                      offer lower payments than life-only.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors to Consider</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Your life expectancy and health condition
                  </li>
                  <li className="mb-2">
                    Need for guaranteed income vs. flexibility
                  </li>
                  <li className="mb-2">
                    Importance of leaving benefits to beneficiaries
                  </li>
                  <li>
                    Impact of inflation on future purchasing power
                  </li>
                </ul>
                <p>
                  The best payout option depends on your personal circumstances and financial goals. 
                  Consider consulting with a financial advisor to determine which option best suits 
                  your needs.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
