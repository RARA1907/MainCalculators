'use client';

import { useState, useEffect } from 'react';
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

interface InflationData {
  year: number;
  value: number;
  cumulativeValue: number;
}

export default function InflationCalculator() {
  const breadcrumbItems = [
    {
      label: 'Inflation Calculator',
      href: '/inflation-calculator'
    }
  ];

  const currentYear = new Date().getFullYear();

  // Calculation inputs
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(currentYear);
  const [amount, setAmount] = useState<number>(100);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [customRates, setCustomRates] = useState<boolean>(false);
  
  // Results
  const [adjustedAmount, setAdjustedAmount] = useState<number>(0);
  const [purchasingPowerLoss, setPurchasingPowerLoss] = useState<number>(0);
  const [averageRate, setAverageRate] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<InflationData[]>([]);

  // Historical inflation rates (example data)
  const historicalRates: { [key: number]: number } = {
    2023: 3.4,
    2022: 8.0,
    2021: 4.7,
    2020: 1.4,
    2019: 2.3,
    2018: 2.4,
    2017: 2.1,
    2016: 1.3,
    2015: 0.1,
    2014: 1.6,
    2013: 1.5,
    2012: 2.1,
    2011: 3.2,
    2010: 1.6,
    // Add more historical data as needed
  };

  // Calculate inflation impact
  const calculateInflation = () => {
    const years = endYear - startYear;
    let yearlyInflation: InflationData[] = [];
    let totalValue = amount;
    let cumulativeValue = amount;
    
    for (let i = 0; i <= years; i++) {
      const currentYear = startYear + i;
      let yearRate = customRates ? inflationRate : (historicalRates[currentYear] || inflationRate);
      
      if (i > 0) {
        totalValue *= (1 + yearRate / 100);
      }
      
      yearlyInflation.push({
        year: currentYear,
        value: yearRate,
        cumulativeValue: totalValue
      });
    }
    
    const totalInflation = ((totalValue - amount) / amount) * 100;
    const avgRate = totalInflation / years;
    
    setYearlyData(yearlyInflation);
    setAdjustedAmount(totalValue);
    setPurchasingPowerLoss(100 - (amount / totalValue * 100));
    setAverageRate(avgRate);
  };

  useEffect(() => {
    calculateInflation();
  }, [startYear, endYear, amount, inflationRate, customRates]);

  // Chart for cumulative value
  const getCumulativeValueChart = () => {
    const years = yearlyData.map(data => data.year);
    const values = yearlyData.map(data => data.cumulativeValue);

    return {
      title: {
        text: 'Value Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const year = params[0].axisValue;
          const value = params[0].data;
          return `${year}<br/>Value: $${value.toFixed(2)}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Year'
      },
      yAxis: {
        type: 'value',
        name: 'Value ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [{
        data: values,
        type: 'line',
        smooth: true,
        areaStyle: {},
        itemStyle: { color: '#4CAF50' }
      }]
    };
  };

  // Chart for yearly inflation rates
  const getYearlyRatesChart = () => {
    const years = yearlyData.map(data => data.year);
    const rates = yearlyData.map(data => data.value);

    return {
      title: {
        text: 'Yearly Inflation Rates',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const year = params[0].axisValue;
          const rate = params[0].data;
          return `${year}<br/>Rate: ${rate.toFixed(1)}%`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Year'
      },
      yAxis: {
        type: 'value',
        name: 'Inflation Rate (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [{
        data: rates,
        type: 'bar',
        itemStyle: { color: '#2196F3' }
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Inflation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Inflation Impact</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Year</span>
                    </label>
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="1900"
                      max={currentYear}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Year</span>
                    </label>
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="1900"
                      max={currentYear}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Use Custom Inflation Rate</span>
                    <input
                      type="checkbox"
                      checked={customRates}
                      onChange={(e) => setCustomRates(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {customRates && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Custom Inflation Rate (%)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average annual inflation rate to use for calculations</p>
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
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateInflation}
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
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Adjusted Amount</div>
                    <div className="stat-value text-lg">
                      ${adjustedAmount.toFixed(2)}
                    </div>
                    <div className="stat-desc">
                      Value in {endYear}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Purchasing Power Loss</div>
                    <div className="stat-value text-lg text-red-500">
                      {purchasingPowerLoss.toFixed(1)}%
                    </div>
                    <div className="stat-desc">
                      Since {startYear}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Annual Rate</div>
                    <div className="stat-value text-lg">
                      {averageRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Time Period</div>
                    <div className="stat-value text-lg">
                      {endYear - startYear} years
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCumulativeValueChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getYearlyRatesChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Inflation</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Types of Inflation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Demand-Pull Inflation</h4>
                      <ul className="list-disc pl-6">
                        <li>Excess demand</li>
                        <li>Strong economic growth</li>
                        <li>Consumer spending increase</li>
                        <li>Supply shortages</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Cost-Push Inflation</h4>
                      <ul className="list-disc pl-6">
                        <li>Rising production costs</li>
                        <li>Wage increases</li>
                        <li>Resource scarcity</li>
                        <li>Supply chain issues</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Effects of Inflation</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Reduced purchasing power</li>
                      <li>Higher cost of living</li>
                      <li>Fixed income challenges</li>
                      <li>Investment implications</li>
                      <li>Economic uncertainty</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Protection Strategies</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Diversified investments</li>
                      <li>Real estate holdings</li>
                      <li>TIPS and I-Bonds</li>
                      <li>Regular income adjustments</li>
                      <li>Cost-of-living planning</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
