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

interface DepreciationSchedule {
  year: number;
  depreciation: number;
  bookValue: number;
  accumulatedDepreciation: number;
}

type DepreciationMethod = 'straight-line' | 'declining-balance' | 'sum-of-years' | 'units-of-production';

export default function DepreciationCalculator() {
  const breadcrumbItems = [
    {
      label: 'Depreciation Calculator',
      href: '/depreciation-calculator'
    }
  ];

  // Asset details
  const [assetCost, setAssetCost] = useState<number>(100000);
  const [salvageValue, setSalvageValue] = useState<number>(10000);
  const [usefulLife, setUsefulLife] = useState<number>(5);
  const [depreciationMethod, setDepreciationMethod] = useState<DepreciationMethod>('straight-line');
  const [decliningBalanceRate, setDecliningBalanceRate] = useState<number>(200);
  const [totalUnits, setTotalUnits] = useState<number>(100000);
  const [unitsPerYear, setUnitsPerYear] = useState<number>(20000);
  
  // Results
  const [schedule, setSchedule] = useState<DepreciationSchedule[]>([]);
  const [totalDepreciation, setTotalDepreciation] = useState<number>(0);
  const [annualDepreciation, setAnnualDepreciation] = useState<number>(0);
  const [depreciableBase, setDepreciableBase] = useState<number>(0);

  // Calculate straight-line depreciation
  const calculateStraightLine = (): DepreciationSchedule[] => {
    const yearlyDepreciation = (assetCost - salvageValue) / usefulLife;
    let schedule: DepreciationSchedule[] = [];
    let bookValue = assetCost;
    let accumulatedDepreciation = 0;
    
    for (let year = 1; year <= usefulLife; year++) {
      accumulatedDepreciation += yearlyDepreciation;
      bookValue = assetCost - accumulatedDepreciation;
      
      schedule.push({
        year,
        depreciation: yearlyDepreciation,
        bookValue,
        accumulatedDepreciation
      });
    }
    
    return schedule;
  };

  // Calculate declining balance depreciation
  const calculateDecliningBalance = (): DepreciationSchedule[] => {
    const rate = (decliningBalanceRate / 100) / usefulLife;
    let schedule: DepreciationSchedule[] = [];
    let bookValue = assetCost;
    let accumulatedDepreciation = 0;
    
    for (let year = 1; year <= usefulLife; year++) {
      const depreciation = bookValue * rate;
      accumulatedDepreciation += depreciation;
      bookValue -= depreciation;
      
      if (bookValue < salvageValue) {
        bookValue = salvageValue;
        accumulatedDepreciation = assetCost - salvageValue;
      }
      
      schedule.push({
        year,
        depreciation,
        bookValue,
        accumulatedDepreciation
      });
    }
    
    return schedule;
  };

  // Calculate sum-of-years digits depreciation
  const calculateSumOfYears = (): DepreciationSchedule[] => {
    const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
    const depreciableAmount = assetCost - salvageValue;
    let schedule: DepreciationSchedule[] = [];
    let bookValue = assetCost;
    let accumulatedDepreciation = 0;
    
    for (let year = 1; year <= usefulLife; year++) {
      const depreciation = (depreciableAmount * (usefulLife - year + 1)) / sumOfYears;
      accumulatedDepreciation += depreciation;
      bookValue = assetCost - accumulatedDepreciation;
      
      schedule.push({
        year,
        depreciation,
        bookValue,
        accumulatedDepreciation
      });
    }
    
    return schedule;
  };

  // Calculate units of production depreciation
  const calculateUnitsOfProduction = (): DepreciationSchedule[] => {
    const depreciationPerUnit = (assetCost - salvageValue) / totalUnits;
    const years = Math.ceil(totalUnits / unitsPerYear);
    let schedule: DepreciationSchedule[] = [];
    let bookValue = assetCost;
    let accumulatedDepreciation = 0;
    let remainingUnits = totalUnits;
    
    for (let year = 1; year <= years; year++) {
      const unitsThisYear = Math.min(unitsPerYear, remainingUnits);
      const depreciation = unitsThisYear * depreciationPerUnit;
      accumulatedDepreciation += depreciation;
      bookValue = assetCost - accumulatedDepreciation;
      remainingUnits -= unitsThisYear;
      
      schedule.push({
        year,
        depreciation,
        bookValue,
        accumulatedDepreciation
      });
    }
    
    return schedule;
  };

  // Calculate depreciation
  const calculateDepreciation = () => {
    let newSchedule: DepreciationSchedule[] = [];
    
    switch (depreciationMethod) {
      case 'straight-line':
        newSchedule = calculateStraightLine();
        break;
      case 'declining-balance':
        newSchedule = calculateDecliningBalance();
        break;
      case 'sum-of-years':
        newSchedule = calculateSumOfYears();
        break;
      case 'units-of-production':
        newSchedule = calculateUnitsOfProduction();
        break;
    }
    
    setSchedule(newSchedule);
    setTotalDepreciation(assetCost - salvageValue);
    setAnnualDepreciation(newSchedule[0].depreciation);
    setDepreciableBase(assetCost - salvageValue);
  };

  useEffect(() => {
    calculateDepreciation();
  }, [
    assetCost,
    salvageValue,
    usefulLife,
    depreciationMethod,
    decliningBalanceRate,
    totalUnits,
    unitsPerYear
  ]);

  // Chart for depreciation schedule
  const getDepreciationChart = () => {
    const years = schedule.map(data => data.year);
    const bookValues = schedule.map(data => data.bookValue);
    const depreciationValues = schedule.map(data => data.depreciation);

    return {
      title: {
        text: 'Depreciation Schedule',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Book Value', 'Annual Depreciation'],
        top: 30
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: years,
        name: 'Year'
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
          name: 'Book Value',
          type: 'line',
          data: bookValues,
          smooth: true
        },
        {
          name: 'Annual Depreciation',
          type: 'bar',
          data: depreciationValues
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Depreciation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Asset Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Depreciation Method</span>
                  </label>
                  <select
                    value={depreciationMethod}
                    onChange={(e) => setDepreciationMethod(e.target.value as DepreciationMethod)}
                    className="select select-bordered w-full"
                  >
                    <option value="straight-line">Straight Line</option>
                    <option value="declining-balance">Declining Balance</option>
                    <option value="sum-of-years">Sum of Years Digits</option>
                    <option value="units-of-production">Units of Production</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Asset Cost ($)</span>
                  </label>
                  <input
                    type="number"
                    value={assetCost}
                    onChange={(e) => setAssetCost(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Salvage Value ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated value at the end of useful life</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={salvageValue}
                    onChange={(e) => setSalvageValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Useful Life (years)</span>
                  </label>
                  <input
                    type="number"
                    value={usefulLife}
                    onChange={(e) => setUsefulLife(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="50"
                  />
                </div>

                {depreciationMethod === 'declining-balance' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Declining Balance Rate (%)</span>
                    </label>
                    <input
                      type="number"
                      value={decliningBalanceRate}
                      onChange={(e) => setDecliningBalanceRate(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="100"
                      max="300"
                      step="50"
                    />
                  </div>
                )}

                {depreciationMethod === 'units-of-production' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Total Units</span>
                      </label>
                      <input
                        type="number"
                        value={totalUnits}
                        onChange={(e) => setTotalUnits(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="1"
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Units per Year</span>
                      </label>
                      <input
                        type="number"
                        value={unitsPerYear}
                        onChange={(e) => setUnitsPerYear(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="1"
                      />
                    </div>
                  </>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateDepreciation}
                >
                  Calculate Depreciation
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Depreciation Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Depreciation</div>
                    <div className="stat-value text-lg">
                      ${totalDepreciation.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Annual Depreciation</div>
                    <div className="stat-value text-lg">
                      ${annualDepreciation.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Depreciable Base</div>
                    <div className="stat-value text-lg">
                      ${depreciableBase.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Recovery Period</div>
                    <div className="stat-value text-lg">
                      {usefulLife} years
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <ReactECharts option={getDepreciationChart()} style={{ height: '300px' }} />
                </div>

                {/* Depreciation Schedule */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Depreciation</th>
                        <th>Book Value</th>
                        <th>Accumulated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((year, index) => (
                        <tr key={index}>
                          <td>{year.year}</td>
                          <td>${year.depreciation.toLocaleString()}</td>
                          <td>${year.bookValue.toLocaleString()}</td>
                          <td>${year.accumulatedDepreciation.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Depreciation</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Depreciation Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Straight Line</h4>
                      <ul className="list-disc pl-6">
                        <li>Equal annual amounts</li>
                        <li>Simple to calculate</li>
                        <li>Most common method</li>
                        <li>Consistent expenses</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Declining Balance</h4>
                      <ul className="list-disc pl-6">
                        <li>Accelerated depreciation</li>
                        <li>Higher early expenses</li>
                        <li>Common for technology</li>
                        <li>Tax advantages</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Terms</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Asset cost (basis)</li>
                      <li>Salvage value</li>
                      <li>Useful life</li>
                      <li>Book value</li>
                      <li>Accumulated depreciation</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Tax Considerations</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Section 179 expensing</li>
                      <li>Bonus depreciation</li>
                      <li>MACRS depreciation</li>
                      <li>Tax deduction timing</li>
                      <li>Asset classification</li>
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
