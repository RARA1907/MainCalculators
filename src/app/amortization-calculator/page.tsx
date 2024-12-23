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

export default function AmortizationCalculator() {
  const breadcrumbItems = [
  
    {
      label: 'Amortization Calculator',
      href: '/amortization-calculator'
    }
  ];

  // State for loan details
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>('2024-01');
  const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');
  const [extraPayment, setExtraPayment] = useState<number>(0);

  // State for calculation results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  // Calculate amortization
  const calculateAmortization = () => {
    const periodicInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPaymentAmount = (loanAmount * periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments)) / (Math.pow(1 + periodicInterestRate, numberOfPayments) - 1);

    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = balance * periodicInterestRate;
      const principalPayment = monthlyPaymentAmount - interestPayment + (i === 1 ? extraPayment : 0);
      balance = balance - principalPayment;
      totalInterestPaid += interestPayment;

      schedule.push({
        paymentNumber: i,
        payment: monthlyPaymentAmount + (i === 1 ? extraPayment : 0),
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest: totalInterestPaid
      });

      if (balance <= 0) break;
    }

    setMonthlyPayment(monthlyPaymentAmount);
    setTotalInterest(totalInterestPaid);
    setTotalPayment(loanAmount + totalInterestPaid);
    setAmortizationSchedule(schedule);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold text-base-content">Amortization Calculator</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Form */}
            <div className="flex-1">
              <Card className="bg-base-100">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-base-content">Loan Details</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Amount */}
                  <div className="form-control">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-base-content">Loan Amount ($)</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-base-content/70" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the total amount of the loan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="form-control">
                    <label className="text-base-content mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                  </div>

                  {/* Loan Term */}
                  <div className="form-control">
                    <label className="text-base-content mb-2">Loan Term</label>
                    <select 
                      className="select select-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                    >
                      <option value={30}>30 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={10}>10 Years</option>
                      <option value={5}>5 Years</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="form-control">
                    <label className="text-base-content mb-2">Start Date</label>
                    <input
                      type="month"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* Payment Frequency */}
                  <div className="form-control">
                    <label className="text-base-content mb-2">Payment Frequency</label>
                    <select 
                      className="select select-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={paymentFrequency}
                      onChange={(e) => setPaymentFrequency(e.target.value)}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="biweekly">Bi-Weekly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  {/* Extra Payment */}
                  <div className="form-control">
                    <label className="text-base-content mb-2">Extra Payment ($)</label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300 border-2"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(Number(e.target.value))}
                      placeholder="Optional"
                    />
                  </div>

                  <button 
                    className="btn bg-blue-500 hover:bg-blue-600 text-white mt-4 w-full border-0"
                    onClick={calculateAmortization}
                  >
                    Calculate
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Results Card */}
            <div className="flex-1">
              <Card className="bg-base-100">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-base-content">Payment Summary</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Monthly Payment</span>
                      <span className="text-2xl font-bold text-base-content">${monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-base-content/70">
                      Due on the 1st of each month
                    </div>
                  </div>

                  <Separator />

                  {/* Loan Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Total Principal</span>
                      <span className="font-medium text-base-content">${loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Total Interest</span>
                      <span className="font-medium text-base-content">${totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-base-content">Total of All Payments</span>
                      <span className="text-base-content">${totalPayment.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Distribution Chart */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-base-content">Payment Distribution</h4>
                    <div className="h-[300px]">
                      <ReactECharts
                        option={{
                          tooltip: {
                            trigger: 'item',
                            formatter: '{b}: ${c} ({d}%)'
                          },
                          legend: {
                            orient: 'vertical',
                            right: 10,
                            top: 'center',
                            textStyle: {
                              color: 'var(--fallback-bc,oklch(var(--bc)/1))'
                            }
                          },
                          series: [
                            {
                              name: 'Payment Distribution',
                              type: 'pie',
                              radius: ['40%', '70%'],
                              center: ['40%', '50%'],
                              avoidLabelOverlap: true,
                              itemStyle: {
                                borderRadius: 10,
                                borderColor: 'var(--fallback-b1,oklch(var(--b1)))',
                                borderWidth: 2
                              },
                              label: {
                                show: false
                              },
                              emphasis: {
                                label: {
                                  show: true,
                                  formatter: '{b}: ${c}\n({d}%)',
                                  fontSize: 14
                                }
                              },
                              data: [
                                { 
                                  value: loanAmount, 
                                  name: 'Principal',
                                  itemStyle: { color: '#3B82F6' }
                                },
                                { 
                                  value: totalInterest, 
                                  name: 'Interest',
                                  itemStyle: { color: '#10B981' }
                                }
                              ]
                            }
                          ]
                        }}
                        style={{ height: '100%' }}
                        opts={{ renderer: 'canvas' }}
                      />
                    </div>
                  </div>

                  {/* Amortization Schedule */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-base-content">Amortization Schedule</h4>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Payment #</th>
                            <th>Payment</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortizationSchedule.slice(0, 12).map((payment) => (
                            <tr key={payment.paymentNumber}>
                              <td>{payment.paymentNumber}</td>
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

                  {/* Social Share Buttons */}
                  <div className="flex justify-end gap-2 mt-6">
                    <button 
                      className="btn btn-circle btn-ghost"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20Amortization%20Calculator!&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                    <button 
                      className="btn btn-circle btn-ghost"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </button>
                    <button 
                      className="btn btn-circle btn-ghost"
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=Amortization%20Calculator`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
