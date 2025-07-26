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

export default function CDCalculator() {
  const breadcrumbItems = [
    {
      label: 'CD Calculator',
      href: '/cd-calculator'
    }
  ];

  // Calculator State
  const [principal, setPrincipal] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [termInMonths, setTermInMonths] = useState<number>(12);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
  const [withdrawInterest, setWithdrawInterest] = useState<boolean>(false);
  const [reinvestmentRate, setReinvestmentRate] = useState<number>(4.0);

  // Results
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [finalBalance, setFinalBalance] = useState<number>(0);
  const [monthlyInterest, setMonthlyInterest] = useState<number>(0);
  const [apy, setApy] = useState<number>(0);
  const [earlyWithdrawalPenalty, setEarlyWithdrawalPenalty] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const calculateCD = () => {
    const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
    const totalPeriods = (termInMonths / 12) * periodsPerYear;
    const periodicRate = interestRate / 100 / periodsPerYear;

    let balance = principal;
    let totalInt = 0;
    let monthlyData = [];

    // Calculate APY
    const calculatedApy = (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100;
    setApy(calculatedApy);

    // Calculate monthly interest for interest withdrawal option
    const monthlyInt = (principal * (interestRate / 100)) / 12;
    setMonthlyInterest(monthlyInt);

    // Calculate early withdrawal penalty (typically 3-6 months of interest)
    const penaltyMonths = termInMonths <= 12 ? 3 : 6;
    const penalty = monthlyInt * penaltyMonths;
    setEarlyWithdrawalPenalty(penalty);

    // Calculate growth over time
    for (let month = 0; month <= termInMonths; month++) {
      if (withdrawInterest) {
        // If withdrawing interest, principal stays the same
        const monthInterest = (principal * (interestRate / 100)) / 12;
        totalInt += monthInterest;
        
        monthlyData.push({
          month,
          balance: principal,
          interest: totalInt,
          withdrawal: month * monthInterest
        });
      } else {
        // Compound interest calculation
        if (month % (12 / periodsPerYear) === 0) {
          const interest = balance * periodicRate;
          balance += interest;
          totalInt += interest;
        }
        
        monthlyData.push({
          month,
          balance: balance,
          interest: totalInt,
          withdrawal: 0
        });
      }
    }

    setTotalInterest(totalInt);
    setFinalBalance(balance);
    setMonthlyData(monthlyData);
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

  // Chart for CD growth
  const getCDGrowthChart = () => {
    const months = monthlyData.map(data => data.month);
    const balances = monthlyData.map(data => data.balance);
    const withdrawals = monthlyData.map(data => data.withdrawal);

    return {
      title: {
        text: 'CD Growth Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          let result = `Month ${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: $${param.value.toFixed(2)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Balance', 'Total Withdrawals'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: months,
        name: 'Months'
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
          name: 'Balance',
          type: 'line',
          data: balances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Total Withdrawals',
          type: 'line',
          data: withdrawals,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        }
      ]
    };
  };

  // Chart for interest breakdown
  const getInterestBreakdownChart = () => {
    const data = [
      { value: principal, name: 'Principal' },
      { value: totalInterest, name: 'Interest' }
    ];

    return {
      title: {
        text: 'Principal vs Interest',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
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
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '${c}\n{b}'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          data: data
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">CD Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate CD Returns</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Principal Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Deposit ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount you plan to deposit in the CD</p>
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
                          <p>Annual interest rate offered by the CD</p>
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
                    step="0.01"
                  />
                </div>

                {/* Term Length Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Term Length (months)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the CD term</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={termInMonths}
                    onChange={(e) => setTermInMonths(Number(e.target.value))}
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
                    <option value="semiannually">Semi-annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                {/* Interest Withdrawal Option */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Withdraw Interest</span>
                    <input
                      type="checkbox"
                      checked={withdrawInterest}
                      onChange={(e) => setWithdrawInterest(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {/* Reinvestment Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expected Reinvestment Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected rate for reinvesting at maturity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={reinvestmentRate}
                    onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateCD}
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
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg">
                      ${totalInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Final Balance</div>
                    <div className="stat-value text-lg">
                      ${finalBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Interest</div>
                    <div className="stat-value text-lg">
                      ${monthlyInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">APY</div>
                    <div className="stat-value text-lg">
                      {apy.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <div className="font-semibold mb-2">Early Withdrawal Penalty</div>
                  <div className="text-lg">${earlyWithdrawalPenalty.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    Estimated penalty for early withdrawal ({termInMonths <= 12 ? '3' : '6'} months of interest)
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCDGrowthChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getInterestBreakdownChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding CDs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">What is a CD?</h3>
                    <p>A Certificate of Deposit (CD) is a time deposit that offers a guaranteed interest rate for a fixed term. Key features include:</p>
                    <ul className="list-disc pl-6">
                      <li>Fixed term length</li>
                      <li>Guaranteed return</li>
                      <li>FDIC insurance</li>
                      <li>Higher rates than savings</li>
                      <li>Early withdrawal penalties</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Types of CDs</h3>
                    <ul className="list-disc pl-6">
                      <li>Traditional CD</li>
                      <li>No-penalty CD</li>
                      <li>Step-up CD</li>
                      <li>Bump-up CD</li>
                      <li>Jumbo CD</li>
                      <li>IRA CD</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">CD Strategies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">CD Ladder</h3>
                    <p>A CD ladder involves buying multiple CDs with different maturity dates to:</p>
                    <ul className="list-disc pl-6">
                      <li>Maintain liquidity</li>
                      <li>Take advantage of higher rates</li>
                      <li>Minimize interest rate risk</li>
                      <li>Create regular income</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">CD Barbell</h3>
                    <p>A CD barbell strategy involves:</p>
                    <ul className="list-disc pl-6">
                      <li>Short-term CDs for liquidity</li>
                      <li>Long-term CDs for higher yields</li>
                      <li>Skip middle-term CDs</li>
                      <li>Balance risk and return</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for CD Investing</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Compare APY across institutions</li>
                  <li>Understand early withdrawal penalties</li>
                  <li>Consider inflation rates</li>
                  <li>Plan for interest rate changes</li>
                  <li>Review grace period policies</li>
                  <li>Keep track of maturity dates</li>
                  <li>Consider CD alternatives</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
