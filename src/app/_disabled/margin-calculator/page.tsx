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

interface MarginBreakdown {
  cost: number;
  margin: number;
  profit: number;
  revenue: number;
}

interface ComparisonData {
  margin: number;
  markup: number;
  revenue: number;
  profit: number;
}

export default function MarginCalculator() {
  const breadcrumbItems = [
    {
      label: 'Margin Calculator',
      href: '/margin-calculator'
    }
  ];

  // Input values
  const [costPrice, setCostPrice] = useState<number>(100);
  const [marginPercent, setMarginPercent] = useState<number>(40);
  const [markupPercent, setMarkupPercent] = useState<number>(66.67);
  const [sellingPrice, setSellingPrice] = useState<number>(166.67);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Additional costs
  const [overheadCosts, setOverheadCosts] = useState<number>(0);
  const [shippingCosts, setShippingCosts] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  
  // Results
  const [breakdown, setBreakdown] = useState<MarginBreakdown>({
    cost: 0,
    margin: 0,
    profit: 0,
    revenue: 0
  });

  // Calculate margins and related values
  const calculateMargins = () => {
    // Calculate total costs
    const totalCostPerUnit = costPrice + (overheadCosts / quantity) + shippingCosts;
    const totalCost = totalCostPerUnit * quantity;
    
    // Calculate revenue and profit
    const revenue = sellingPrice * quantity;
    const profit = revenue - totalCost;
    
    // Calculate margin
    const margin = (profit / revenue) * 100;
    
    setBreakdown({
      cost: totalCost,
      margin: margin,
      profit: profit,
      revenue: revenue
    });
  };

  // Update selling price when margin changes
  const updateSellingPrice = (margin: number) => {
    const totalCostPerUnit = costPrice + (overheadCosts / quantity) + shippingCosts;
    const newSellingPrice = totalCostPerUnit / (1 - (margin / 100));
    setSellingPrice(newSellingPrice);
    setMarkupPercent(((newSellingPrice / totalCostPerUnit) - 1) * 100);
  };

  // Update margin when selling price changes
  const updateMargin = (price: number) => {
    const totalCostPerUnit = costPrice + (overheadCosts / quantity) + shippingCosts;
    const newMargin = ((price - totalCostPerUnit) / price) * 100;
    setMarginPercent(newMargin);
    setMarkupPercent(((price / totalCostPerUnit) - 1) * 100);
  };

  // Generate comparison data for different margins
  const generateComparisonData = (): ComparisonData[] => {
    const margins = [10, 20, 30, 40, 50, 60, 70];
    const totalCostPerUnit = costPrice + (overheadCosts / quantity) + shippingCosts;
    
    return margins.map(margin => {
      const revenue = totalCostPerUnit / (1 - (margin / 100)) * quantity;
      const profit = revenue - (totalCostPerUnit * quantity);
      const markup = ((revenue / (totalCostPerUnit * quantity)) - 1) * 100;
      
      return {
        margin,
        markup,
        revenue,
        profit
      };
    });
  };

  useEffect(() => {
    calculateMargins();
  }, [costPrice, marginPercent, sellingPrice, quantity, overheadCosts, shippingCosts, taxRate]);

  // Chart for margin breakdown
  const getMarginBreakdownChart = () => {
    return {
      title: {
        text: 'Revenue Breakdown',
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
          { value: breakdown.cost, name: 'Cost' },
          { value: breakdown.profit, name: 'Profit' }
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

  // Chart for margin comparison
  const getMarginComparisonChart = () => {
    const comparisonData = generateComparisonData();
    const margins = comparisonData.map(data => data.margin);
    const profits = comparisonData.map(data => data.profit);
    const revenues = comparisonData.map(data => data.revenue);

    return {
      title: {
        text: 'Margin Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Revenue', 'Profit'],
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
        data: margins,
        name: 'Margin %'
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
          name: 'Revenue',
          type: 'line',
          data: revenues,
          smooth: true
        },
        {
          name: 'Profit',
          type: 'line',
          data: profits,
          smooth: true
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Margin Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Margins</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cost Price ($)</span>
                  </label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Margin (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Profit as a percentage of revenue</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={marginPercent}
                    onChange={(e) => {
                      setMarginPercent(Number(e.target.value));
                      updateSellingPrice(Number(e.target.value));
                    }}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Selling Price ($)</span>
                  </label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => {
                      setSellingPrice(Number(e.target.value));
                      updateMargin(Number(e.target.value));
                    }}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quantity</span>
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Additional Costs</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Overhead Costs ($)</span>
                  </label>
                  <input
                    type="number"
                    value={overheadCosts}
                    onChange={(e) => setOverheadCosts(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shipping per Unit ($)</span>
                  </label>
                  <input
                    type="number"
                    value={shippingCosts}
                    onChange={(e) => setShippingCosts(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tax Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateMargins}
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
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value text-lg">
                      ${breakdown.revenue.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${breakdown.cost.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Profit</div>
                    <div className="stat-value text-lg text-green-500">
                      ${breakdown.profit.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Markup</div>
                    <div className="stat-value text-lg">
                      {markupPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getMarginBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getMarginComparisonChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold">Understanding Margins</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Concepts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Profit Margin</h4>
                      <ul className="list-disc pl-6">
                        <li>Profit as % of revenue</li>
                        <li>Higher is better</li>
                        <li>Industry dependent</li>
                        <li>Key profitability metric</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Markup</h4>
                      <ul className="list-disc pl-6">
                        <li>Price increase over cost</li>
                        <li>Pricing strategy</li>
                        <li>Competition factor</li>
                        <li>Market positioning</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Pricing Strategies</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Cost-plus pricing</li>
                      <li>Value-based pricing</li>
                      <li>Competitive pricing</li>
                      <li>Dynamic pricing</li>
                      <li>Premium pricing</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Optimization Tips</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Reduce costs</li>
                      <li>Increase efficiency</li>
                      <li>Monitor competitors</li>
                      <li>Adjust pricing strategy</li>
                      <li>Track market trends</li>
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
