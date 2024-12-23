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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="mb-6 mt-6 bg-base-100"
          />
          <h1 className="text-3xl font-bold text-base-content">House Affordability Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Financial Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Annual Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Income ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total annual household income before taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Monthly Debts Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Debts ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total monthly payments for car loans, credit cards, student loans, etc.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
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
                          <p>How much you plan to pay upfront</p>
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
                          <p>Expected annual mortgage interest rate</p>
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
                    step="0.1"
                  />
                </div>

                {/* Loan Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (years)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the mortgage loan in years</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="select select-bordered w-full"
                  >
                    <option value={30}>30 years</option>
                    <option value={20}>20 years</option>
                    <option value={15}>15 years</option>
                    <option value={10}>10 years</option>
                  </select>
                </div>

                {/* Property Tax Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Property Tax Rate (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Annual property tax rate in your area</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.1"
                  />
                </div>

                {/* Home Insurance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Home Insurance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated annual homeowner's insurance premium</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* HOA Fees Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly HOA Fees ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly Homeowners Association fees, if any</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={hoa}
                    onChange={(e) => setHoa(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateAffordability}
                >
                  Calculate Affordability
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
                    <div className="stat-title">Maximum Home Price</div>
                    <div className="stat-value text-lg">${maxHomePrice.toLocaleString()}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Mortgage Payment</div>
                    <div className="stat-value text-lg">${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Property Taxes</div>
                    <div className="stat-value text-lg">${monthlyTaxes.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
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
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Income</h3>
                    <p>Your gross monthly income is a primary factor in determining how much you can borrow</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Debt-to-Income Ratio</h3>
                    <p>Lenders typically prefer a DTI ratio of 43% or less</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Down Payment</h3>
                    <p>A larger down payment increases your home buying power</p>
                  </div>
                </div>
                <div className="card bg-base-200">
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
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    How much down payment do I need?
                  </div>
                  <div className="collapse-content"> 
                    <p>While 20% is ideal to avoid PMI, many loans allow down payments as low as 3.5% (FHA) or 3% (conventional).</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    What is a good debt-to-income ratio?
                  </div>
                  <div className="collapse-content"> 
                    <p>Most lenders prefer a debt-to-income ratio of 43% or less, though some may accept up to 50% in certain circumstances.</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    Should I include property taxes in my budget?
                  </div>
                  <div className="collapse-content"> 
                    <p>Yes, property taxes are a significant ongoing expense that should be included in your home affordability calculations.</p>
                  </div>
                </div>
              </div>
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
