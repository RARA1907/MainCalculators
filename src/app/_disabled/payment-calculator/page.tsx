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

export default function PaymentCalculator() {
  const breadcrumbItems = [
    {
      label: 'Payment Calculator',
      href: '/payment-calculator'
    }
  ];

  // State for inputs
  const [paymentType, setPaymentType] = useState<string>('loan');
  const [amount, setAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [term, setTerm] = useState<number>(36);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');
  const [balloonPayment, setBalloonPayment] = useState<number>(0);
  const [includesTax, setIncludesTax] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(0);

  // State for results
  const [regularPayment, setRegularPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<Array<{
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>>([]);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);

  const calculatePayment = () => {
    // Convert annual rate to periodic rate based on payment frequency
    let periodsPerYear;
    switch (paymentFrequency) {
      case 'weekly':
        periodsPerYear = 52;
        break;
      case 'biweekly':
        periodsPerYear = 26;
        break;
      case 'monthly':
        periodsPerYear = 12;
        break;
      case 'quarterly':
        periodsPerYear = 4;
        break;
      default:
        periodsPerYear = 12;
    }

    const periodicRate = (interestRate / 100) / periodsPerYear;
    const totalPeriods = (term * periodsPerYear) / 12;
    const loanAmount = amount - downPayment;

    // Calculate regular payment using the loan payment formula
    // If there's a balloon payment, adjust the calculation
    let payment;
    if (balloonPayment > 0) {
      const balloonPresentValue = balloonPayment / Math.pow(1 + periodicRate, totalPeriods);
      const amountToAmortize = loanAmount - balloonPresentValue;
      payment = (amountToAmortize * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) 
              / (Math.pow(1 + periodicRate, totalPeriods) - 1);
    } else {
      payment = (loanAmount * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) 
              / (Math.pow(1 + periodicRate, totalPeriods) - 1);
    }

    // Add tax if applicable
    if (includesTax) {
      payment *= (1 + taxRate / 100);
    }

    // Calculate payment schedule
    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];

    for (let period = 1; period <= totalPeriods; period++) {
      const interestPayment = balance * periodicRate;
      let principalPayment = payment - interestPayment;

      // Adjust for balloon payment in last period
      if (period === totalPeriods && balloonPayment > 0) {
        principalPayment = balance;
      }

      totalInterestPaid += interestPayment;
      balance -= principalPayment;

      schedule.push({
        period,
        payment: payment + (period === totalPeriods ? balloonPayment : 0),
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    // Calculate effective annual rate
    const effectiveAnnualRate = (Math.pow(1 + periodicRate, periodsPerYear) - 1) * 100;

    setRegularPayment(payment);
    setTotalPayment(payment * totalPeriods + balloonPayment);
    setTotalInterest(totalInterestPaid);
    setPaymentSchedule(schedule);
    setEffectiveRate(effectiveAnnualRate);
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
              value: amount - downPayment,
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalInterest,
              name: 'Interest',
              itemStyle: { color: '#FF5722' }
            },
            {
              value: downPayment,
              name: 'Down Payment',
              itemStyle: { color: '#2196F3' }
            },
            ...(balloonPayment > 0 ? [{
              value: balloonPayment,
              name: 'Balloon Payment',
              itemStyle: { color: '#9C27B0' }
            }] : [])
          ]
        }
      ]
    };
  };

  // Chart for payment schedule
  const getPaymentScheduleChart = () => {
    return {
      title: {
        text: 'Payment Schedule',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
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
        name: 'Period',
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
          data: paymentSchedule.map(item => [item.period, item.principal]),
          itemStyle: { color: '#4CAF50' }
        },
        {
          name: 'Interest',
          type: 'bar',
          stack: 'payment',
          data: paymentSchedule.map(item => [item.period, item.interest]),
          itemStyle: { color: '#FF5722' }
        },
        {
          name: 'Remaining Balance',
          type: 'line',
          data: paymentSchedule.map(item => [item.period, item.balance]),
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Payment Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payment Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Payment Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Type</span>
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="loan">Loan Payment</option>
                    <option value="lease">Lease Payment</option>
                    <option value="installment">Installment Payment</option>
                  </select>
                </div>

                {/* Amount Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Total Amount ($)</span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                {/* Down Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Down Payment ($)</span>
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max={amount}
                    step="100"
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
                    max="100"
                    step="0.1"
                  />
                </div>

                {/* Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Term (Months)</span>
                  </label>
                  <input
                    type="number"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="360"
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
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>

                {/* Balloon Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Balloon Payment ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional final payment at the end of the term</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={balloonPayment}
                    onChange={(e) => setBalloonPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                {/* Tax Options */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Include Tax</span>
                    <input
                      type="checkbox"
                      checked={includesTax}
                      onChange={(e) => setIncludesTax(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {includesTax && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tax Rate (%)</span>
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePayment}
                >
                  Calculate Payment
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Regular Payment</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${regularPayment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                    <div className="stat-desc">Per {paymentFrequency}</div>
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
                    <div className="stat-title">Effective Annual Rate</div>
                    <div className="stat-value text-lg">
                      {effectiveRate.toFixed(2)}%
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
                    <ReactECharts option={getPaymentScheduleChart()} style={{ height: '400px' }} />
                  </div>
                </div>

                {/* Payment Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.filter((_, index) => index % 12 === 0).map((payment) => (
                        <tr key={payment.period}>
                          <td>{payment.period}</td>
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
              <h2 className="text-2xl font-semibold">Understanding Payments</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Payment Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Loan Payments</h4>
                      <p>Regular payments to repay borrowed money with interest over time.</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Lease Payments</h4>
                      <p>Regular payments for the use of an asset without ownership.</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Installment Payments</h4>
                      <p>Fixed payments to purchase an item over time.</p>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Payment Components</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li><strong>Principal:</strong> The amount being financed</li>
                      <li><strong>Interest:</strong> The cost of borrowing</li>
                      <li><strong>Down Payment:</strong> Initial payment to reduce financed amount</li>
                      <li><strong>Balloon Payment:</strong> Larger final payment at end of term</li>
                      <li><strong>Tax:</strong> Additional charges required by law</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Payment Strategies</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Choose shorter terms to reduce total interest</li>
                      <li>Make larger down payments to lower monthly payments</li>
                      <li>Consider different payment frequencies</li>
                      <li>Understand the impact of balloon payments</li>
                      <li>Account for taxes and fees in total cost</li>
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
