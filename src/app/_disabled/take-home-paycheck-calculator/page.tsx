'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { TakeHomePaycheckCalculator } from '@/components/calculators/TakeHomePaycheckCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    description: 'Calculate your income tax based on your earnings',
    href: '/income-tax-calculator'
  },
  {
    name: 'Salary Calculator',
    description: 'Calculate gross and net salary with deductions',
    href: '/salary-calculator'
  },
  {
    name: '401(k) Calculator',
    description: 'Plan your retirement savings and contributions',
    href: '/401k-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Take Home Paycheck Calculator',
    href: '/take-home-paycheck-calculator'
  }
];

const DEDUCTION_TYPES = [
  {
    type: 'Pre-tax Deductions',
    examples: '401(k), Health Insurance, FSA',
    taxBenefit: 'Reduces taxable income',
    timing: 'Deducted before taxes'
  },
  {
    type: 'Post-tax Deductions',
    examples: 'Roth 401(k), Disability Insurance',
    taxBenefit: 'No immediate tax benefit',
    timing: 'Deducted after taxes'
  },
  {
    type: 'Required Deductions',
    examples: 'Social Security, Medicare',
    taxBenefit: 'None - mandatory taxes',
    timing: 'Based on gross income'
  },
  {
    type: 'Voluntary Benefits',
    examples: 'Life Insurance, Legal Plans',
    taxBenefit: 'Varies by benefit type',
    timing: 'Can be pre or post-tax'
  }
];

export default function TakeHomePaycheckCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <TakeHomePaycheckCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Your Paycheck</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Gross vs. Net Pay</h3>
                  <p className="text-muted-foreground">
                    Gross pay is your total earnings before any deductions or taxes. Net pay, or take-home pay, is what you actually receive after all deductions, including taxes, insurance premiums, and retirement contributions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Mandatory Deductions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Federal Income Tax</li>
                    <li>State Income Tax (where applicable)</li>
                    <li>Social Security Tax (6.2% up to wage base)</li>
                    <li>Medicare Tax (1.45% + 0.9% for high earners)</li>
                    <li>Local Taxes (where applicable)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Common Voluntary Deductions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Health Insurance Premiums</li>
                    <li>Retirement Plan Contributions</li>
                    <li>Flexible Spending Accounts (FSA)</li>
                    <li>Health Savings Accounts (HSA)</li>
                    <li>Life Insurance Premiums</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Types of Paycheck Deductions</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Examples</TableHead>
                      <TableHead>Tax Benefit</TableHead>
                      <TableHead>Timing</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DEDUCTION_TYPES.map((deduction) => (
                      <TableRow key={deduction.type}>
                        <TableCell className="font-medium">{deduction.type}</TableCell>
                        <TableCell>{deduction.examples}</TableCell>
                        <TableCell>{deduction.taxBenefit}</TableCell>
                        <TableCell>{deduction.timing}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Withholding</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Form W-4</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Determines federal tax withholding</li>
                      <li>Update when life changes occur</li>
                      <li>Affects take-home pay amount</li>
                      <li>Consider multiple jobs/income</li>
                      <li>Account for tax credits/deductions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Withholding Adjustments</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Review withholding annually</li>
                      <li>Consider additional withholding</li>
                      <li>Account for non-wage income</li>
                      <li>Plan for life changes</li>
                      <li>Avoid tax surprises</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Maximizing Take-Home Pay</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Pre-tax Strategies</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Maximize 401(k) contributions</li>
                      <li>Use FSA/HSA accounts</li>
                      <li>Choose pre-tax benefits</li>
                      <li>Consider commuter benefits</li>
                      <li>Review dependent care options</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tax Planning</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Review tax withholding</li>
                      <li>Plan deductions carefully</li>
                      <li>Consider tax credits</li>
                      <li>Track tax-deductible expenses</li>
                      <li>Consult tax professional</li>
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
              <h2 className="text-xl font-semibold">Paycheck Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Regular Review</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Check pay stubs regularly</li>
                    <li>Verify deductions</li>
                    <li>Monitor tax withholding</li>
                    <li>Track benefit changes</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Common Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Wrong W-4 information</li>
                    <li>Missed benefit deadlines</li>
                    <li>Incorrect deductions</li>
                    <li>Overlooked tax credits</li>
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
