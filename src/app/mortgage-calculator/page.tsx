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

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const calculateMortgage = () => {
    const principal = homePrice * (1 - downPayment / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyMortgagePayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    const monthlyHomeInsurance = homeInsurance / 12;
    const monthlyPMI = pmiInsurance / 12;
    const monthlyHOA = hoaFee / 12;
    const monthlyOther = otherCosts / 12;

    const totalMonthly = includeTaxesCosts
      ? monthlyMortgagePayment + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA + monthlyOther
      : monthlyMortgagePayment;

    setMonthlyPayment(totalMonthly);
    setTotalPayment(totalMonthly * numberOfPayments);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mortgage Calculator</h1>
        <div className="flex items-center gap-2">
          <SocialShare url={window?.location.href} title="Mortgage Calculator" />
          <EmbedDialog title="Mortgage Calculator" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="homePrice">Home Price</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the total price of the home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="homePrice"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment %</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate %</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.001"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTaxesCosts"
                checked={includeTaxesCosts}
                onCheckedChange={(checked) => setIncludeTaxesCosts(checked as boolean)}
              />
              <label
                htmlFor="includeTaxesCosts"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include Taxes & Costs Below
              </label>
            </div>

            {includeTaxesCosts && (
              <div className="space-y-4">
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="propertyTax">Property Tax %</Label>
                  <Input
                    id="propertyTax"
                    type="number"
                    step="0.1"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeInsurance">Home Insurance (yearly)</Label>
                  <Input
                    id="homeInsurance"
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pmiInsurance">PMI Insurance</Label>
                  <Input
                    id="pmiInsurance"
                    type="number"
                    value={pmiInsurance}
                    onChange={(e) => setPmiInsurance(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hoaFee">HOA Fee (yearly)</Label>
                  <Input
                    id="hoaFee"
                    type="number"
                    value={hoaFee}
                    onChange={(e) => setHoaFee(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherCosts">Other Costs (yearly)</Label>
                  <Input
                    id="otherCosts"
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            <Button onClick={calculateMortgage} className="w-full">Calculate</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <div className="bg-primary/10 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Monthly Payment</h2>
              <p className="text-3xl font-bold">${monthlyPayment.toFixed(2)}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Payment</span>
                <span className="font-semibold">${totalPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Down Payment</span>
                <span className="font-semibold">${(homePrice * downPayment / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Amount</span>
                <span className="font-semibold">${(homePrice * (1 - downPayment / 100)).toFixed(2)}</span>
              </div>
            </div>

            {/* Add pie chart here for payment breakdown */}
          </div>
        </Card>
      </div>

      {/* Add content section here */}
    </main>
  );
}
