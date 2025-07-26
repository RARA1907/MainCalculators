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

export default function InvestmentCalculator() {
  const breadcrumbItems = [
    {
      label: 'Investment Calculator',
      href: '/investment-calculator'
    }
  ];

  // Investment Details
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualReturn, setAnnualReturn] = useState<number>(8);
  const [investmentLength, setInvestmentLength] = useState<number>(20);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
  const [inflationRate, setInflationRate] = useState<number>(2.5);

  // Results
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [finalBalance, setFinalBalance] = useState<number>(0);
  const [inflationAdjustedBalance, setInflationAdjustedBalance] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateCompoundInterest = () => {
    let periodsPerYear = getPeriodsPerYear();
    let totalPeriods = investmentLength * periodsPerYear;
    let periodicRate = annualReturn / 100 / periodsPerYear;
    let periodicContribution = monthlyContribution * (12 / periodsPerYear);
    
    let balance = initialInvestment;
    let contributions = initialInvestment;
    let yearlyBalances = [];
    
    for (let period = 1; period <= totalPeriods; period++) {
      // Add periodic contribution
      balance = balance * (1 + periodicRate) + periodicContribution;
      contributions += periodicContribution;
      
      // Store yearly data
      if (period % periodsPerYear === 0) {
        const year = period / periodsPerYear;
        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        yearlyBalances.push({
          year,
          balance,
          contributions,
          interest: balance - contributions,
          inflationAdjusted: balance / inflationFactor
        });
      }
    }

    setTotalContributions(contributions);
    setTotalInterest(balance - contributions);
    setFinalBalance(balance);
    setInflationAdjustedBalance(balance / Math.pow(1 + inflationRate / 100, investmentLength));
    setYearlyData(yearlyBalances);
  };

  const getPeriodsPerYear = () => {
    switch (compoundingFrequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'annually': return 1;
      default: return 12;
    }
  };

  // Chart for investment growth
  const getInvestmentGrowthChart = () => {
    const years = yearlyData.map(data => data.year);
    const balances = yearlyData.map(data => data.balance);
    const contributions = yearlyData.map(data => data.contributions);
    const inflationAdjusted = yearlyData.map(data => data.inflationAdjusted);

    return {
      title: {
        text: 'Investment Growth Over Time',
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
        data: ['Total Balance', 'Total Contributions', 'Inflation Adjusted'],
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
          name: 'Total Contributions',
          type: 'line',
          data: contributions,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        },
        {
          name: 'Inflation Adjusted',
          type: 'line',
          data: inflationAdjusted,
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
        text: 'Investment Breakdown',
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
              name: 'Investment Returns',
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Investment Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Investment Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                          <p>Starting amount to invest</p>
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
                          <p>Amount to invest each month</p>
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

                {/* Annual Return Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Annual Return (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual rate of return</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Investment Length Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Investment Length (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long you plan to invest</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={investmentLength}
                    onChange={(e) => setInvestmentLength(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

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
                    <option value="annually">Annually</option>
                  </select>
                </div>

                {/* Inflation Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Inflation Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual inflation rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateCompoundInterest}
                >
                  Calculate Returns
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Investment Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Final Balance</div>
                    <div className="stat-value text-lg">
                      ${finalBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Contributions</div>
                    <div className="stat-value text-lg">
                      ${totalContributions.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg">
                      ${totalInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Inflation Adjusted Balance</div>
                    <div className="stat-value text-lg">
                      ${inflationAdjustedBalance.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getInvestmentGrowthChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getFinalBreakdownChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Investment Growth</h2>
              <p className="mb-4">
                Investment growth is powered by compound interest - when your returns generate their 
                own returns. The more frequently interest is compounded and the longer your investment 
                horizon, the more dramatic this effect becomes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Investment Strategies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Lump Sum Investing</h3>
                    <ul className="list-disc pl-6">
                      <li>Invest a large amount at once</li>
                      <li>More time in the market</li>
                      <li>Potentially higher returns</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Dollar-Cost Averaging</h3>
                    <ul className="list-disc pl-6">
                      <li>Regular periodic investments</li>
                      <li>Reduces timing risk</li>
                      <li>More manageable for most investors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors Affecting Returns</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Time Horizon:</strong>
                    <ul className="pl-6 mt-2">
                      <li>Longer periods allow more compounding</li>
                      <li>Helps smooth out market volatility</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Rate of Return:</strong>
                    <ul className="pl-6 mt-2">
                      <li>Different asset classes have different expected returns</li>
                      <li>Higher returns often come with higher risk</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Contribution Amount:</strong>
                    <ul className="pl-6 mt-2">
                      <li>Regular contributions accelerate growth</li>
                      <li>More contributions = more potential returns</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Inflation:</strong>
                    <ul className="pl-6 mt-2">
                      <li>Reduces purchasing power over time</li>
                      <li>Important to consider real returns</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Investment Tips</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Start early to maximize compound interest</li>
                  <li>Diversify your investments</li>
                  <li>Consider your risk tolerance</li>
                  <li>Reinvest dividends and gains</li>
                  <li>Review and rebalance regularly</li>
                  <li>Account for taxes and fees</li>
                  <li>Stay invested during market volatility</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
