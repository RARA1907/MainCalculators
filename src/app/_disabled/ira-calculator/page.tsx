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

export default function IRACalculator() {
  const breadcrumbItems = [
    {
      label: 'IRA Calculator',
      href: '/ira-calculator'
    }
  ];

  // Constants for 2024
  const CURRENT_YEAR = 2024;
  const TRADITIONAL_IRA_LIMIT = 7000;
  const ROTH_IRA_LIMIT = 7000;
  const CATCH_UP_CONTRIBUTION = 1000;
  const CATCH_UP_AGE = 50;

  // State for inputs
  const [iraType, setIraType] = useState<string>('traditional');
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentBalance, setCurrentBalance] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(6000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [taxBracket, setTaxBracket] = useState<number>(22);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [filingStatus, setFilingStatus] = useState<string>('single');

  // State for results
  const [projectedBalance, setProjectedBalance] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [taxSavings, setTaxSavings] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<Array<{
    age: number;
    balance: number;
    contribution: number;
    earnings: number;
    taxSavings: number;
  }>>([]);

  const calculateIRA = () => {
    let balance = currentBalance;
    let totalContrib = 0;
    let totalEarn = 0;
    let yearlyTaxSavings = 0;
    const yearly = [];
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;

    for (let age = currentAge; age <= retirementAge; age++) {
      // Calculate contribution limit based on age
      const baseLimit = iraType === 'traditional' ? TRADITIONAL_IRA_LIMIT : ROTH_IRA_LIMIT;
      const maxContribution = age >= CATCH_UP_AGE ? baseLimit + CATCH_UP_CONTRIBUTION : baseLimit;
      
      // Calculate actual contribution for the year
      const yearContribution = Math.min(annualContribution, maxContribution);
      
      // Calculate earnings
      const yearEarnings = balance * (expectedReturn / 100);
      
      // Calculate tax savings for traditional IRA
      const yearTaxSaving = iraType === 'traditional' ? yearContribution * (taxBracket / 100) : 0;
      yearlyTaxSavings += yearTaxSaving;

      // Update totals
      totalContrib += yearContribution;
      totalEarn += yearEarnings;
      balance = balance + yearContribution + yearEarnings;

      yearly.push({
        age,
        balance,
        contribution: yearContribution,
        earnings: yearEarnings,
        taxSavings: yearTaxSaving
      });
    }

    setProjectedBalance(balance);
    setTotalContributions(totalContrib);
    setTotalEarnings(totalEarn);
    setTaxSavings(yearlyTaxSavings);
    setYearlyData(yearly);
  };

  // Chart for balance growth
  const getBalanceGrowthChart = () => {
    return {
      title: {
        text: 'IRA Balance Growth Projection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const data = params[0].data;
          return `Age ${data[0]}<br/>
            Balance: $${data[1].toLocaleString()}`
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
        max: retirementAge
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
          data: yearlyData.map(item => [item.age, item.balance]),
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

  // Chart for contribution breakdown
  const getContributionBreakdownChart = () => {
    return {
      title: {
        text: 'IRA Composition',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          return `${params.name}: $${params.value.toLocaleString()} (${params.percent}%)`
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">IRA Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">IRA Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* IRA Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">IRA Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose between Traditional and Roth IRA</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={iraType}
                    onChange={(e) => setIraType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="traditional">Traditional IRA</option>
                    <option value="roth">Roth IRA</option>
                  </select>
                </div>

                {/* Current Age Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Age</span>
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

                {/* Current Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Balance ($)</span>
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
                  </label>
                  <input
                    type="number"
                    value={annualContribution}
                    onChange={(e) => setAnnualContribution(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max={TRADITIONAL_IRA_LIMIT + (currentAge >= CATCH_UP_AGE ? CATCH_UP_CONTRIBUTION : 0)}
                    step="500"
                  />
                </div>

                {/* Expected Return Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Annual Return (%)</span>
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

                {/* Tax Bracket Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Tax Bracket (%)</span>
                  </label>
                  <select
                    value={taxBracket}
                    onChange={(e) => setTaxBracket(Number(e.target.value))}
                    className="select select-bordered w-full"
                  >
                    <option value="10">10%</option>
                    <option value="12">12%</option>
                    <option value="22">22%</option>
                    <option value="24">24%</option>
                    <option value="32">32%</option>
                    <option value="35">35%</option>
                    <option value="37">37%</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateIRA}
                >
                  Calculate IRA
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">IRA Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Projected Balance</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${projectedBalance.toLocaleString()}
                    </div>
                    <div className="stat-desc">At retirement</div>
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
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Tax Savings</div>
                    <div className="stat-value text-lg">
                      ${taxSavings.toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      {iraType === 'traditional' ? 'From deductible contributions' : 'Tax-free growth'}
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
                    <ReactECharts option={getContributionBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding IRAs</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Traditional IRA vs. Roth IRA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Traditional IRA</h4>
                      <ul className="list-disc pl-6">
                        <li>Tax-deductible contributions</li>
                        <li>Tax-deferred growth</li>
                        <li>Taxable withdrawals in retirement</li>
                        <li>Required Minimum Distributions at age 73</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Roth IRA</h4>
                      <ul className="list-disc pl-6">
                        <li>After-tax contributions</li>
                        <li>Tax-free growth</li>
                        <li>Tax-free qualified withdrawals</li>
                        <li>No Required Minimum Distributions</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">2024 Contribution Limits</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Under age 50: ${TRADITIONAL_IRA_LIMIT.toLocaleString()}</li>
                      <li>Age 50 or older: ${(TRADITIONAL_IRA_LIMIT + CATCH_UP_CONTRIBUTION).toLocaleString()}</li>
                      <li>Income limits apply for Roth IRA contributions</li>
                      <li>Deduction limits apply for Traditional IRA if covered by workplace plan</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Investment Considerations</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Start early to maximize compound growth</li>
                      <li>Consider your current and future tax brackets</li>
                      <li>Diversify investments within your IRA</li>
                      <li>Review and rebalance your portfolio regularly</li>
                      <li>Consider professional advice for optimal strategy</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
