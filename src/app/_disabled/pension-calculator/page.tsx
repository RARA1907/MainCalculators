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

export default function PensionCalculator() {
  const breadcrumbItems = [
    {
      label: 'Pension Calculator',
      href: '/pension-calculator'
    }
  ];

  // Personal Inputs
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [yearsOfService, setYearsOfService] = useState<number>(10);
  const [expectedFinalSalary, setExpectedFinalSalary] = useState<number>(100000);
  const [pensionType, setPensionType] = useState<string>('defined-benefit');
  const [accrualRate, setAccrualRate] = useState<number>(1.5);
  const [inflationRate, setInflationRate] = useState<number>(2.5);

  // Additional Benefits
  const [socialSecurityBenefit, setSocialSecurityBenefit] = useState<number>(2000);
  const [otherIncome, setOtherIncome] = useState<number>(500);

  // Results
  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [totalPensionValue, setTotalPensionValue] = useState<number>(0);
  const [replacementRate, setReplacementRate] = useState<number>(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<{
    pension: number;
    socialSecurity: number;
    otherIncome: number;
  }>({
    pension: 0,
    socialSecurity: 0,
    otherIncome: 0
  });
  const [yearlyProjection, setYearlyProjection] = useState<Array<{
    age: number;
    pensionAmount: number;
    totalIncome: number;
  }>>([]);

  const calculatePension = () => {
    // Calculate years in retirement
    const retirementYears = lifeExpectancy - retirementAge;
    
    // Calculate base pension based on type
    let basePension = 0;
    if (pensionType === 'defined-benefit') {
      basePension = (expectedFinalSalary * (accrualRate / 100) * yearsOfService);
    } else {
      // Simplified defined-contribution calculation
      basePension = (expectedFinalSalary * 0.6); // Assuming 60% replacement rate
    }

    // Calculate monthly pension
    const monthlyPensionAmount = basePension / 12;
    setMonthlyPension(monthlyPensionAmount);

    // Calculate total pension value
    const totalValue = monthlyPensionAmount * 12 * retirementYears;
    setTotalPensionValue(totalValue);

    // Calculate replacement rate
    const totalMonthlyIncome = monthlyPensionAmount + socialSecurityBenefit + otherIncome;
    const replacementRateCalc = (totalMonthlyIncome * 12 / expectedFinalSalary) * 100;
    setReplacementRate(replacementRateCalc);

    // Set monthly breakdown
    setMonthlyBreakdown({
      pension: monthlyPensionAmount,
      socialSecurity: socialSecurityBenefit,
      otherIncome: otherIncome
    });

    // Calculate yearly projection with inflation adjustment
    const projection = [];
    let currentPension = monthlyPensionAmount;
    let currentTotal = currentPension + socialSecurityBenefit + otherIncome;

    for (let age = retirementAge; age <= lifeExpectancy; age++) {
      projection.push({
        age,
        pensionAmount: currentPension * 12,
        totalIncome: currentTotal * 12
      });

      // Apply inflation adjustment for next year
      currentPension *= (1 + inflationRate / 100);
      currentTotal = currentPension + socialSecurityBenefit + otherIncome;
    }

    setYearlyProjection(projection);
  };

  // Chart for income breakdown
  const getIncomeBreakdownChart = () => {
    return {
      title: {
        text: 'Monthly Retirement Income Breakdown',
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
              value: monthlyBreakdown.pension,
              name: 'Pension',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: monthlyBreakdown.socialSecurity,
              name: 'Social Security',
              itemStyle: { color: '#2196F3' }
            },
            {
              value: monthlyBreakdown.otherIncome,
              name: 'Other Income',
              itemStyle: { color: '#FFC107' }
            }
          ]
        }
      ]
    };
  };

  // Chart for pension projection
  const getPensionProjectionChart = () => {
    return {
      title: {
        text: 'Annual Income Projection',
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
            Annual Income: $${data[1].toLocaleString('en-US', {
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
        min: retirementAge,
        max: lifeExpectancy,
        axisLabel: {
          formatter: '{value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Annual Income ($)',
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
          name: 'Total Income',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.totalIncome]),
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Pension Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal & Pension Details</h2>
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
                          <p>Age you plan to retire and start receiving pension</p>
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

                {/* Years of Service Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years of Service</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total years you'll work before retirement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={yearsOfService}
                    onChange={(e) => setYearsOfService(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="50"
                  />
                </div>

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
                          <p>Your current annual salary</p>
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

                {/* Expected Final Salary Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Final Salary ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected salary at retirement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={expectedFinalSalary}
                    onChange={(e) => setExpectedFinalSalary(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={currentSalary}
                    step="1000"
                  />
                </div>

                {/* Pension Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pension Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Type of pension plan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={pensionType}
                    onChange={(e) => setPensionType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="defined-benefit">Defined Benefit</option>
                    <option value="defined-contribution">Defined Contribution</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePension}
                >
                  Calculate Pension
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Pension Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Pension</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${monthlyPension.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Pension Value</div>
                    <div className="stat-value text-lg">
                      ${totalPensionValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Income Replacement</div>
                    <div className="stat-value text-lg">
                      {replacementRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Years in Retirement</div>
                    <div className="stat-value text-lg">
                      {lifeExpectancy - retirementAge}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getIncomeBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getPensionProjectionChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Your Pension</h2>
              <p className="mb-4">
                A pension is a retirement plan that provides a regular income stream during your 
                retirement years. The amount you receive typically depends on factors such as your 
                years of service, final salary, and the type of pension plan you have.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Types of Pension Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Defined Benefit Plans</h3>
                    <p>
                      These plans promise a specific monthly benefit at retirement. The benefit is 
                      typically based on a formula that considers your salary history and years of 
                      service. The employer bears the investment risk.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Defined Contribution Plans</h3>
                    <p>
                      These plans specify how much money goes into your retirement account, typically 
                      through employer and employee contributions. The final benefit depends on how 
                      well the investments perform.
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
                    Check your pension plan's vesting schedule and requirements
                  </li>
                  <li className="mb-2">
                    Consider how inflation might affect your pension's purchasing power
                  </li>
                  <li className="mb-2">
                    Understand your pension's survivor benefits and options
                  </li>
                  <li>
                    Review your pension alongside other retirement income sources
                  </li>
                </ul>
                <p>
                  Remember that pension benefits can be complex and vary significantly between 
                  employers and plan types. Consider consulting with your HR department or a 
                  financial advisor for specific guidance about your pension plan.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
