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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function MortgagePayoffCalculator() {
  const breadcrumbItems = [
    {
      label: 'Mortgage Payoff Calculator',
      href: '/mortgage-payoff-calculator'
    }
  ];

  // State for mortgage details
  const [currentBalance, setCurrentBalance] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(1500);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('2024-01');

  // State for calculation results
  const [payoffDate, setPayoffDate] = useState<string>('');
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [monthsSaved, setMonthsSaved] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);

  // Calculate mortgage payoff
  const calculatePayoff = () => {
    let balance = currentBalance;
    let monthlyInterestRate = (interestRate / 100) / 12;
    let totalInterestPaid = 0;
    let months = 0;
    const schedule = [];
    let currentDate = new Date(startDate);

    while (balance > 0) {
      const interestPayment = balance * monthlyInterestRate;
      const principalPayment = monthlyPayment + extraPayment - interestPayment;
      
      if (principalPayment <= 0) {
        // Payment is not enough to cover interest
        break;
      }

      balance = Math.max(0, balance - principalPayment);
      totalInterestPaid += interestPayment;
      months++;

      schedule.push({
        paymentNumber: months,
        date: new Date(currentDate).toISOString().slice(0, 7),
        payment: monthlyPayment + extraPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
      
      if (months > 600) { // Safety check to prevent infinite loops
        break;
      }
    }

    // Calculate months saved (assuming 30-year mortgage)
    const standardTerm = 360; // 30 years * 12 months
    setMonthsSaved(Math.max(0, standardTerm - months));
    
    setPayoffDate(schedule[schedule.length - 1].date);
    setTotalInterest(totalInterestPaid);
    setTotalPayment(totalInterestPaid + currentBalance);
    setPaymentSchedule(schedule);
  };

  // Chart options for payment breakdown
  const getChartOptions = () => {
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
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: currentBalance, name: 'Principal' },
            { value: totalInterest, name: 'Interest' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Mortgage Payoff Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Mortgage Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Balance Input */}
                <div className="space-y-2">
                  <Label>Current Balance ($)</Label>
                  <Input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                  />
                </div>

                {/* Interest Rate Input */}
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                </div>

                {/* Monthly Payment Input */}
                <div className="space-y-2">
                  <Label>Monthly Payment ($)</Label>
                  <Input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                  />
                </div>

                {/* Extra Payment Input */}
                <div className="space-y-2">
                  <Label>Extra Monthly Payment ($)</Label>
                  <Input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                  />
                </div>

                {/* Start Date Input */}
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={calculatePayoff}
                >
                  Calculate Payoff
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Payoff Date</div>
                    <div className="stat-value text-lg">{payoffDate || '-'}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Months Saved</div>
                    <div className="stat-value text-lg">{monthsSaved || '0'}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg">${totalInterest.toFixed(2)}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Payment</div>
                    <div className="stat-value text-lg">${totalPayment.toFixed(2)}</div>
                  </div>
                </div>

                <Separator />

                {/* Payment Schedule */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Payment Schedule</h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Payment #</th>
                          <th>Date</th>
                          <th>Payment</th>
                          <th>Principal</th>
                          <th>Interest</th>
                          <th>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentSchedule.slice(0, 12).map((payment) => (
                          <tr key={payment.paymentNumber}>
                            <td>{payment.paymentNumber}</td>
                            <td>{payment.date}</td>
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

                <Separator />

                {/* Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Payment Breakdown</h3>
                  <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold mb-8">Mortgage Payoff Calculator: Your Guide to Early Mortgage Freedom</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4">
                A mortgage payoff calculator is an essential tool for homeowners who want to understand how they can 
                pay off their mortgage early and save money on interest payments. By calculating the impact of extra 
                payments and different payment strategies, you can make informed decisions about your mortgage payoff plan.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How Does the Mortgage Payoff Calculator Work?</h2>
              <p className="mb-4">
                This calculator takes into account your current mortgage balance, interest rate, and monthly payment 
                to determine your payoff timeline. By adding extra monthly payments, you can see how much faster you 
                can pay off your mortgage and how much interest you can save.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Benefits of Early Mortgage Payoff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Save on Interest</h3>
                    <p>Reduce the total interest paid over the life of your loan</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Build Equity Faster</h3>
                    <p>Increase your home equity at an accelerated rate</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Financial Freedom</h3>
                    <p>Achieve debt-free homeownership sooner</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Peace of Mind</h3>
                    <p>Reduce financial stress and secure your future</p>
                  </div>
                </div>
              </div>
            </section>

            

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Tips for Paying Off Your Mortgage Early</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Make bi-weekly payments instead of monthly payments</li>
                <li>Round up your monthly payments</li>
                <li>Apply windfalls (bonuses, tax refunds) to your mortgage</li>
                <li>Refinance to a shorter loan term</li>
                <li>Set up automatic extra payments</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
              <p className="mb-4">
                Using a mortgage payoff calculator can help you develop a strategic plan to become mortgage-free sooner. 
                By understanding the impact of extra payments and different payment strategies, you can make informed 
                decisions about your mortgage payoff journey. Remember to consider your overall financial goals and 
                consult with financial advisors when making significant decisions about your mortgage.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
