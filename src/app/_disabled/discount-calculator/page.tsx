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

interface DiscountBreakdown {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
}

interface ComparisonData {
  discountPercent: number;
  finalPrice: number;
  savings: number;
}

export default function DiscountCalculator() {
  const breadcrumbItems = [
    {
      label: 'Discount Calculator',
      href: '/discount-calculator'
    }
  ];

  // Input values
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Additional discounts
  const [bulkDiscount, setBulkDiscount] = useState<number>(0);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [loyaltyDiscount, setLoyaltyDiscount] = useState<number>(0);
  
  // Tax and shipping
  const [taxRate, setTaxRate] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  
  // Results
  const [breakdown, setBreakdown] = useState<DiscountBreakdown>({
    originalPrice: 0,
    discountAmount: 0,
    finalPrice: 0,
    savings: 0
  });

  // Calculate discount and final price
  const calculateDiscount = () => {
    const subtotal = originalPrice * quantity;
    
    // Calculate cumulative discount percentage
    const totalDiscountPercent = discountPercent + bulkDiscount + couponDiscount + loyaltyDiscount;
    const discountAmount = (subtotal * totalDiscountPercent) / 100;
    
    // Calculate tax and shipping
    const discountedPrice = subtotal - discountAmount;
    const tax = (discountedPrice * taxRate) / 100;
    const finalPrice = discountedPrice + tax + shippingCost;
    
    setBreakdown({
      originalPrice: subtotal,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      savings: subtotal - discountedPrice
    });
  };

  // Generate comparison data for different discount percentages
  const generateComparisonData = (): ComparisonData[] => {
    const discounts = [5, 10, 15, 20, 25, 30, 40, 50];
    const subtotal = originalPrice * quantity;
    
    return discounts.map(discount => {
      const discountAmount = (subtotal * discount) / 100;
      const discountedPrice = subtotal - discountAmount;
      const tax = (discountedPrice * taxRate) / 100;
      const finalPrice = discountedPrice + tax + shippingCost;
      
      return {
        discountPercent: discount,
        finalPrice: finalPrice,
        savings: subtotal - discountedPrice
      };
    });
  };

  useEffect(() => {
    calculateDiscount();
  }, [
    originalPrice,
    discountPercent,
    quantity,
    bulkDiscount,
    couponDiscount,
    loyaltyDiscount,
    taxRate,
    shippingCost
  ]);

  // Chart for price breakdown
  const getPriceBreakdownChart = () => {
    return {
      title: {
        text: 'Price Breakdown',
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
          { value: breakdown.finalPrice, name: 'Final Price' },
          { value: breakdown.discountAmount, name: 'Discount' }
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

  // Chart for discount comparison
  const getDiscountComparisonChart = () => {
    const comparisonData = generateComparisonData();
    const discounts = comparisonData.map(data => data.discountPercent);
    const prices = comparisonData.map(data => data.finalPrice);
    const savings = comparisonData.map(data => data.savings);

    return {
      title: {
        text: 'Discount Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Final Price', 'Savings'],
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
        data: discounts,
        name: 'Discount %'
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
          name: 'Final Price',
          type: 'line',
          data: prices,
          smooth: true
        },
        {
          name: 'Savings',
          type: 'bar',
          data: savings
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Discount Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Discount</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Original Price ($)</span>
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Discount (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Main discount percentage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
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

                <h3 className="text-lg font-semibold">Additional Discounts</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bulk Discount (%)</span>
                  </label>
                  <input
                    type="number"
                    value={bulkDiscount}
                    onChange={(e) => setBulkDiscount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Coupon Discount (%)</span>
                  </label>
                  <input
                    type="number"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loyalty Discount (%)</span>
                  </label>
                  <input
                    type="number"
                    value={loyaltyDiscount}
                    onChange={(e) => setLoyaltyDiscount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Additional Costs</h3>

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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shipping Cost ($)</span>
                  </label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateDiscount}
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
                    <div className="stat-title">Original Price</div>
                    <div className="stat-value text-lg">
                      ${breakdown.originalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Discount Amount</div>
                    <div className="stat-value text-lg text-red-500">
                      -${breakdown.discountAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Final Price</div>
                    <div className="stat-value text-lg text-green-500">
                      ${breakdown.finalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">You Save</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${breakdown.savings.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPriceBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getDiscountComparisonChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold">Understanding Discounts</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Types of Discounts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Percentage Off</h4>
                      <ul className="list-disc pl-6">
                        <li>Most common type</li>
                        <li>Easy to understand</li>
                        <li>Scales with price</li>
                        <li>Flexible application</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Volume Discounts</h4>
                      <ul className="list-disc pl-6">
                        <li>Bulk purchases</li>
                        <li>Tiered pricing</li>
                        <li>Quantity breaks</li>
                        <li>Encourages larger orders</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Discount Strategies</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Seasonal sales</li>
                      <li>Loyalty rewards</li>
                      <li>Early bird discounts</li>
                      <li>Bundle deals</li>
                      <li>Flash sales</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Clear terms and conditions</li>
                      <li>Time-limited offers</li>
                      <li>Target specific segments</li>
                      <li>Track effectiveness</li>
                      <li>Maintain profit margins</li>
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
