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

type LoanPurpose = 'debt-consolidation' | 'home-improvement' | 'major-purchase' | 'other';
type PaymentFrequency = 'monthly' | 'biweekly';

export default function PersonalLoanCalculator() {
  const breadcrumbItems = [
    {
      label: 'Personal Loan Calculator',
      href: '/personal-loan-calculator'
    }
  ];

  // Loan details
  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(8.99);
  const [loanTerm, setLoanTerm] = useState<number>(3);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>('debt-consolidation');
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly');
  
  // Additional costs
  const [originationFee, setOriginationFee] = useState<number>(1);
  const [creditScore, setCreditScore] = useState<number>(700);
  
  // Results
  const [schedule, setSchedule] = useState<PaymentSchedule[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [apr, setApr] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Calculate monthly payment
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
    const monthlyRate = annualRate / 1200;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  // Calculate APR
  const calculateAPR = (loanAmount: number, fees: number, interestRate: number, term: number): number => {
    const totalFees = fees;
    const effectiveAmount = loanAmount - totalFees;
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term);
    const totalPayments = monthlyPayment * term * 12;
    
    // Simple APR calculation
    const apr = ((totalPayments - effectiveAmount) / (effectiveAmount * term)) * 100;
    return apr;
  };

  // Calculate loan details
  const calculateLoan = () => {
    const fees = (originationFee / 100 * loanAmount);
    const effectivePrincipal = loanAmount;
    const monthlyRate = interestRate / 1200;
    const numberOfPayments = loanTerm * 12;
    const payment = calculateMonthlyPayment(effectivePrincipal, interestRate, loanTerm);
    
    let currentBalance = effectivePrincipal;
    let schedule: PaymentSchedule[] = [];
    let totalInterestPaid = 0;
    
    // Generate amortization schedule
    for (let month = 1; month <= numberOfPayments; month++) {
      const monthlyInterest = currentBalance * monthlyRate;
      const principalPayment = payment - monthlyInterest;
      
      currentBalance -= principalPayment;
      totalInterestPaid += monthlyInterest;
      
      schedule.push({
        month,
        payment,
        principal: principalPayment,
        interest: monthlyInterest,
        remainingBalance: currentBalance
      });
    }
    
    // Calculate APR
    const calculatedAPR = calculateAPR(loanAmount, fees, interestRate, loanTerm);
    
    setSchedule(schedule);
    setMonthlyPayment(payment);
    setTotalInterest(totalInterestPaid);
    setApr(calculatedAPR);
    setTotalCost(totalInterestPaid + loanAmount + fees);
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    const principal = loanAmount;
    const fees = (originationFee / 100 * loanAmount);
    
    return {
      title: {
        text: 'Total Cost Breakdown',
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
          { value: totalInterest, name: 'Interest' },
          { value: fees, name: 'Fees' }
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Personal Loan Calculator</h1>
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
                    <span className="label-text">Loan Purpose</span>
                  </label>
                  <select
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                    className="select select-bordered w-full"
                  >
                    <option value="debt-consolidation">Debt Consolidation</option>
                    <option value="home-improvement">Home Improvement</option>
                    <option value="major-purchase">Major Purchase</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1000"
                    max="50000"
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
                    max="36"
                    step="0.01"
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
                    max="7"
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
                  </select>
                </div>

                <Separator />

                {/* Additional Details */}
                <h3 className="text-lg font-semibold">Additional Details</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Credit Score</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your credit score affects your interest rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="300"
                    max="850"
                    step="1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Origination Fee (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>One-time fee charged for processing the loan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={originationFee}
                    onChange={(e) => setOriginationFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="8"
                    step="0.1"
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
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyPayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">APR</div>
                    <div className="stat-value text-lg">
                      {apr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${totalCost.toLocaleString()}
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
              <h2 className="text-2xl font-semibold">Understanding Personal Loans</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Factors Affecting Your Loan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Credit Score Impact</h4>
                      <ul className="list-disc pl-6">
                        <li>Determines interest rate</li>
                        <li>Affects loan approval</li>
                        <li>Influences loan terms</li>
                        <li>May require collateral</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Loan Terms</h4>
                      <ul className="list-disc pl-6">
                        <li>Fixed monthly payments</li>
                        <li>Predictable interest rates</li>
                        <li>No prepayment penalties</li>
                        <li>Flexible use of funds</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Approval</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Check credit report for errors</li>
                      <li>Improve credit score if possible</li>
                      <li>Calculate affordable payment</li>
                      <li>Compare multiple lenders</li>
                      <li>Gather required documents</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Common Uses</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Debt consolidation</li>
                      <li>Home improvements</li>
                      <li>Major purchases</li>
                      <li>Emergency expenses</li>
                      <li>Medical bills</li>
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
