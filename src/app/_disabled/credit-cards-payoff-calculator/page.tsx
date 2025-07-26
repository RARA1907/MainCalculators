'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Plus, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

interface CreditCard {
  id: number;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export default function CreditCardsPayoffCalculator() {
  const breadcrumbItems = [
    {
      label: 'Credit Cards Payoff Calculator',
      href: '/credit-cards-payoff-calculator'
    }
  ];

  // State for credit cards
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    { id: 1, name: 'Card 1', balance: 5000, interestRate: 18.9, minimumPayment: 100 }
  ]);
  
  // State for inputs
  const [monthlyPayment, setMonthlyPayment] = useState<number>(500);
  const [payoffStrategy, setPayoffStrategy] = useState<string>('avalanche');
  const [nextCardId, setNextCardId] = useState<number>(2);

  // State for results
  const [payoffSchedule, setPayoffSchedule] = useState<Array<{
    month: number;
    totalBalance: number;
    payments: Array<{
      cardId: number;
      payment: number;
      interest: number;
      principal: number;
      remainingBalance: number;
    }>;
  }>>([]);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [monthsToPayoff, setMonthsToPayoff] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);

  // Add new credit card
  const addCreditCard = () => {
    setCreditCards([
      ...creditCards,
      {
        id: nextCardId,
        name: `Card ${nextCardId}`,
        balance: 0,
        interestRate: 0,
        minimumPayment: 0
      }
    ]);
    setNextCardId(nextCardId + 1);
  };

  // Remove credit card
  const removeCreditCard = (id: number) => {
    setCreditCards(creditCards.filter(card => card.id !== id));
  };

  // Update credit card
  const updateCreditCard = (id: number, field: keyof CreditCard, value: string | number) => {
    setCreditCards(creditCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  // Calculate payoff schedule
  const calculatePayoff = () => {
    let cards = creditCards.map(card => ({
      ...card,
      currentBalance: card.balance,
      paid: false
    }));
    
    let month = 0;
    let schedule = [];
    let totalInterestPaid = 0;
    let remainingPayment = monthlyPayment;
    
    while (cards.some(card => !card.paid) && month < 600) { // 50 years max
      month++;
      remainingPayment = monthlyPayment;
      let monthPayments = [];

      // Calculate interest and minimum payments
      cards.forEach(card => {
        if (!card.paid) {
          const interest = (card.currentBalance * (card.interestRate / 100)) / 12;
          totalInterestPaid += interest;
          card.currentBalance += interest;

          const minPayment = Math.min(card.minimumPayment, card.currentBalance);
          remainingPayment -= minPayment;

          monthPayments.push({
            cardId: card.id,
            payment: minPayment,
            interest: interest,
            principal: minPayment - interest,
            remainingBalance: card.currentBalance - minPayment
          });

          card.currentBalance -= minPayment;
        }
      });

      // Apply remaining payment based on strategy
      if (remainingPayment > 0) {
        const activeCards = cards.filter(card => !card.paid);
        if (activeCards.length > 0) {
          activeCards.sort((a, b) => {
            if (payoffStrategy === 'avalanche') {
              return b.interestRate - a.interestRate;
            } else { // snowball
              return a.currentBalance - b.currentBalance;
            }
          });

          const targetCard = activeCards[0];
          const extraPayment = Math.min(remainingPayment, targetCard.currentBalance);
          
          const payment = monthPayments.find(p => p.cardId === targetCard.id);
          if (payment) {
            payment.payment += extraPayment;
            payment.principal += extraPayment;
            payment.remainingBalance -= extraPayment;
          }

          targetCard.currentBalance -= extraPayment;
        }
      }

      // Update paid status
      cards.forEach(card => {
        card.paid = card.currentBalance <= 0;
      });

      // Add month to schedule
      schedule.push({
        month,
        totalBalance: cards.reduce((sum, card) => sum + card.currentBalance, 0),
        payments: monthPayments
      });
    }

    setPayoffSchedule(schedule);
    setTotalInterest(totalInterestPaid);
    setMonthsToPayoff(month);
    setTotalPaid(totalInterestPaid + creditCards.reduce((sum, card) => sum + card.balance, 0));
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
        data: creditCards.map(card => card.name),
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
        name: 'Balance ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: function(value: number) {
            return '$' + value.toLocaleString();
          }
        }
      },
      series: creditCards.map(card => ({
        name: card.name,
        type: 'line',
        data: payoffSchedule.map(month => [
          month.month,
          month.payments.find(p => p.cardId === card.id)?.remainingBalance || 0
        ])
      }))
    };
  };

  // Chart for payment allocation
  const getPaymentAllocationChart = () => {
    const totalPayments = creditCards.reduce((sum, card) => sum + card.balance, 0);
    const totalInterestPaid = totalInterest;

    return {
      title: {
        text: 'Total Payment Allocation',
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
              value: totalPayments,
              name: 'Principal',
              itemStyle: { color: '#4CAF50' }
            },
            {
              value: totalInterestPaid,
              name: 'Interest',
              itemStyle: { color: '#FF5722' }
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Credit Cards Payoff Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Credit Cards</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Credit Cards List */}
                {creditCards.map((card) => (
                  <div key={card.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={card.name}
                        onChange={(e) => updateCreditCard(card.id, 'name', e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                      <button
                        onClick={() => removeCreditCard(card.id)}
                        className="btn btn-ghost btn-circle"
                        disabled={creditCards.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Balance ($)</span>
                        </label>
                        <input
                          type="number"
                          value={card.balance}
                          onChange={(e) => updateCreditCard(card.id, 'balance', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="100"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Interest Rate (%)</span>
                        </label>
                        <input
                          type="number"
                          value={card.interestRate}
                          onChange={(e) => updateCreditCard(card.id, 'interestRate', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Minimum Payment ($)</span>
                        </label>
                        <input
                          type="number"
                          value={card.minimumPayment}
                          onChange={(e) => updateCreditCard(card.id, 'minimumPayment', Number(e.target.value))}
                          className="input input-bordered w-full"
                          min="0"
                          step="10"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addCreditCard}
                  className="btn btn-outline w-full"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Credit Card
                </button>

                {/* Monthly Payment Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Total Monthly Payment ($)</span>
                  </label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={creditCards.reduce((sum, card) => sum + card.minimumPayment, 0)}
                    step="10"
                  />
                </div>

                {/* Payoff Strategy Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payoff Strategy</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Avalanche: Pay highest interest first<br/>Snowball: Pay lowest balance first</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <select
                    value={payoffStrategy}
                    onChange={(e) => setPayoffStrategy(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                    <option value="snowball">Debt Snowball (Lowest Balance First)</option>
                  </select>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculatePayoff}
                >
                  Calculate Payoff Plan
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Payoff Analysis</h2>
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
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Interest</div>
                    <div className="stat-value text-lg text-red-500">
                      ${totalInterest.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Paid</div>
                    <div className="stat-value text-lg">
                      ${totalPaid.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Debt</div>
                    <div className="stat-value text-lg">
                      ${creditCards.reduce((sum, card) => sum + card.balance, 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getBalanceOverTimeChart()} style={{ height: '400px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getPaymentAllocationChart()} style={{ height: '300px' }} />
                  </div>
                </div>

                {/* Payment Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        {creditCards.map(card => (
                          <th key={card.id}>{card.name}</th>
                        ))}
                        <th>Total Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoffSchedule.filter((_, index) => index % 12 === 0).map((month) => (
                        <tr key={month.month}>
                          <td>{month.month}</td>
                          {creditCards.map(card => (
                            <td key={card.id}>
                              ${month.payments.find(p => p.cardId === card.id)?.remainingBalance.toFixed(2) || '0.00'}
                            </td>
                          ))}
                          <td>${month.totalBalance.toFixed(2)}</td>
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
              <h2 className="text-2xl font-semibold">Debt Payoff Strategies</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Debt Avalanche vs. Debt Snowball</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Debt Avalanche</h4>
                      <ul className="list-disc pl-6">
                        <li>Pay highest interest rate first</li>
                        <li>Mathematically optimal approach</li>
                        <li>Minimizes total interest paid</li>
                        <li>Best for disciplined borrowers</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Debt Snowball</h4>
                      <ul className="list-disc pl-6">
                        <li>Pay smallest balance first</li>
                        <li>Provides psychological wins</li>
                        <li>Builds momentum through success</li>
                        <li>Good for motivation</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Tips for Success</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Always pay at least the minimum on all cards</li>
                      <li>Put extra money toward the target debt</li>
                      <li>Avoid new credit card charges</li>
                      <li>Consider balance transfer options</li>
                      <li>Create an emergency fund to avoid new debt</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Additional Resources</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Consider credit counseling services</li>
                      <li>Look into debt consolidation options</li>
                      <li>Check for balance transfer promotions</li>
                      <li>Review your credit report regularly</li>
                      <li>Create a realistic budget</li>
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
