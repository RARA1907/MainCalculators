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

export default function BondCalculator() {
  const breadcrumbItems = [
    {
      label: 'Bond Calculator',
      href: '/bond-calculator'
    }
  ];

  // Calculator State
  const [faceValue, setFaceValue] = useState<number>(1000);
  const [couponRate, setCouponRate] = useState<number>(5);
  const [marketRate, setMarketRate] = useState<number>(6);
  const [yearsToMaturity, setYearsToMaturity] = useState<number>(10);
  const [paymentsPerYear, setPaymentsPerYear] = useState<number>(2);
  const [calculationType, setCalculationType] = useState<'price' | 'yield'>('price');

  // Results
  const [bondPrice, setBondPrice] = useState<number>(0);
  const [yieldToMaturity, setYieldToMaturity] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [modifiedDuration, setModifiedDuration] = useState<number>(0);
  const [currentYield, setCurrentYield] = useState<number>(0);
  const [cashFlows, setCashFlows] = useState<any[]>([]);

  const calculateBond = () => {
    const numberOfPayments = yearsToMaturity * paymentsPerYear;
    const couponPayment = (faceValue * couponRate / 100) / paymentsPerYear;
    const ratePerPeriod = marketRate / 100 / paymentsPerYear;
    
    let price = 0;
    let durationNumerator = 0;
    let durationDenominator = 0;
    let flows = [];

    // Calculate present value of all cash flows
    for (let i = 1; i <= numberOfPayments; i++) {
      const timeInYears = i / paymentsPerYear;
      const discountFactor = Math.pow(1 + ratePerPeriod, i);
      const isLastPayment = i === numberOfPayments;
      const cashFlow = isLastPayment ? couponPayment + faceValue : couponPayment;
      const presentValue = cashFlow / discountFactor;

      price += presentValue;
      durationNumerator += timeInYears * presentValue;
      durationDenominator += presentValue;

      flows.push({
        period: i,
        cashFlow: cashFlow,
        presentValue: presentValue,
        timeInYears: timeInYears
      });
    }

    // Calculate duration and modified duration
    const macaulayDuration = durationNumerator / price;
    const modDuration = macaulayDuration / (1 + ratePerPeriod);
    
    // Calculate current yield
    const currYield = (couponPayment * paymentsPerYear / price) * 100;

    // Calculate yield to maturity using Newton-Raphson method
    const ytm = calculateYTM(flows, price, faceValue, paymentsPerYear);

    setBondPrice(price);
    setDuration(macaulayDuration);
    setModifiedDuration(modDuration);
    setCurrentYield(currYield);
    setYieldToMaturity(ytm);
    setCashFlows(flows);
  };

  const calculateYTM = (flows: any[], price: number, faceValue: number, paymentsPerYear: number) => {
    let guess = couponRate / 100; // Initial guess
    const tolerance = 0.0001;
    const maxIterations = 100;
    let iteration = 0;

    while (iteration < maxIterations) {
      let priceAtGuess = 0;
      let derivative = 0;

      for (let i = 0; i < flows.length; i++) {
        const t = flows[i].timeInYears;
        const cf = flows[i].cashFlow;
        const discountFactor = Math.pow(1 + guess, t);
        
        priceAtGuess += cf / discountFactor;
        derivative -= (t * cf) / Math.pow(1 + guess, t + 1);
      }

      const difference = priceAtGuess - price;
      if (Math.abs(difference) < tolerance) {
        return guess * 100;
      }

      guess = guess - difference / derivative;
      iteration++;
    }

    return guess * 100;
  };

  // Chart for cash flow visualization
  const getCashFlowChart = () => {
    const periods = cashFlows.map(flow => `Period ${flow.period}`);
    const cashFlowValues = cashFlows.map(flow => flow.cashFlow);
    const presentValues = cashFlows.map(flow => flow.presentValue);

    return {
      title: {
        text: 'Bond Cash Flows',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName}: $${param.value.toFixed(2)}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Cash Flow', 'Present Value'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: periods
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
          name: 'Cash Flow',
          type: 'bar',
          data: cashFlowValues,
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Present Value',
          type: 'line',
          data: presentValues,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        }
      ]
    };
  };

  // Chart for yield curve
  const getYieldCurveChart = () => {
    const yields = [];
    const prices = [];
    const baseYield = marketRate;
    
    for (let i = -5; i <= 5; i++) {
      const yieldRate = baseYield + i;
      const ratePerPeriod = yieldRate / 100 / paymentsPerYear;
      let price = 0;
      
      for (let j = 1; j <= yearsToMaturity * paymentsPerYear; j++) {
        const couponPayment = (faceValue * couponRate / 100) / paymentsPerYear;
        const isLastPayment = j === yearsToMaturity * paymentsPerYear;
        const cashFlow = isLastPayment ? couponPayment + faceValue : couponPayment;
        price += cashFlow / Math.pow(1 + ratePerPeriod, j);
      }
      
      yields.push(yieldRate);
      prices.push(price);
    }

    return {
      title: {
        text: 'Price-Yield Relationship',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          return `Yield: ${params[0].axisValue}%<br/>Price: $${params[0].data.toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Yield (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'value',
        name: 'Price ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          type: 'line',
          data: yields.map((y, i) => [y, prices[i]]),
          smooth: true,
          lineStyle: { width: 3 },
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Bond Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Bond Metrics</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Face Value Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Face Value ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Par value of the bond at maturity</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={faceValue}
                    onChange={(e) => setFaceValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Coupon Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Coupon Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual interest rate paid by the bond</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={couponRate}
                    onChange={(e) => setCouponRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Market Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Market Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Current market interest rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={marketRate}
                    onChange={(e) => setMarketRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Years to Maturity Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years to Maturity</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time until bond matures</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={yearsToMaturity}
                    onChange={(e) => setYearsToMaturity(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

                {/* Payments Per Year Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payments Per Year</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Frequency of coupon payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={paymentsPerYear}
                    onChange={(e) => setPaymentsPerYear(Number(e.target.value))}
                    className="select select-bordered w-full"
                  >
                    <option value={1}>Annual</option>
                    <option value={2}>Semi-annual</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>

                {/* Calculation Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Calculation Type</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose to calculate price or yield</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value as 'price' | 'yield')}
                    className="select select-bordered w-full"
                  >
                    <option value="price">Calculate Price</option>
                    <option value="yield">Calculate Yield</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateBond}
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
                    <div className="stat-title">Bond Price</div>
                    <div className="stat-value text-lg">
                      ${bondPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Yield to Maturity</div>
                    <div className="stat-value text-lg">
                      {yieldToMaturity.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Duration</div>
                    <div className="stat-value text-lg">
                      {duration.toFixed(2)} years
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Modified Duration</div>
                    <div className="stat-value text-lg">
                      {modifiedDuration.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <div className="font-semibold mb-2">Current Yield</div>
                  <div className="text-lg">{currentYield.toFixed(2)}%</div>
                  <div className="text-sm text-gray-600">
                    Annual coupon payment as a percentage of bond price
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCashFlowChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getYieldCurveChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold">Understanding Bonds</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bond Basics</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Face Value (Par Value)</li>
                    <li>Coupon Rate</li>
                    <li>Market Rate</li>
                    <li>Maturity</li>
                    <li>Coupon Payments</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bond Metrics</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Bond Price</li>
                    <li>Yield to Maturity</li>
                    <li>Duration</li>
                    <li>Modified Duration</li>
                    <li>Current Yield</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Market Relationships</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Price-Yield Relationship</li>
                    <li>Interest Rate Risk</li>
                    <li>Credit Risk</li>
                    <li>Market Conditions</li>
                    <li>Economic Factors</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Bond Price Factors</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Market interest rates</li>
                    <li>Time to maturity</li>
                    <li>Credit quality</li>
                    <li>Payment frequency</li>
                    <li>Economic conditions</li>
                  </ul>
                </div>

                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Investment Tips</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Diversify bond portfolio</li>
                    <li>Consider interest rate risk</li>
                    <li>Monitor credit ratings</li>
                    <li>Understand call provisions</li>
                    <li>Review tax implications</li>
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
