'use client';

import { useState, useEffect } from 'react';
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

interface LeaseTerms {
  months: number;
  residualValue: number;
  description: string;
}

const leaseTermOptions: LeaseTerms[] = [
  {
    months: 24,
    residualValue: 0.70,
    description: 'Short-term lease with higher monthly payments but more flexibility'
  },
  {
    months: 36,
    residualValue: 0.60,
    description: 'Most common lease term with balanced payments and duration'
  },
  {
    months: 48,
    residualValue: 0.50,
    description: 'Longer term with lower monthly payments but less flexibility'
  }
];

interface TaxState {
  name: string;
  rate: number;
}

const taxStates: TaxState[] = [
  { name: 'California', rate: 0.0725 },
  { name: 'New York', rate: 0.04 },
  { name: 'Texas', rate: 0.0625 },
  { name: 'Florida', rate: 0.06 },
  { name: 'Illinois', rate: 0.0625 },
  { name: 'Custom', rate: 0 }
];

export default function AutoLeaseCalculator() {
  const breadcrumbItems = [
    {
      label: 'Auto Lease Calculator',
      href: '/auto-lease-calculator'
    }
  ];

  // Input states
  const [vehiclePrice, setVehiclePrice] = useState<number>(30000);
  const [downPayment, setDownPayment] = useState<number>(3000);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [leaseTerm, setLeaseTerm] = useState<LeaseTerms>(leaseTermOptions[1]);
  const [moneyFactor, setMoneyFactor] = useState<number>(0.002);
  const [mileageAllowance, setMileageAllowance] = useState<number>(12000);
  const [excessMileageRate, setExcessMileageRate] = useState<number>(0.25);
  const [selectedState, setSelectedState] = useState<TaxState>(taxStates[0]);
  const [customTaxRate, setCustomTaxRate] = useState<number>(0);
  const [acquisitionFee, setAcquisitionFee] = useState<number>(895);
  const [dispositionFee, setDispositionFee] = useState<number>(395);
  const [dealerFees, setDealerFees] = useState<number>(500);

  // Result states
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalLeaseCost, setTotalLeaseCost] = useState<number>(0);
  const [costBreakdown, setCostBreakdown] = useState<{
    depreciation: number;
    rentCharge: number;
    taxes: number;
    fees: number;
  }>({
    depreciation: 0,
    rentCharge: 0,
    taxes: 0,
    fees: 0
  });

  // Calculate lease payments
  const calculateLease = () => {
    // Calculate residual value
    const residualValue = vehiclePrice * leaseTerm.residualValue;

    // Calculate depreciation
    const totalDepreciation = vehiclePrice - residualValue;
    const monthlyDepreciation = totalDepreciation / leaseTerm.months;

    // Calculate rent charge (finance charge)
    const baseAmount = vehiclePrice + residualValue;
    const monthlyRentCharge = baseAmount * moneyFactor;

    // Calculate taxes
    const taxRate = selectedState.name === 'Custom' ? customTaxRate : selectedState.rate;
    const monthlyTaxes = (monthlyDepreciation + monthlyRentCharge) * taxRate;

    // Calculate total monthly payment
    const calculatedMonthlyPayment = monthlyDepreciation + monthlyRentCharge + monthlyTaxes;

    // Calculate total lease cost
    const totalCost = (calculatedMonthlyPayment * leaseTerm.months) + downPayment + acquisitionFee + dispositionFee + dealerFees;

    // Set states
    setMonthlyPayment(Math.round(calculatedMonthlyPayment));
    setTotalLeaseCost(Math.round(totalCost));
    setCostBreakdown({
      depreciation: Math.round(monthlyDepreciation),
      rentCharge: Math.round(monthlyRentCharge),
      taxes: Math.round(monthlyTaxes),
      fees: Math.round((acquisitionFee + dispositionFee + dealerFees) / leaseTerm.months)
    });
  };

  // Get cost breakdown chart
  const getCostBreakdownChart = () => {
    return {
      title: {
        text: 'Monthly Payment Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
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
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: costBreakdown.depreciation, name: 'Depreciation', itemStyle: { color: '#3B82F6' } },
            { value: costBreakdown.rentCharge, name: 'Rent Charge', itemStyle: { color: '#34D399' } },
            { value: costBreakdown.taxes, name: 'Taxes', itemStyle: { color: '#F87171' } },
            { value: costBreakdown.fees, name: 'Fees', itemStyle: { color: '#FBBF24' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateLease();
  }, [vehiclePrice, downPayment, tradeInValue, leaseTerm, moneyFactor, selectedState, customTaxRate, acquisitionFee, dispositionFee, dealerFees]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Auto Lease Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Lease Payments</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  />
                </div>

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
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Lease Term</span>
                  </label>
                  <div className="flex gap-4">
                    {leaseTermOptions.map((term) => (
                      <button
                        key={term.months}
                        className={`btn flex-1 ${leaseTerm.months === term.months ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setLeaseTerm(term)}
                      >
                        {term.months} months
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {leaseTerm.description}
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Money Factor</span>
                  </label>
                  <input
                    type="number"
                    value={moneyFactor}
                    onChange={(e) => setMoneyFactor(Number(e.target.value))}
                    className="input input-bordered w-full"
                    step="0.0001"
                    min="0"
                  />
                  <span className="text-sm text-gray-500 mt-1">
                    Approximate APR: {(moneyFactor * 2400).toFixed(2)}%
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Mileage Allowance</span>
                  </label>
                  <input
                    type="number"
                    value={mileageAllowance}
                    onChange={(e) => setMileageAllowance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Excess Mileage Rate ($ per mile)</span>
                  </label>
                  <input
                    type="number"
                    value={excessMileageRate}
                    onChange={(e) => setExcessMileageRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">State Tax Rate</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {taxStates.map((state) => (
                      <button
                        key={state.name}
                        className={`btn ${selectedState.name === state.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setSelectedState(state)}
                      >
                        {state.name}
                      </button>
                    ))}
                  </div>
                  {selectedState.name === 'Custom' && (
                    <input
                      type="number"
                      value={customTaxRate}
                      onChange={(e) => setCustomTaxRate(Number(e.target.value))}
                      className="input input-bordered w-full mt-2"
                      step="0.0001"
                      min="0"
                      max="1"
                      placeholder="Enter custom tax rate (e.g., 0.06 for 6%)"
                    />
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fees</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Acquisition Fee ($)</span>
                      </label>
                      <input
                        type="number"
                        value={acquisitionFee}
                        onChange={(e) => setAcquisitionFee(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Disposition Fee ($)</span>
                      </label>
                      <input
                        type="number"
                        value={dispositionFee}
                        onChange={(e) => setDispositionFee(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Dealer Fees ($)</span>
                      </label>
                      <input
                        type="number"
                        value={dealerFees}
                        onChange={(e) => setDealerFees(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateLease}
                >
                  Calculate Lease
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Lease Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Payment</div>
                    <div className="stat-value text-primary">${monthlyPayment}</div>
                    <div className="stat-desc">For {leaseTerm.months} months</div>
                  </div>

                  {/* Total Cost */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Lease Cost</div>
                    <div className="stat-value text-secondary">${totalLeaseCost}</div>
                    <div className="stat-desc">Including all fees and taxes</div>
                  </div>

                  {/* Cost Breakdown Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Monthly Payment Breakdown</h3>
                    <ReactECharts option={getCostBreakdownChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Depreciation</div>
                      <div className="stat-value text-blue-500">${costBreakdown.depreciation}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Rent Charge</div>
                      <div className="stat-value text-green-500">${costBreakdown.rentCharge}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Taxes</div>
                      <div className="stat-value text-red-500">${costBreakdown.taxes}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Fees</div>
                      <div className="stat-value text-yellow-500">${costBreakdown.fees}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Lease Details</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Mileage Information</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>Annual Mileage Allowance: {mileageAllowance.toLocaleString()} miles</p>
                      <p>Total Lease Mileage: {(mileageAllowance * (leaseTerm.months / 12)).toLocaleString()} miles</p>
                      <p>Excess Mileage Rate: ${excessMileageRate} per mile</p>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Fees Breakdown</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Acquisition Fee: ${acquisitionFee}</li>
                        <li>Disposition Fee: ${dispositionFee}</li>
                        <li>Dealer Fees: ${dealerFees}</li>
                        <li>Total Fees: ${acquisitionFee + dispositionFee + dealerFees}</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Important Notes</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Residual Value: {(leaseTerm.residualValue * 100).toFixed(0)}% of MSRP</li>
                        <li>Money Factor: {moneyFactor} (APR: {(moneyFactor * 2400).toFixed(2)}%)</li>
                        <li>Sales Tax Rate: {(selectedState.name === 'Custom' ? customTaxRate : selectedState.rate) * 100}%</li>
                        <li>Down Payment: ${downPayment}</li>
                        {tradeInValue > 0 && <li>Trade-in Value: ${tradeInValue}</li>}
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
