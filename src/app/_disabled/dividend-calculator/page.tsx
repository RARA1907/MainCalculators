'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { DividendCalculator } from '@/components/calculators/DividendCalculator';
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
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest growth',
    href: '/compound-interest-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Dividend Calculator',
    href: '/dividend-calculator'
  }
];

const dividendMetricsExamples = [
  {
    metric: 'Dividend Yield',
    formula: 'Annual Dividend per Share / Share Price × 100',
    example: '$2 dividend / $50 share price = 4% yield'
  },
  {
    metric: 'Payout Ratio',
    formula: 'Total Dividends / Net Income × 100',
    example: '$100M dividends / $400M net income = 25% payout'
  },
  {
    metric: 'Dividend Growth Rate',
    formula: '(New Dividend - Old Dividend) / Old Dividend × 100',
    example: '($2.20 - $2.00) / $2.00 = 10% growth'
  }
];

export default function DividendCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <DividendCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Dividends</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What are Dividends?</h3>
                  <p className="text-muted-foreground">
                    Dividends are regular payments made by companies to shareholders from their profits. They represent a way for companies to share their success with investors and provide a steady stream of income.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Dividend Metrics</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Formula</TableHead>
                        <TableHead>Example</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dividendMetricsExamples.map((metric) => (
                        <TableRow key={metric.metric}>
                          <TableCell className="font-medium">{metric.metric}</TableCell>
                          <TableCell>{metric.formula}</TableCell>
                          <TableCell>{metric.example}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Dividend Reinvestment (DRIP)</h3>
                  <p className="text-muted-foreground">
                    DRIP allows investors to automatically reinvest their dividend payments into additional shares of the stock. Benefits include:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                    <li>Compound growth over time</li>
                    <li>Dollar-cost averaging</li>
                    <li>Automatic investment</li>
                    <li>Often commission-free</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Dividend Investment Strategies</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Dividend Growth Investing</h3>
                    <p className="text-muted-foreground">
                      This strategy focuses on companies that consistently increase their dividend payments over time:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Look for companies with strong dividend growth history</li>
                      <li>Focus on sustainable payout ratios</li>
                      <li>Consider industry leaders with competitive advantages</li>
                      <li>Monitor dividend coverage ratios</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">High-Yield Strategy</h3>
                    <p className="text-muted-foreground">
                      This approach targets stocks with above-average dividend yields:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Research sustainability of high yields</li>
                      <li>Analyze company financials carefully</li>
                      <li>Consider sector-specific factors</li>
                      <li>Diversify across industries</li>
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
              <h2 className="text-xl font-semibold">Dividend Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Best Practices</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Research dividend history and stability</li>
                    <li>Consider tax implications</li>
                    <li>Monitor payout ratios</li>
                    <li>Diversify dividend sources</li>
                    <li>Reinvest for compound growth</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Warning Signs</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Unsustainably high yields</li>
                    <li>Declining dividend growth</li>
                    <li>High payout ratios</li>
                    <li>Poor earnings coverage</li>
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
