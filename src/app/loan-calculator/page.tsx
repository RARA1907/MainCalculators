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

export default function LoanCalculator() {
  const breadcrumbItems = [
    {
      label: 'Loan Calculator',
      href: '/loan-calculator'
    }
  ];

  // State for inputs
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [loanType, setLoanType] = useState<string>('mortgage');

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<Array<{
    period: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
    totalInterest: number;
  }>>([]);
  const [payoffDate, setPayoffDate] = useState<string>('');
  const [interestSaved, setInterestSaved] = useState<number>(0);

  const calculateLoan = () => {
    const periodicRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using the loan payment formula
    const monthlyPmt = loanAmount * (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) 
                      / (Math.pow(1 + periodicRate, numberOfPayments) - 1);
    
    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];
    let month = 1;

    while (balance > 0 && month <= numberOfPayments) {
      const interestPayment = balance * periodicRate;
      const principalPayment = Math.min(monthlyPmt + extraPayment - interestPayment, balance);
      const totalPayment = principalPayment + interestPayment;
      
      totalInterestPaid += interestPayment;
      balance -= principalPayment;

      schedule.push({
        period: month,
        payment: totalPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: balance,
        totalInterest: totalInterestPaid
      });

      month++;
    }

    // Calculate payoff date
    const today = new Date();
    const payoffDateObj = new Date(today.setMonth(today.getMonth() + schedule.length));
    
    // Calculate interest saved with extra payments
    const normalTotalInterest = loanAmount * (monthlyPmt * numberOfPayments / loanAmount - 1);
    const interestSavings = normalTotalInterest - totalInterestPaid;

    setMonthlyPayment(monthlyPmt);
    setTotalPayment(monthlyPmt * numberOfPayments);
    setTotalInterest(totalInterestPaid);
    setAmortizationSchedule(schedule);
    setPayoffDate(payoffDateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    }));
    setInterestSaved(interestSavings);
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    return {
      title: {
        text: 'Loan Payment Breakdown',
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
              value: loanAmount,
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalInterest,
              name: 'Interest',
              itemStyle: { color: '#FF5722' }
            }
          ]
        }
      ]
    };
  };

  // Chart for amortization schedule
  const getAmortizationChart = () => {
    return {
      title: {
        text: 'Amortization Schedule',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          return `Month ${params[0].data[0]}<br/>
            Principal: $${params[0].data[1].toLocaleString()}<br/>
            Interest: $${params[1].data[1].toLocaleString()}<br/>
            Balance: $${params[2].data[1].toLocaleString()}`
        }
      },
      legend: {
        data: ['Principal', 'Interest', 'Remaining Balance'],
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
            if (value >= 1000000) {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return '$' + (value / 1000).toFixed(0) + 'K';
            }
            return '$' + value;
          }
        }
      },
      series: [
        {
          name: 'Principal',
          type: 'bar',
          stack: 'payment',
          data: amortizationSchedule.map(item => [item.period, item.principal]),
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Interest',
          type: 'bar',
          stack: 'payment',
          data: amortizationSchedule.map(item => [item.period, item.interest]),
          itemStyle: { color: '#FF5722' }
        },
        {
          name: 'Remaining Balance',
          type: 'line',
          data: amortizationSchedule.map(item => [item.period, item.remainingBalance]),
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Loan Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Loan Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Type</span>
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="mortgage">Mortgage</option>
                    <option value="auto">Auto Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="student">Student Loan</option>
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
                          <p>Total amount you plan to borrow</p>
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
                    step="1000"
                  />
                </div>

                {/* Interest Rate Input */}
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
                    max="30"
                    step="0.1"
                  />
                </div>

                {/* Loan Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (Years)</span>
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="40"
                  />
                </div>

                {/* Payment Frequency Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Frequency</span>
                  </label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Extra Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Extra Monthly Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Additional payment to reduce loan term</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateLoan}
                >
                  Calculate Loan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Loan Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${monthlyPayment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Payment</div>
                    <div className="stat-value text-lg">
                      ${totalPayment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Payoff Date</div>
                    <div className="stat-value text-lg">
                      {payoffDate}
                    </div>
                  </div>
                </div>

                {extraPayment > 0 && (
                  <div className="bg-green-100 ">
                    <h3 className="font-semibold text-green-800 ">
                      Extra Payment Savings
                    </h3>
                    <p className="text-green-700 ">
                      By making an extra monthly payment of ${extraPayment}, you will save ${interestSaved.toLocaleString()} in interest!
                    </p>
                  </div>
                )}

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getPaymentBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getAmortizationChart()} style={{ height: '400px' }} />
                  </div>
                </div>

                {/* Amortization Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Payment #</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.filter((_, index) => index % 12 === 0).map((payment) => (
                        <tr key={payment.period}>
                          <td>{payment.period}</td>
                          <td>${payment.payment.toFixed(2)}</td>
                          <td>${payment.principal.toFixed(2)}</td>
                          <td>${payment.interest.toFixed(2)}</td>
                          <td>${payment.remainingBalance.toFixed(2)}</td>
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
              <h2 className="text-2xl font-semibold">Understanding Your Loan</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Principal</h4>
                      <p>The initial amount borrowed, not including interest.</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Interest Rate</h4>
                      <p>The annual cost of borrowing, expressed as a percentage.</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Amortization</h4>
                      <p>The process of paying off a loan with regular payments.</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Extra Payments</h4>
                      <p>Additional payments that reduce the principal and total interest.</p>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Loan Management</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Make extra payments when possible to reduce total interest</li>
                      <li>Consider bi-weekly payments to make an extra payment each year</li>
                      <li>Keep track of your amortization schedule</li>
                      <li>Compare different loan terms to find the best option</li>
                      <li>Understand the impact of interest rates on total cost</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Types of Loans</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li><strong>Mortgage:</strong> Long-term loan for home purchase</li>
                      <li><strong>Auto Loan:</strong> Vehicle financing, typically 3-7 years</li>
                      <li><strong>Personal Loan:</strong> Unsecured loan for various purposes</li>
                      <li><strong>Student Loan:</strong> Education financing with special terms</li>
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
