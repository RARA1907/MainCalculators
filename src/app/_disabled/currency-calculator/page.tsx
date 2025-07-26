'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, ArrowRightLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface ExchangeRate {
  date: string;
  rate: number;
}

export default function CurrencyCalculator() {
  const breadcrumbItems = [
    {
      label: 'Currency Calculator',
      href: '/currency-calculator'
    }
  ];

  // Currency details
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number>(0.85);
  const [historicalRates, setHistoricalRates] = useState<ExchangeRate[]>([]);
  
  // Common currencies
  const commonCurrencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' }
  ];

  // Results
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [inverseRate, setInverseRate] = useState<number>(0);

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Calculate conversion
  const calculateConversion = () => {
    const result = amount * exchangeRate;
    setConvertedAmount(result);
    setInverseRate(1 / exchangeRate);
  };

  // Generate mock historical data
  const generateHistoricalData = () => {
    const data: ExchangeRate[] = [];
    const baseRate = exchangeRate;
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add some random variation to the rate
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const rate = baseRate * (1 + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        rate: rate
      });
    }
    
    setHistoricalRates(data);
  };

  // Effect to update conversion when currencies or amount changes
  useEffect(() => {
    calculateConversion();
    generateHistoricalData();
  }, [amount, fromCurrency, toCurrency, exchangeRate]);

  // Chart for historical rates
  const getHistoricalRatesChart = () => {
    const dates = historicalRates.map(data => data.date);
    const rates = historicalRates.map(data => data.rate);

    return {
      title: {
        text: '30-Day Exchange Rate History',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = params[0].axisValue;
          const rate = params[0].data;
          return `${date}<br/>1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: dates,
        name: 'Date'
      },
      yAxis: {
        type: 'value',
        name: 'Exchange Rate',
        axisLabel: {
          formatter: (value: number) => value.toFixed(4)
        }
      },
      series: [{
        data: rates,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#4CAF50' }
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Currency Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Currency Conversion</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Amount</span>
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="label">
                      <span className="label-text">From</span>
                    </label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      {commonCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-center items-end pb-2">
                    <button
                      onClick={swapCurrencies}
                      className="btn btn-circle btn-outline"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="col-span-2">
                    <label className="label">
                      <span className="label-text">To</span>
                    </label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="select select-bordered w-full"
                    >
                      {commonCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Exchange Rate</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Current market exchange rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.0001"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateConversion}
                >
                  Convert
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Conversion Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Conversion Results */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-base-200 rounded-lg p-6">
                    <div className="text-lg mb-2">
                      {amount.toFixed(2)} {fromCurrency} =
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {convertedAmount.toFixed(2)} {toCurrency}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Rate</div>
                      <div className="stat-value text-lg">
                        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Inverse Rate</div>
                      <div className="stat-value text-lg">
                        1 {toCurrency} = {inverseRate.toFixed(4)} {fromCurrency}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Historical Rates Chart */}
                <div>
                  <ReactECharts option={getHistoricalRatesChart()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding Currency Exchange</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Exchange Rate Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Spot Rate</h4>
                      <ul className="list-disc pl-6">
                        <li>Current market rate</li>
                        <li>Immediate exchange</li>
                        <li>Most common for travelers</li>
                        <li>Real-time fluctuations</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Forward Rate</h4>
                      <ul className="list-disc pl-6">
                        <li>Future exchange rate</li>
                        <li>Fixed rate contract</li>
                        <li>Risk management tool</li>
                        <li>Used by businesses</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Factors Affecting Rates</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Interest rates</li>
                      <li>Economic indicators</li>
                      <li>Political stability</li>
                      <li>Market sentiment</li>
                      <li>Trade balances</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Currency Trading Tips</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Compare rates from multiple sources</li>
                      <li>Watch for hidden fees</li>
                      <li>Consider timing of exchange</li>
                      <li>Monitor market trends</li>
                      <li>Use reliable exchange services</li>
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
