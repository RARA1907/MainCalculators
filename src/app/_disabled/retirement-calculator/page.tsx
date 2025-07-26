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

export default function RetirementCalculator() {
  const breadcrumbItems = [
    {
      label: 'Retirement Calculator',
      href: '/retirement-calculator'
    }
  ];

  // Personal Information
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);

  // Investment Details
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState<number>(5000);
  const [socialSecurityIncome, setSocialSecurityIncome] = useState<number>(1500);

  // Results
  const [totalSavingsNeeded, setTotalSavingsNeeded] = useState<number>(0);
  const [projectedSavings, setProjectedSavings] = useState<number>(0);
  const [monthlyIncomeFromSavings, setMonthlyIncomeFromSavings] = useState<number>(0);
  const [savingsGap, setSavingsGap] = useState<number>(0);
  const [retirementBreakdown, setRetirementBreakdown] = useState({
    principal: 0,
    contributions: 0,
    returns: 0
  });

  const calculateRetirement = () => {
    // Calculate years until retirement
    const yearsUntilRetirement = retirementAge - currentAge;
    
    // Adjust returns for inflation
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    
    // Calculate required retirement savings (using 4% rule)
    const monthlyNeeds = desiredMonthlyIncome - socialSecurityIncome;
    const annualNeeds = monthlyNeeds * 12;
    const requiredSavings = annualNeeds / 0.04;
    setTotalSavingsNeeded(requiredSavings);

    // Calculate future value of current savings
    let futureValue = currentSavings;
    let totalContributions = 0;
    let totalReturns = 0;

    for (let year = 1; year <= yearsUntilRetirement; year++) {
      const startValue = futureValue;
      const yearlyContribution = monthlyContribution * 12;
      totalContributions += yearlyContribution;
      
      futureValue = (futureValue + yearlyContribution) * (1 + realReturn);
      totalReturns += futureValue - startValue - yearlyContribution;
    }

    setProjectedSavings(futureValue);
    setMonthlyIncomeFromSavings((futureValue * 0.04) / 12);
    setSavingsGap(Math.max(0, requiredSavings - futureValue));

    // Set breakdown for pie chart
    setRetirementBreakdown({
      principal: currentSavings,
      contributions: totalContributions,
      returns: totalReturns
    });
  };

  // Chart for retirement savings breakdown
  const getSavingsBreakdownChart = () => {
    return {
      title: {
        text: 'Retirement Savings Breakdown',
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
              value: retirementBreakdown.principal, 
              name: 'Current Savings',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: retirementBreakdown.contributions, 
              name: 'Future Contributions',
              itemStyle: { color: '#2196F3' }
            },
            { 
              value: retirementBreakdown.returns, 
              name: 'Investment Returns',
              itemStyle: { color: '#FFC107' }
            }
          ]
        }
      ]
    };
  };

  // Chart for savings vs. needs comparison
  const getSavingsComparisonChart = () => {
    return {
      title: {
        text: 'Savings vs. Needs Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const value = params[0].value;
          return `${params[0].name}: $${value.toLocaleString('en-US', {
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
        type: 'category',
        data: ['Projected Savings', 'Required Savings'],
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
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
          data: [
            { 
              value: projectedSavings,
              itemStyle: { 
                color: '#4CAF50',
                borderRadius: [8, 8, 0, 0]
              }
            },
            { 
              value: totalSavingsNeeded,
              itemStyle: { 
                color: '#2196F3',
                borderRadius: [8, 8, 0, 0]
              }
            }
          ],
          type: 'bar',
          barWidth: '40%'
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Retirement Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal & Investment Details</h2>
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
                    min="0"
                    max="100"
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
                          <p>Age at which you plan to retire</p>
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

                {/* Current Savings Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Savings ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current retirement savings</p>
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

                <Separator />
                <h3 className="text-lg font-semibold">Investment Details</h3>

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
                          <p>How much you save each month</p>
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
                    max="20"
                    step="0.1"
                  />
                </div>

                {/* Desired Monthly Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Desired Monthly Income ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly income needed in retirement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={desiredMonthlyIncome}
                    onChange={(e) => setDesiredMonthlyIncome(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRetirement}
                >
                  Calculate Retirement Plan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Retirement Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Projected Savings</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${projectedSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Income</div>
                    <div className="stat-value text-lg">
                      ${monthlyIncomeFromSavings.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Required Savings</div>
                    <div className="stat-value text-lg">
                      ${totalSavingsNeeded.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Savings Gap</div>
                    <div className="stat-value text-lg">
                      ${savingsGap.toLocaleString()}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getSavingsBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getSavingsComparisonChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Retirement Planning</h2>
              <p className="mb-4">
                Retirement planning is crucial for ensuring financial security in your later years. 
                This calculator helps you estimate how much you'll need to save for a comfortable retirement 
                by considering factors such as your current age, desired retirement age, expected investment 
                returns, and anticipated expenses.
              </p>
              <p className="mb-4">
                Using the widely-accepted 4% rule, which suggests you can safely withdraw 4% of your retirement 
                savings each year while maintaining your principal balance, this calculator provides insights 
                into your retirement readiness and helps identify any potential savings gaps.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Components of Retirement Planning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Investment Returns</h3>
                    <p>
                      The expected rate of return on your investments plays a crucial role in 
                      determining how much you need to save. A diversified portfolio typically 
                      aims for 6-8% annual returns over the long term, though actual returns may vary.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Inflation Impact</h3>
                    <p>
                      Inflation erodes purchasing power over time. This calculator accounts for 
                      inflation by using real returns (nominal returns minus inflation) in its 
                      calculations, helping provide more accurate long-term projections.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Social Security Benefits</h3>
                    <p>
                      Social Security can provide a significant portion of your retirement income. 
                      Consider your expected benefits when planning, but remember that these benefits 
                      alone may not be sufficient to maintain your desired lifestyle.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Savings Strategy</h3>
                    <p>
                      Regular contributions to your retirement savings are essential. This calculator 
                      helps you understand if your current savings rate is sufficient or if adjustments 
                      are needed to reach your retirement goals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Calculator Limitations</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <p className="mb-4">
                  While this calculator provides valuable insights, it's essential to understand its limitations:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    Relies on assumptions about future market returns and inflation rates
                  </li>
                  <li className="mb-2">
                    Does not account for all possible variables affecting retirement savings
                  </li>
                  <li className="mb-2">
                    Provides estimates based on current inputs, which may change over time
                  </li>
                  <li>
                    Should be used as one of many tools in your retirement planning process
                  </li>
                </ul>
                <p>
                  For comprehensive retirement planning, consider consulting with a financial advisor 
                  who can provide personalized advice based on your specific situation.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
