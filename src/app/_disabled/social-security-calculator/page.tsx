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

export default function SocialSecurityCalculator() {
  const breadcrumbItems = [
    {
      label: 'Social Security Calculator',
      href: '/social-security-calculator'
    }
  ];

  // Constants for 2024
  const CURRENT_YEAR = new Date().getFullYear();
  const FULL_RETIREMENT_AGE = 67; // For those born in 1960 or later
  const MAX_BENEFIT_AGE = 70;
  const MIN_BENEFIT_AGE = 62;
  const COLA_RATE = 3.2; // 2024 Cost of Living Adjustment

  // Personal Inputs
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(67);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);
  const [yearsWorked, setYearsWorked] = useState<number>(15);
  const [expectedFutureIncome, setExpectedFutureIncome] = useState<number>(85000);

  // Results
  const [monthlyBenefit, setMonthlyBenefit] = useState<number>(0);
  const [totalLifetimeBenefits, setTotalLifetimeBenefits] = useState<number>(0);
  const [benefitReduction, setBenefitReduction] = useState<number>(0);
  const [benefitIncrease, setBenefitIncrease] = useState<number>(0);
  const [yearlyProjection, setYearlyProjection] = useState<Array<{
    age: number;
    benefit: number;
    cumulativeBenefit: number;
  }>>([]);

  const calculateSocialSecurity = () => {
    // Calculate full retirement age benefit (simplified calculation)
    // In reality, this would use the actual Social Security Administration formula
    const averageIncome = (annualIncome + expectedFutureIncome) / 2;
    let baseMonthlyBenefit = (averageIncome * 0.4) / 12; // Simplified calculation

    // Adjust for early or late retirement
    let adjustedBenefit = baseMonthlyBenefit;
    if (retirementAge < FULL_RETIREMENT_AGE) {
      // Reduce benefits for early retirement (approximately 6.67% per year)
      const reduction = ((FULL_RETIREMENT_AGE - retirementAge) * 6.67) / 100;
      adjustedBenefit *= (1 - reduction);
      setBenefitReduction(reduction * 100);
      setBenefitIncrease(0);
    } else if (retirementAge > FULL_RETIREMENT_AGE) {
      // Increase benefits for delayed retirement (8% per year)
      const increase = ((retirementAge - FULL_RETIREMENT_AGE) * 8) / 100;
      adjustedBenefit *= (1 + increase);
      setBenefitIncrease(increase * 100);
      setBenefitReduction(0);
    }

    setMonthlyBenefit(adjustedBenefit);

    // Calculate lifetime benefits
    const yearsReceivingBenefits = lifeExpectancy - retirementAge;
    const totalBenefits = adjustedBenefit * 12 * yearsReceivingBenefits;
    setTotalLifetimeBenefits(totalBenefits);

    // Calculate yearly projection with COLA
    const projection = [];
    let currentBenefit = adjustedBenefit;
    let cumulativeBenefit = 0;

    for (let age = retirementAge; age <= lifeExpectancy; age++) {
      cumulativeBenefit += currentBenefit * 12;
      projection.push({
        age,
        benefit: currentBenefit * 12,
        cumulativeBenefit
      });
      currentBenefit *= (1 + COLA_RATE / 100); // Apply COLA increase
    }

    setYearlyProjection(projection);
  };

  // Chart for benefit projection
  const getBenefitProjectionChart = () => {
    return {
      title: {
        text: 'Annual Benefit Projection',
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
            Annual Benefit: $${data[1].toLocaleString('en-US', {
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
        name: 'Annual Benefit ($)',
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
          name: 'Annual Benefit',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.benefit]),
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

  // Chart for cumulative benefits
  const getCumulativeBenefitsChart = () => {
    return {
      title: {
        text: 'Cumulative Benefits Over Time',
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
            Total Benefits: $${data[1].toLocaleString('en-US', {
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
        max: lifeExpectancy
      },
      yAxis: {
        type: 'value',
        name: 'Cumulative Benefits ($)',
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
          name: 'Cumulative Benefits',
          type: 'line',
          smooth: true,
          data: yearlyProjection.map(item => [item.age, item.cumulativeBenefit]),
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Social Security Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Personal Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Birth Year Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Birth Year</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your birth year affects your full retirement age</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1900"
                    max={CURRENT_YEAR - 18}
                  />
                </div>

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
                    <span className="label-text">Planned Retirement Age</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Age you plan to start collecting Social Security benefits</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={MIN_BENEFIT_AGE}
                    max={MAX_BENEFIT_AGE}
                  />
                </div>

                <Separator />

                {/* Annual Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Annual Income ($)</span>
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

                {/* Years Worked Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years Worked</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total years you've worked and paid Social Security taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={yearsWorked}
                    onChange={(e) => setYearsWorked(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="50"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateSocialSecurity}
                >
                  Calculate Benefits
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Benefit Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Benefit</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${monthlyBenefit.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Lifetime Benefits</div>
                    <div className="stat-value text-lg">
                      ${totalLifetimeBenefits.toLocaleString()}
                    </div>
                  </div>
                  {benefitReduction > 0 && (
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Early Retirement Reduction</div>
                      <div className="stat-value text-lg text-red-500">
                        {benefitReduction.toFixed(1)}%
                      </div>
                    </div>
                  )}
                  {benefitIncrease > 0 && (
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Delayed Retirement Credits</div>
                      <div className="stat-value text-lg text-green-500">
                        +{benefitIncrease.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getBenefitProjectionChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getCumulativeBenefitsChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Social Security Benefits</h2>
              <p className="mb-4">
                Social Security retirement benefits are monthly payments provided to eligible workers 
                and their families. The amount you receive depends on your earnings history, the age 
                you start collecting benefits, and other factors.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Factors Affecting Your Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Retirement Age</h3>
                    <p>
                      Your monthly benefit amount can vary significantly based on the age you start 
                      receiving benefits. You can start receiving benefits as early as age {MIN_BENEFIT_AGE} 
                      or delay until age {MAX_BENEFIT_AGE}. Full retirement age is {FULL_RETIREMENT_AGE} for 
                      those born in 1960 or later.
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-2">Work History</h3>
                    <p>
                      Your benefit is based on your highest 35 years of earnings. Working longer and 
                      earning more can increase your benefit amount. Years with no earnings are 
                      counted as zeros in the calculation.
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
                    Early retirement can permanently reduce your benefits
                  </li>
                  <li className="mb-2">
                    Delayed retirement credits increase your benefit amount
                  </li>
                  <li className="mb-2">
                    Cost of Living Adjustments (COLA) help benefits keep pace with inflation
                  </li>
                  <li>
                    Working while receiving benefits may affect your payment amount
                  </li>
                </ul>
                <p>
                  This calculator provides estimates based on current rules and regulations. Actual 
                  benefits may vary based on changes in law, your earnings record, and other factors. 
                  For the most accurate information, create an account at www.ssa.gov.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
