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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactECharts from 'echarts-for-react';

export default function HouseAffordabilityCalculator() {
  const breadcrumbItems = [
    {
      label: 'House Affordability Calculator',
      href: '/house-affordability-calculator'
    }
  ];

  // State for income and expenses
  const [annualIncome, setAnnualIncome] = useState<number>(100000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(500);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(1200);
  const [hoa, setHoa] = useState<number>(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState<number>(36);

  // State for results
  const [maxHomePrice, setMaxHomePrice] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [monthlyTaxes, setMonthlyTaxes] = useState<number>(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState<number>(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState<number>(0);

  // Calculate affordability
  const calculateAffordability = () => {
    // Calculate monthly income and maximum monthly payment
    const monthlyIncome = annualIncome / 12;
    const maxMonthlyDebt = (monthlyIncome * (debtToIncomeRatio / 100)) - monthlyDebts;

    // Calculate monthly insurance and HOA
    const monthlyIns = homeInsurance / 12;
    const monthlyHoa = hoa;

    // Calculate maximum home price
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    // Using the mortgage payment formula backwards to find maximum loan amount
    const maxLoanAmount = maxMonthlyDebt * ((Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) / 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)));

    // Calculate maximum home price including down payment
    const calculatedMaxHomePrice = maxLoanAmount + downPayment;

    // Calculate monthly payments
    const loanAmount = calculatedMaxHomePrice - downPayment;
    const monthlyMortgage = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    const monthlyPropertyTax = (calculatedMaxHomePrice * (propertyTaxRate / 100)) / 12;

    // Update state with results
    setMaxHomePrice(calculatedMaxHomePrice);
    setMonthlyPayment(monthlyMortgage);
    setMonthlyTaxes(monthlyPropertyTax);
    setMonthlyInsurance(monthlyIns);
    setTotalMonthlyPayment(monthlyMortgage + monthlyPropertyTax + monthlyIns + monthlyHoa);
  };

  // Chart options for payment breakdown
  const getChartOptions = () => {
    return {
      title: {
        text: 'Monthly Payment Breakdown',
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
            { value: monthlyPayment, name: 'Principal & Interest' },
            { value: monthlyTaxes, name: 'Property Taxes' },
            { value: monthlyInsurance, name: 'Insurance' },
            { value: hoa, name: 'HOA Fees' }
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4">House Affordability Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Financial Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Annual Income */}
                <div className="space-y-2">
                  <Label>Annual Income ($)</Label>
                  <Input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  />
                </div>

                {/* Monthly Debts */}
                <div className="space-y-2">
                  <Label>Monthly Debt Payments ($)</Label>
                  <Input
                    type="number"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
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

                {/* Loan Term */}
                <div className="space-y-2">
                  <Label>Loan Term</Label>
                  <Select
                    value={loanTerm.toString()}
                    onValueChange={(value) => setLoanTerm(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Tax Rate */}
                <div className="space-y-2">
                  <Label>Property Tax Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                  />
                </div>

                {/* Home Insurance */}
                <div className="space-y-2">
                  <Label>Annual Home Insurance ($)</Label>
                  <Input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  />
                </div>

                {/* HOA Fees */}
                <div className="space-y-2">
                  <Label>Monthly HOA Fees ($)</Label>
                  <Input
                    type="number"
                    value={hoa}
                    onChange={(e) => setHoa(Number(e.target.value))}
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={calculateAffordability}
                >
                  Calculate Affordability
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat">
                    <div className="stat-title">Maximum Home Price</div>
                    <div className="stat-value text-lg">${maxHomePrice.toLocaleString()}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Monthly Mortgage Payment</div>
                    <div className="stat-value text-lg">${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Monthly Property Taxes</div>
                    <div className="stat-value text-lg">${monthlyTaxes.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Monthly Payment</div>
                    <div className="stat-value text-lg">${totalMonthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Monthly Payment Breakdown</h3>
                  <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold mb-8">Understanding Home Affordability: A Comprehensive Guide</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What Determines Home Affordability?</h2>
              <p className="mb-4">
                Home affordability is determined by several key factors including your income, debts, 
                down payment, and current mortgage rates. Understanding these factors helps you make 
                an informed decision about how much house you can comfortably afford.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Factors in Home Affordability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Income</h3>
                    <p>Your gross monthly income is a primary factor in determining how much you can borrow</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Debt-to-Income Ratio</h3>
                    <p>Lenders typically prefer a DTI ratio of 43% or less</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Down Payment</h3>
                    <p>A larger down payment increases your home buying power</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Credit Score</h3>
                    <p>Better credit scores typically mean better interest rates</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Additional Costs to Consider</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Property taxes</li>
                <li>Home insurance</li>
                <li>HOA fees</li>
                <li>Maintenance and repairs</li>
                <li>Utilities</li>
                <li>Private Mortgage Insurance (PMI) if down payment is less than 20%</li>
              </ul>
            </section>

            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Increasing Your Home Affordability</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Improve your credit score</li>
                <li>Pay down existing debts</li>
                <li>Save for a larger down payment</li>
                <li>Consider a longer loan term</li>
                <li>Look for areas with lower property taxes</li>
                <li>Shop around for better mortgage rates</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
              <p className="mb-4">
                Understanding how much house you can afford is crucial in your home buying journey. 
                Use this calculator as a starting point, but remember to consider your complete financial 
                picture and long-term goals when making your decision. It's also wise to consult with 
                a financial advisor or mortgage professional for personalized advice.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
