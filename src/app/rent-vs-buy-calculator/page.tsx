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

export default function RentVsBuyCalculator() {
  const breadcrumbItems = [
    {
      label: 'Rent vs. Buy Calculator',
      href: '/rent-vs-buy-calculator'
    }
  ];

  // Buying Details
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [propertyTax, setPropertyTax] = useState<number>(3000);
  const [homeInsurance, setHomeInsurance] = useState<number>(1200);
  const [maintenance, setMaintenance] = useState<number>(3000);
  const [hoa, setHoa] = useState<number>(0);
  const [homeAppreciation, setHomeAppreciation] = useState<number>(3);

  // Renting Details
  const [monthlyRent, setMonthlyRent] = useState<number>(2000);
  const [rentersInsurance, setRentersInsurance] = useState<number>(200);
  const [rentIncrease, setRentIncrease] = useState<number>(3);

  // Investment Details
  const [investmentReturn, setInvestmentReturn] = useState<number>(7);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);

  // Results
  const [buyingCosts, setBuyingCosts] = useState<number[]>([]);
  const [rentingCosts, setRentingCosts] = useState<number[]>([]);
  const [homeEquity, setHomeEquity] = useState<number[]>([]);
  const [netWorthDifference, setNetWorthDifference] = useState<number>(0);
  const [breakEvenYear, setBreakEvenYear] = useState<number>(0);

  const calculateComparison = () => {
    let buyingCostsArray = [];
    let rentingCostsArray = [];
    let homeEquityArray = [];
    let buyerNetWorth = -downPayment;
    let renterNetWorth = 0;
    let foundBreakEven = false;
    let breakEvenYearFound = 0;

    // Calculate monthly mortgage payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const loanAmount = homePrice - downPayment;
    const monthlyMortgage = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate yearly costs and equity
    for (let year = 0; year <= timeHorizon; year++) {
      // Buying costs
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyPropertyTax = propertyTax * Math.pow(1 + homeAppreciation / 100, year);
      const yearlyHomeInsurance = homeInsurance * Math.pow(1 + homeAppreciation / 100, year);
      const yearlyMaintenance = maintenance * Math.pow(1 + homeAppreciation / 100, year);
      const yearlyHoa = hoa * 12;
      const totalBuyingCost = yearlyMortgage + yearlyPropertyTax + yearlyHomeInsurance + 
        yearlyMaintenance + yearlyHoa;
      
      // Home equity
      const homeValue = homePrice * Math.pow(1 + homeAppreciation / 100, year);
      const remainingLoan = year < loanTerm ? 
        loanAmount * (Math.pow(1 + monthlyRate, numberOfPayments) - Math.pow(1 + monthlyRate, year * 12)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1) : 0;
      const equity = homeValue - remainingLoan;

      // Renting costs
      const yearlyRent = monthlyRent * 12 * Math.pow(1 + rentIncrease / 100, year);
      const yearlyRentersInsurance = rentersInsurance;
      const totalRentingCost = yearlyRent + yearlyRentersInsurance;

      // Investment returns (difference in monthly payments invested)
      const monthlyDifference = totalBuyingCost / 12 - totalRentingCost / 12;
      const investmentValue = monthlyDifference > 0 ?
        monthlyDifference * 12 * Math.pow(1 + investmentReturn / 100, year) : 0;

      // Calculate net worth difference
      const buyerYearlyNetWorth = equity - totalBuyingCost;
      const renterYearlyNetWorth = -totalRentingCost + investmentValue;

      // Check for break-even point
      if (!foundBreakEven && buyerYearlyNetWorth > renterYearlyNetWorth) {
        foundBreakEven = true;
        breakEvenYearFound = year;
      }

      buyingCostsArray.push(totalBuyingCost);
      rentingCostsArray.push(totalRentingCost);
      homeEquityArray.push(equity);

      if (year === timeHorizon) {
        setNetWorthDifference(buyerYearlyNetWorth - renterYearlyNetWorth);
      }
    }

    setBuyingCosts(buyingCostsArray);
    setRentingCosts(rentingCostsArray);
    setHomeEquity(homeEquityArray);
    setBreakEvenYear(breakEvenYearFound);
  };

  // Chart for cost comparison
  const getCostComparisonChart = () => {
    const years = Array.from({length: timeHorizon + 1}, (_, i) => i);

    return {
      title: {
        text: 'Cost Comparison Over Time',
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
        data: ['Buying Costs', 'Renting Costs', 'Home Equity'],
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
          name: 'Buying Costs',
          type: 'line',
          data: buyingCosts,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Renting Costs',
          type: 'line',
          data: rentingCosts,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        },
        {
          name: 'Home Equity',
          type: 'line',
          data: homeEquity,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#9C27B0' }
        }
      ]
    };
  };

  // Chart for cumulative cost comparison
  const getCumulativeCostChart = () => {
    const cumulativeBuying = buyingCosts.reduce((acc, cost, index) => {
      acc.push((acc[index - 1] || 0) + cost);
      return acc;
    }, []);

    const cumulativeRenting = rentingCosts.reduce((acc, cost, index) => {
      acc.push((acc[index - 1] || 0) + cost);
      return acc;
    }, []);

    const years = Array.from({length: timeHorizon + 1}, (_, i) => i);

    return {
      title: {
        text: 'Cumulative Costs Over Time',
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
        data: ['Cumulative Buying Costs', 'Cumulative Renting Costs'],
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
          name: 'Cumulative Buying Costs',
          type: 'line',
          data: cumulativeBuying,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' },
          areaStyle: {
            opacity: 0.2
          }
        },
        {
          name: 'Cumulative Renting Costs',
          type: 'line',
          data: cumulativeRenting,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' },
          areaStyle: {
            opacity: 0.2
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Rent vs. Buy Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Compare Options</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Buying Details</h3>
                {/* Home Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Home Price ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Purchase price of the home</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Down Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Down Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Initial payment for the home</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
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
                          <p>Annual mortgage interest rate</p>
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
                    step="0.125"
                  />
                </div>

                <Separator />
                <h3 className="text-lg font-semibold">Renting Details</h3>

                {/* Monthly Rent Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Rent ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly rental payment</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Rent Increase Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Rent Increase (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected yearly increase in rent</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={rentIncrease}
                    onChange={(e) => setRentIncrease(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                <Separator />
                <h3 className="text-lg font-semibold">Additional Details</h3>

                {/* Time Horizon Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Time Horizon (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long you plan to stay</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateComparison}
                >
                  Compare Options
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Comparison Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Break-even Year</div>
                    <div className="stat-value text-lg">
                      Year {breakEvenYear}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Net Worth Difference</div>
                    <div className="stat-value text-lg">
                      ${netWorthDifference.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCostComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getCumulativeCostChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors to Consider</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Buying Advantages</h3>
                    <ul className="list-disc pl-6">
                      <li>Build equity over time</li>
                      <li>Tax deductions on mortgage interest</li>
                      <li>Property value appreciation</li>
                      <li>Fixed monthly payments</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Renting Advantages</h3>
                    <ul className="list-disc pl-6">
                      <li>Lower upfront costs</li>
                      <li>More flexibility to move</li>
                      <li>No maintenance responsibilities</li>
                      <li>Potential to invest difference</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Hidden Costs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Buying Hidden Costs</h3>
                    <ul className="list-disc pl-6">
                      <li>Property taxes</li>
                      <li>Home insurance</li>
                      <li>Maintenance and repairs</li>
                      <li>HOA fees</li>
                      <li>Closing costs</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Renting Hidden Costs</h3>
                    <ul className="list-disc pl-6">
                      <li>Security deposit</li>
                      <li>Renters insurance</li>
                      <li>Annual rent increases</li>
                      <li>Moving costs</li>
                      <li>Pet rent/deposit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Making Your Decision</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Consider your long-term plans</li>
                  <li>Evaluate your financial stability</li>
                  <li>Research local market conditions</li>
                  <li>Calculate total costs of ownership</li>
                  <li>Factor in lifestyle preferences</li>
                  <li>Consider investment alternatives</li>
                  <li>Evaluate tax implications</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
