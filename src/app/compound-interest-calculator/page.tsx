'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

export default function CompoundInterestCalculator() {
  const breadcrumbItems = [
    {
      label: 'Compound Interest Calculator',
      href: '/compound-interest-calculator'
    }
  ];

  // Calculator State
  const [principal, setPrincipal] = useState<number>(10000);
  const [annualContribution, setAnnualContribution] = useState<number>(1200);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [timeInYears, setTimeInYears] = useState<number>(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
  const [contributionFrequency, setContributionFrequency] = useState<string>('monthly');
  const [contributionTiming, setContributionTiming] = useState<'beginning' | 'end'>('end');
  const [inflationRate, setInflationRate] = useState<number>(2.5);

  // Results
  const [finalBalance, setFinalBalance] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [inflationAdjustedBalance, setInflationAdjustedBalance] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateCompoundInterest = () => {
    const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
    const contributionsPerYear = getPeriodsPerYear(contributionFrequency);
    const totalPeriods = timeInYears * periodsPerYear;
    const periodicRate = interestRate / 100 / periodsPerYear;
    const periodicContribution = annualContribution / contributionsPerYear;

    let balance = principal;
    let totalContributionAmount = principal;
    let yearlyBalances = [];

    for (let period = 1; period <= totalPeriods; period++) {
      // Add contribution at the beginning if selected
      if (contributionTiming === 'beginning') {
        if (period % (periodsPerYear / contributionsPerYear) === 1) {
          balance += periodicContribution;
          totalContributionAmount += periodicContribution;
        }
      }

      // Apply compound interest
      balance *= (1 + periodicRate);

      // Add contribution at the end if selected
      if (contributionTiming === 'end') {
        if (period % (periodsPerYear / contributionsPerYear) === 0) {
          balance += periodicContribution;
          totalContributionAmount += periodicContribution;
        }
      }

      // Store yearly data
      if (period % periodsPerYear === 0) {
        const year = period / periodsPerYear;
        const inflationFactor = Math.pow(1 + inflationRate / 100, year);
        yearlyBalances.push({
          year,
          balance,
          contributions: totalContributionAmount,
          interest: balance - totalContributionAmount,
          inflationAdjusted: balance / inflationFactor
        });
      }
    }

    setFinalBalance(balance);
    setTotalContributions(totalContributionAmount);
    setTotalInterest(balance - totalContributionAmount);
    setInflationAdjustedBalance(balance / Math.pow(1 + inflationRate / 100, timeInYears));
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

  // Chart for growth visualization
  const getGrowthChart = () => {
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Compound Interest Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Investment Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Principal Amount Input */}
                <div>
                  <Label>Initial Investment ($)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      min="0"
                    />
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
                  </div>
                </div>

                {/* Annual Contribution Input */}
                <div>
                  <Label>Annual Contribution ($)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={annualContribution}
                      onChange={(e) => setAnnualContribution(Number(e.target.value))}
                      min="0"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total contributions per year</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Interest Rate Input */}
                <div>
                  <Label>Annual Interest Rate (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected annual return rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Time Period Input */}
                <div>
                  <Label>Investment Period (years)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={timeInYears}
                      onChange={(e) => setTimeInYears(Number(e.target.value))}
                      min="1"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of investment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Compounding Frequency Selection */}
                <div>
                  <Label>Compounding Frequency</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={compoundingFrequency}
                      onValueChange={(value) => setCompoundingFrequency(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semiannually">Semi-annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
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
                  </div>
                </div>

                {/* Contribution Frequency Selection */}
                <div>
                  <Label>Contribution Frequency</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={contributionFrequency}
                      onValueChange={(value) => setContributionFrequency(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often contributions are made</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Contribution Timing Selection */}
                <div>
                  <Label>Contribution Timing</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={contributionTiming}
                      onValueChange={(value) => setContributionTiming(value as 'beginning' | 'end')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginning">Beginning of Period</SelectItem>
                        <SelectItem value="end">End of Period</SelectItem>
                      </SelectContent>
                    </Select>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>When contributions are made</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Inflation Rate Input */}
                <div>
                  <Label>Inflation Rate (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
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
                  </div>
                </div>

                <Button
                  onClick={calculateCompoundInterest}
                  className="w-full"
                >
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm font-medium">Final Balance</div>
                    <div className="text-lg font-bold">
                      ${finalBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm font-medium">Total Interest</div>
                    <div className="text-lg font-bold">
                      ${totalInterest.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm font-medium">Total Contributions</div>
                    <div className="text-lg font-bold">
                      ${totalContributions.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm font-medium">Inflation Adjusted Balance</div>
                    <div className="text-lg font-bold">
                      ${inflationAdjustedBalance.toFixed(2)}
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
          <div className="max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Compound Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">What is Compound Interest?</h3>
                    <p>Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. This creates a snowball effect, where your money grows exponentially over time.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">The Power of Compounding</h3>
                    <ul className="list-disc pl-6">
                      <li>Earnings generate more earnings</li>
                      <li>Growth accelerates over time</li>
                      <li>Earlier start means bigger returns</li>
                      <li>Regular contributions amplify growth</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors Affecting Returns</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Initial Investment:</strong> Starting amount
                    </li>
                    <li>
                      <strong>Contribution Amount:</strong> Regular additional investments
                    </li>
                    <li>
                      <strong>Interest Rate:</strong> Annual return rate
                    </li>
                    <li>
                      <strong>Time Period:</strong> Investment duration
                    </li>
                    <li>
                      <strong>Compounding Frequency:</strong> How often interest is calculated
                    </li>
                    <li>
                      <strong>Inflation:</strong> Purchasing power impact
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Investment Strategies</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Start investing early to maximize compound growth</li>
                    <li>Make regular contributions to accelerate wealth building</li>
                    <li>Reinvest dividends and interest payments</li>
                    <li>Consider tax-advantaged accounts</li>
                    <li>Diversify investments to manage risk</li>
                    <li>Account for inflation in long-term planning</li>
                    <li>Review and rebalance periodically</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
