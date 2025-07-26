'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { TakeHomePayCalculator } from '@/components/calculators/TakeHomePayCalculator';

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    description: 'Calculate your total income tax burden',
    href: '/income-tax-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Plan your investment growth',
    href: '/investment-calculator'
  },
  {
    name: 'Retirement Calculator',
    description: 'Plan for your retirement',
    href: '/retirement-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Take Home Pay Calculator',
    href: '/take-home-pay-calculator'
  }
];

export default function TakeHomePayCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <TakeHomePayCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Your Paycheck</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Gross Pay vs. Net Pay</h3>
                  <p className="text-muted-foreground">
                    Gross pay is your total earnings before any deductions or taxes. Net pay, or take-home pay, is what you actually receive after all deductions and taxes are taken out.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Common Paycheck Deductions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Pre-tax deductions:</span> 401(k), health insurance, HSA, FSA
                    </li>
                    <li>
                      <span className="font-medium">Taxes:</span> Federal income tax, state tax, local tax
                    </li>
                    <li>
                      <span className="font-medium">FICA taxes:</span> Social Security (6.2%) and Medicare (1.45%)
                    </li>
                    <li>
                      <span className="font-medium">Post-tax deductions:</span> Roth 401(k), disability insurance
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Withholding and Allowances</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Your employer withholds taxes based on your W-4 form. The number of allowances you claim affects how much tax is withheld:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>More allowances = Less tax withheld = Larger paycheck</li>
                    <li>Fewer allowances = More tax withheld = Smaller paycheck</li>
                    <li>Claiming too many allowances may result in owing taxes</li>
                    <li>Claiming too few may result in a large tax refund</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Pre-Tax vs. Post-Tax Deductions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Pre-Tax Deductions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Traditional 401(k) contributions</li>
                      <li>Health insurance premiums</li>
                      <li>Health Savings Account (HSA)</li>
                      <li>Flexible Spending Account (FSA)</li>
                      <li>Commuter benefits</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Post-Tax Deductions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Roth 401(k) contributions</li>
                      <li>Roth IRA contributions</li>
                      <li>Disability insurance</li>
                      <li>Life insurance</li>
                      <li>Union dues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Maximizing Your Take-Home Pay</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Tax Reduction Strategies</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Contribute to pre-tax retirement accounts</li>
                      <li>Use HSA/FSA accounts for healthcare expenses</li>
                      <li>Take advantage of commuter benefits</li>
                      <li>Review and adjust your W-4 withholdings</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Benefits Optimization</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Compare health insurance options during open enrollment</li>
                      <li>Consider high-deductible health plans with HSA</li>
                      <li>Maximize employer 401(k) match</li>
                      <li>Review and adjust voluntary deductions periodically</li>
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
              <h2 className="text-xl font-semibold">2024 Tax Information</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">FICA Taxes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Social Security tax: 6.2% up to $168,600</li>
                    <li>Medicare tax: 1.45% (no limit)</li>
                    <li>Additional Medicare tax: 0.9% over $200,000</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Contribution Limits</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>401(k): $23,000 ($30,500 if 50+)</li>
                    <li>IRA: $7,000 ($8,000 if 50+)</li>
                    <li>HSA: $4,150 single, $8,300 family</li>
                    <li>FSA: $3,200</li>
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
