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

export default function RMDCalculator() {
  const breadcrumbItems = [
    {
      label: 'RMD Calculator',
      href: '/rmd-calculator'
    }
  ];

  // Constants
  const CURRENT_YEAR = 2024;
  const RMD_AGE = 73; // Current RMD age as of 2024

  // State for inputs
  const [age, setAge] = useState<number>(73);
  const [accountBalance, setAccountBalance] = useState<number>(500000);
  const [expectedReturn, setExpectedReturn] = useState<number>(6);
  const [accountType, setAccountType] = useState<string>('traditional-ira');
  const [spouseAge, setSpouseAge] = useState<number>(70);
  const [hasSpouseBeneficiary, setHasSpouseBeneficiary] = useState<boolean>(false);

  // State for results
  const [rmdAmount, setRmdAmount] = useState<number>(0);
  const [projectedBalances, setProjectedBalances] = useState<Array<{
    age: number;
    balance: number;
    rmd: number;
  }>>([]);
  const [totalRMDs, setTotalRMDs] = useState<number>(0);

  // RMD Distribution Periods (2022 IRS Uniform Lifetime Table)
  const rmdTable = {
    73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9,
    78: 22.0, 79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5,
    83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4,
    88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
    93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8,
    98: 7.3, 99: 6.8, 100: 6.4, 101: 6.0, 102: 5.6,
    103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1,
    108: 3.9, 109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3,
    113: 3.1, 114: 3.0, 115: 2.9, 116: 2.8, 117: 2.7,
    118: 2.5, 119: 2.3, 120: 2.0
  };

  const calculateRMD = () => {
    if (age < RMD_AGE) {
      setRmdAmount(0);
      setProjectedBalances([]);
      return;
    }

    const projections = [];
    let currentBalance = accountBalance;
    let totalRMDs = 0;
    let currentAge = age;

    // Calculate RMDs for the next 30 years or until age 120
    while (currentAge <= Math.min(120, age + 30) && currentBalance > 0) {
      const distributionPeriod = rmdTable[currentAge as keyof typeof rmdTable] || 2.0;
      const yearRMD = currentBalance / distributionPeriod;
      
      projections.push({
        age: currentAge,
        balance: currentBalance,
        rmd: yearRMD
      });

      totalRMDs += yearRMD;
      
      // Calculate next year's balance
      const investment_return = (currentBalance - yearRMD) * (expectedReturn / 100);
      currentBalance = currentBalance - yearRMD + investment_return;
      currentAge++;
    }

    setRmdAmount(projections[0].rmd);
    setProjectedBalances(projections);
    setTotalRMDs(totalRMDs);
  };

  // Chart for RMD projections
  const getRMDProjectionChart = () => {
    return {
      title: {
        text: 'RMD and Account Balance Projection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          return `Age ${params[0].data[0]}<br/>
            Balance: $${params[0].data[1].toLocaleString()}<br/>
            RMD: $${params[1].data[1].toLocaleString()}`
        }
      },
      legend: {
        data: ['Account Balance', 'RMD Amount'],
        bottom: 0
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
        min: age,
        max: Math.min(120, age + 30)
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
          name: 'Account Balance',
          type: 'line',
          data: projectedBalances.map(item => [item.age, item.balance]),
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#4CAF50'
          }
        },
        {
          name: 'RMD Amount',
          type: 'bar',
          data: projectedBalances.map(item => [item.age, item.rmd]),
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Required Minimum Distribution (RMD) Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Account Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Age Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Current Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>RMDs must begin at age {RMD_AGE}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={RMD_AGE}
                    max="120"
                  />
                </div>

                {/* Account Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Account Balance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Previous year-end account balance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Account Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Account Type</span>
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="traditional-ira">Traditional IRA</option>
                    <option value="401k">401(k)</option>
                    <option value="403b">403(b)</option>
                    <option value="457b">457(b)</option>
                  </select>
                </div>

                {/* Expected Return Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Annual Return (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual investment return</p>
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

                {/* Spouse Beneficiary Option */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Spouse is Sole Beneficiary</span>
                    <input
                      type="checkbox"
                      checked={hasSpouseBeneficiary}
                      onChange={(e) => setHasSpouseBeneficiary(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {/* Spouse Age Input (if spouse is beneficiary) */}
                {hasSpouseBeneficiary && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Spouse's Age</span>
                    </label>
                    <input
                      type="number"
                      value={spouseAge}
                      onChange={(e) => setSpouseAge(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      max="120"
                    />
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRMD}
                >
                  Calculate RMD
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">RMD Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Required Distribution</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${rmdAmount.toLocaleString()}
                    </div>
                    <div className="stat-desc">For {CURRENT_YEAR}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Distribution Rate</div>
                    <div className="stat-value text-lg">
                      {((rmdAmount / accountBalance) * 100).toFixed(2)}%
                    </div>
                    <div className="stat-desc">Of account balance</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Projected RMDs</div>
                    <div className="stat-value text-lg">
                      ${totalRMDs.toLocaleString()}
                    </div>
                    <div className="stat-desc">Over projection period</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Distribution</div>
                    <div className="stat-value text-lg">
                      ${(rmdAmount / 12).toLocaleString()}
                    </div>
                    <div className="stat-desc">If taken monthly</div>
                  </div>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <ReactECharts option={getRMDProjectionChart()} style={{ height: '400px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding RMDs</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">What are RMDs?</h3>
                  <p>
                    Required Minimum Distributions (RMDs) are the minimum amounts you must withdraw 
                    annually from your traditional retirement accounts once you reach age {RMD_AGE}. 
                    These accounts include traditional IRAs, 401(k)s, 403(b)s, and other employer-sponsored 
                    retirement plans.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key RMD Rules for {CURRENT_YEAR}</h3>
                  <ul className="list-disc pl-6">
                    <li>RMDs must begin by April 1st of the year following the year you turn {RMD_AGE}</li>
                    <li>Subsequent RMDs must be taken by December 31st of each year</li>
                    <li>RMDs are calculated separately for each retirement account</li>
                    <li>Failure to take RMDs can result in a 25% penalty on the amount not taken</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Important Considerations</h3>
                  <ul className="list-disc pl-6">
                    <li>RMDs are taxed as ordinary income</li>
                    <li>You can withdraw more than the minimum required amount</li>
                    <li>Roth IRAs do not require RMDs during the owner's lifetime</li>
                    <li>You can donate your RMD to charity (QCD) to reduce taxable income</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Planning Tips</h3>
                  <ul className="list-disc pl-6">
                    <li>Consider taking RMDs early in the year to avoid missing deadlines</li>
                    <li>Plan for taxes by making quarterly estimated tax payments if needed</li>
                    <li>Consider consolidating accounts to simplify RMD calculations</li>
                    <li>Review your investment strategy to ensure it aligns with RMD requirements</li>
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
