'use client';

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
import { SocialShare } from '@/components/common/SocialShare';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { EmbedDialog } from '@/components/shared/EmbedDialog';
import { RoiCalculator } from '@/components/calculators/RoiCalculator';

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
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <RoiCalculator />
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
          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </div>
    </div>
  );
}
