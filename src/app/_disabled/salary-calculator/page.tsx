'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { SalaryCalculator } from '@/components/calculators/SalaryCalculator';

const relatedCalculators = [
  {
    name: 'Take Home Pay Calculator',
    description: 'Calculate your net pay after taxes and deductions',
    href: '/take-home-pay-calculator'
  },
  {
    name: 'Income Tax Calculator',
    description: 'Calculate your total tax burden',
    href: '/income-tax-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Plan your investment growth',
    href: '/investment-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Salary Calculator',
    href: '/salary-calculator'
  }
];

export default function SalaryCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <SalaryCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Salary Components</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Base Salary</h3>
                  <p className="text-muted-foreground">
                    Base salary is your fixed regular payment, typically expressed as an annual figure. It's the foundation of your compensation package and is guaranteed regardless of performance or company results.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Variable Compensation</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Bonuses:</span> Additional payments based on performance or company results
                    </li>
                    <li>
                      <span className="font-medium">Commission:</span> Percentage-based earnings from sales or specific achievements
                    </li>
                    <li>
                      <span className="font-medium">Overtime:</span> Additional pay for hours worked beyond standard hours
                    </li>
                    <li>
                      <span className="font-medium">Stock Options:</span> Right to purchase company stock at a set price
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Salary Conversion Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Common salary conversion formulas (based on a standard work year):
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Annual to Monthly: Divide by 12</li>
                    <li>Annual to Bi-weekly: Divide by 26</li>
                    <li>Annual to Weekly: Divide by 52</li>
                    <li>Annual to Daily: Divide by 260 (52 weeks × 5 days)</li>
                    <li>Annual to Hourly: Divide by 2,080 (52 weeks × 40 hours)</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Note: These calculations assume a standard work schedule. Adjust for part-time or alternative schedules.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Total Compensation Package</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Direct Compensation</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Base salary</li>
                      <li>Bonuses and commissions</li>
                      <li>Overtime pay</li>
                      <li>Profit sharing</li>
                      <li>Stock options and RSUs</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Benefits and Perks</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Health insurance</li>
                      <li>Retirement plans (401(k), pension)</li>
                      <li>Life and disability insurance</li>
                      <li>Paid time off</li>
                      <li>Professional development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Negotiating Your Salary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Preparation Tips</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Research industry standards and salary ranges</li>
                      <li>Document your achievements and value</li>
                      <li>Consider the entire compensation package</li>
                      <li>Practice your negotiation pitch</li>
                      <li>Be prepared with market data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Negotiation Points</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Base salary increase</li>
                      <li>Sign-on bonus</li>
                      <li>Performance bonus structure</li>
                      <li>Equity compensation</li>
                      <li>Flexible work arrangements</li>
                      <li>Professional development budget</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">2024 Salary Trends</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Average Increases</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Merit increases: 3.0% - 4.0%</li>
                    <li>Promotion increases: 8% - 12%</li>
                    <li>Cost of living adjustments: 2% - 3%</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Benefits Trends</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Remote work options</li>
                    <li>Mental health benefits</li>
                    <li>Student loan assistance</li>
                    <li>Expanded family leave</li>
                  </ul>
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
