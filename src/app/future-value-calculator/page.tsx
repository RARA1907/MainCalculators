'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { FutureValueCalculator } from '@/components/calculators/FutureValueCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Present Value Calculator',
    description: 'Calculate the current worth of future payments',
    href: '/present-value-calculator'
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate investment growth over time',
    href: '/investment-calculator'
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest earnings',
    href: '/compound-interest-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Future Value Calculator',
    href: '/future-value-calculator'
  }
];

const compoundingExamples = [
  {
    frequency: 'Annually',
    initialAmount: '$1,000',
    rate: '5%',
    years: '5',
    result: '$1,276.28'
  },
  {
    frequency: 'Semi-annually',
    initialAmount: '$1,000',
    rate: '5%',
    years: '5',
    result: '$1,283.36'
  },
  {
    frequency: 'Quarterly',
    initialAmount: '$1,000',
    rate: '5%',
    years: '5',
    result: '$1,287.07'
  },
  {
    frequency: 'Monthly',
    initialAmount: '$1,000',
    rate: '5%',
    years: '5',
    result: '$1,289.23'
  }
];

export default function FutureValueCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <FutureValueCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Future Value</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is Future Value?</h3>
                  <p className="text-muted-foreground">
                    Future Value (FV) is the value of an asset or cash at a specified date in the future, based on an assumed growth rate. This calculator helps you understand how your money can grow over time through the power of compound interest and regular contributions.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">The Formula</h3>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="font-mono">FV = P(1 + r)^(nt) + PMT × [((1 + r)^(nt) - 1) / r]</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Where:<br />
                      FV = Future Value<br />
                      P = Present Value (Principal)<br />
                      r = Interest Rate per period<br />
                      n = Number of times interest is compounded per year<br />
                      t = Number of years<br />
                      PMT = Regular payment amount
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Compounding Frequency Examples</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Initial Amount</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Years</TableHead>
                        <TableHead>Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compoundingExamples.map((example) => (
                        <TableRow key={example.frequency}>
                          <TableCell>{example.frequency}</TableCell>
                          <TableCell>{example.initialAmount}</TableCell>
                          <TableCell>{example.rate}</TableCell>
                          <TableCell>{example.years}</TableCell>
                          <TableCell>{example.result}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Calculate future value with different compounding frequencies</li>
                    <li>Add regular contributions to see accelerated growth</li>
                    <li>Visualize the breakdown between principal, contributions, and interest</li>
                    <li>Compare different scenarios with the interactive chart</li>
                    <li>See the impact of different contribution frequencies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Tips for Using the Calculator</h2>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Start with realistic interest rates based on your investment type</li>
                  <li>Consider inflation when planning for long-term goals</li>
                  <li>Compare different contribution amounts to meet your goals</li>
                  <li>Use the chart to understand the power of compound interest</li>
                  <li>Experiment with different compounding frequencies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Why Calculate Future Value?</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Understanding future value is crucial for financial planning and investment decisions. It helps you:
              </p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Plan for retirement savings goals</li>
                    <li>Understand investment growth potential</li>
                    <li>Compare different investment strategies</li>
                    <li>See the impact of regular contributions</li>
                    <li>Visualize the power of compound interest</li>
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
