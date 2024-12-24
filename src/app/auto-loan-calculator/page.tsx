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

export default function AutoLoanCalculator() {
  const breadcrumbItems = [
    {
      label: 'Auto Loan Calculator',
      href: '/auto-loan-calculator'
    }
  ];

  // State for inputs
  const [vehiclePrice, setVehiclePrice] = useState<number>(30000);
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [salesTax, setSalesTax] = useState<number>(6);
  const [includeExtras, setIncludeExtras] = useState<boolean>(false);
  const [dealerFees, setDealerFees] = useState<number>(0);
  const [extendedWarranty, setExtendedWarranty] = useState<number>(0);
  const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');

  // State for results
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<Array<{
    period: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>>([]);

  const calculateLoan = () => {
    // Calculate total amount to finance
    const taxAmount = (vehiclePrice - tradeInValue) * (salesTax / 100);
    const extras = includeExtras ? dealerFees + extendedWarranty : 0;
    const totalAmount = vehiclePrice + taxAmount + extras - downPayment - tradeInValue;

    // Calculate periodic payment
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
      default:
        periodsPerYear = 12;
    }

    const periodicRate = (interestRate / 100) / periodsPerYear;
    const totalPeriods = (loanTerm * periodsPerYear) / 12;
    
    // Calculate payment using loan payment formula
    const payment = (totalAmount * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) 
                   / (Math.pow(1 + periodicRate, totalPeriods) - 1);

    // Generate amortization schedule
    let balance = totalAmount;
    let totalInterestPaid = 0;
    const schedule = [];

    for (let period = 1; period <= totalPeriods; period++) {
      const interestPayment = balance * periodicRate;
      const principalPayment = payment - interestPayment;
      
      totalInterestPaid += interestPayment;
      balance -= principalPayment;

      schedule.push({
        period,
        payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setMonthlyPayment(payment);
    setTotalLoanAmount(totalAmount);
    setTotalInterest(totalInterestPaid);
    setTotalCost(totalAmount + totalInterestPaid);
    setPaymentSchedule(schedule);
  };

  // Chart for cost breakdown
  const getCostBreakdownChart = () => {
    return {
      title: {
        text: 'Total Cost Breakdown',
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
              value: vehiclePrice,
              name: 'Vehicle Price',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalInterest,
              name: 'Interest',
              itemStyle: { color: '#FF5722' }
            },
            {
              value: (vehiclePrice - tradeInValue) * (salesTax / 100),
              name: 'Sales Tax',
              itemStyle: { color: '#2196F3' }
            },
            ...(includeExtras ? [
              {
                value: dealerFees + extendedWarranty,
                name: 'Fees & Warranty',
                itemStyle: { color: '#9C27B0' }
              }
            ] : [])
          ]
        }
      ]
    };
  };

  // Chart for loan amortization
  const getLoanAmortizationChart = () => {
    return {
      title: {
        text: 'Loan Amortization Schedule',
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Auto Loan Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Vehicle & Loan Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Vehicle Price Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vehicle Price ($)</span>
                  </label>
                  <input
                    type="number"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
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
                    step="500"
                  />
                </div>

                {/* Trade-in Value Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Trade-in Value ($)</span>
                  </label>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                {/* Loan Term Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loan Term (months)</span>
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
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

                {/* Interest Rate Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Interest Rate (%)</span>
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

                {/* Sales Tax Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sales Tax (%)</span>
                  </label>
                  <input
                    type="number"
                    value={salesTax}
                    onChange={(e) => setSalesTax(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="15"
                    step="0.1"
                  />
                </div>

                {/* Additional Fees Toggle */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Include Additional Fees</span>
                    <input
                      type="checkbox"
                      checked={includeExtras}
                      onChange={(e) => setIncludeExtras(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {includeExtras && (
                  <>
                    {/* Dealer Fees Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Dealer Fees ($)</span>
                      </label>
                      <input
                        type="number"
                        value={dealerFees}
                        onChange={(e) => setDealerFees(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="100"
                      />
                    </div>

                    {/* Extended Warranty Input */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Extended Warranty ($)</span>
                      </label>
                      <input
                        type="number"
                        value={extendedWarranty}
                        onChange={(e) => setExtendedWarranty(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                        step="100"
                      />
                    </div>
                  </>
                )}

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

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateLoan}
                >
                  Calculate Auto Loan
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
                    <div className="stat-title">Payment Amount</div>
                    <div className="stat-value text-lg text-blue-500">
                      ${monthlyPayment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                    <div className="stat-desc">Per {paymentFrequency}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Loan Amount</div>
                    <div className="stat-value text-lg">
                      ${totalLoanAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
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
                    <ReactECharts option={getCostBreakdownChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getLoanAmortizationChart()} style={{ height: '400px' }} />
                  </div>
                </div>

                {/* Payment Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
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
              <h2 className="text-2xl font-semibold">Auto Loan Guide</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Understanding Auto Loans</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Key Components</h4>
                      <ul className="list-disc pl-6">
                        <li>Vehicle price and down payment</li>
                        <li>Interest rate and loan term</li>
                        <li>Sales tax and fees</li>
                        <li>Trade-in value</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Additional Costs</h4>
                      <ul className="list-disc pl-6">
                        <li>Registration and title fees</li>
                        <li>Insurance costs</li>
                        <li>Extended warranty</li>
                        <li>Maintenance and repairs</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Better Auto Loans</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Make a larger down payment to reduce monthly payments</li>
                      <li>Shop around for the best interest rates</li>
                      <li>Consider shorter loan terms to save on interest</li>
                      <li>Check your credit score before applying</li>
                      <li>Negotiate the vehicle price before discussing financing</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Common Mistakes to Avoid</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Focusing only on monthly payments</li>
                      <li>Taking too long of a loan term</li>
                      <li>Not shopping around for financing</li>
                      <li>Overlooking the total cost of ownership</li>
                      <li>Not considering gap insurance</li>
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
