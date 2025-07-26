'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { PresentValueCalculator } from '@/components/calculators/PresentValueCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Future Value Calculator',
    description: 'Calculate the future value of your investments',
    href: '/future-value-calculator'
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
    label: 'Present Value Calculator',
    href: '/present-value-calculator'
  }
];

const compoundingExamples = [
  {
    frequency: 'Annually',
    periods: 1,
    example: '$10,000 future value, 5% rate, 3 years = $8,638.38'
  },
  {
    frequency: 'Semi-annually',
    periods: 2,
    example: '$10,000 future value, 5% rate, 3 years = $8,630.46'
  },
  {
    frequency: 'Quarterly',
    periods: 4,
    example: '$10,000 future value, 5% rate, 3 years = $8,626.52'
  },
  {
    frequency: 'Monthly',
    periods: 12,
    example: '$10,000 future value, 5% rate, 3 years = $8,624.07'
  }
];

export default function PresentValueCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <PresentValueCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Present Value</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is Present Value?</h3>
                  <p className="text-muted-foreground">
                    Present Value (PV) is the current worth of a future sum of money or stream of cash flows, given a specified rate of return. It's a fundamental concept in finance that helps determine how much future payments are worth today.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">The Formula</h3>
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="font-mono">PV = FV / (1 + r)^t</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Where:<br />
                      PV = Present Value<br />
                      FV = Future Value<br />
                      r = Interest Rate (as decimal)<br />
                      t = Time Period (in years)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Compounding Frequency Examples</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Periods per Year</TableHead>
                        <TableHead>Example Calculation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {compoundingExamples.map((example) => (
                        <TableRow key={example.frequency}>
                          <TableCell>{example.frequency}</TableCell>
                          <TableCell>{example.periods}</TableCell>
                          <TableCell>{example.example}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Applications</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Investment Analysis: Evaluating investment opportunities by comparing their current values</li>
                    <li>Bond Valuation: Determining the fair price of bonds based on future interest payments</li>
                    <li>Real Estate: Assessing property values based on expected future rental income</li>
                    <li>Business Planning: Evaluating projects based on expected future cash flows</li>
                    <li>Personal Finance: Planning for retirement or future expenses</li>
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
                  <li>Use higher discount rates for riskier investments to account for uncertainty</li>
                  <li>Consider inflation when setting your discount rate</li>
                  <li>Compare different compounding frequencies to understand their impact</li>
                  <li>For long-term calculations, remember that small rate changes can have significant effects</li>
                  <li>Use the chart to visualize how the value changes over time</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Why Calculate Present Value?</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Present Value calculations are crucial in financial decision-making because they account for the time value of money - the concept that money available now is worth more than the same amount in the future.
              </p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Key Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Compare different investment opportunities</li>
                    <li>Make informed financial decisions</li>
                    <li>Account for inflation and risk</li>
                    <li>Plan for future expenses</li>
                    <li>Value assets and investments</li>
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
