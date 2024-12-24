'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Plus, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

interface Debt {
  id: number;
  name: string;
  balance: number;
  interestRate: number;
  monthlyPayment: number;
  remainingMonths: number;
}

export default function DebtConsolidationCalculator() {
  const breadcrumbItems = [
    {
      label: 'Debt Consolidation Calculator',
      href: '/debt-consolidation-calculator'
    }
  ];

  // State for existing debts
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit Card 1', balance: 5000, interestRate: 18.9, monthlyPayment: 150, remainingMonths: 48 }
  ]);
  
  // State for consolidation loan
  const [consolidationAmount, setConsolidationAmount] = useState<number>(0);
  const [consolidationRate, setConsolidationRate] = useState<number>(8.9);
  const [consolidationTerm, setConsolidationTerm] = useState<number>(60);
  const [originationFee, setOriginationFee] = useState<number>(0);
  const [nextDebtId, setNextDebtId] = useState<number>(2);

  // State for results
  const [currentTotalPayment, setCurrentTotalPayment] = useState<number>(0);
  const [consolidatedPayment, setConsolidatedPayment] = useState<number>(0);
  const [currentTotalInterest, setCurrentTotalInterest] = useState<number>(0);
  const [consolidatedTotalInterest, setConsolidatedTotalInterest] = useState<number>(0);
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [breakevenMonths, setBreakevenMonths] = useState<number>(0);

  // Add new debt
  const addDebt = () => {
    setDebts([
      ...debts,
      {
        id: nextDebtId,
        name: `Debt ${nextDebtId}`,
        balance: 0,
        interestRate: 0,
        monthlyPayment: 0,
        remainingMonths: 0
      }
    ]);
    setNextDebtId(nextDebtId + 1);
  };

  // Remove debt
  const removeDebt = (id: number) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  // Update debt
  const updateDebt = (id: number, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  // Calculate consolidation details
  const calculateConsolidation = () => {
    // Calculate total current debt and monthly payments
    const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
    
    // Set consolidation amount if not manually set
    if (consolidationAmount === 0) {
      setConsolidationAmount(totalDebt);
    }

    // Calculate current scenario
    let currentTotalInt = 0;
    debts.forEach(debt => {
      const monthlyRate = debt.interestRate / 1200;
      const totalPayments = debt.monthlyPayment * debt.remainingMonths;
      currentTotalInt += totalPayments - debt.balance;
    });

    // Calculate consolidated scenario
    const consolidatedMonthlyRate = consolidationRate / 1200;
    const loanAmount = consolidationAmount * (1 + (originationFee / 100));
    const consolidatedMonthlyPmt = calculateMonthlyPayment(loanAmount, consolidatedMonthlyRate, consolidationTerm);
    const consolidatedTotalInt = (consolidatedMonthlyPmt * consolidationTerm) - consolidationAmount;

    // Calculate savings
    const monthlyPaymentSavings = totalMonthlyPayment - consolidatedMonthlyPmt;
    const totalInterestSavings = currentTotalInt - consolidatedTotalInt;

    // Calculate breakeven point considering origination fee
    const breakevenPeriod = Math.ceil(
      (originationFee / 100 * consolidationAmount) / monthlyPaymentSavings
    );

    setCurrentTotalPayment(totalMonthlyPayment);
    setConsolidatedPayment(consolidatedMonthlyPmt);
    setCurrentTotalInterest(currentTotalInt);
    setConsolidatedTotalInterest(consolidatedTotalInt);
    setMonthlySavings(monthlyPaymentSavings);
    setTotalSavings(totalInterestSavings);
    setBreakevenMonths(breakevenPeriod);
  };

  // Helper function to calculate monthly payment
  const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  };

  // Chart for payment comparison
  const getPaymentComparisonChart = () => {
    return {
      title: {
        text: 'Monthly Payment Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Current', 'Consolidated'],
        bottom: 0
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Monthly Payment']
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
          name: 'Current',
          type: 'bar',
          data: [currentTotalPayment],
          itemStyle: { color: '#FF5722' }
        },
        {
          name: 'Consolidated',
          type: 'bar',
          data: [consolidatedPayment],
          itemStyle: { color: '#4CAF50' }
        }
      ]
    };
  };

  // Chart for total cost comparison
  const getTotalCostComparisonChart = () => {
    const currentPrincipal = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const consolidatedPrincipal = consolidationAmount;
    const originationCost = consolidationAmount * (originationFee / 100);

    return {
      title: {
        text: 'Total Cost Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Principal', 'Interest', 'Fees'],
        bottom: 0
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Current Debts', 'Consolidated Loan']
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
          name: 'Principal',
          type: 'bar',
          stack: 'total',
          data: [currentPrincipal, consolidatedPrincipal],
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Interest',
          type: 'bar',
          stack: 'total',
          data: [currentTotalInterest, consolidatedTotalInterest],
          itemStyle: { color: '#FF5722' }
        },
        {
          name: 'Fees',
          type: 'bar',
          stack: 'total',
          data: [0, originationCost],
          itemStyle: { color: '#2196F3' }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Debt Consolidation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Current Debts</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Debts List */}
                {debts.map((debt) => (
                  <div key={debt.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className="btn btn-ghost btn-circle"
                        disabled={debts.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Balance ($)</span>
                        </label>
                        <input
                          type="number"
                          value={debt.balance}
                          onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="100"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Interest Rate (%)</span>
                        </label>
                        <input
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) => updateDebt(debt.id, 'interestRate', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Monthly Payment ($)</span>
                        </label>
                        <input
                          type="number"
                          value={debt.monthlyPayment}
                          onChange={(e) => updateDebt(debt.id, 'monthlyPayment', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="10"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Remaining Months</span>
                        </label>
                        <input
                          type="number"
                          value={debt.remainingMonths}
                          onChange={(e) => updateDebt(debt.id, 'remainingMonths', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addDebt}
                  className="btn btn-outline w-full"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Debt
                </button>

                <Separator />

                {/* Consolidation Loan Details */}
                <h3 className="text-xl font-semibold">Consolidation Loan Details</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Consolidation Amount ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Leave at 0 to use total debt amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={consolidationAmount}
                    onChange={(e) => setConsolidationAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Interest Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    value={consolidationRate}
                    onChange={(e) => setConsolidationRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (months)</span>
                  </label>
                  <select
                    value={consolidationTerm}
                    onChange={(e) => setConsolidationTerm(Number(e.target.value))}
                    className="select select-bordered w-full"
                  >
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                    <option value="84">84 months</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Origination Fee (%)</span>
                  </label>
                  <input
                    type="number"
                    value={originationFee}
                    onChange={(e) => setOriginationFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateConsolidation}
                >
                  Calculate Consolidation
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Consolidation Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Savings</div>
                    <div className="stat-value text-lg text-green-500">
                      ${monthlySavings.toFixed(2)}
                    </div>
                    <div className="stat-desc">
                      {((monthlySavings / currentTotalPayment) * 100).toFixed(1)}% reduction
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest Savings</div>
                    <div className="stat-value text-lg text-green-500">
                      ${totalSavings.toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      Over the life of the loan
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Break-even Period</div>
                    <div className="stat-value text-lg">
                      {breakevenMonths} months
                    </div>
                    <div className="stat-desc">
                      To recover origination fee
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">New Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${consolidatedPayment.toFixed(2)}
                    </div>
                    <div className="stat-desc">
                      vs ${currentTotalPayment.toFixed(2)} current
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPaymentComparisonChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getTotalCostComparisonChart()} style={{ height: '400px' }} />
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
              <h2 className="text-2xl font-semibold">Understanding Debt Consolidation</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Pros and Cons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Advantages</h4>
                      <ul className="list-disc pl-6">
                        <li>Single monthly payment</li>
                        <li>Potentially lower interest rate</li>
                        <li>Fixed repayment schedule</li>
                        <li>Simplified debt management</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-6">
                        <li>Possible origination fees</li>
                        <li>May extend repayment period</li>
                        <li>Could pay more interest long-term</li>
                        <li>Requires good credit for best rates</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">When to Consider Consolidation</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Multiple high-interest debts</li>
                      <li>Good credit score for better rates</li>
                      <li>Stable income for payments</li>
                      <li>Committed to avoiding new debt</li>
                      <li>Clear plan for debt-free future</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Alternative Options</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Balance transfer credit cards</li>
                      <li>Debt management plans</li>
                      <li>Debt snowball/avalanche methods</li>
                      <li>Personal loans</li>
                      <li>Credit counseling services</li>
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
