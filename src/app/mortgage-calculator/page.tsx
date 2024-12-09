'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialShare } from "@/components/common/SocialShare";
import { EmbedDialog } from "@/components/shared/EmbedDialog";
import { Separator } from "@/components/ui/separator";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb
        segments={[
          { title: "Calculators", href: "/calculators" },
          { title: "Mortgage Calculator", href: "/mortgage-calculator" },
        ]}
        className="mb-8"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mortgage Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate your monthly mortgage payments and see a detailed breakdown of costs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SocialShare url="https://www.maincalculators.com/mortgage-calculator" title="Mortgage Calculator" />
          <Button
            variant="ghost"
            size="icon"
            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 p-2 rounded-full transition-colors"
            onClick={copyUrlToClipboard}
            aria-label="Copy link"
          >
            <Link2 className="h-5 w-5" />
          </Button>
          <EmbedDialog title="Mortgage Calculator" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-6">
        <Card className="h-fit">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Mortgage Calculator</h2>
              <p className="text-sm text-muted-foreground mt-1">Calculate your estimated monthly mortgage payment</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="homePrice" className="text-sm font-medium">Home Price</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="homePrice"
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    className="pl-7"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="downPayment" className="text-sm font-medium">Down Payment %</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="text-right mt-1"
                />
              </div>

              <div>
                <Label htmlFor="loanTerm" className="text-sm font-medium">Loan Term</Label>
                <Select value={String(loanTerm)} onValueChange={(value) => setLoanTerm(Number(value))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                    <SelectItem value="30">30 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium">Interest Rate %</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.001"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="text-right mt-1"
                />
              </div>

              <div>
                <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTaxesCosts"
                  checked={includeTaxesCosts}
                  onCheckedChange={(checked) => setIncludeTaxesCosts(checked as boolean)}
                  className="border-gray-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="includeTaxesCosts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Taxes & Additional Costs
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Add property tax, insurance, and other costs to calculation
                  </p>
                </div>
              </div>

              {includeTaxesCosts && (
                <div className="space-y-4">
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Label htmlFor="propertyTax" className="text-sm font-medium">Property Tax %</Label>
                    <Input
                      id="propertyTax"
                      type="number"
                      step="0.1"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(Number(e.target.value))}
                      className="text-right mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeInsurance" className="text-sm font-medium">Home Insurance (yearly)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="homeInsurance"
                        type="number"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(Number(e.target.value))}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="includePMI"
                      checked={includePMI}
                      onCheckedChange={(checked) => {
                        setIncludePMI(checked as boolean);
                        if (!checked) setPmiInsurance(0);
                      }}
                      className="border-gray-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="includePMI"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include PMI Insurance
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Add Private Mortgage Insurance if down payment is less than 20%
                      </p>
                    </div>
                  </div>

                  {includePMI && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="pmiInsurance" className="text-sm font-medium">PMI Insurance (yearly)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                        <Input
                          id="pmiInsurance"
                          type="number"
                          value={pmiInsurance}
                          onChange={(e) => setPmiInsurance(Number(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="includeHOA"
                      checked={includeHOA}
                      onCheckedChange={(checked) => {
                        setIncludeHOA(checked as boolean);
                        if (!checked) setHoaFee(0);
                      }}
                      className="border-gray-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="includeHOA"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include HOA Fee
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Add Homeowners Association fees if applicable
                      </p>
                    </div>
                  </div>

                  {includeHOA && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="hoaFee" className="text-sm font-medium">HOA Fee (yearly)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                        <Input
                          id="hoaFee"
                          type="number"
                          value={hoaFee}
                          onChange={(e) => setHoaFee(Number(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="includeOtherCosts"
                      checked={includeOtherCosts}
                      onCheckedChange={(checked) => {
                        setIncludeOtherCosts(checked as boolean);
                        if (!checked) setOtherCosts(0);
                      }}
                      className="border-gray-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="includeOtherCosts"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include Other Costs
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Add maintenance, utilities, or other annual costs
                      </p>
                    </div>
                  </div>

                  {includeOtherCosts && (
                    <div className="space-y-2 mt-2">
                      <Label htmlFor="otherCosts" className="text-sm font-medium">Other Costs (yearly)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-muted-foreground text-sm">$</span>
                        <Input
                          id="otherCosts"
                          type="number"
                          value={otherCosts}
                          onChange={(e) => setOtherCosts(Number(e.target.value))}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button onClick={calculateMortgage} className="w-full">Calculate Payment</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Payment Summary</h2>
              <p className="text-muted-foreground mt-1">Estimated monthly payments and total cost</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Payment</div>
                <div className="text-3xl font-bold mt-1">
                  {formatCurrency(monthlyPayment)}
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground">Total of {loanTerm * 12} Payments</div>
                <div className="text-2xl font-semibold mt-1">
                  {formatCurrency(totalPayment)}
                </div>
              </div>
            </div>

            {includeTaxesCosts && monthlyPayment > 0 && (
              <>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Payment Distribution</h3>
                    <div className="aspect-square max-w-[240px]">
                      <Pie
                        data={{
                          labels: [
                            'Principal & Interest',
                            'Property Tax',
                            'Home Insurance',
                            'PMI',
                            'HOA Fee',
                            'Other Costs',
                          ],
                          datasets: [
                            {
                              data: [
                                monthlyBreakdown.principalAndInterest,
                                monthlyBreakdown.propertyTax,
                                monthlyBreakdown.homeInsurance,
                                includePMI ? monthlyBreakdown.pmiInsurance : 0,
                                includeHOA ? monthlyBreakdown.hoaFee : 0,
                                includeOtherCosts ? monthlyBreakdown.otherCosts : 0,
                              ],
                              backgroundColor: [
                                '#0EA5E9',
                                '#22C55E',
                                '#EAB308',
                                '#EC4899',
                                '#8B5CF6',
                                '#F97316',
                              ],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Monthly Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Principal & Interest</span>
                        <span>{formatCurrency(principalAndInterest)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Property Tax</span>
                        <span>{formatCurrency((homePrice * (propertyTax / 100)) / 12)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Home Insurance</span>
                        <span>{formatCurrency(homeInsurance / 12)}</span>
                      </div>
                      {includePMI && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">PMI</span>
                          <span>{formatCurrency(pmiInsurance / 12)}</span>
                        </div>
                      )}
                      {includeHOA && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">HOA Fee</span>
                          <span>{formatCurrency(hoaFee / 12)}</span>
                        </div>
                      )}
                      {includeOtherCosts && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Other Costs</span>
                          <span>{formatCurrency(otherCosts / 12)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Monthly Payment Breakdown</h2>
        
        {/* Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Distribution</h3>
            <div className="aspect-square">
              <Pie
                data={{
                  labels: [
                    'Principal & Interest',
                    'Property Tax',
                    'Home Insurance',
                    'PMI',
                    'HOA Fee',
                    'Other Costs',
                  ],
                  datasets: [
                    {
                      data: [
                        monthlyBreakdown.principalAndInterest,
                        monthlyBreakdown.propertyTax,
                        monthlyBreakdown.homeInsurance,
                        includePMI ? monthlyBreakdown.pmiInsurance : 0,
                        includeHOA ? monthlyBreakdown.hoaFee : 0,
                        includeOtherCosts ? monthlyBreakdown.otherCosts : 0,
                      ],
                      backgroundColor: [
                        '#0EA5E9',
                        '#F59E0B',
                        '#10B981',
                        '#6366F1',
                        '#EC4899',
                        '#8B5CF6',
                      ],
                      borderColor: '#FFFFFF',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </div>
          </Card>

          {/* Detailed Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Payment Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Component</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries({
                    'Principal & Interest': monthlyBreakdown.principalAndInterest,
                    'Property Tax': monthlyBreakdown.propertyTax,
                    'Home Insurance': monthlyBreakdown.homeInsurance,
                    'PMI': includePMI ? monthlyBreakdown.pmiInsurance : 0,
                    'HOA Fee': includeHOA ? monthlyBreakdown.hoaFee : 0,
                    'Other Costs': includeOtherCosts ? monthlyBreakdown.otherCosts : 0,
                  }).map(([label, amount]) => (
                    <tr key={label} className="border-b">
                      <td className="py-2">{label}</td>
                      <td className="text-right py-2">
                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="text-right py-2">
                        {((amount / monthlyPayment) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="py-2">Total Monthly Payment</td>
                    <td className="text-right py-2">
                      ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-2">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <MortgageCalculatorContent />
    </main>
  );
}
