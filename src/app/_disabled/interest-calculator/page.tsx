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

export default function InterestCalculator() {
  const breadcrumbItems = [
    {
      label: 'Interest Calculator',
      href: '/interest-calculator'
    }
  ];

  // Calculator State
  const [calculatorType, setCalculatorType] = useState<'simple' | 'compound'>('compound');
  const [principal, setPrincipal] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [timeInYears, setTimeInYears] = useState<number>(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
  const [additionalContributions, setAdditionalContributions] = useState<number>(100);
  const [contributionFrequency, setContributionFrequency] = useState<string>('monthly');

  // Results
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateInterest = () => {
    let yearlyBalances = [];
    let totalContributionAmount = principal;
    let finalBalance = 0;

    if (calculatorType === 'simple') {
      // Simple Interest Calculation
      const contributionsPerYear = getContributionsPerYear();
      const yearlyContribution = additionalContributions * contributionsPerYear;

      for (let year = 0; year <= timeInYears; year++) {
        const contributions = principal + (yearlyContribution * year);
        const interest = contributions * (interestRate / 100) * year;
        const balance = contributions + interest;

        yearlyBalances.push({
          year,
          balance,
          contributions,
          interest
        });

        if (year === timeInYears) {
          finalBalance = balance;
          totalContributionAmount = contributions;
        }
      }
    } else {
      // Compound Interest Calculation
      const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
      const contributionsPerYear = getContributionsPerYear();
      const periodicRate = interestRate / 100 / periodsPerYear;
      const totalPeriods = timeInYears * periodsPerYear;
      const periodicContribution = additionalContributions * (contributionsPerYear / periodsPerYear);

      let balance = principal;
      let contributions = principal;

      for (let period = 1; period <= totalPeriods; period++) {
        // Add interest
        balance = balance * (1 + periodicRate);
        // Add contribution
        balance += periodicContribution;
        contributions += periodicContribution;

        // Store yearly data
        if (period % periodsPerYear === 0) {
          const year = period / periodsPerYear;
          yearlyBalances.push({
            year,
            balance,
            contributions,
            interest: balance - contributions
          });

          if (year === timeInYears) {
            finalBalance = balance;
            totalContributionAmount = contributions;
          }
        }
      }
    }

    setFinalAmount(finalBalance);
    setTotalContributions(totalContributionAmount);
    setTotalInterest(finalBalance - totalContributionAmount);
    setYearlyData(yearlyBalances);
  };

  const getPeriodsPerYear = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'semiannually': return 2;
      case 'annually': return 1;
      default: return 12;
    }
  };

  const getContributionsPerYear = () => {
    switch (contributionFrequency) {
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'annually': return 1;
      default: return 12;
    }
  };

  // Chart for growth over time
  const getGrowthChart = () => {
    const years = yearlyData.map(data => data.year);
    const balances = yearlyData.map(data => data.balance);
    const contributions = yearlyData.map(data => data.contributions);
    const interests = yearlyData.map(data => data.interest);

    return {
      title: {
        text: 'Growth Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          let result = `Year ${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: $${param.value.toFixed(2)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Total Balance', 'Contributions', 'Interest Earned'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Years'
      },
      yAxis: {
        type: 'value',
        name: 'Amount ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Total Balance',
          type: 'line',
          data: balances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Contributions',
          type: 'line',
          data: contributions,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        },
        {
          name: 'Interest Earned',
          type: 'line',
          data: interests,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#9C27B0' }
        }
      ]
    };
  };

  // Chart for final breakdown
  const getFinalBreakdownChart = () => {
    return {
      title: {
        text: 'Final Balance Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 30
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { 
              value: totalContributions, 
              name: 'Total Contributions',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: totalInterest, 
              name: 'Total Interest',
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Interest Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Interest</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calculator Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Interest Type</span>
                  </label>
                  <select
                    value={calculatorType}
                    onChange={(e) => setCalculatorType(e.target.value as 'simple' | 'compound')}
                    className="select select-bordered w-full"
                  >
                    <option value="simple">Simple Interest</option>
                    <option value="compound">Compound Interest</option>
                  </select>
                </div>

                {/* Principal Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Principal Amount ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Initial investment amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
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
                          <p>Annual interest rate</p>
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
                    step="0.1"
                  />
                </div>

                {/* Time Period Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Time (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Investment time period</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={timeInYears}
                    onChange={(e) => setTimeInYears(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

                {calculatorType === 'compound' && (
                  <>
                    {/* Compounding Frequency Selection */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Compounding Frequency</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>How often interest is compounded</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <select
                        value={compoundingFrequency}
                        onChange={(e) => setCompoundingFrequency(e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="semiannually">Semi-annually</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Additional Contributions Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Additional Contributions ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Regular additional investments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={additionalContributions}
                    onChange={(e) => setAdditionalContributions(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Contribution Frequency Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contribution Frequency</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often you make additional contributions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={contributionFrequency}
                    onChange={(e) => setContributionFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateInterest}
                >
                  Calculate Interest
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Final Amount</div>
                    <div className="stat-value text-lg">
                      ${finalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg">
                      ${totalInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Contributions</div>
                    <div className="stat-value text-lg">
                      ${totalContributions.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Interest to Principal Ratio</div>
                    <div className="stat-value text-lg">
                      {(totalInterest / totalContributions * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getGrowthChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getFinalBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Interest Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Simple Interest</h3>
                    <ul className="list-disc pl-6">
                      <li>Interest calculated on principal only</li>
                      <li>Linear growth over time</li>
                      <li>Common in short-term loans</li>
                      <li>Easier to calculate</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Compound Interest</h3>
                    <ul className="list-disc pl-6">
                      <li>Interest calculated on principal and accumulated interest</li>
                      <li>Exponential growth over time</li>
                      <li>Common in investments and savings</li>
                      <li>More powerful long-term growth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors Affecting Interest</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Principal Amount:</strong> Initial investment or loan amount
                  </li>
                  <li>
                    <strong>Interest Rate:</strong> Annual percentage rate of return
                  </li>
                  <li>
                    <strong>Time Period:</strong> Duration of investment or loan
                  </li>
                  <li>
                    <strong>Compounding Frequency:</strong> How often interest is calculated
                  </li>
                  <li>
                    <strong>Additional Contributions:</strong> Regular deposits or payments
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Maximizing Interest</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Start early to benefit from compound interest</li>
                  <li>Make regular contributions to accelerate growth</li>
                  <li>Choose higher compounding frequencies when possible</li>
                  <li>Compare different interest rates and terms</li>
                  <li>Consider the impact of fees and taxes</li>
                  <li>Reinvest earnings for maximum growth</li>
                  <li>Maintain a long-term perspective</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
