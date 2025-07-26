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
  minimumPayment: number;
  lastPayment?: number;
  lastInterest?: number;
}

type PayoffStrategy = 'avalanche' | 'snowball' | 'custom';

export default function DebtPayoffCalculator() {
  const breadcrumbItems = [
    {
      label: 'Debt Payoff Calculator',
      href: '/debt-payoff-calculator'
    }
  ];

  // State for debts
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: 'Credit Card 1', balance: 5000, interestRate: 18.9, minimumPayment: 150 }
  ]);
  
  // State for payoff strategy and additional payment
  const [payoffStrategy, setPayoffStrategy] = useState<PayoffStrategy>('avalanche');
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);
  const [nextDebtId, setNextDebtId] = useState<number>(2);

  // State for results
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [monthsToPayoff, setMonthsToPayoff] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [payoffSchedule, setPayoffSchedule] = useState<any[]>([]);

  // Add new debt
  const addDebt = () => {
    setDebts([
      ...debts,
      {
        id: nextDebtId,
        name: `Debt ${nextDebtId}`,
        balance: 0,
        interestRate: 0,
        minimumPayment: 0
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

  // Calculate monthly interest for a debt
  const calculateMonthlyInterest = (balance: number, annualRate: number): number => {
    return (balance * (annualRate / 100)) / 12;
  };

  // Sort debts based on strategy
  const sortDebts = (debtsToSort: Debt[]): Debt[] => {
    if (payoffStrategy === 'avalanche') {
      return [...debtsToSort].sort((a, b) => b.interestRate - a.interestRate);
    } else if (payoffStrategy === 'snowball') {
      return [...debtsToSort].sort((a, b) => a.balance - b.balance);
    }
    return debtsToSort; // For custom order
  };

  // Calculate payoff details
  const calculatePayoff = () => {
    let currentDebts = sortDebts([...debts]);
    let totalMinPayment = currentDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    let monthlyAvailable = totalMinPayment + additionalPayment;
    let schedule: any[] = [];
    let month = 0;
    let totalInterestPaid = 0;
    let balanceOverTime: number[] = [];
    let interestOverTime: number[] = [];

    while (currentDebts.some(debt => debt.balance > 0) && month < 600) {
      let monthData = {
        month: month + 1,
        payments: [] as any[],
        totalBalance: 0,
        totalInterest: 0
      };

      let remainingPayment = monthlyAvailable;

      // Calculate interest and minimum payments
      currentDebts = currentDebts.map(debt => {
        if (debt.balance <= 0) return debt;

        let interest = calculateMonthlyInterest(debt.balance, debt.interestRate);
        let minPayment = Math.min(debt.minimumPayment, debt.balance + interest);
        let payment = minPayment;
        remainingPayment -= minPayment;

        return {
          ...debt,
          balance: debt.balance + interest - payment,
          lastInterest: interest,
          lastPayment: payment
        };
      });

      // Apply remaining payment to target debt
      if (remainingPayment > 0) {
        for (let i = 0; i < currentDebts.length; i++) {
          if (currentDebts[i].balance > 0) {
            let extraPayment = Math.min(remainingPayment, currentDebts[i].balance);
            currentDebts[i].balance -= extraPayment;
            currentDebts[i].lastPayment += extraPayment;
            remainingPayment -= extraPayment;
            if (remainingPayment <= 0) break;
          }
        }
      }

      // Record monthly data
      currentDebts.forEach(debt => {
        if (debt.lastPayment > 0) {
          monthData.payments.push({
            name: debt.name,
            payment: debt.lastPayment,
            interest: debt.lastInterest,
            remainingBalance: debt.balance
          });
          monthData.totalBalance += debt.balance;
          monthData.totalInterest += debt.lastInterest;
          totalInterestPaid += debt.lastInterest;
        }
      });

      schedule.push(monthData);
      balanceOverTime.push(monthData.totalBalance);
      interestOverTime.push(monthData.totalInterest);
      month++;
    }

    setTotalDebt(currentDebts.reduce((sum, debt) => sum + debt.balance, 0));
    setTotalInterest(totalInterestPaid);
    setMonthsToPayoff(month);
    setMonthlyPayment(monthlyAvailable);
    setPayoffSchedule(schedule);
  };

  // Chart for balance over time
  const getBalanceChart = () => {
    const months = payoffSchedule.map(data => data.month);
    const balances = payoffSchedule.map(data => data.totalBalance);

    return {
      title: {
        text: 'Balance Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const month = params[0].axisValue;
          const balance = params[0].data;
          return `Month ${month}<br/>Balance: $${balance.toFixed(2)}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: months,
        name: 'Month'
      },
      yAxis: {
        type: 'value',
        name: 'Balance ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [{
        data: balances,
        type: 'line',
        smooth: true,
        areaStyle: {},
        itemStyle: { color: '#4CAF50' }
      }]
    };
  };

  // Chart for payment allocation
  const getPaymentAllocationChart = () => {
    const totalPayment = monthlyPayment * monthsToPayoff;
    const principalPayment = totalPayment - totalInterest;

    return {
      title: {
        text: 'Payment Allocation',
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
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: principalPayment, name: 'Principal' },
          { value: totalInterest, name: 'Interest' }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Debt Payoff Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Your Debts</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Debts List */}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                          <span className="label-text">Minimum Payment ($)</span>
                        </label>
                        <input
                          type="number"
                          value={debt.minimumPayment}
                          onChange={(e) => updateDebt(debt.id, 'minimumPayment', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="10"
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

                {/* Payoff Strategy */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payoff Strategy</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Avalanche: Highest interest first<br/>
                             Snowball: Lowest balance first<br/>
                             Custom: Your own order</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={payoffStrategy}
                    onChange={(e) => setPayoffStrategy(e.target.value as PayoffStrategy)}
                    className="select select-bordered w-full"
                  >
                    <option value="avalanche">Debt Avalanche</option>
                    <option value="snowball">Debt Snowball</option>
                    <option value="custom">Custom Order</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Additional Monthly Payment ($)</span>
                  </label>
                  <input
                    type="number"
                    value={additionalPayment}
                    onChange={(e) => setAdditionalPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="10"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePayoff}
                >
                  Calculate Payoff Plan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payoff Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Debt</div>
                    <div className="stat-value text-lg">
                      ${totalDebt.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Months to Payoff</div>
                    <div className="stat-value text-lg">
                      {monthsToPayoff} months
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getBalanceChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getPaymentAllocationChart()} style={{ height: '300px' }} />
                  </div>
                </div>

                {/* Payment Schedule */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Interest</th>
                        <th>Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoffSchedule.map((month, index) => (
                        <tr key={index}>
                          <td>{month.month}</td>
                          <td>${monthlyPayment.toFixed(2)}</td>
                          <td>${month.totalInterest.toFixed(2)}</td>
                          <td>${month.totalBalance.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Debt Payoff Strategies</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Debt Avalanche vs. Debt Snowball</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Debt Avalanche</h4>
                      <ul className="list-disc pl-6">
                        <li>Prioritizes highest interest rate debts</li>
                        <li>Mathematically optimal approach</li>
                        <li>Minimizes total interest paid</li>
                        <li>Best for those focused on financial optimization</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Debt Snowball</h4>
                      <ul className="list-disc pl-6">
                        <li>Prioritizes lowest balance debts</li>
                        <li>Provides quick wins for motivation</li>
                        <li>Helps build momentum</li>
                        <li>Best for those needing psychological victories</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Successful Debt Payoff</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Create and stick to a budget</li>
                      <li>Cut unnecessary expenses</li>
                      <li>Consider debt consolidation</li>
                      <li>Build an emergency fund</li>
                      <li>Avoid taking on new debt</li>
                      <li>Celebrate milestones</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Credit counseling services</li>
                      <li>Debt management programs</li>
                      <li>Financial education resources</li>
                      <li>Budgeting tools and apps</li>
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
