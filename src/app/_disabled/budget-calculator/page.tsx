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

interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
}

interface BudgetBreakdown {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  surplusDeficit: number;
  expenseRatio: number;
  savingsRatio: number;
}

export default function BudgetCalculator() {
  const breadcrumbItems = [
    {
      label: 'Budget Calculator',
      href: '/budget-calculator'
    }
  ];

  // Income sources
  const [salary, setSalary] = useState<number>(5000);
  const [additionalIncome, setAdditionalIncome] = useState<number>(0);
  const [bonuses, setBonuses] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);

  // Living expenses
  const [housing, setHousing] = useState<number>(1500);
  const [utilities, setUtilities] = useState<number>(200);
  const [groceries, setGroceries] = useState<number>(400);
  const [transportation, setTransportation] = useState<number>(300);

  // Discretionary expenses
  const [entertainment, setEntertainment] = useState<number>(200);
  const [shopping, setShopping] = useState<number>(200);
  const [dining, setDining] = useState<number>(300);
  const [travel, setTravel] = useState<number>(200);

  // Financial goals
  const [emergencyFund, setEmergencyFund] = useState<number>(500);
  const [retirement, setRetirement] = useState<number>(500);
  const [investments401k, setInvestments401k] = useState<number>(400);
  const [debtPayment, setDebtPayment] = useState<number>(300);

  // Results
  const [breakdown, setBreakdown] = useState<BudgetBreakdown>({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    surplusDeficit: 0,
    expenseRatio: 0,
    savingsRatio: 0
  });

  // Calculate budget
  const calculateBudget = () => {
    // Calculate total income
    const totalIncome = salary + additionalIncome + bonuses + investments;

    // Calculate total expenses
    const livingExpenses = housing + utilities + groceries + transportation;
    const discretionaryExpenses = entertainment + shopping + dining + travel;
    const totalExpenses = livingExpenses + discretionaryExpenses;

    // Calculate total savings
    const totalSavings = emergencyFund + retirement + investments401k + debtPayment;

    // Calculate surplus/deficit
    const surplusDeficit = totalIncome - totalExpenses - totalSavings;

    // Calculate ratios
    const expenseRatio = (totalExpenses / totalIncome) * 100;
    const savingsRatio = (totalSavings / totalIncome) * 100;

    setBreakdown({
      totalIncome,
      totalExpenses,
      totalSavings,
      surplusDeficit,
      expenseRatio,
      savingsRatio
    });
  };

  useEffect(() => {
    calculateBudget();
  }, [
    salary,
    additionalIncome,
    bonuses,
    investments,
    housing,
    utilities,
    groceries,
    transportation,
    entertainment,
    shopping,
    dining,
    travel,
    emergencyFund,
    retirement,
    investments401k,
    debtPayment
  ]);

  // Chart for income breakdown
  const getIncomeBreakdownChart = () => {
    const data = [
      { value: salary, name: 'Salary' },
      { value: additionalIncome, name: 'Additional Income' },
      { value: bonuses, name: 'Bonuses' },
      { value: investments, name: 'Investment Income' }
    ].filter(item => item.value > 0);

    return {
      title: {
        text: 'Income Sources',
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
        data: data,
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

  // Chart for expense breakdown
  const getExpenseBreakdownChart = () => {
    const categories = [
      { name: 'Housing', amount: housing },
      { name: 'Utilities', amount: utilities },
      { name: 'Groceries', amount: groceries },
      { name: 'Transportation', amount: transportation },
      { name: 'Entertainment', amount: entertainment },
      { name: 'Shopping', amount: shopping },
      { name: 'Dining', amount: dining },
      { name: 'Travel', amount: travel }
    ].filter(category => category.amount > 0);

    return {
      title: {
        text: 'Expense Breakdown',
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
        data: categories.map(category => ({
          value: category.amount,
          name: category.name
        })),
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

  // Chart for savings breakdown
  const getSavingsBreakdownChart = () => {
    const data = [
      { value: emergencyFund, name: 'Emergency Fund' },
      { value: retirement, name: 'Retirement' },
      { value: investments401k, name: '401(k)' },
      { value: debtPayment, name: 'Debt Payment' }
    ].filter(item => item.value > 0);

    return {
      title: {
        text: 'Savings & Goals',
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
        data: data,
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Budget Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-8">
            {/* Income Sources */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Income Sources</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Monthly Salary ($)</span>
                    </label>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Additional Income ($)</span>
                    </label>
                    <input
                      type="number"
                      value={additionalIncome}
                      onChange={(e) => setAdditionalIncome(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Monthly Bonuses ($)</span>
                    </label>
                    <input
                      type="number"
                      value={bonuses}
                      onChange={(e) => setBonuses(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Investment Income ($)</span>
                    </label>
                    <input
                      type="number"
                      value={investments}
                      onChange={(e) => setInvestments(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Living Expenses */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Living Expenses</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Housing ($)</span>
                    </label>
                    <input
                      type="number"
                      value={housing}
                      onChange={(e) => setHousing(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Utilities ($)</span>
                    </label>
                    <input
                      type="number"
                      value={utilities}
                      onChange={(e) => setUtilities(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="10"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Groceries ($)</span>
                    </label>
                    <input
                      type="number"
                      value={groceries}
                      onChange={(e) => setGroceries(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Transportation ($)</span>
                    </label>
                    <input
                      type="number"
                      value={transportation}
                      onChange={(e) => setTransportation(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discretionary Expenses */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Discretionary Expenses</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Entertainment ($)</span>
                    </label>
                    <input
                      type="number"
                      value={entertainment}
                      onChange={(e) => setEntertainment(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Shopping ($)</span>
                    </label>
                    <input
                      type="number"
                      value={shopping}
                      onChange={(e) => setShopping(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Dining Out ($)</span>
                    </label>
                    <input
                      type="number"
                      value={dining}
                      onChange={(e) => setDining(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Travel ($)</span>
                    </label>
                    <input
                      type="number"
                      value={travel}
                      onChange={(e) => setTravel(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Goals */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Financial Goals</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Fund ($)</span>
                    </label>
                    <input
                      type="number"
                      value={emergencyFund}
                      onChange={(e) => setEmergencyFund(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Retirement ($)</span>
                    </label>
                    <input
                      type="number"
                      value={retirement}
                      onChange={(e) => setRetirement(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">401(k) ($)</span>
                    </label>
                    <input
                      type="number"
                      value={investments401k}
                      onChange={(e) => setInvestments401k(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Debt Payment ($)</span>
                    </label>
                    <input
                      type="number"
                      value={debtPayment}
                      onChange={(e) => setDebtPayment(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      step="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Budget Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Income</div>
                      <div className="stat-value text-lg text-green-500">
                        ${breakdown.totalIncome.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Expenses</div>
                      <div className="stat-value text-lg text-red-500">
                        ${breakdown.totalExpenses.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Total Savings</div>
                      <div className="stat-value text-lg text-blue-500">
                        ${breakdown.totalSavings.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Surplus/Deficit</div>
                      <div className={`stat-value text-lg ${breakdown.surplusDeficit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${breakdown.surplusDeficit.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Ratios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Expense Ratio</div>
                      <div className="stat-value text-lg">
                        {breakdown.expenseRatio.toFixed(1)}%
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Savings Ratio</div>
                      <div className="stat-value text-lg">
                        {breakdown.savingsRatio.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Charts */}
                  <div className="space-y-6">
                    <div>
                      <ReactECharts option={getIncomeBreakdownChart()} style={{ height: '300px' }} />
                    </div>
                    <div>
                      <ReactECharts option={getExpenseBreakdownChart()} style={{ height: '300px' }} />
                    </div>
                    <div>
                      <ReactECharts option={getSavingsBreakdownChart()} style={{ height: '300px' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Budgeting Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">50/30/20 Rule</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>50% for needs (essential expenses)</li>
                        <li>30% for wants (discretionary spending)</li>
                        <li>20% for savings and debt repayment</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Emergency Fund</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Aim for 3-6 months of expenses</li>
                        <li>Keep in easily accessible account</li>
                        <li>Start small and build gradually</li>
                        <li>Review and adjust regularly</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Saving Strategies</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Pay yourself first</li>
                        <li>Automate savings</li>
                        <li>Cut unnecessary expenses</li>
                        <li>Track spending habits</li>
                        <li>Review subscriptions regularly</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
