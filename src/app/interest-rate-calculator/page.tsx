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

type CalculationType = 'APR' | 'APY' | 'Nominal' | 'Effective';

export default function InterestRateCalculator() {
  const breadcrumbItems = [
    {
      label: 'Interest Rate Calculator',
      href: '/interest-rate-calculator'
    }
  ];

  // Calculator State
  const [calculationType, setCalculationType] = useState<CalculationType>('APR');
  const [interestRate, setInterestRate] = useState<number>(5);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>('monthly');
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [fees, setFees] = useState<number>(500);

  // Results
  const [apr, setApr] = useState<number>(0);
  const [apy, setApy] = useState<number>(0);
  const [nominalRate, setNominalRate] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateRates = () => {
    const periodsPerYear = getPeriodsPerYear(compoundingFrequency);
    
    // Calculate different types of rates
    const calculatedApr = calculateAPR();
    const calculatedApy = calculateAPY(interestRate, periodsPerYear);
    const calculatedNominal = calculateNominalRate(interestRate, periodsPerYear);
    const calculatedEffective = calculateEffectiveRate(interestRate, periodsPerYear);

    // Set results
    setApr(calculatedApr);
    setApy(calculatedApy);
    setNominalRate(calculatedNominal);
    setEffectiveRate(calculatedEffective);

    // Calculate loan amortization
    calculateAmortization(calculatedApr);
  };

  const getPeriodsPerYear = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'semiannually': return 2;
      case 'annually': return 1;
      default: return 12;
    }
  };

  const calculateAPR = (): number => {
    const periodicRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPaymentAmount = (loanAmount * periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) /
      (Math.pow(1 + periodicRate, numberOfPayments) - 1);
    
    setMonthlyPayment(monthlyPaymentAmount);

    // Calculate APR considering fees
    const totalCost = (monthlyPaymentAmount * numberOfPayments) - loanAmount + fees;
    const aprRate = (totalCost / (loanAmount * loanTerm)) * 100;

    return aprRate;
  };

  const calculateAPY = (rate: number, periods: number): number => {
    return (Math.pow(1 + rate / 100 / periods, periods) - 1) * 100;
  };

  const calculateNominalRate = (effectiveRate: number, periods: number): number => {
    return (Math.pow(1 + effectiveRate / 100, 1 / periods) - 1) * periods * 100;
  };

  const calculateEffectiveRate = (nominalRate: number, periods: number): number => {
    return (Math.pow(1 + nominalRate / 100 / periods, periods) - 1) * 100;
  };

  const calculateAmortization = (aprRate: number) => {
    const monthlyRate = aprRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const payment = monthlyPayment;
    
    let balance = loanAmount;
    let yearlyBalances = [];
    let totalInterestPaid = 0;

    for (let year = 0; year <= loanTerm; year++) {
      const yearlyPayment = year === 0 ? 0 : payment * 12;
      const yearlyInterest = year === 0 ? 0 : balance * (Math.pow(1 + monthlyRate, 12) - 1);
      const yearlyPrincipal = yearlyPayment - yearlyInterest;

      totalInterestPaid += yearlyInterest;
      balance = year === 0 ? loanAmount : balance - yearlyPrincipal;

      yearlyBalances.push({
        year,
        balance: Math.max(0, balance),
        totalInterest: totalInterestPaid,
        payment: yearlyPayment
      });
    }

    setTotalInterest(totalInterestPaid);
    setYearlyData(yearlyBalances);
  };

  // Chart for loan balance and payments
  const getLoanChart = () => {
    const years = yearlyData.map(data => data.year);
    const balances = yearlyData.map(data => data.balance);
    const interests = yearlyData.map(data => data.totalInterest);

    return {
      title: {
        text: 'Loan Balance and Interest Over Time',
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
        data: ['Loan Balance', 'Total Interest'],
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
          name: 'Loan Balance',
          type: 'line',
          data: balances,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Total Interest',
          type: 'line',
          data: interests,
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: '#2196F3' }
        }
      ]
    };
  };

  // Chart for rate comparison
  const getRateComparisonChart = () => {
    return {
      title: {
        text: 'Interest Rate Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      xAxis: {
        type: 'category',
        data: ['APR', 'APY', 'Nominal Rate', 'Effective Rate']
      },
      yAxis: {
        type: 'value',
        name: 'Rate (%)',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: apr, itemStyle: { color: '#4CAF50' } },
            { value: apy, itemStyle: { color: '#2196F3' } },
            { value: nominalRate, itemStyle: { color: '#9C27B0' } },
            { value: effectiveRate, itemStyle: { color: '#FF9800' } }
          ],
          label: {
            show: true,
            formatter: '{c}%'
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Interest Rate Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Interest Rates</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Calculator Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rate Type to Calculate</span>
                  </label>
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value as CalculationType)}
                    className="select select-bordered w-full"
                  >
                    <option value="APR">Annual Percentage Rate (APR)</option>
                    <option value="APY">Annual Percentage Yield (APY)</option>
                    <option value="Nominal">Nominal Rate</option>
                    <option value="Effective">Effective Rate</option>
                  </select>
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
                          <p>Base interest rate</p>
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
                    step="0.01"
                  />
                </div>

                {/* Compounding Frequency Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Compounding Frequency</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How often interest is compounded</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semiannually">Semi-annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                {/* Loan Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Amount ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Principal amount of the loan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
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
                          <p>Length of the loan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                  />
                </div>

                {/* Fees Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Fees ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Additional loan fees and charges</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRates}
                >
                  Calculate Rates
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
                    <div className="stat-title">APR</div>
                    <div className="stat-value text-lg">
                      {apr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">APY</div>
                    <div className="stat-value text-lg">
                      {apy.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Nominal Rate</div>
                    <div className="stat-value text-lg">
                      {nominalRate.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Effective Rate</div>
                    <div className="stat-value text-lg">
                      {effectiveRate.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg">
                      ${totalInterest.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getLoanChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getRateComparisonChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Different Interest Rates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">APR vs APY</h3>
                    <ul className="list-disc pl-6">
                      <li>APR is the simple interest rate plus fees</li>
                      <li>APY includes compound interest effects</li>
                      <li>APY is always higher than APR</li>
                      <li>APY better reflects true cost of borrowing</li>
                    </ul>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Nominal vs Effective</h3>
                    <ul className="list-disc pl-6">
                      <li>Nominal rate is the stated rate</li>
                      <li>Effective rate includes compounding</li>
                      <li>Effective rate shows true annual return</li>
                      <li>Frequency affects the difference</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Factors Affecting Interest Rates</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Compounding Frequency:</strong> More frequent compounding increases effective rate
                  </li>
                  <li>
                    <strong>Loan Term:</strong> Longer terms may have different rates
                  </li>
                  <li>
                    <strong>Loan Amount:</strong> May affect available rates
                  </li>
                  <li>
                    <strong>Additional Fees:</strong> Increase APR
                  </li>
                  <li>
                    <strong>Credit Score:</strong> Affects offered rates
                  </li>
                  <li>
                    <strong>Market Conditions:</strong> Influence base rates
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Comparing Rates</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Always compare APR when shopping for loans</li>
                  <li>Consider the effect of compounding frequency</li>
                  <li>Include all fees in calculations</li>
                  <li>Look at total cost over loan term</li>
                  <li>Compare monthly payments</li>
                  <li>Consider prepayment options</li>
                  <li>Check for rate adjustments</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
