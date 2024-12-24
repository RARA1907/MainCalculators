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

export default function RothIRACalculator() {
  const breadcrumbItems = [
    {
      label: 'Roth IRA Calculator',
      href: '/roth-ira-calculator'
    }
  ];

  // 2024 Roth IRA Limits
  const CURRENT_YEAR = 2024;
  const BASE_CONTRIBUTION_LIMIT = 7000;
  const CATCH_UP_AGE = 50;
  const CATCH_UP_CONTRIBUTION = 1000;
  
  // Income Limits for 2024
  const SINGLE_PHASE_OUT_START = 146000;
  const SINGLE_PHASE_OUT_END = 161000;
  const MARRIED_PHASE_OUT_START = 230000;
  const MARRIED_PHASE_OUT_END = 240000;

  // Personal Inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentBalance, setCurrentBalance] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(6000);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);

  // Results
  const [maxContribution, setMaxContribution] = useState<number>(0);
  const [projectedBalance, setProjectedBalance] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [yearlyProjection, setYearlyProjection] = useState<Array<{
    age: number;
    balance: number;
    contribution: number;
    earnings: number;
    totalContributions: number;
    totalEarnings: number;
  }>>([]);

  const calculateRothIRA = () => {
    // Calculate contribution limit based on age and income
    let baseLimit = BASE_CONTRIBUTION_LIMIT;
    if (currentAge >= CATCH_UP_AGE) {
      baseLimit += CATCH_UP_CONTRIBUTION;
    }

    // Calculate phase-out based on income and filing status
    let phaseOutStart = filingStatus === 'single' ? SINGLE_PHASE_OUT_START : MARRIED_PHASE_OUT_START;
    let phaseOutEnd = filingStatus === 'single' ? SINGLE_PHASE_OUT_END : MARRIED_PHASE_OUT_END;

    let contributionLimit = baseLimit;
    if (annualIncome > phaseOutStart) {
      if (annualIncome >= phaseOutEnd) {
        contributionLimit = 0;
      } else {
        const phaseOutRange = phaseOutEnd - phaseOutStart;
        const overageAmount = annualIncome - phaseOutStart;
        const reductionRatio = overageAmount / phaseOutRange;
        contributionLimit = baseLimit * (1 - reductionRatio);
      }
    }

    setMaxContribution(contributionLimit);

    // Calculate yearly projection
    let balance = currentBalance;
    let totalContrib = 0;
    let totalEarn = 0;
    const projection = [];
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    
    for (let age = currentAge; age <= retirementAge; age++) {
      const yearContribution = Math.min(annualContribution, contributionLimit);
      const yearEarnings = balance * (expectedReturn / 100);
      
      totalContrib += yearContribution;
      totalEarn += yearEarnings;
      balance = balance + yearContribution + yearEarnings;

      projection.push({
        age,
        balance,
        contribution: yearContribution,
        earnings: yearEarnings,
        totalContributions: totalContrib,
        totalEarnings: totalEarn
      });
    }

    setProjectedBalance(balance);
    setTotalContributions(totalContrib);
    setTotalEarnings(totalEarn);
    setYearlyProjection(projection);
  };

  // Chart for balance growth
  const getBalanceGrowthChart = () => {
    return {
      title: {
        text: 'Roth IRA Balance Growth',
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
            Balance: $${data[1].toLocaleString('en-US', {
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
        min: currentAge,
        max: retirementAge,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Balance ($)',
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
          name: 'Balance',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.balance]),
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

  // Chart for contribution vs earnings
  const getContributionVsEarningsChart = () => {
    return {
      title: {
        text: 'Contributions vs Earnings',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          return `${params.name}: $${params.value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })} (${params.percent.toFixed(1)}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: totalContributions,
              name: 'Total Contributions',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalEarnings,
              name: 'Investment Earnings',
              itemStyle: { color: '#2196F3' }
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Roth IRA Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal Information</h2>
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

                {/* Retirement Age Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Retirement Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Age you plan to retire</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={currentAge}
                    max="100"
                  />
                </div>

                {/* Annual Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Income ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current annual income</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Filing Status Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Filing Status</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your tax filing status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                </div>

                {/* Current Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Roth IRA Balance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current Roth IRA balance</p>
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
                    step="1000"
                  />
                </div>

                {/* Annual Contribution Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Contribution ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount you plan to contribute annually</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={annualContribution}
                    onChange={(e) => setAnnualContribution(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max={BASE_CONTRIBUTION_LIMIT + (currentAge >= CATCH_UP_AGE ? CATCH_UP_CONTRIBUTION : 0)}
                    step="500"
                  />
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

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRothIRA}
                >
                  Calculate Roth IRA
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Roth IRA Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Maximum Contribution</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${maxContribution.toLocaleString()}
                    </div>
                    <div className="stat-desc">For {CURRENT_YEAR}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Projected Balance</div>
                    <div className="stat-value text-lg">
                      ${projectedBalance.toLocaleString()}
                    </div>
                    <div className="stat-desc">At age {retirementAge}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Contributions</div>
                    <div className="stat-value text-lg">
                      ${totalContributions.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Investment Earnings</div>
                    <div className="stat-value text-lg">
                      ${totalEarnings.toLocaleString()}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getBalanceGrowthChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getContributionVsEarningsChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Roth IRAs</h2>
              <p className="mb-4">
                A Roth IRA is a retirement account that offers tax-free growth and tax-free 
                withdrawals in retirement. Contributions are made with after-tax dollars, meaning 
                you pay taxes on the money before contributing it to your Roth IRA.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">2024 Roth IRA Limits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Contribution Limits</h3>
                    <ul className="list-disc pl-6">
                      <li>Under age 50: ${BASE_CONTRIBUTION_LIMIT.toLocaleString()}</li>
                      <li>Age 50 or older: ${(BASE_CONTRIBUTION_LIMIT + CATCH_UP_CONTRIBUTION).toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Income Limits</h3>
                    <ul className="list-disc pl-6">
                      <li>Single: $146,000 - $161,000</li>
                      <li>Married Filing Jointly: $230,000 - $240,000</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Tax-free growth on your investments
                  </li>
                  <li className="mb-2">
                    Tax-free withdrawals in retirement
                  </li>
                  <li className="mb-2">
                    No required minimum distributions (RMDs)
                  </li>
                  <li>
                    Flexibility to withdraw contributions at any time without penalties
                  </li>
                </ul>
                <p>
                  This calculator helps you estimate your potential Roth IRA growth based on your 
                  contributions and investment returns. Remember that actual results may vary based 
                  on market performance and changes in contribution limits.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
