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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ReactECharts from 'echarts-for-react';

export default function RealEstateCalculator() {
  const breadcrumbItems = [
    {
      label: 'Real Estate Calculator',
      href: '/real-estate-calculator'
    }
  ];

  // Property Details
  const [purchasePrice, setPurchasePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(1200);
  const [maintenanceMonthly, setMaintenanceMonthly] = useState<number>(200);
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);
  const [appreciationRate, setAppreciationRate] = useState<number>(3);
  
  // Rental Income
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [propertyManagementFee, setPropertyManagementFee] = useState<number>(10);

  // Results
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [monthlyCashFlow, setMonthlyCashFlow] = useState<number>(0);
  const [capRate, setCapRate] = useState<number>(0);
  const [cashOnCashReturn, setCashOnCashReturn] = useState<number>(0);
  const [propertyValueIn5Years, setPropertyValueIn5Years] = useState<number>(0);
  const [propertyValueIn10Years, setPropertyValueIn10Years] = useState<number>(0);

  const calculateResults = () => {
    // Calculate loan amount
    const loanAmount = purchasePrice - downPayment;
    
    // Calculate monthly mortgage payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const mortgagePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate monthly expenses
    const propertyTax = (purchasePrice * (propertyTaxRate / 100)) / 12;
    const insurance = insuranceAnnual / 12;
    const totalMonthlyExpenses = propertyTax + insurance + maintenanceMonthly + hoaMonthly;

    // Calculate rental income after vacancy and management
    const effectiveRent = monthlyRent * (1 - vacancyRate / 100);
    const managementFee = effectiveRent * (propertyManagementFee / 100);
    const netRentalIncome = effectiveRent - managementFee;

    // Calculate cash flow
    const monthlyCashFlowCalc = netRentalIncome - mortgagePayment - totalMonthlyExpenses;

    // Calculate cap rate
    const annualNetOperatingIncome = (netRentalIncome - totalMonthlyExpenses) * 12;
    const capRateCalc = (annualNetOperatingIncome / purchasePrice) * 100;

    // Calculate cash on cash return
    const annualCashFlow = monthlyCashFlowCalc * 12;
    const cashOnCashReturnCalc = (annualCashFlow / downPayment) * 100;

    // Calculate future property values
    const value5Years = purchasePrice * Math.pow(1 + appreciationRate / 100, 5);
    const value10Years = purchasePrice * Math.pow(1 + appreciationRate / 100, 10);

    // Update state with calculations
    setMonthlyMortgage(mortgagePayment);
    setMonthlyExpenses(totalMonthlyExpenses);
    setMonthlyCashFlow(monthlyCashFlowCalc);
    setCapRate(capRateCalc);
    setCashOnCashReturn(cashOnCashReturnCalc);
    setPropertyValueIn5Years(value5Years);
    setPropertyValueIn10Years(value10Years);
  };

  // Chart options for monthly breakdown
  const getMonthlyBreakdownChart = () => {
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
            { value: monthlyRent, name: 'Gross Rent' },
            { value: monthlyMortgage, name: 'Mortgage' },
            { value: monthlyExpenses, name: 'Expenses' },
            { value: monthlyCashFlow, name: 'Net Cash Flow' }
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

  // Chart options for property value projection
  const getAppreciationChart = () => {
    return {
      title: {
        text: 'Property Value Projection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Now', '5 Years', '10 Years']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          data: [purchasePrice, propertyValueIn5Years, propertyValueIn10Years],
          type: 'line',
          smooth: true
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Real Estate Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Property Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Purchase Price */}
                <div className="space-y-2">
                  <Label>Purchase Price ($)</Label>
                  <Input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  />
                </div>

                {/* Down Payment */}
                <div className="space-y-2">
                  <Label>Down Payment ($)</Label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                  />
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                {/* Property Tax */}
                <div className="space-y-2">
                  <Label>Annual Property Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  />
                </div>

                {/* Insurance */}
                <div className="space-y-2">
                  <Label>Annual Insurance ($)</Label>
                  <Input
                    type="number"
                    value={insuranceAnnual}
                    onChange={(e) => setInsuranceAnnual(Number(e.target.value))}
                  />
                </div>

                {/* HOA Fees */}
                <div className="space-y-2">
                  <Label>Monthly HOA Fees ($)</Label>
                  <Input
                    type="number"
                    value={hoaMonthly}
                    onChange={(e) => setHoaMonthly(Number(e.target.value))}
                  />
                </div>

                {/* Maintenance */}
                <div className="space-y-2">
                  <Label>Monthly Maintenance ($)</Label>
                  <Input
                    type="number"
                    value={maintenanceMonthly}
                    onChange={(e) => setMaintenanceMonthly(Number(e.target.value))}
                  />
                </div>

                {/* Rental Income */}
                <div className="space-y-2">
                  <Label>Monthly Rental Income ($)</Label>
                  <Input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={calculateResults}
                >
                  Calculate Investment Returns
                </Button>
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
                    <div className="stat-value text-lg">
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
                    <div className="stat-title">Monthly Mortgage</div>
                    <div className="stat-value text-lg">
                      ${monthlyMortgage.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getMonthlyBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getAppreciationChart()} style={{ height: '300px' }} />
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
              <h2 className="text-2xl font-semibold mb-4">Understanding Real Estate Investment Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Cap Rate</h3>
                    <p>The capitalization rate measures a property's potential return on investment, calculated as the ratio of net operating income to property value.</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Cash on Cash Return</h3>
                    <p>This metric shows the return on the actual cash invested, helping you compare different investment opportunities.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Investment Considerations</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Location and neighborhood analysis</li>
                  <li>Property condition and maintenance requirements</li>
                  <li>Local real estate market trends</li>
                  <li>Rental demand in the area</li>
                  <li>Future development plans nearby</li>
                  <li>Property tax rates and insurance costs</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Investment Strategies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Buy and Hold</h3>
                    <p>Purchase property for long-term appreciation and rental income</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Fix and Flip</h3>
                    <p>Buy undervalued properties, renovate, and sell for profit</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">BRRRR Method</h3>
                    <p>Buy, Rehab, Rent, Refinance, Repeat for portfolio growth</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Risk Management</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain adequate cash reserves for emergencies</li>
                  <li>Properly screen tenants to minimize vacancy risk</li>
                  <li>Obtain comprehensive property insurance</li>
                  <li>Regularly inspect and maintain the property</li>
                  <li>Stay informed about local market conditions</li>
                  <li>Consider professional property management</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
