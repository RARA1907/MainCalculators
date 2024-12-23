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
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Amortization Calculator</h1>
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

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold mb-8">Amortization Calculator: A Complete Guide to Understanding and Using It</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                An amortization calculator is a vital tool for anyone managing loans or planning to borrow money. 
                This tool simplifies the complex process of calculating your monthly payments, interest charges, 
                and principal reductions over the life of a loan. Whether you're purchasing a home, financing a car, 
                or taking out a personal loan, understanding amortization is essential to making informed financial decisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What Is an Amortization Calculator?</h2>
              <p className="mb-4">
                An amortization calculator is a digital tool or software application that calculates how a loan's 
                payments are divided into principal and interest over time. It uses specific inputs like loan amount, 
                interest rate, and loan term to generate a detailed payment schedule.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Why Is Amortization Important in Finance?</h2>
              <p className="mb-4">Amortization allows borrowers to understand:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Monthly payment obligations</li>
                <li>How much of each payment goes toward interest and principal</li>
                <li>The total cost of the loan over time</li>
              </ul>
              <p>This clarity can help borrowers choose the right loan product and budget effectively.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Amortization</h2>
              
              <h3 className="text-xl font-semibold mb-3">Definition of Amortization</h3>
              <p className="mb-4">
                Amortization refers to the gradual repayment of a debt through scheduled payments, 
                where each installment covers both interest and a portion of the principal balance.
              </p>

              <h3 className="text-xl font-semibold mb-3">Types of Amortization</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Loan Amortization:</strong> Applicable to mortgages, auto loans, and personal loans</li>
                <li><strong>Intangible Asset Amortization:</strong> Relates to spreading out the cost of intangible assets over their useful lives</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Key Components of Amortization</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Principal:</strong> The original loan amount borrowed</li>
                <li><strong>Interest Rate:</strong> The percentage charged by the lender for borrowing</li>
                <li><strong>Loan Term:</strong> The duration over which the loan will be repaid</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How an Amortization Calculator Works</h2>
              
              <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">The Mathematical Formula</h3>
                <p className="mb-2">The standard formula for calculating loan payments is:</p>
                <div className="bg-base-100 p-4 rounded-md font-mono text-sm mb-4">
                  M = P [r(1+r)^n] / [(1+r)^n - 1]
                </div>
                <p>Where:</p>
                <ul className="list-none space-y-2">
                  <li>M = Monthly payment</li>
                  <li>P = Loan amount</li>
                  <li>r = Monthly interest rate</li>
                  <li>n = Number of payments</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Common Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Home Loans</h3>
                    <p>Calculate mortgage payments and understand interest costs</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Car Loans</h3>
                    <p>Plan auto financing effectively</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Personal Loans</h3>
                    <p>Manage short-term borrowing</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Business Loans</h3>
                    <p>Analyze repayment schedules for commercial financing</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    What is the difference between amortization and depreciation?
                  </div>
                  <div className="collapse-content"> 
                    <p>Amortization applies to loans or intangible assets, while depreciation is used for tangible assets.</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    Can an amortization calculator help reduce my loan term?
                  </div>
                  <div className="collapse-content"> 
                    <p>Yes, by evaluating the impact of extra payments, you can shorten the loan term.</p>
                  </div>
                </div>
                <div className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="my-accordion-3" /> 
                  <div className="collapse-title text-xl font-medium">
                    What is the amortization period?
                  </div>
                  <div className="collapse-content"> 
                    <p>It's the total duration over which the loan is repaid, including principal and interest.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
              <p className="mb-4">
                In summary, understanding how to use an amortization calculator can greatly enhance your 
                financial planning capabilities. By leveraging technology effectively, you can make informed 
                decisions about your loans and manage your finances more efficiently.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
