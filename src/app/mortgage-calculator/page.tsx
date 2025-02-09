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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import ReactECharts from 'echarts-for-react';
import { Checkbox } from "@/components/ui/checkbox";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

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
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            segments={[
             
              { title: "Mortgage Calculator", href: "/mortgage-calculator" }
            ]}
            className="mb-6"
          />
          <h1 className="text-3xl font-bold text-base-content">Mortgage Calculator</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Form */}
            <div className="flex-1">
              <Card className="bg-base-100">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-base-content">Loan Details</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Home Price */}
                  <div className="form-control">
                    <Label className="flex items-center gap-2">
                      Home Price ($)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the total price of the home</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  {/* Down Payment */}
                  <div className="form-control">
                    <Label className="flex items-center justify-between">
                      Down Payment (%)
                      <span className="text-sm text-base-content/70">
                        (${(homePrice * (downPayment / 100)).toLocaleString()})
                      </span>
                    </Label>
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="form-control">
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>

                  {/* Loan Term */}
                  <div className="form-control">
                    <Label>Loan Term</Label>
                    <Select
                      value={String(loanTerm)}
                      onValueChange={(value) => setLoanTerm(Number(value))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select loan term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Years</SelectItem>
                        <SelectItem value="20">20 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Date */}
                  <div className="form-control">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="divider">Additional Costs</div>

                  {/* Include Taxes & Insurance Toggle */}
                  <div className="form-control">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="taxes"
                        checked={includeTaxesCosts}
                        onCheckedChange={(checked) => setIncludeTaxesCosts(checked as boolean)}
                      />
                      <Label htmlFor="taxes">Include Taxes & Insurance</Label>
                    </div>
                  </div>

                  {includeTaxesCosts && (
                    <>
                      {/* Property Tax */}
                      <div className="form-control">
                        <Label>Property Tax Rate (% Annual)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={propertyTax}
                          onChange={(e) => setPropertyTax(Number(e.target.value))}
                          className="mt-2"
                        />
                      </div>

                      {/* Home Insurance */}
                      <div className="form-control">
                        <Label>Home Insurance ($ Annual)</Label>
                        <Input
                          type="number"
                          value={homeInsurance}
                          onChange={(e) => setHomeInsurance(Number(e.target.value))}
                          className="mt-2"
                        />
                      </div>

                      {/* PMI Insurance Toggle & Input */}
                      <div className="form-control">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pmi"
                            checked={includePMI}
                            onCheckedChange={(checked) => setIncludePMI(checked as boolean)}
                          />
                          <Label htmlFor="pmi">Private Mortgage Insurance (PMI)</Label>
                        </div>
                        {includePMI && (
                          <div className="mt-2">
                            <Label>PMI ($ Annual)</Label>
                            <Input
                              type="number"
                              value={pmiInsurance}
                              onChange={(e) => setPmiInsurance(Number(e.target.value))}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>

                      {/* HOA Fee Toggle & Input */}
                      <div className="form-control">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hoa"
                            checked={includeHOA}
                            onCheckedChange={(checked) => setIncludeHOA(checked as boolean)}
                          />
                          <Label htmlFor="hoa">Homeowners Association Fee (HOA)</Label>
                        </div>
                        {includeHOA && (
                          <div className="mt-2">
                            <Label>HOA Fee ($ Monthly)</Label>
                            <Input
                              type="number"
                              value={hoaFee}
                              onChange={(e) => setHoaFee(Number(e.target.value))}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>

                      {/* Other Costs Toggle & Input */}
                      <div className="form-control">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="other"
                            checked={includeOtherCosts}
                            onCheckedChange={(checked) => setIncludeOtherCosts(checked as boolean)}
                          />
                          <Label htmlFor="other">Other Costs</Label>
                        </div>
                        {includeOtherCosts && (
                          <div className="mt-2">
                            <Label>Other Costs ($ Annual)</Label>
                            <Input
                              type="number"
                              value={otherCosts}
                              onChange={(e) => setOtherCosts(Number(e.target.value))}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white mt-4 w-full border-0"
                    onClick={calculateMortgage}
                  >
                    Calculate
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Card */}
            <div className="flex-1">
              <Card className="bg-base-100">
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-base-content">Payment Summary</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Monthly Payment</span>
                      <span className="text-2xl font-bold text-base-content">${monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-base-content/70">
                      Due on the 1st of each month
                    </div>
                  </div>

                  <Separator />

                  {/* Total Payments */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Principal & Interest</span>
                      <span className="font-medium text-base-content">${principalAndInterest.toFixed(2)}</span>
                    </div>
                    {includeTaxesCosts && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-base-content/70">Property Tax</span>
                          <span className="font-medium text-base-content">${monthlyBreakdown.propertyTax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base-content/70">Home Insurance</span>
                          <span className="font-medium text-base-content">${monthlyBreakdown.homeInsurance.toFixed(2)}</span>
                        </div>
                        {includePMI && (
                          <div className="flex justify-between items-center">
                            <span className="text-base-content/70">PMI</span>
                            <span className="font-medium text-base-content">${monthlyBreakdown.pmiInsurance.toFixed(2)}</span>
                          </div>
                        )}
                        {includeHOA && (
                          <div className="flex justify-between items-center">
                            <span className="text-base-content/70">HOA Fee</span>
                            <span className="font-medium text-base-content">${monthlyBreakdown.hoaFee.toFixed(2)}</span>
                          </div>
                        )}
                        {includeOtherCosts && (
                          <div className="flex justify-between items-center">
                            <span className="text-base-content/70">Other Costs</span>
                            <span className="font-medium text-base-content">${monthlyBreakdown.otherCosts.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Loan Summary */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Total Principal</span>
                      <span className="font-medium text-base-content">${(homePrice * (1 - downPayment / 100)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">Total Interest</span>
                      <span className="font-medium text-base-content">${(totalPayment - (homePrice * (1 - downPayment / 100))).toLocaleString()}</span>
                    </div>
                    {includeTaxesCosts && (
                      <div className="flex justify-between items-center">
                        <span className="text-base-content/70">Total Tax & Insurance</span>
                        <span className="font-medium text-base-content">${((monthlyBreakdown.propertyTax + monthlyBreakdown.homeInsurance + monthlyBreakdown.pmiInsurance + monthlyBreakdown.hoaFee + monthlyBreakdown.otherCosts) * loanTerm * 12).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-base-content">Total of All Payments</span>
                      <span className="text-base-content">${totalPayment.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Distribution Chart */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-base-content">Payment Distribution</h4>
                    <div className="h-[300px]">
                      <ReactECharts
                        option={{
                          tooltip: {
                            trigger: 'item',
                            formatter: '{b}: ${c} ({d}%)'
                          },
                          legend: {
                            orient: 'vertical',
                            right: 10,
                            top: 'center',
                            textStyle: {
                              color: 'var(--fallback-bc,oklch(var(--bc)/1))'
                            }
                          },
                          series: [
                            {
                              name: 'Payment Distribution',
                              type: 'pie',
                              radius: ['40%', '70%'],
                              center: ['40%', '50%'],
                              avoidLabelOverlap: true,
                              itemStyle: {
                                borderRadius: 10,
                                borderColor: 'var(--fallback-b1,oklch(var(--b1)))',
                                borderWidth: 2
                              },
                              label: {
                                show: false
                              },
                              emphasis: {
                                label: {
                                  show: true,
                                  formatter: '{b}: ${c}\n({d}%)',
                                  fontSize: 14
                                }
                              },
                              data: [
                                { 
                                  value: principalAndInterest, 
                                  name: 'Principal & Interest',
                                  itemStyle: { color: '#3B82F6' }
                                },
                                ...(includeTaxesCosts ? [
                                  { 
                                    value: monthlyBreakdown.propertyTax, 
                                    name: 'Property Tax',
                                    itemStyle: { color: '#10B981' }
                                  },
                                  { 
                                    value: monthlyBreakdown.homeInsurance, 
                                    name: 'Home Insurance',
                                    itemStyle: { color: '#F59E0B' }
                                  },
                                  ...(includePMI ? [{
                                    value: monthlyBreakdown.pmiInsurance,
                                    name: 'PMI',
                                    itemStyle: { color: '#EF4444' }
                                  }] : []),
                                  ...(includeHOA ? [{
                                    value: monthlyBreakdown.hoaFee,
                                    name: 'HOA Fee',
                                    itemStyle: { color: '#8B5CF6' }
                                  }] : []),
                                  ...(includeOtherCosts ? [{
                                    value: monthlyBreakdown.otherCosts,
                                    name: 'Other Costs',
                                    itemStyle: { color: '#EC4899' }
                                  }] : [])
                                ] : [])
                              ]
                            }
                          ]
                        }}
                        style={{ height: '100%' }}
                        opts={{ renderer: 'canvas' }}
                      />
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="flex justify-end gap-2 mt-6">
                    <Button 
                      className="btn-circle btn-ghost"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20this%20Mortgage%20Calculator!&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                    </Button>
                    <Button 
                      className="btn-circle btn-ghost"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </Button>
                    <Button 
                      className="btn-circle btn-ghost"
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=Mortgage%20Calculator`, '_blank')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <MortgageCalculatorContent />
        </div>
      </div>
    </div>
  );
}
