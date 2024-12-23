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

export default function RentalPropertyCalculator() {
  const breadcrumbItems = [
    {
      label: 'Rental Property Calculator',
      href: '/rental-property-calculator'
    }
  ];

  // Property Details
  const [purchasePrice, setPurchasePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [closingCosts, setClosingCosts] = useState<number>(5000);
  const [repairCosts, setRepairCosts] = useState<number>(10000);
  const [propertyValue, setPropertyValue] = useState<number>(300000);
  const [appreciationRate, setAppreciationRate] = useState<number>(3);

  // Financing
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(0);

  // Income
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Operating Expenses
  const [propertyTax, setPropertyTax] = useState<number>(3000);
  const [insurance, setInsurance] = useState<number>(1200);
  const [utilities, setUtilities] = useState<number>(0);
  const [maintenance, setMaintenance] = useState<number>(1800);
  const [propertyManagement, setPropertyManagement] = useState<number>(0);
  const [hoaFees, setHoaFees] = useState<number>(0);

  // Results
  const [monthlyCashFlow, setMonthlyCashFlow] = useState<number>(0);
  const [yearlyNetIncome, setYearlyNetIncome] = useState<number>(0);
  const [capRate, setCapRate] = useState<number>(0);
  const [cashOnCashReturn, setCashOnCashReturn] = useState<number>(0);
  const [roi5Year, setRoi5Year] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  const calculateResults = () => {
    // Calculate monthly mortgage payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const loanAmount = purchasePrice - downPayment;
    const mortgagePayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate effective gross income
    const vacancyLoss = monthlyRent * (vacancyRate / 100);
    const effectiveGrossIncome = (monthlyRent - vacancyLoss + otherIncome) * 12;

    // Calculate operating expenses
    const annualOperatingExpenses = 
      propertyTax + 
      insurance + 
      (utilities * 12) + 
      maintenance + 
      (propertyManagement * 12) + 
      (hoaFees * 12);

    // Calculate net operating income
    const netOperatingIncome = effectiveGrossIncome - annualOperatingExpenses;

    // Calculate monthly cash flow
    const monthlyCashFlowCalc = 
      (effectiveGrossIncome - annualOperatingExpenses - (mortgagePayment * 12)) / 12;

    // Calculate total investment
    const totalInvestmentCalc = downPayment + closingCosts + repairCosts;

    // Calculate returns
    const capRateCalc = (netOperatingIncome / propertyValue) * 100;
    const cashOnCashReturnCalc = 
      ((effectiveGrossIncome - annualOperatingExpenses - (mortgagePayment * 12)) / 
      totalInvestmentCalc) * 100;

    // Calculate 5-year ROI
    const appreciatedValue = propertyValue * Math.pow(1 + (appreciationRate / 100), 5);
    const equityBuilt = loanAmount - (loanAmount * Math.pow(1 - (1 / numberOfPayments), 60));
    const totalReturn = 
      (appreciatedValue - propertyValue) + // Appreciation
      equityBuilt + // Equity from mortgage paydown
      (monthlyCashFlowCalc * 12 * 5); // Cash flow
    const roi5YearCalc = (totalReturn / totalInvestmentCalc) * 100;

    // Update state
    setMonthlyMortgage(mortgagePayment);
    setMonthlyCashFlow(monthlyCashFlowCalc);
    setYearlyNetIncome(netOperatingIncome);
    setCapRate(capRateCalc);
    setCashOnCashReturn(cashOnCashReturnCalc);
    setRoi5Year(roi5YearCalc);
    setTotalInvestment(totalInvestmentCalc);
  };

  // Chart for monthly cash flow breakdown
  const getCashFlowChart = () => {
    return {
      title: {
        text: 'Monthly Cash Flow Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: monthlyRent, name: 'Rental Income' },
            { value: monthlyMortgage, name: 'Mortgage' },
            { value: propertyTax / 12, name: 'Property Tax' },
            { value: insurance / 12, name: 'Insurance' },
            { value: maintenance / 12, name: 'Maintenance' },
            { value: utilities, name: 'Utilities' },
            { value: hoaFees, name: 'HOA Fees' }
          ].filter(item => item.value > 0),
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

  // Chart for return metrics
  const getReturnMetricsChart = () => {
    return {
      title: {
        text: 'Return Metrics',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['Cap Rate', 'Cash on Cash', '5-Year ROI']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          data: [
            { value: capRate, itemStyle: { color: '#4CAF50' } },
            { value: cashOnCashReturn, itemStyle: { color: '#2196F3' } },
            { value: roi5Year, itemStyle: { color: '#9C27B0' } }
          ],
          type: 'bar'
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Rental Property Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Property Details & Financing</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Purchase Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Purchase Price ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The total purchase price of the property</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
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
                          <p>Initial payment for the property</p>
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
                          <p>Annual interest rate for the mortgage</p>
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
                          <p>Expected monthly rental income</p>
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

                {/* Operating Expenses */}
                <h3 className="text-lg font-semibold pt-4">Operating Expenses (Annual)</h3>

                {/* Property Tax Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Property Tax ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual property tax amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Insurance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Insurance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual property insurance cost</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateResults}
                >
                  Calculate Returns
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Investment Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Cash Flow</div>
                    <div className={`stat-value text-lg ${monthlyCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${monthlyCashFlow.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Cap Rate</div>
                    <div className="stat-value text-lg">
                      {capRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Cash on Cash Return</div>
                    <div className="stat-value text-lg">
                      {cashOnCashReturn.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">5-Year ROI</div>
                    <div className="stat-value text-lg">
                      {roi5Year.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getCashFlowChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getReturnMetricsChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Rental Property Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Cash Flow</h3>
                    <p>Monthly rental income minus all expenses, including mortgage payments</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Cap Rate</h3>
                    <p>Net operating income divided by property value, showing return potential</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Operating Expenses to Consider</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property taxes</li>
                  <li>Insurance</li>
                  <li>Utilities</li>
                  <li>Maintenance and repairs</li>
                  <li>Property management fees</li>
                  <li>HOA fees</li>
                  <li>Vacancy costs</li>
                  <li>Marketing expenses</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Successful Rental Property Investment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Location Research</h3>
                    <p>Study neighborhood trends, amenities, and rental demand</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Property Management</h3>
                    <p>Consider professional management for hands-off investment</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Emergency Fund</h3>
                    <p>Maintain reserves for unexpected expenses and vacancies</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Risk Management</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Thoroughly screen tenants</li>
                  <li>Maintain adequate insurance coverage</li>
                  <li>Regular property inspections</li>
                  <li>Stay informed about local regulations</li>
                  <li>Plan for market fluctuations</li>
                  <li>Build relationships with reliable contractors</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
