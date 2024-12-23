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

interface ReturnPeriod {
  period: number;
  return: number;
  investment: number;
}

export default function AverageReturnCalculator() {
  const breadcrumbItems = [
    {
      label: 'Average Return Calculator',
      href: '/average-return-calculator'
    }
  ];

  // State for return periods
  const [returnPeriods, setReturnPeriods] = useState<ReturnPeriod[]>([
    { period: 1, return: 0, investment: 1000 }
  ]);

  // State for calculator results
  const [arithmeticMean, setArithmeticMean] = useState<number>(0);
  const [geometricMean, setGeometricMean] = useState<number>(0);
  const [timeWeightedReturn, setTimeWeightedReturn] = useState<number>(0);
  const [dollarWeightedReturn, setDollarWeightedReturn] = useState<number>(0);

  // Add new period
  const addPeriod = () => {
    setReturnPeriods([
      ...returnPeriods,
      {
        period: returnPeriods.length + 1,
        return: 0,
        investment: 1000
      }
    ]);
  };

  // Remove period
  const removePeriod = (index: number) => {
    if (returnPeriods.length > 1) {
      const newPeriods = returnPeriods.filter((_, i) => i !== index);
      setReturnPeriods(newPeriods);
    }
  };

  // Update period data
  const updatePeriod = (index: number, field: keyof ReturnPeriod, value: number) => {
    const newPeriods = [...returnPeriods];
    newPeriods[index] = {
      ...newPeriods[index],
      [field]: value
    };
    setReturnPeriods(newPeriods);
  };

  // Calculate returns
  const calculateReturns = () => {
    // Arithmetic Mean Return
    const arithmeticSum = returnPeriods.reduce((sum, period) => sum + period.return, 0);
    const arithmeticMeanReturn = arithmeticSum / returnPeriods.length;

    // Geometric Mean Return
    const geometricProduct = returnPeriods.reduce((product, period) => {
      return product * (1 + period.return / 100);
    }, 1);
    const geometricMeanReturn = (Math.pow(geometricProduct, 1 / returnPeriods.length) - 1) * 100;

    // Time-Weighted Return
    const timeWeightedReturn = (geometricProduct - 1) * 100;

    // Dollar-Weighted Return (Internal Rate of Return approximation)
    // Simple approximation for demonstration
    const totalInvestment = returnPeriods.reduce((sum, period) => sum + period.investment, 0);
    const finalValue = returnPeriods.reduce((sum, period) => {
      return sum + (period.investment * (1 + period.return / 100));
    }, 0);
    const dollarWeightedReturn = ((finalValue - totalInvestment) / totalInvestment) * 100;

    setArithmeticMean(arithmeticMeanReturn);
    setGeometricMean(geometricMeanReturn);
    setTimeWeightedReturn(timeWeightedReturn);
    setDollarWeightedReturn(dollarWeightedReturn);
  };

  // Chart options
  const getReturnComparisonChart = () => {
    return {
      title: {
        text: 'Return Comparison by Period',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      xAxis: {
        type: 'category',
        data: returnPeriods.map(period => `Period ${period.period}`),
        name: 'Period'
      },
      yAxis: {
        type: 'value',
        name: 'Return (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          data: returnPeriods.map(period => period.return),
          type: 'bar',
          itemStyle: {
            color: '#4CAF50'
          }
        }
      ]
    };
  };

  const getInvestmentChart = () => {
    return {
      title: {
        text: 'Investment Amount by Period',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '${c}'
      },
      xAxis: {
        type: 'category',
        data: returnPeriods.map(period => `Period ${period.period}`),
        name: 'Period'
      },
      yAxis: {
        type: 'value',
        name: 'Investment ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: returnPeriods.map(period => period.investment),
          type: 'line',
          smooth: true,
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
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold mt-4">Average Return Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Return Data</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnPeriods.map((period, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Period {period.period}</span>
                      </label>
                      <input
                        type="number"
                        value={period.return}
                        onChange={(e) => updatePeriod(index, 'return', Number(e.target.value))}
                        className="input input-bordered w-full"
                        placeholder="Return %"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Investment ($)</span>
                      </label>
                      <input
                        type="number"
                        value={period.investment}
                        onChange={(e) => updatePeriod(index, 'investment', Number(e.target.value))}
                        className="input input-bordered w-full"
                        placeholder="Investment"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => removePeriod(index)}
                        disabled={returnPeriods.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between">
                  <button
                    className="btn btn-outline"
                    onClick={addPeriod}
                  >
                    Add Period
                  </button>
                  <button
                    className="btn bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={calculateReturns}
                  >
                    Calculate
                  </button>
                </div>
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
                    <div className="stat-title flex items-center gap-2">
                      Arithmetic Mean Return
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Simple average of returns</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="stat-value text-lg">
                      {arithmeticMean.toFixed(2)}%
                    </div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title flex items-center gap-2">
                      Geometric Mean Return
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Compound annual growth rate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="stat-value text-lg">
                      {geometricMean.toFixed(2)}%
                    </div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title flex items-center gap-2">
                      Time-Weighted Return
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Return independent of cash flows</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="stat-value text-lg">
                      {timeWeightedReturn.toFixed(2)}%
                    </div>
                  </div>

                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title flex items-center gap-2">
                      Dollar-Weighted Return
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Return considering investment amounts</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="stat-value text-lg">
                      {dollarWeightedReturn.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getReturnComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getInvestmentChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Investment Returns</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Types of Returns</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold">Arithmetic Mean Return</h4>
                      <p className="text-sm text-gray-600">
                        Simple average of returns over multiple periods. Easy to calculate but may overstate long-term returns.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Geometric Mean Return</h4>
                      <p className="text-sm text-gray-600">
                        Considers compounding effects. Better represents actual investment performance over time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Advanced Metrics</h3>
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold">Time-Weighted Return</h4>
                      <p className="text-sm text-gray-600">
                        Eliminates the impact of cash flows. Useful for comparing investment manager performance.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Dollar-Weighted Return</h4>
                      <p className="text-sm text-gray-600">
                        Considers the timing and size of cash flows. Reflects actual investor experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">When to Use Each Metric</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Use arithmetic mean for short-term analysis</li>
                    <li>Use geometric mean for long-term performance</li>
                    <li>Use time-weighted return for manager evaluation</li>
                    <li>Use dollar-weighted return for actual returns</li>
                  </ul>
                </div>

                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Consider multiple return metrics</li>
                    <li>Account for risk and volatility</li>
                    <li>Compare returns over similar time periods</li>
                    <li>Include all relevant cash flows</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
