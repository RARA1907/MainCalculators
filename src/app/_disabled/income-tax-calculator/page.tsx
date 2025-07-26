'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { IncomeTaxCalculator } from '@/components/calculators/IncomeTaxCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Capital Gains Calculator',
    description: 'Calculate capital gains tax on investments',
    href: '/capital-gains-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate investment growth over time',
    href: '/investment-calculator'
  },
  {
    name: 'Retirement Calculator',
    description: 'Plan your retirement savings',
    href: '/retirement-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Income Tax Calculator',
    href: '/income-tax-calculator'
  }
];

const federalTaxBrackets2024 = [
  {
    rate: '10%',
    single: 'Up to $11,600',
    married: 'Up to $23,200',
    head: 'Up to $16,550'
  },
  {
    rate: '12%',
    single: '$11,601 - $47,150',
    married: '$23,201 - $94,300',
    head: '$16,551 - $63,100'
  },
  {
    rate: '22%',
    single: '$47,151 - $100,525',
    married: '$94,301 - $201,050',
    head: '$63,101 - $100,500'
  },
  {
    rate: '24%',
    single: '$100,526 - $191,950',
    married: '$201,051 - $383,900',
    head: '$100,501 - $191,950'
  },
  {
    rate: '32%',
    single: '$191,951 - $243,725',
    married: '$383,901 - $487,450',
    head: '$191,951 - $243,700'
  },
  {
    rate: '35%',
    single: '$243,726 - $609,350',
    married: '$487,451 - $731,200',
    head: '$243,701 - $609,350'
  },
  {
    rate: '37%',
    single: 'Over $609,350',
    married: 'Over $731,200',
    head: 'Over $609,350'
  }
];

export default function IncomeTaxCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <IncomeTaxCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">2024 Federal Tax Brackets</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rate</TableHead>
                      <TableHead>Single</TableHead>
                      <TableHead>Married Filing Jointly</TableHead>
                      <TableHead>Head of Household</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {federalTaxBrackets2024.map((bracket) => (
                      <TableRow key={bracket.rate}>
                        <TableCell className="font-medium">{bracket.rate}</TableCell>
                        <TableCell>{bracket.single}</TableCell>
                        <TableCell>{bracket.married}</TableCell>
                        <TableCell>{bracket.head}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Income Tax</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Progressive Tax System</h3>
                  <p className="text-muted-foreground">
                    The U.S. uses a progressive tax system where different portions of your income are taxed at different rates. As your income increases, you pay a higher percentage on the amount within each bracket.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Types of Taxes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Federal Income Tax:</span> Based on your income level and filing status
                    </li>
                    <li>
                      <span className="font-medium">State Income Tax:</span> Varies by state, some states have no income tax
                    </li>
                    <li>
                      <span className="font-medium">FICA Taxes:</span> Social Security (6.2%) and Medicare (1.45%)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Common Deductions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Standard deduction or itemized deductions</li>
                    <li>401(k) and IRA contributions</li>
                    <li>HSA contributions</li>
                    <li>Student loan interest</li>
                    <li>Mortgage interest</li>
                    <li>Charitable contributions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Credits and Deductions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Common Tax Credits</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Child Tax Credit (up to $2,000 per qualifying child)</li>
                      <li>Earned Income Tax Credit</li>
                      <li>American Opportunity Credit (education)</li>
                      <li>Lifetime Learning Credit</li>
                      <li>Child and Dependent Care Credit</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tax-Advantaged Accounts</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Traditional 401(k): $23,000 limit (2024)</li>
                      <li>Traditional IRA: $7,000 limit (2024)</li>
                      <li>HSA: $4,150 individual, $8,300 family (2024)</li>
                      <li>FSA: $3,200 limit (2024)</li>
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
              <h2 className="text-xl font-semibold">Tax Planning Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Tax Reduction Strategies</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Maximize retirement contributions</li>
                    <li>Use tax-advantaged accounts</li>
                    <li>Bundle itemized deductions</li>
                    <li>Harvest tax losses</li>
                    <li>Time income and deductions</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Important Deadlines</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Tax filing deadline: April 15, 2024</li>
                    <li>Q1 estimated tax: April 15, 2024</li>
                    <li>Q2 estimated tax: June 17, 2024</li>
                    <li>Q3 estimated tax: Sept 16, 2024</li>
                    <li>Q4 estimated tax: Jan 15, 2025</li>
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
