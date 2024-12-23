'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SocialShare } from "@/components/common/SocialShare";
import { EmbedDialog } from "@/components/shared/EmbedDialog";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MortgageCalculatorContent } from "./content";
import { Link2 } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPayment, setDownPayment] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.699);
  const [startDate, setStartDate] = useState<string>("2024-01");
  const [includeTaxesCosts, setIncludeTaxesCosts] = useState<boolean>(true);
  const [propertyTax, setPropertyTax] = useState<number>(1.2);
  const [homeInsurance, setHomeInsurance] = useState<number>(1500);
  const [pmiInsurance, setPmiInsurance] = useState<number>(0);
  const [hoaFee, setHoaFee] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(4000);
  const [includePMI, setIncludePMI] = useState<boolean>(false);
  const [includeHOA, setIncludeHOA] = useState<boolean>(false);
  const [includeOtherCosts, setIncludeOtherCosts] = useState<boolean>(false);

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [principalAndInterest, setPrincipalAndInterest] = useState<number>(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<{
    propertyTax: number;
    homeInsurance: number;
    pmiInsurance: number;
    hoaFee: number;
    otherCosts: number;
    principalAndInterest: number;
  }>({
    propertyTax: 0,
    homeInsurance: 0,
    pmiInsurance: 0,
    hoaFee: 0,
    otherCosts: 0,
    principalAndInterest: 0,
  });

  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  const calculateMortgage = () => {
    const principal = homePrice * (1 - downPayment / 100);
    const baseMonthlyPayment = calculateMonthlyPayment(principal, interestRate, loanTerm);
    setPrincipalAndInterest(baseMonthlyPayment);

    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyPMI = includePMI ? pmiInsurance / 12 : 0;
    const monthlyHOA = includeHOA ? hoaFee / 12 : 0;
    const monthlyOther = includeOtherCosts ? otherCosts / 12 : 0;

    const totalMonthly = includeTaxesCosts
      ? baseMonthlyPayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA + monthlyOther
      : baseMonthlyPayment;

    setMonthlyBreakdown({
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyHomeInsurance,
      pmiInsurance: monthlyPMI,
      hoaFee: monthlyHOA,
      otherCosts: monthlyOther,
      principalAndInterest: baseMonthlyPayment,
    });

    setMonthlyPayment(totalMonthly);
    setTotalPayment(totalMonthly * loanTerm * 12);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText("https://www.maincalculators.com/mortgage-calculator");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        segments={[
          { title: "Home", href: "/" },
          { title: "Mortgage Calculator", href: "/mortgage-calculator" },
        ]}
        className="mb-8"
      />

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mortgage Calculator</h1>
          <div className="flex gap-2">
            <SocialShare
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title="Mortgage Calculator"
            />
            <EmbedDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content mb-4">Loan Details</h2>
              
              <div className="form-control gap-6">
                {/* Home Price */}
                <div className="form-control">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-base-content">Home Price</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-base-content/70" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the total price of the home</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-base-200 text-base-content border-base-300">$</span>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-base-content">Down Payment</label>
                    <span className="text-sm text-base-content/70">
                      (${(homePrice * (downPayment / 100)).toLocaleString()})
                    </span>
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                    />
                    <span className="input-group-text bg-base-200 text-base-content border-base-300">%</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="form-control">
                  <label className="text-base-content mb-2">Interest Rate</label>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.001"
                      className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                    />
                    <span className="input-group-text bg-base-200 text-base-content border-base-300">%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div className="form-control">
                  <label className="text-base-content mb-2">Loan Term</label>
                  <select 
                    className="select select-bordered w-full bg-base-100 text-base-content border-base-300"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  >
                    <option value={30}>30 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={15}>15 Years</option>
                    <option value={10}>10 Years</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="form-control">
                  <label className="text-base-content mb-2">Start Date</label>
                  <input
                    type="month"
                    className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="divider">Additional Costs</div>

                {/* Include Taxes & Insurance Toggle */}
                <div className="form-control">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-base-content">Include Taxes & Insurance</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={includeTaxesCosts}
                      onChange={(e) => setIncludeTaxesCosts(e.target.checked)}
                    />
                  </label>
                </div>

                {includeTaxesCosts && (
                  <>
                    {/* Property Tax */}
                    <div className="form-control">
                      <label className="text-base-content mb-2">Property Tax Rate (Annual)</label>
                      <div className="input-group">
                        <input
                          type="number"
                          step="0.01"
                          className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                          value={propertyTax}
                          onChange={(e) => setPropertyTax(Number(e.target.value))}
                        />
                        <span className="input-group-text bg-base-200 text-base-content border-base-300">%</span>
                      </div>
                    </div>

                    {/* Home Insurance */}
                    <div className="form-control">
                      <label className="text-base-content mb-2">Home Insurance (Annual)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-base-200 text-base-content border-base-300">$</span>
                        <input
                          type="number"
                          className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                          value={homeInsurance}
                          onChange={(e) => setHomeInsurance(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* PMI Insurance Toggle & Input */}
                    <div className="form-control">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-base-content">Private Mortgage Insurance (PMI)</span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includePMI}
                          onChange={(e) => setIncludePMI(e.target.checked)}
                        />
                      </label>
                      {includePMI && (
                        <div className="mt-2">
                          <div className="input-group">
                            <span className="input-group-text bg-base-200 text-base-content border-base-300">$</span>
                            <input
                              type="number"
                              className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                              value={pmiInsurance}
                              onChange={(e) => setPmiInsurance(Number(e.target.value))}
                              placeholder="Annual PMI"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HOA Fee Toggle & Input */}
                    <div className="form-control">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-base-content">Homeowners Association Fee (HOA)</span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includeHOA}
                          onChange={(e) => setIncludeHOA(e.target.checked)}
                        />
                      </label>
                      {includeHOA && (
                        <div className="mt-2">
                          <div className="input-group">
                            <span className="input-group-text bg-base-200 text-base-content border-base-300">$</span>
                            <input
                              type="number"
                              className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                              value={hoaFee}
                              onChange={(e) => setHoaFee(Number(e.target.value))}
                              placeholder="Monthly HOA Fee"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Other Costs Toggle & Input */}
                    <div className="form-control">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-base-content">Other Costs (Annual)</span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={includeOtherCosts}
                          onChange={(e) => setIncludeOtherCosts(e.target.checked)}
                        />
                      </label>
                      {includeOtherCosts && (
                        <div className="mt-2">
                          <div className="input-group">
                            <span className="input-group-text bg-base-200 text-base-content border-base-300">$</span>
                            <input
                              type="number"
                              className="input input-bordered w-full bg-base-100 text-base-content border-base-300"
                              value={otherCosts}
                              onChange={(e) => setOtherCosts(Number(e.target.value))}
                              placeholder="Annual Other Costs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <button 
                  className="btn bg-blue-500 hover:bg-blue-600 text-white mt-4 w-full border-0"
                  onClick={calculateMortgage}
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content mb-4">Monthly Payment Breakdown</h2>
              
              <div className="stats stats-vertical shadow bg-base-200">
                <div className="stat">
                  <div className="stat-title text-base-content/70">Monthly Payment</div>
                  <div className="stat-value text-primary">
                    ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title text-base-content/70">Principal & Interest</div>
                  <div className="stat-value text-secondary">
                    ${principalAndInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>

                {includeTaxesCosts && (
                  <>
                    <div className="stat">
                      <div className="stat-title text-base-content/70">Property Tax</div>
                      <div className="stat-value text-accent">
                        ${monthlyBreakdown.propertyTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="stat">
                      <div className="stat-title text-base-content/70">Home Insurance</div>
                      <div className="stat-value">
                        ${monthlyBreakdown.homeInsurance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    {includePMI && (
                      <div className="stat">
                        <div className="stat-title text-base-content/70">PMI</div>
                        <div className="stat-value">
                          ${monthlyBreakdown.pmiInsurance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}

                    {includeHOA && (
                      <div className="stat">
                        <div className="stat-title text-base-content/70">HOA Fee</div>
                        <div className="stat-value">
                          ${monthlyBreakdown.hoaFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}

                    {includeOtherCosts && (
                      <div className="stat">
                        <div className="stat-title text-base-content/70">Other Costs</div>
                        <div className="stat-value">
                          ${monthlyBreakdown.otherCosts.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="stat">
                  <div className="stat-title text-base-content/70">Total Payment (Loan Term)</div>
                  <div className="stat-value text-base-content">
                    ${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MortgageCalculatorContent />
      </div>
    </div>
  );
}
