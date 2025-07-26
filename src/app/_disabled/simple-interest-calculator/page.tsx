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

export default function SimpleInterestCalculator() {
  const breadcrumbItems = [
    {
      label: 'Simple Interest Calculator',
      href: '/simple-interest-calculator'
    }
  ];

  // Calculator State
  const [principal, setPrincipal] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [timeInYears, setTimeInYears] = useState<number>(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('annually');

  // Results
  const [simpleInterest, setSimpleInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [compoundAmount, setCompoundAmount] = useState<number>(0);
  const [interestDifference, setInterestDifference] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateInterest = () => {
    // Calculate Simple Interest
    const si = (principal * interestRate * timeInYears) / 100;
    const total = principal + si;

    // Calculate Compound Interest for comparison
    const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
    const compound = principal * Math.pow(1 + (interestRate / 100) / periodsPerYear, periodsPerYear * timeInYears);
    
    // Calculate yearly data
    const yearlyBalances = [];
    for (let year = 0; year <= timeInYears; year++) {
      const simpleInterestAmount = (principal * interestRate * year) / 100;
      const simpleTotal = principal + simpleInterestAmount;
      
      const compoundTotal = principal * Math.pow(1 + (interestRate / 100) / periodsPerYear, periodsPerYear * year);
      
      yearlyBalances.push({
        year,
        simple: simpleTotal,
        compound: compoundTotal,
        difference: compoundTotal - simpleTotal
      });
    }

    setSimpleInterest(si);
    setTotalAmount(total);
    setCompoundAmount(compound);
    setInterestDifference(compound - total);
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
      default: return 1;
    }
  };

  // Chart for growth comparison
  const getGrowthComparisonChart = () => {
    const years = yearlyData.map(data => data.year);
    const simpleBalances = yearlyData.map(data => data.simple);
    const compoundBalances = yearlyData.map(data => data.compound);

    return {
      title: {
        text: 'Simple vs Compound Interest Growth',
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
        data: ['Simple Interest', 'Compound Interest'],
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
          name: 'Simple Interest',
          type: 'line',
          data: simpleBalances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Compound Interest',
          type: 'line',
          data: compoundBalances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        }
      ]
    };
  };

  // Chart for interest difference
  const getInterestDifferenceChart = () => {
    const years = yearlyData.map(data => data.year);
    const differences = yearlyData.map(data => data.difference);

    return {
      title: {
        text: 'Difference Between Compound and Simple Interest',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          return `Year ${params[0].axisValue}<br/>Difference: $${params[0].value.toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Years'
      },
      yAxis: {
        type: 'value',
        name: 'Difference ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          type: 'bar',
          data: differences,
          itemStyle: { color: '#9C27B0' }
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Simple Interest Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Simple Interest</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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

                {/* Compound Frequency for Comparison */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Compound Frequency (for comparison)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often interest is compounded in the comparison</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="annually">Annually</option>
                    <option value="semiannually">Semi-annually</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateInterest}
                >
                  Calculate
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
                    <div className="stat-title">Simple Interest</div>
                    <div className="stat-value text-lg">
                      ${simpleInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value text-lg">
                      ${totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Compound Amount</div>
                    <div className="stat-value text-lg">
                      ${compoundAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Interest Difference</div>
                    <div className="stat-value text-lg">
                      ${interestDifference.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getGrowthComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getInterestDifferenceChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Simple Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">What is Simple Interest?</h3>
                    <p>Simple interest is calculated only on the principal amount. Unlike compound interest, it doesn't include interest earned on previously accumulated interest. The formula is:</p>
                    <p className="font-mono">Simple Interest = (Principal × Rate × Time) / 100</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Common Applications</h3>
                    <ul className="list-disc pl-6">
                      <li>Short-term loans</li>
                      <li>Car loans</li>
                      <li>Consumer loans</li>
                      <li>Some types of bonds</li>
                      <li>Basic savings accounts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Simple vs Compound Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Simple Interest</h3>
                    <ul className="list-disc pl-6">
                      <li>Interest calculated on principal only</li>
                      <li>Linear growth over time</li>
                      <li>Easier to calculate</li>
                      <li>Lower total interest earned/paid</li>
                      <li>Better for borrowers</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Compound Interest</h3>
                    <ul className="list-disc pl-6">
                      <li>Interest calculated on principal and accumulated interest</li>
                      <li>Exponential growth over time</li>
                      <li>More complex calculations</li>
                      <li>Higher total interest earned/paid</li>
                      <li>Better for investors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Using Simple Interest</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compare with compound interest options</li>
                  <li>Consider the time period carefully</li>
                  <li>Check if interest is truly simple</li>
                  <li>Look for prepayment options</li>
                  <li>Calculate total cost upfront</li>
                  <li>Understand payment schedules</li>
                  <li>Consider inflation effects</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
