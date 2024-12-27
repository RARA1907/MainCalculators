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
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface TipCalculation {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
  tipPerPerson: number;
}

const commonTipPercentages = [15, 18, 20, 22, 25];

export default function TipCalculator() {
  const breadcrumbItems = [
    {
      label: 'Tip Calculator',
      href: '/tip-calculator'
    }
  ];

  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<string>('20');
  const [numberOfPeople, setNumberOfPeople] = useState<string>('1');
  const [customTipActive, setCustomTipActive] = useState(false);
  const [result, setResult] = useState<TipCalculation | null>(null);
  const [error, setError] = useState<string>('');

  const calculateTip = (amount: number, tip: number, people: number): TipCalculation => {
    const tipAmount = amount * (tip / 100);
    const totalAmount = amount + tipAmount;
    const perPerson = totalAmount / people;
    const tipPerPerson = tipAmount / people;

    return {
      tipAmount: Number(tipAmount.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      perPerson: Number(perPerson.toFixed(2)),
      tipPerPerson: Number(tipPerPerson.toFixed(2))
    };
  };

  const handleCalculate = () => {
    setError('');

    const amount = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const people = parseInt(numberOfPeople);

    if (!billAmount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bill amount');
      return;
    }

    if (!tipPercentage || isNaN(tip) || tip < 0) {
      setError('Please enter a valid tip percentage');
      return;
    }

    if (!numberOfPeople || isNaN(people) || people < 1) {
      setError('Please enter a valid number of people');
      return;
    }

    const calculation = calculateTip(amount, tip, people);
    setResult(calculation);
  };

  const handleTipSelection = (percentage: number) => {
    setTipPercentage(percentage.toString());
    setCustomTipActive(false);
    if (billAmount) handleCalculate();
  };

  const handleCustomTip = () => {
    setCustomTipActive(true);
    setTipPercentage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Tip Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Tip</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bill Amount Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bill Amount
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the total bill amount before tip</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                    <input
                      type="number"
                      className="input input-bordered w-full pl-8"
                      value={billAmount}
                      onChange={(e) => {
                        setBillAmount(e.target.value);
                        if (e.target.value) handleCalculate();
                      }}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* Tip Percentage Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tip Percentage</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                    {commonTipPercentages.map((percentage) => (
                      <button
                        key={percentage}
                        className={`btn ${
                          tipPercentage === percentage.toString() && !customTipActive
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                        onClick={() => handleTipSelection(percentage)}
                      >
                        {percentage}%
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className={`btn btn-outline ${customTipActive ? 'btn-primary' : ''}`}
                      onClick={handleCustomTip}
                    >
                      Custom
                    </button>
                    {customTipActive && (
                      <input
                        type="number"
                        className="input input-bordered w-24"
                        value={tipPercentage}
                        onChange={(e) => {
                          setTipPercentage(e.target.value);
                          if (e.target.value && billAmount) handleCalculate();
                        }}
                        placeholder="0"
                        min="0"
                        step="0.1"
                      />
                    )}
                  </div>
                </div>

                {/* Number of People Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of People
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the number of people splitting the bill</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={numberOfPeople}
                    onChange={(e) => {
                      setNumberOfPeople(e.target.value);
                      if (e.target.value && billAmount) handleCalculate();
                    }}
                    placeholder="1"
                    min="1"
                    step="1"
                  />
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                >
                  Calculate
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Tip Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Tip Amount Display */}
                    <div className="flex justify-center">
                      <div className="w-48">
                        <CircularProgressbar
                          value={parseFloat(tipPercentage)}
                          maxValue={100}
                          text={`${tipPercentage}%`}
                          styles={buildStyles({
                            textColor: '#3B82F6',
                            pathColor: '#3B82F6',
                            trailColor: '#d6d6d6'
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Tip Amount</div>
                        <div className="text-2xl font-bold text-primary">${result.tipAmount}</div>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <div className="text-sm text-gray-500">Total Bill</div>
                        <div className="text-2xl font-bold text-primary">${result.totalAmount}</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Per Person Breakdown:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-base-200 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Tip Per Person</div>
                          <div className="text-xl font-bold text-primary">${result.tipPerPerson}</div>
                        </div>
                        <div className="bg-base-200 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">Total Per Person</div>
                          <div className="text-xl font-bold text-primary">${result.perPerson}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter bill details to see tip calculations
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Tipping Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Common Tipping Percentages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Standard Service (15-20%)</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Regular restaurant service</li>
                          <li>Food delivery</li>
                          <li>Taxi/rideshare</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Exceptional Service (20-25%)</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Outstanding service</li>
                          <li>Large groups</li>
                          <li>Complex orders</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Tipping Etiquette</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Tip on the pre-tax amount</li>
                      <li>Round up for convenience</li>
                      <li>Consider service quality</li>
                      <li>Account for local customs</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">When to Adjust Tip</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Higher Tip</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Exceptional service</li>
                          <li>Holiday season</li>
                          <li>Difficult requests</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Standard Tip</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Regular service</li>
                          <li>Normal circumstances</li>
                          <li>Simple orders</li>
                        </ul>
                      </div>
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
