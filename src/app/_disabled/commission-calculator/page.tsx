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

interface CommissionTier {
  minSales: number;
  maxSales: number;
  rate: number;
}

interface CommissionBreakdown {
  baseSalary: number;
  totalSales: number;
  totalCommission: number;
  totalEarnings: number;
  commissionRate: number;
  effectiveRate: number;
}

export default function CommissionCalculator() {
  const breadcrumbItems = [
    {
      label: 'Commission Calculator',
      href: '/commission-calculator'
    }
  ];

  // Commission structure
  const [commissionType, setCommissionType] = useState<string>('flat');
  const [baseSalary, setBaseSalary] = useState<number>(3000);
  const [flatRate, setFlatRate] = useState<number>(5);
  const [salesAmount, setSalesAmount] = useState<number>(50000);
  const [bonusThreshold, setBonusThreshold] = useState<number>(100000);
  const [bonusRate, setBonusRate] = useState<number>(2);
  
  // Tiered commission rates
  const [tiers, setTiers] = useState<CommissionTier[]>([
    { minSales: 0, maxSales: 50000, rate: 5 },
    { minSales: 50001, maxSales: 100000, rate: 7 },
    { minSales: 100001, maxSales: 200000, rate: 9 },
    { minSales: 200001, maxSales: Infinity, rate: 12 }
  ]);
  
  // Results
  const [breakdown, setBreakdown] = useState<CommissionBreakdown>({
    baseSalary: 0,
    totalSales: 0,
    totalCommission: 0,
    totalEarnings: 0,
    commissionRate: 0,
    effectiveRate: 0
  });

  // Calculate commission
  const calculateCommission = () => {
    let totalCommission = 0;
    let effectiveRate = 0;
    let commissionRate = flatRate;

    if (commissionType === 'flat') {
      // Flat rate commission
      totalCommission = (salesAmount * flatRate) / 100;
      
      // Add bonus if applicable
      if (salesAmount > bonusThreshold) {
        const bonusAmount = (salesAmount - bonusThreshold) * (bonusRate / 100);
        totalCommission += bonusAmount;
      }
      
      effectiveRate = (totalCommission / salesAmount) * 100;
    } else {
      // Tiered commission
      let remainingSales = salesAmount;
      let tierStart = 0;
      
      for (const tier of tiers) {
        if (remainingSales <= 0) break;
        
        const tierRange = tier.maxSales - tierStart;
        const salesInTier = Math.min(remainingSales, tierRange);
        const tierCommission = (salesInTier * tier.rate) / 100;
        
        totalCommission += tierCommission;
        remainingSales -= salesInTier;
        tierStart = tier.maxSales;
        
        if (salesAmount <= tier.maxSales) {
          commissionRate = tier.rate;
          break;
        }
      }
      
      effectiveRate = (totalCommission / salesAmount) * 100;
    }

    const totalEarnings = baseSalary + totalCommission;

    setBreakdown({
      baseSalary,
      totalSales: salesAmount,
      totalCommission,
      totalEarnings,
      commissionRate,
      effectiveRate
    });
  };

  useEffect(() => {
    calculateCommission();
  }, [
    commissionType,
    baseSalary,
    flatRate,
    salesAmount,
    bonusThreshold,
    bonusRate
  ]);

  // Chart for earnings breakdown
  const getEarningsBreakdownChart = () => {
    return {
      title: {
        text: 'Earnings Breakdown',
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
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: breakdown.baseSalary, name: 'Base Salary' },
          { value: breakdown.totalCommission, name: 'Commission' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  };

  // Chart for sales vs commission
  const getSalesCommissionChart = () => {
    const salesPoints = [
      0,
      salesAmount * 0.5,
      salesAmount,
      salesAmount * 1.5,
      salesAmount * 2
    ];

    const commissionPoints = salesPoints.map(sales => {
      if (commissionType === 'flat') {
        let commission = (sales * flatRate) / 100;
        if (sales > bonusThreshold) {
          commission += (sales - bonusThreshold) * (bonusRate / 100);
        }
        return commission;
      } else {
        let commission = 0;
        let remainingSales = sales;
        let tierStart = 0;
        
        for (const tier of tiers) {
          if (remainingSales <= 0) break;
          
          const tierRange = tier.maxSales - tierStart;
          const salesInTier = Math.min(remainingSales, tierRange);
          const tierCommission = (salesInTier * tier.rate) / 100;
          
          commission += tierCommission;
          remainingSales -= salesInTier;
          tierStart = tier.maxSales;
        }
        return commission;
      }
    });

    return {
      title: {
        text: 'Sales vs Commission',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%'
      },
      xAxis: {
        type: 'value',
        name: 'Sales ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Commission ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [{
        type: 'line',
        data: salesPoints.map((sales, index) => [sales, commissionPoints[index]]),
        smooth: true
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Commission Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Commission</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Commission Type</span>
                  </label>
                  <select
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="flat">Flat Rate</option>
                    <option value="tiered">Tiered Rate</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Base Salary ($)</span>
                  </label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sales Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={salesAmount}
                    onChange={(e) => setSalesAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                {commissionType === 'flat' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Commission Rate (%)</span>
                      </label>
                      <input
                        type="number"
                        value={flatRate}
                        onChange={(e) => setFlatRate(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Bonus Threshold ($)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sales amount required to earn bonus commission</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <input
                        type="number"
                        value={bonusThreshold}
                        onChange={(e) => setBonusThreshold(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="1000"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Bonus Rate (%)</span>
                      </label>
                      <input
                        type="number"
                        value={bonusRate}
                        onChange={(e) => setBonusRate(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </>
                )}

                {commissionType === 'tiered' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Commission Tiers</h3>
                    {tiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Min Sales ($)</span>
                          </label>
                          <input
                            type="number"
                            value={tier.minSales}
                            onChange={(e) => {
                              const newTiers = [...tiers];
                              newTiers[index].minSales = Number(e.target.value);
                              setTiers(newTiers);
                            }}
                            className="input input-bordered w-full"
                            min="0"
                            step="1000"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Max Sales ($)</span>
                          </label>
                          <input
                            type="number"
                            value={tier.maxSales === Infinity ? '' : tier.maxSales}
                            onChange={(e) => {
                              const newTiers = [...tiers];
                              newTiers[index].maxSales = Number(e.target.value);
                              setTiers(newTiers);
                            }}
                            className="input input-bordered w-full"
                            min="0"
                            step="1000"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Rate (%)</span>
                          </label>
                          <input
                            type="number"
                            value={tier.rate}
                            onChange={(e) => {
                              const newTiers = [...tiers];
                              newTiers[index].rate = Number(e.target.value);
                              setTiers(newTiers);
                            }}
                            className="input input-bordered w-full"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateCommission}
                >
                  Calculate
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Commission Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Sales</div>
                      <div className="stat-value text-lg">
                        ${breakdown.totalSales.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Commission Rate</div>
                      <div className="stat-value text-lg">
                        {breakdown.commissionRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Commission</div>
                      <div className="stat-value text-lg text-green-500">
                        ${breakdown.totalCommission.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Earnings</div>
                      <div className="stat-value text-lg text-blue-500">
                        ${breakdown.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Charts */}
                  <div className="space-y-6">
                    <div>
                      <ReactECharts option={getEarningsBreakdownChart()} style={{ height: '300px' }} />
                    </div>
                    <div>
                      <ReactECharts option={getSalesCommissionChart()} style={{ height: '300px' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Commissions</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Commission Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Flat Rate</h4>
                        <ul className="list-disc pl-6">
                          <li>Simple percentage</li>
                          <li>Easy to calculate</li>
                          <li>Consistent earnings</li>
                          <li>Optional bonus rates</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Tiered Rate</h4>
                        <ul className="list-disc pl-6">
                          <li>Progressive rates</li>
                          <li>Rewards higher sales</li>
                          <li>Multiple thresholds</li>
                          <li>Increased motivation</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Commission Structure</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Base salary + commission</li>
                        <li>Commission only</li>
                        <li>Draw against commission</li>
                        <li>Residual commission</li>
                        <li>Team commission</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Track sales regularly</li>
                        <li>Understand commission structure</li>
                        <li>Set realistic goals</li>
                        <li>Focus on high-value sales</li>
                        <li>Monitor performance metrics</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
