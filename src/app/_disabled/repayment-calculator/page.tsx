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

interface PaymentSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly';
type ExtraPaymentFrequency = 'none' | 'monthly' | 'yearly' | 'once';

export default function RepaymentCalculator() {
  const breadcrumbItems = [
    {
      label: 'Repayment Calculator',
      href: '/repayment-calculator'
    }
  ];

  // Basic loan details
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly');

  // Extra payment details
  const [extraPaymentType, setExtraPaymentType] = useState<ExtraPaymentFrequency>('none');
  const [extraPaymentAmount, setExtraPaymentAmount] = useState<number>(0);
  const [extraPaymentStartMonth, setExtraPaymentStartMonth] = useState<number>(1);

  // Results
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [monthsSaved, setMonthsSaved] = useState<number>(0);
  const [interestSaved, setInterestSaved] = useState<number>(0);

  // Calculate monthly payment
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
    const monthlyRate = annualRate / 1200;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  // Calculate payment schedule
  const calculatePaymentSchedule = () => {
    const monthlyRate = interestRate / 1200;
    const numberOfPayments = loanTerm * 12;
    const baseMonthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTerm);
    
    let currentBalance = loanAmount;
    let schedule: PaymentSchedule[] = [];
    let month = 1;
    let totalPaid = 0;
    let totalInterestPaid = 0;
    
    // Calculate regular payment schedule
    const regularSchedule: PaymentSchedule[] = [];
    currentBalance = loanAmount;
    
    while (currentBalance > 0 && month <= numberOfPayments * 1.5) {
      let monthlyInterest = currentBalance * monthlyRate;
      let extraPayment = 0;
      
      // Calculate extra payment based on frequency
      if (extraPaymentType === 'monthly') {
        if (month >= extraPaymentStartMonth) {
          extraPayment = extraPaymentAmount;
        }
      } else if (extraPaymentType === 'yearly') {
        if (month >= extraPaymentStartMonth && (month - extraPaymentStartMonth) % 12 === 0) {
          extraPayment = extraPaymentAmount;
        }
      } else if (extraPaymentType === 'once' && month === extraPaymentStartMonth) {
        extraPayment = extraPaymentAmount;
      }
      
      let totalMonthlyPayment = Math.min(baseMonthlyPayment + extraPayment, currentBalance + monthlyInterest);
      let principalPayment = totalMonthlyPayment - monthlyInterest;
      
      currentBalance -= principalPayment;
      totalPaid += totalMonthlyPayment;
      totalInterestPaid += monthlyInterest;
      
      regularSchedule.push({
        month,
        payment: totalMonthlyPayment,
        principal: principalPayment,
        interest: monthlyInterest,
        remainingBalance: currentBalance
      });
      
      month++;
    }
    
    // Calculate comparison schedule without extra payments
    let comparisonBalance = loanAmount;
    let comparisonMonth = 1;
    let comparisonInterest = 0;
    
    while (comparisonBalance > 0 && comparisonMonth <= numberOfPayments * 1.5) {
      let monthlyInterest = comparisonBalance * monthlyRate;
      let principalPayment = baseMonthlyPayment - monthlyInterest;
      
      comparisonBalance -= principalPayment;
      comparisonInterest += monthlyInterest;
      comparisonMonth++;
    }
    
    setSchedule(regularSchedule);
    setTotalPayments(totalPaid);
    setTotalInterest(totalInterestPaid);
    setMonthsSaved(comparisonMonth - month);
    setInterestSaved(comparisonInterest - totalInterestPaid);
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    const principal = loanAmount;
    return {
      title: {
        text: 'Payment Breakdown',
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
          { value: principal, name: 'Principal' },
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

  // Chart for balance over time
  const getBalanceChart = () => {
    const months = schedule.map(data => data.month);
    const balances = schedule.map(data => data.remainingBalance);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Repayment Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Loan Details */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Interest Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (years)</span>
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Frequency</span>
                  </label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value as PaymentFrequency)}
                    className="select select-bordered w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <Separator />

                {/* Extra Payment Section */}
                <h3 className="text-lg font-semibold">Extra Payments</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Extra Payment Frequency</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose how often you want to make extra payments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={extraPaymentType}
                    onChange={(e) => setExtraPaymentType(e.target.value as ExtraPaymentFrequency)}
                    className="select select-bordered w-full"
                  >
                    <option value="none">No Extra Payments</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="once">One-time</option>
                  </select>
                </div>

                {extraPaymentType !== 'none' && (
                  <>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Extra Payment Amount ($)</span>
                      </label>
                      <input
                        type="number"
                        value={extraPaymentAmount}
                        onChange={(e) => setExtraPaymentAmount(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="100"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Start Month</span>
                      </label>
                      <input
                        type="number"
                        value={extraPaymentStartMonth}
                        onChange={(e) => setExtraPaymentStartMonth(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="1"
                        max={loanTerm * 12}
                        step="1"
                      />
                    </div>
                  </>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePaymentSchedule}
                >
                  Calculate Repayment Plan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Repayment Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${(totalPayments / (schedule.length || 1)).toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Time Saved</div>
                    <div className="stat-value text-lg text-green-500">
                      {monthsSaved} months
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Interest Saved</div>
                    <div className="stat-value text-lg text-green-500">
                      ${interestSaved.toLocaleString()}
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
                    <ReactECharts option={getBalanceChart()} style={{ height: '300px' }} />
                  </div>
                </div>

                {/* Amortization Schedule */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((month, index) => (
                        <tr key={index}>
                          <td>{month.month}</td>
                          <td>${month.payment.toFixed(2)}</td>
                          <td>${month.principal.toFixed(2)}</td>
                          <td>${month.interest.toFixed(2)}</td>
                          <td>${month.remainingBalance.toFixed(2)}</td>
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
              <h2 className="text-2xl font-semibold">Understanding Loan Repayment</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Payment Strategies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Regular Payments</h4>
                      <ul className="list-disc pl-6">
                        <li>Consistent monthly payments</li>
                        <li>Predictable payment schedule</li>
                        <li>Easy to budget</li>
                        <li>Standard amortization</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Extra Payments</h4>
                      <ul className="list-disc pl-6">
                        <li>Reduces total interest paid</li>
                        <li>Shortens loan term</li>
                        <li>Builds equity faster</li>
                        <li>Flexible payment options</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Faster Repayment</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Make bi-weekly payments</li>
                      <li>Round up your payments</li>
                      <li>Apply windfalls to principal</li>
                      <li>Set up automatic payments</li>
                      <li>Consider refinancing for better rates</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Important Considerations</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Check for prepayment penalties</li>
                      <li>Maintain emergency savings</li>
                      <li>Balance with other financial goals</li>
                      <li>Review loan terms regularly</li>
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
