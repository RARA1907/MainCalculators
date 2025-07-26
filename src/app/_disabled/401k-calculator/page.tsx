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

export default function FourZeroOneKCalculator() {
  const breadcrumbItems = [
    {
      label: '401(k) Calculator',
      href: '/401k-calculator'
    }
  ];

  // Constants
  const CURRENT_YEAR = new Date().getFullYear();
  const MAX_CONTRIBUTION = 22500; // 2024 limit
  const CATCH_UP_AGE = 50;
  const CATCH_UP_CONTRIBUTION = 7500; // 2024 catch-up limit

  // Personal Inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [currentBalance, setCurrentBalance] = useState<number>(50000);
  const [contributionPercent, setContributionPercent] = useState<number>(6);
  const [employerMatch, setEmployerMatch] = useState<number>(50);
  const [employerMatchLimit, setEmployerMatchLimit] = useState<number>(6);
  const [annualRaise, setAnnualRaise] = useState<number>(2);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);

  // Results
  const [projectedBalance, setProjectedBalance] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalEmployerMatch, setTotalEmployerMatch] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<Array<{
    age: number;
    year: number;
    balance: number;
    contribution: number;
    employerMatch: number;
    earnings: number;
  }>>([]);

  const calculate401k = () => {
    let balance = currentBalance;
    let totalContrib = 0;
    let totalMatch = 0;
    let totalEarn = 0;
    let salary = currentSalary;
    let breakdown = [];
    
    for (let age = currentAge; age <= retirementAge; age++) {
      const year = CURRENT_YEAR + (age - currentAge);
      const startBalance = balance;
      
      // Calculate contribution limits
      const baseLimit = MAX_CONTRIBUTION;
      const catchUpAllowed = age >= CATCH_UP_AGE ? CATCH_UP_CONTRIBUTION : 0;
      const maxAllowed = baseLimit + catchUpAllowed;

      // Calculate employee contribution
      const employeeContribution = Math.min(
        (salary * (contributionPercent / 100)),
        maxAllowed
      );

      // Calculate employer match
      const matchLimit = salary * (employerMatchLimit / 100);
      const actualMatch = Math.min(
        employeeContribution,
        matchLimit
      ) * (employerMatch / 100);

      // Add contributions and calculate returns
      balance = balance * (1 + expectedReturn / 100);
      balance += employeeContribution + actualMatch;

      // Update totals
      totalContrib += employeeContribution;
      totalMatch += actualMatch;
      totalEarn = balance - totalContrib - totalMatch - currentBalance;

      // Store yearly details
      breakdown.push({
        age,
        year,
        balance,
        contribution: employeeContribution,
        employerMatch: actualMatch,
        earnings: balance - startBalance - employeeContribution - actualMatch
      });

      // Increase salary for next year
      salary *= (1 + annualRaise / 100);
    }

    setProjectedBalance(balance);
    setTotalContributions(totalContrib);
    setTotalEmployerMatch(totalMatch);
    setTotalEarnings(totalEarn);
    setYearlyBreakdown(breakdown);
  };

  // Chart for 401(k) balance growth
  const getBalanceGrowthChart = () => {
    return {
      title: {
        text: '401(k) Balance Growth',
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
          data: yearlyBreakdown.map(item => [item.age, item.balance]),
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

  // Chart for 401(k) composition
  const getCompositionChart = () => {
    return {
      title: {
        text: '401(k) Composition',
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
              value: currentBalance,
              name: 'Current Balance',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalContributions,
              name: 'Your Contributions',
              itemStyle: { color: '#2196F3' }
            },
            {
              value: totalEmployerMatch,
              name: 'Employer Match',
              itemStyle: { color: '#FFC107' }
            },
            {
              value: totalEarnings,
              name: 'Investment Returns',
              itemStyle: { color: '#9C27B0' }
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">401(k) Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal & Plan Details</h2>
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
                    max="80"
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

                <Separator />

                {/* Current Salary Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Annual Salary ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current annual salary before taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Current 401(k) Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current 401(k) Balance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current 401(k) account balance</p>
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

                {/* Contribution Percentage Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Contribution (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of salary you contribute to 401(k)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={contributionPercent}
                    onChange={(e) => setContributionPercent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                {/* Employer Match Percentage Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employer Match (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage your employer matches of your contributions</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="5"
                  />
                </div>

                {/* Employer Match Limit Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employer Match Limit (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Maximum salary percentage your employer will match</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={employerMatchLimit}
                    onChange={(e) => setEmployerMatchLimit(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculate401k}
                >
                  Calculate 401(k)
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">401(k) Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Projected Balance</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${projectedBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Your Contributions</div>
                    <div className="stat-value text-lg">
                      ${totalContributions.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Employer Match</div>
                    <div className="stat-value text-lg">
                      ${totalEmployerMatch.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Investment Returns</div>
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
                    <ReactECharts option={getCompositionChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Your 401(k)</h2>
              <p className="mb-4">
                A 401(k) is a powerful retirement savings tool that offers tax advantages and potential 
                employer matching contributions. This calculator helps you estimate how your 401(k) 
                balance might grow over time based on your contributions, employer match, and 
                investment returns.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key 401(k) Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Contribution Limits</h3>
                    <p>
                      For {CURRENT_YEAR}, you can contribute up to ${MAX_CONTRIBUTION.toLocaleString()} 
                      to your 401(k). If you're {CATCH_UP_AGE} or older, you can make additional 
                      catch-up contributions of up to ${CATCH_UP_CONTRIBUTION.toLocaleString()}.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Employer Match</h3>
                    <p>
                      Many employers match a portion of your contributions, effectively providing 
                      "free money" for your retirement. Taking full advantage of your employer match 
                      can significantly boost your retirement savings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Maximizing Your 401(k)</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Contribute at least enough to get your full employer match
                  </li>
                  <li className="mb-2">
                    Consider increasing contributions when you get a raise
                  </li>
                  <li className="mb-2">
                    Take advantage of catch-up contributions if you're 50 or older
                  </li>
                  <li>
                    Review and rebalance your investment choices periodically
                  </li>
                </ul>
                <p>
                  Remember that while this calculator provides estimates based on your inputs, actual 
                  results will vary depending on market performance and other factors. Consider 
                  consulting with a financial advisor for personalized retirement planning advice.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
