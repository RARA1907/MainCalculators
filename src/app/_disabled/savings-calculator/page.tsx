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

export default function SavingsCalculator() {
  const breadcrumbItems = [
    {
      label: 'Savings Calculator',
      href: '/savings-calculator'
    }
  ];

  // Savings Inputs
  const [initialDeposit, setInitialDeposit] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [savingsPeriod, setSavingsPeriod] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');

  // Results
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<Array<{
    month: number;
    balance: number;
    contributions: number;
    interest: number;
  }>>([]);

  const calculateSavings = () => {
    const periods = {
      'monthly': 12,
      'quarterly': 4,
      'semi-annually': 2,
      'annually': 1
    }[compoundingFrequency];

    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = savingsPeriod * 12;
    let balance = initialDeposit;
    let totalContrib = initialDeposit;
    let breakdown = [];

    for (let month = 1; month <= totalMonths; month++) {
      const startBalance = balance;
      
      // Add monthly contribution
      balance += monthlyContribution;
      totalContrib += monthlyContribution;

      // Apply interest if it's a compounding month
      if (month % (12 / periods) === 0) {
        const interest = balance * (interestRate / 100 / periods);
        balance += interest;
      }

      breakdown.push({
        month,
        balance,
        contributions: totalContrib,
        interest: balance - totalContrib
      });
    }

    setTotalSavings(balance);
    setTotalContributions(totalContrib);
    setTotalInterest(balance - totalContrib);
    setMonthlyBreakdown(breakdown);
  };

  // Chart for savings growth
  const getSavingsGrowthChart = () => {
    return {
      title: {
        text: 'Savings Growth Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          const monthData = params[0].data;
          return `Month ${monthData[0]}<br/>
            Balance: $${monthData[1].toLocaleString('en-US', {
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
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 30,
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
          data: monthlyBreakdown.map(item => [item.month, item.balance]),
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

  // Chart for savings breakdown
  const getSavingsBreakdownChart = () => {
    return {
      title: {
        text: 'Savings Breakdown',
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
              value: initialDeposit,
              name: 'Initial Deposit',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalContributions - initialDeposit,
              name: 'Additional Contributions',
              itemStyle: { color: '#2196F3' }
            },
            {
              value: totalInterest,
              name: 'Interest Earned',
              itemStyle: { color: '#FFC107' }
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Savings Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Savings Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Initial Deposit Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Deposit ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Starting amount in your savings account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Monthly Contribution Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Contribution ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount you'll save each month</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <Separator />

                {/* Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Interest Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual return on your savings</p>
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
                    max="100"
                    step="0.1"
                  />
                </div>

                {/* Savings Period Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Savings Period (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long you plan to save</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={savingsPeriod}
                    onChange={(e) => setSavingsPeriod(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="50"
                  />
                </div>

                {/* Compounding Frequency Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Compounding Frequency</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often interest is calculated and added to your balance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateSavings}
                >
                  Calculate Savings
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Savings Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Savings</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${totalSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Contributions</div>
                    <div className="stat-value text-lg">
                      ${totalContributions.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Interest Earned</div>
                    <div className="stat-value text-lg">
                      ${totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Return on Investment</div>
                    <div className="stat-value text-lg">
                      {totalContributions > 0
                        ? ((totalInterest / totalContributions) * 100).toFixed(1)
                        : '0'}%
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getSavingsGrowthChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getSavingsBreakdownChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Savings Growth</h2>
              <p className="mb-4">
                Saving money is a crucial step toward financial security. This calculator helps you 
                understand how your savings can grow over time through regular contributions and 
                compound interest. By making consistent deposits and earning interest on both your 
                contributions and previously earned interest, your money can grow significantly over time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Savings Concepts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Compound Interest</h3>
                    <p>
                      Compound interest is interest earned on both your initial deposit and previously 
                      earned interest. The frequency of compounding can significantly impact your 
                      total returns, with more frequent compounding generally leading to higher returns.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Regular Contributions</h3>
                    <p>
                      Making regular contributions to your savings is key to building wealth over time. 
                      Even small monthly deposits can add up to significant amounts when combined with 
                      compound interest over longer periods.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Savings</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Start saving early to take advantage of compound interest
                  </li>
                  <li className="mb-2">
                    Set up automatic monthly contributions to maintain consistency
                  </li>
                  <li className="mb-2">
                    Look for high-yield savings accounts or investment options
                  </li>
                  <li>
                    Regularly review and adjust your savings strategy as needed
                  </li>
                </ul>
                <p>
                  Remember that while higher interest rates can lead to greater returns, they often 
                  come with increased risk. Consider your risk tolerance and time horizon when 
                  choosing where to save or invest your money.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
