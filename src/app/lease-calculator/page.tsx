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

interface LeasePayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingValue: number;
}

type LeaseType = 'auto' | 'equipment' | 'commercial' | 'residential';

export default function LeaseCalculator() {
  const breadcrumbItems = [
    {
      label: 'Lease Calculator',
      href: '/lease-calculator'
    }
  ];

  // Lease details
  const [leaseType, setLeaseType] = useState<LeaseType>('auto');
  const [assetValue, setAssetValue] = useState<number>(30000);
  const [residualValue, setResidualValue] = useState<number>(15000);
  const [leaseTerm, setLeaseTerm] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [downPayment, setDownPayment] = useState<number>(3000);
  
  // Additional costs
  const [salesTax, setSalesTax] = useState<number>(8.25);
  const [acquisitionFee, setAcquisitionFee] = useState<number>(895);
  const [dispositionFee, setDispositionFee] = useState<number>(350);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(0);
  
  // Results
  const [schedule, setSchedule] = useState<LeasePayment[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [effectiveRate, setEffectiveRate] = useState<number>(0);

  // Calculate monthly lease payment
  const calculateMonthlyPayment = (
    assetValue: number,
    residualValue: number,
    rate: number,
    months: number,
    downPayment: number
  ): number => {
    const monthlyRate = rate / 1200;
    const depreciationAmount = assetValue - residualValue - downPayment;
    const monthlyDepreciation = depreciationAmount / months;
    const monthlyRent = (assetValue - downPayment) * monthlyRate;
    
    return monthlyDepreciation + monthlyRent;
  };

  // Calculate lease details
  const calculateLease = () => {
    const monthlyRate = interestRate / 1200;
    const payment = calculateMonthlyPayment(
      assetValue,
      residualValue,
      interestRate,
      leaseTerm,
      downPayment
    );
    
    let currentValue = assetValue - downPayment;
    let schedule: LeasePayment[] = [];
    let totalPayments = downPayment;
    
    // Generate payment schedule
    for (let month = 1; month <= leaseTerm; month++) {
      const monthlyInterest = currentValue * monthlyRate;
      const monthlyPrincipal = payment - monthlyInterest;
      
      currentValue -= monthlyPrincipal;
      totalPayments += payment;
      
      schedule.push({
        month,
        payment,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        remainingValue: currentValue
      });
    }
    
    // Calculate total cost including fees and taxes
    const totalTax = (payment * leaseTerm * salesTax) / 100;
    const totalMaintenance = monthlyMaintenance * leaseTerm;
    const totalCost = totalPayments + totalTax + acquisitionFee + dispositionFee + totalMaintenance;
    
    // Calculate effective rate
    const effectiveRate = ((totalCost - assetValue) / assetValue) * 100;
    
    setSchedule(schedule);
    setMonthlyPayment(payment);
    setTotalPayments(totalPayments);
    setTotalCost(totalCost);
    setEffectiveRate(effectiveRate);
  };

  // Chart for payment breakdown
  const getPaymentBreakdownChart = () => {
    const depreciation = assetValue - residualValue;
    const totalInterest = totalPayments - depreciation;
    const totalTax = (monthlyPayment * leaseTerm * salesTax) / 100;
    const totalFees = acquisitionFee + dispositionFee;
    const totalMaintenance = monthlyMaintenance * leaseTerm;
    
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
          { value: depreciation, name: 'Depreciation' },
          { value: totalInterest, name: 'Interest' },
          { value: totalTax, name: 'Sales Tax' },
          { value: totalFees, name: 'Fees' },
          { value: totalMaintenance, name: 'Maintenance' }
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

  // Chart for value over time
  const getValueChart = () => {
    const months = schedule.map(data => data.month);
    const values = schedule.map(data => data.remainingValue);

    return {
      title: {
        text: 'Asset Value Over Time',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const month = params[0].axisValue;
          const value = params[0].data;
          return `Month ${month}<br/>Value: $${value.toFixed(2)}`;
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
        name: 'Value ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [{
        data: values,
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
          <h1 className="text-3xl font-bold pt-4 text-base-content">Lease Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Lease Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Lease Details */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Lease Type</span>
                  </label>
                  <select
                    value={leaseType}
                    onChange={(e) => setLeaseType(e.target.value as LeaseType)}
                    className="select select-bordered w-full"
                  >
                    <option value="auto">Auto Lease</option>
                    <option value="equipment">Equipment Lease</option>
                    <option value="commercial">Commercial Lease</option>
                    <option value="residential">Residential Lease</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Asset Value ($)</span>
                  </label>
                  <input
                    type="number"
                    value={assetValue}
                    onChange={(e) => setAssetValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Residual Value ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated value at the end of lease</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={residualValue}
                    onChange={(e) => setResidualValue(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Lease Term (months)</span>
                  </label>
                  <input
                    type="number"
                    value={leaseTerm}
                    onChange={(e) => setLeaseTerm(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="12"
                    max="84"
                    step="12"
                  />
                </div>

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
                    max="20"
                    step="0.1"
                  />
                </div>

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

                <Separator />

                {/* Additional Costs */}
                <h3 className="text-lg font-semibold">Additional Costs</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sales Tax Rate (%)</span>
                  </label>
                  <input
                    type="number"
                    value={salesTax}
                    onChange={(e) => setSalesTax(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="15"
                    step="0.01"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Acquisition Fee ($)</span>
                  </label>
                  <input
                    type="number"
                    value={acquisitionFee}
                    onChange={(e) => setAcquisitionFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="50"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Disposition Fee ($)</span>
                  </label>
                  <input
                    type="number"
                    value={dispositionFee}
                    onChange={(e) => setDispositionFee(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="50"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Maintenance ($)</span>
                  </label>
                  <input
                    type="number"
                    value={monthlyMaintenance}
                    onChange={(e) => setMonthlyMaintenance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="10"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateLease}
                >
                  Calculate Lease
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Lease Analysis</h2>
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
                    <div className="stat-title">Total Payments</div>
                    <div className="stat-value text-lg">
                      ${totalPayments.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${totalCost.toLocaleString()}
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Effective Rate</div>
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
                    <ReactECharts option={getValueChart()} style={{ height: '300px' }} />
                  </div>
                </div>

                {/* Payment Schedule */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Payment</th>
                        <th>Principal</th>
                        <th>Interest</th>
                        <th>Remaining Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((month, index) => (
                        <tr key={index}>
                          <td>{month.month}</td>
                          <td>${month.payment.toFixed(2)}</td>
                          <td>${month.principal.toFixed(2)}</td>
                          <td>${month.interest.toFixed(2)}</td>
                          <td>${month.remainingValue.toFixed(2)}</td>
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
              <h2 className="text-2xl font-semibold">Understanding Leases</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Types of Leases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Closed-End Lease</h4>
                      <ul className="list-disc pl-6">
                        <li>Fixed term and payments</li>
                        <li>Return asset at end</li>
                        <li>Mileage restrictions</li>
                        <li>Wear and tear limits</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Open-End Lease</h4>
                      <ul className="list-disc pl-6">
                        <li>Flexible terms</li>
                        <li>Purchase option</li>
                        <li>No mileage limits</li>
                        <li>Residual value risk</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Key Terms</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Capitalized cost (Asset value)</li>
                      <li>Residual value</li>
                      <li>Money factor (Interest rate)</li>
                      <li>Acquisition and disposition fees</li>
                      <li>Maintenance responsibilities</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Lease vs. Buy</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Lower monthly payments</li>
                      <li>New asset more often</li>
                      <li>Tax advantages</li>
                      <li>No ownership equity</li>
                      <li>Possible extra fees</li>
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
