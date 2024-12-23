'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { CapitalGainsCalculator } from '@/components/calculators/CapitalGainsCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Stock Calculator',
    description: 'Calculate stock position metrics and returns',
    href: '/stock-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate investment growth over time',
    href: '/investment-calculator'
  },
  {
    name: 'ROI Calculator',
    description: 'Calculate return on investment',
    href: '/roi-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Capital Gains Calculator',
    href: '/capital-gains-calculator'
  }
];

const taxBracketExamples = [
  {
    type: 'Short-term (≤ 1 year)',
    brackets: [
      { rate: '10%', income: 'Up to $11,600' },
      { rate: '12%', income: '$11,601 - $47,150' },
      { rate: '22%', income: '$47,151 - $100,525' },
      { rate: '24%', income: '$100,526 - $191,950' },
      { rate: '32%', income: '$191,951 - $243,725' },
      { rate: '35%', income: '$243,726 - $609,350' },
      { rate: '37%', income: 'Over $609,350' }
    ]
  },
  {
    type: 'Long-term (> 1 year)',
    brackets: [
      { rate: '0%', income: 'Up to $44,625' },
      { rate: '15%', income: '$44,626 - $492,300' },
      { rate: '20%', income: 'Over $492,300' }
    ]
  }
];

export default function CapitalGainsCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <CapitalGainsCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Capital Gains Tax</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What are Capital Gains?</h3>
                  <p className="text-muted-foreground">
                    Capital gains are profits from the sale of capital assets such as stocks, bonds, real estate, or other investments. The tax rate depends on how long you held the asset and your income tax bracket.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2024 Tax Brackets</h3>
                  {taxBracketExamples.map((category) => (
                    <div key={category.type} className="mt-4">
                      <h4 className="font-medium mb-2">{category.type}</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tax Rate</TableHead>
                            <TableHead>Taxable Income</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.brackets.map((bracket) => (
                            <TableRow key={bracket.rate}>
                              <TableCell>{bracket.rate}</TableCell>
                              <TableCell>{bracket.income}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Cost Basis</h3>
                  <p className="text-muted-foreground">
                    Cost basis is the original value of an asset for tax purposes. It includes:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                    <li>Purchase price</li>
                    <li>Brokerage fees</li>
                    <li>Reinvested dividends</li>
                    <li>Stock splits adjustments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tax Minimization Strategies</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Holding Period Strategy</h3>
                    <p className="text-muted-foreground">
                      Strategies to minimize capital gains tax:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Hold investments for over one year</li>
                      <li>Time sales based on income</li>
                      <li>Use tax-loss harvesting</li>
                      <li>Consider tax-advantaged accounts</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tax-Loss Harvesting</h3>
                    <p className="text-muted-foreground">
                      Key points about tax-loss harvesting:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Offset gains with losses</li>
                      <li>Carry forward excess losses</li>
                      <li>Avoid wash sale rules</li>
                      <li>Consider transaction costs</li>
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
                  <h3 className="font-semibold">Best Practices</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Keep detailed records of transactions</li>
                    <li>Consider tax implications before selling</li>
                    <li>Use tax-advantaged accounts when possible</li>
                    <li>Consult with tax professionals</li>
                    <li>Plan sales across tax years</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Common Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Ignoring holding period</li>
                    <li>Forgetting about state taxes</li>
                    <li>Missing tax-loss harvesting opportunities</li>
                    <li>Incorrect cost basis calculation</li>
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
