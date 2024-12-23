'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { MarriageTaxCalculator } from '@/components/calculators/MarriageTaxCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    description: 'Calculate your income tax based on your earnings',
    href: '/income-tax-calculator'
  },
  {
    name: 'Take Home Pay Calculator',
    description: 'Calculate your net income after taxes and deductions',
    href: '/take-home-pay-calculator'
  },
  {
    name: 'Salary Calculator',
    description: 'Calculate gross and net salary with deductions',
    href: '/salary-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Marriage Tax Calculator',
    href: '/marriage-tax-calculator'
  }
];

const TAX_BENEFITS = [
  {
    benefit: 'Higher Standard Deduction',
    single: '$14,600',
    married: '$29,200',
    notes: 'Married couples get double the standard deduction'
  },
  {
    benefit: 'IRA Contribution Limits',
    single: '$7,000',
    married: '$14,000',
    notes: 'Combined contribution limit for both spouses'
  },
  {
    benefit: 'Capital Loss Deduction',
    single: '$3,000',
    married: '$3,000',
    notes: 'Same limit applies to both filing statuses'
  },
  {
    benefit: 'Gift Tax Exclusion',
    single: '$17,000',
    married: '$34,000',
    notes: 'Double the annual gift tax exclusion when married'
  }
];

export default function MarriageTaxCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <MarriageTaxCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding the Marriage Tax</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is the Marriage Tax?</h3>
                  <p className="text-muted-foreground">
                    The marriage tax refers to the change in a couple's total tax liability when they marry and file taxes jointly, compared to filing as single individuals. This change can result in either a penalty (paying more tax) or a bonus (paying less tax).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">When Does a Marriage Penalty Occur?</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Both spouses have similar high incomes</li>
                    <li>Combined income pushes the couple into a higher tax bracket</li>
                    <li>Deductions are limited for married couples</li>
                    <li>Both spouses have significant itemized deductions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">When Does a Marriage Bonus Occur?</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>One spouse earns significantly more than the other</li>
                    <li>One spouse has no income or very low income</li>
                    <li>Combined standard deduction benefits the couple</li>
                    <li>Ability to combine tax credits and deductions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Benefits Comparison (2024)</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Benefit</TableHead>
                      <TableHead>Single</TableHead>
                      <TableHead>Married Filing Jointly</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TAX_BENEFITS.map((benefit) => (
                      <TableRow key={benefit.benefit}>
                        <TableCell className="font-medium">{benefit.benefit}</TableCell>
                        <TableCell>{benefit.single}</TableCell>
                        <TableCell>{benefit.married}</TableCell>
                        <TableCell>{benefit.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Filing Status Options</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Married Filing Jointly</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Most common choice for married couples</li>
                      <li>Combined income and deductions</li>
                      <li>Both spouses equally liable for taxes</li>
                      <li>Access to more tax credits and deductions</li>
                      <li>Simplified tax filing process</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Married Filing Separately</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Separate tax liability</li>
                      <li>May benefit if one spouse has high medical expenses</li>
                      <li>Protection from spouse's tax issues</li>
                      <li>Limited access to certain tax benefits</li>
                      <li>Higher tax rates in some cases</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Planning Strategies</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Before Marriage</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Calculate potential tax impact</li>
                      <li>Review current deductions and credits</li>
                      <li>Consider timing of marriage</li>
                      <li>Evaluate retirement contributions</li>
                      <li>Review employee benefits</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">After Marriage</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Update W-4 withholding</li>
                      <li>Combine or separate financial accounts</li>
                      <li>Review estate planning</li>
                      <li>Coordinate employee benefits</li>
                      <li>Consider joint investment strategies</li>
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
              <h2 className="text-xl font-semibold">Tax Tips for Newlyweds</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Important Updates</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Update name with Social Security</li>
                    <li>Change address with IRS</li>
                    <li>Review tax withholding</li>
                    <li>Update estate documents</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Common Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Wrong filing status</li>
                    <li>Incorrect name/SSN</li>
                    <li>Missing deductions</li>
                    <li>Wrong withholding amount</li>
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
