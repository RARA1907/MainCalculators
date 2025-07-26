'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { PaybackPeriodCalculator } from '@/components/calculators/PaybackPeriodCalculator';

const relatedCalculators = [
  {
    name: 'ROI Calculator',
    description: 'Calculate return on investment and annualized returns',
    href: '/roi-calculator'
  },
  {
    name: 'NPV Calculator',
    description: 'Calculate Net Present Value of investments',
    href: '/npv-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate investment growth over time',
    href: '/investment-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Payback Period Calculator',
    href: '/payback-period-calculator'
  }
];

export default function PaybackPeriodCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <PaybackPeriodCalculator />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">About Payback Period</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The Payback Period calculator helps you determine how long it will take to recover your initial investment based on projected cash flows.
              </p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Simple Payback Period</h3>
                  <p className="text-sm text-muted-foreground">
                    Calculated by dividing the initial investment by annual cash flows, considering growth rate. This method doesn't account for the time value of money.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Discounted Payback Period</h3>
                  <p className="text-sm text-muted-foreground">
                    Similar to simple payback period but considers the time value of money by discounting future cash flows. This provides a more realistic estimate in most cases.
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
