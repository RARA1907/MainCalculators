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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { SocialShare } from '@/components/common/SocialShare';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { EmbedDialog } from '@/components/shared/EmbedDialog';

const relatedCalculators = [
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, and decreases',
    href: '/percentage-calculator'
  },
  {
    name: 'Profit Margin Calculator',
    description: 'Calculate profit margins and markup',
    href: '/profit-margin-calculator'
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest over time',
    href: '/compound-interest-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'ROI Calculator',
    href: '/roi-calculator'
  }
];

export default function ROICalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [finalValue, setFinalValue] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [roi, setRoi] = useState<string>('');
  const [annualizedRoi, setAnnualizedRoi] = useState<string>('');

  const calculateROI = () => {
    const investment = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const time = parseFloat(timePeriod);

    if (isNaN(investment) || isNaN(final)) {
      setRoi('');
      setAnnualizedRoi('');
      return;
    }

    // Calculate ROI
    const roiValue = ((final - investment) / investment) * 100;
    setRoi(roiValue.toFixed(2));

    // Calculate Annualized ROI if time period is provided
    if (!isNaN(time) && time > 0) {
      const annualizedRoiValue = (Math.pow((final / investment), 1/time) - 1) * 100;
      setAnnualizedRoi(annualizedRoiValue.toFixed(2));
    } else {
      setAnnualizedRoi('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">ROI Calculator</h1>
                <EmbedDialog />
              </div>
              <p className="text-muted-foreground">
                Calculate your Return on Investment (ROI) and annualized ROI
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="initial-investment">
                    Initial Investment ($)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Enter the amount of money initially invested
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="initial-investment"
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="final-value">
                    Final Value ($)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Enter the final value of your investment
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="final-value"
                    type="number"
                    value={finalValue}
                    onChange={(e) => setFinalValue(e.target.value)}
                    placeholder="1500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-period">
                    Time Period (Years)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 ml-1 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Enter the investment period in years (optional)
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="time-period"
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    placeholder="1"
                  />
                </div>

                <Button 
                  className="w-full"
                  onClick={calculateROI}
                  disabled={!initialInvestment || !finalValue}
                >
                  Calculate ROI
                </Button>

                {roi && (
                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold">ROI</h3>
                      <p className="text-2xl font-bold">{roi}%</p>
                    </div>
                    
                    {annualizedRoi && (
                      <div className="p-4 bg-secondary rounded-lg">
                        <h3 className="font-semibold">Annualized ROI</h3>
                        <p className="text-2xl font-bold">{annualizedRoi}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About ROI Calculator</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Return on Investment (ROI) calculator helps you evaluate the profitability of an investment. It calculates both the simple ROI and annualized ROI when a time period is provided.
              </p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Simple ROI Formula</h3>
                  <p className="text-sm text-muted-foreground">
                    ROI = ((Final Value - Initial Investment) / Initial Investment) × 100
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Annualized ROI Formula</h3>
                  <p className="text-sm text-muted-foreground">
                    Annualized ROI = (((Final Value / Initial Investment)^(1/years)) - 1) × 100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <SocialShare />
          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </div>
    </div>
  );
}
