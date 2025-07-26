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

export default function CreditCardCalculator() {
  const breadcrumbItems = [
    {
      label: 'Credit Card Calculator',
      href: '/credit-card-calculator'
    }
  ];

  // State for inputs
  const [currentBalance, setCurrentBalance] = useState<number>(5000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(18.9);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(200);
  const [additionalPayment, setAdditionalPayment] = useState<number>(0);
  const [monthlyPurchases, setMonthlyPurchases] = useState<number>(0);
  const [paymentStrategy, setPaymentStrategy] = useState<string>('fixed');
  const [minimumPayment, setMinimumPayment] = useState<number>(25);
  const [minimumPercent, setMinimumPercent] = useState<number>(2);

  // State for results
  const [monthsToPayoff, setMonthsToPayoff] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [interestSaved, setInterestSaved] = useState<number>(0);
  const [timesSaved, setTimesSaved] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
    purchases: number;
  }>>([]);

  const calculatePayments = () => {
    let balance = currentBalance;
    let month = 0;
    let totalInterestPaid = 0;
    let schedule = [];
    const monthlyRate = annualInterestRate / 1200;

    // Calculate minimum payment schedule for comparison
    const minSchedule = calculateSchedule(true);
    
    // Calculate actual payment schedule
    while (balance > 0 && month < 600) { // 50 years max to prevent infinite loops
      month++;
      
      // Add monthly purchases
      balance += monthlyPurchases;

      // Calculate interest
      const interestCharge = balance * monthlyRate;
      totalInterestPaid += interestCharge;

      // Calculate payment based on strategy
      let payment = monthlyPayment + additionalPayment;
      if (paymentStrategy === 'minimum') {
        payment = Math.max(
          minimumPayment,
          balance * (minimumPercent / 100)
        );
      }

      // Adjust final payment if it would overpay
      payment = Math.min(payment, balance + interestCharge);

      // Calculate principal
      const principalPayment = payment - interestCharge;
      
      // Update balance
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: interestCharge,
        balance,
        purchases: monthlyPurchases
      });
    }

    // Calculate savings compared to minimum payments
    const interestSavings = minSchedule.totalInterest - totalInterestPaid;
    const timeSavings = minSchedule.months - month;

    setMonthsToPayoff(month);
    setTotalInterest(totalInterestPaid);
    setTotalPayments(totalInterestPaid + currentBalance);
    setPaymentSchedule(schedule);
    setInterestSaved(interestSavings);
    setTimesSaved(timeSavings);
  };

  // Helper function to calculate schedule for minimum payments
  const calculateSchedule = (isMinimum: boolean) => {
    let balance = currentBalance;
    let month = 0;
    let totalInterestPaid = 0;
    const monthlyRate = annualInterestRate / 1200;

    while (balance > 0 && month < 600) {
      month++;
      balance += monthlyPurchases;
      const interestCharge = balance * monthlyRate;
      totalInterestPaid += interestCharge;

      const payment = isMinimum ? 
        Math.max(minimumPayment, balance * (minimumPercent / 100)) :
        monthlyPayment + additionalPayment;

      const principalPayment = Math.min(payment - interestCharge, balance);
      balance = Math.max(0, balance - principalPayment);
    }

    return {
      months: month,
      totalInterest: totalInterestPaid
    };
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    return {
      title: {
        text: 'Payment Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          return `${params.name}: $${params.value.toLocaleString()} (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          data: [
            {
              value: currentBalance,
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalInterest,
              name: 'Interest',
              itemStyle: { color: '#FF5722' }
            },
            {
              value: monthlyPurchases * monthsToPayoff,
              name: 'New Purchases',
              itemStyle: { color: '#2196F3' }
            }
          ]
        }
      ]
    };
  };

  // Chart for balance over time
  const getBalanceOverTimeChart = () => {
    return {
      title: {
        text: 'Balance Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Balance', 'Interest', 'Principal'],
        bottom: 0
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: 'Amount ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: function(value: number) {
            return '$' + value.toLocaleString();
          }
        }
      },
      series: [
        {
          name: 'Balance',
          type: 'line',
          data: paymentSchedule.map(item => [item.month, item.balance]),
          itemStyle: { color: '#2196F3' }
        },
        {
          name: 'Interest',
          type: 'bar',
          stack: 'payment',
          data: paymentSchedule.map(item => [item.month, item.interest]),
          itemStyle: { color: '#FF5722' }
        },
        {
          name: 'Principal',
          type: 'bar',
          stack: 'payment',
          data: paymentSchedule.map(item => [item.month, item.principal]),
          itemStyle: { color: '#4CAF50' }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Credit Card Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Credit Card Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Balance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Balance ($)</span>
                  </label>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                {/* Annual Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Interest Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    value={annualInterestRate}
                    onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                {/* Payment Strategy Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Strategy</span>
                  </label>
                  <select
                    value={paymentStrategy}
                    onChange={(e) => setPaymentStrategy(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="fixed">Fixed Payment</option>
                    <option value="minimum">Minimum Payment</option>
                  </select>
                </div>

                {paymentStrategy === 'fixed' ? (
                  <>
                    {/* Monthly Payment Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Monthly Payment ($)</span>
                      </label>
                      <input
                        type="number"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="10"
                      />
                    </div>

                    {/* Additional Payment Input */}
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
                  </>
                ) : (
                  <>
                    {/* Minimum Payment Amount Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Minimum Payment Amount ($)</span>
                      </label>
                      <input
                        type="number"
                        value={minimumPayment}
                        onChange={(e) => setMinimumPayment(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="5"
                      />
                    </div>

                    {/* Minimum Payment Percentage Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Minimum Payment Percentage (%)</span>
                      </label>
                      <input
                        type="number"
                        value={minimumPercent}
                        onChange={(e) => setMinimumPercent(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                  </>
                )}

                {/* Monthly Purchases Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Purchases ($)</span>
                  </label>
                  <input
                    type="number"
                    value={monthlyPurchases}
                    onChange={(e) => setMonthlyPurchases(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="10"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePayments}
                >
                  Calculate Payments
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payment Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Months to Pay Off</div>
                    <div className="stat-value text-lg">
                      {monthsToPayoff}
                    </div>
                    <div className="stat-desc">
                      {timesSaved > 0 && `Saves ${timesSaved} months vs minimum payments`}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      {interestSaved > 0 && `Saves $${interestSaved.toLocaleString()} vs minimum payments`}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Payments</div>
                    <div className="stat-value text-lg">
                      ${totalPayments.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Interest</div>
                    <div className="stat-value text-lg">
                      ${(currentBalance * (annualInterestRate / 1200)).toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPaymentBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getBalanceOverTimeChart()} style={{ height: '400px' }} />
                  </div>
                </div>

                {/* Payment Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.filter((_, index) => index % 12 === 0).map((payment) => (
                        <tr key={payment.month}>
                          <td>{payment.month}</td>
                          <td>${payment.payment.toFixed(2)}</td>
                          <td>${payment.principal.toFixed(2)}</td>
                          <td>${payment.interest.toFixed(2)}</td>
                          <td>${payment.balance.toFixed(2)}</td>
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
              <h2 className="text-2xl font-semibold">Credit Card Debt Management</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Payment Strategies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Fixed Payment Strategy</h4>
                      <ul className="list-disc pl-6">
                        <li>Pay more than minimum each month</li>
                        <li>Consistent payment amount</li>
                        <li>Faster debt payoff</li>
                        <li>Less total interest paid</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Minimum Payment Strategy</h4>
                      <ul className="list-disc pl-6">
                        <li>Lower monthly payments</li>
                        <li>Longer repayment period</li>
                        <li>More total interest paid</li>
                        <li>Better for tight budgets</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Faster Payoff</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Pay more than the minimum payment</li>
                      <li>Make additional payments when possible</li>
                      <li>Avoid new purchases while paying off debt</li>
                      <li>Consider balance transfer options</li>
                      <li>Create a budget to maximize payments</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Understanding Credit Card Terms</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li><strong>APR:</strong> Annual Percentage Rate - yearly interest rate</li>
                      <li><strong>Grace Period:</strong> Time to pay without interest charges</li>
                      <li><strong>Minimum Payment:</strong> Lowest amount required monthly</li>
                      <li><strong>Balance Transfer:</strong> Moving debt to another card</li>
                      <li><strong>Cash Advance:</strong> Borrowing cash (usually higher rates)</li>
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
