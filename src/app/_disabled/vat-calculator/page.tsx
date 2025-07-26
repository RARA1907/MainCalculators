'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { VatCalculator } from '@/components/calculators/VatCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Sales Tax Calculator',
    description: 'Calculate sales tax for US states',
    href: '/sales-tax-calculator'
  },
  {
    name: 'Profit Margin Calculator',
    description: 'Calculate profit margins and markup',
    href: '/profit-margin-calculator'
  },
  {
    name: 'Price Calculator',
    description: 'Calculate retail prices and margins',
    href: '/price-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'VAT Calculator',
    href: '/vat-calculator'
  }
];

const EU_VAT_RATES = [
  { country: 'Hungary', standard: 27, reduced: 18, superReduced: 5 },
  { country: 'Sweden', standard: 25, reduced: 12, superReduced: 6 },
  { country: 'Denmark', standard: 25, reduced: '-', superReduced: '-' },
  { country: 'Croatia', standard: 25, reduced: 13, superReduced: 5 },
  { country: 'Finland', standard: 24, reduced: 14, superReduced: 10 },
  { country: 'Greece', standard: 24, reduced: 13, superReduced: 6 },
  { country: 'Ireland', standard: 23, reduced: 13.5, superReduced: 9 },
  { country: 'Poland', standard: 23, reduced: 8, superReduced: 5 },
  { country: 'Portugal', standard: 23, reduced: 13, superReduced: 6 },
  { country: 'Belgium', standard: 21, reduced: 12, superReduced: 6 }
];

export default function VatCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <VatCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding VAT</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is VAT?</h3>
                  <p className="text-muted-foreground">
                    Value Added Tax (VAT) is a consumption tax added to products and services at each stage of production and distribution. Unlike a simple sales tax, VAT is collected incrementally, with each seller in the supply chain charging VAT on their value addition.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Types of VAT Rates</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Standard Rate:</span> Applied to most goods and services
                    </li>
                    <li>
                      <span className="font-medium">Reduced Rate:</span> Lower rate for specific goods/services
                    </li>
                    <li>
                      <span className="font-medium">Super-Reduced Rate:</span> Special low rate for essential items
                    </li>
                    <li>
                      <span className="font-medium">Zero Rate:</span> No VAT charged but businesses can reclaim VAT
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">EU VAT Rates (2024)</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>Standard Rate</TableHead>
                      <TableHead>Reduced Rate</TableHead>
                      <TableHead>Super-Reduced Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EU_VAT_RATES.map((country) => (
                      <TableRow key={country.country}>
                        <TableCell className="font-medium">{country.country}</TableCell>
                        <TableCell>{country.standard}%</TableCell>
                        <TableCell>{country.reduced}%</TableCell>
                        <TableCell>{country.superReduced}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">VAT Calculations</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Common Calculations</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>
                        <span className="font-medium">Add VAT:</span> Net × (1 + VAT rate)
                      </li>
                      <li>
                        <span className="font-medium">Remove VAT:</span> Gross ÷ (1 + VAT rate)
                      </li>
                      <li>
                        <span className="font-medium">VAT Amount:</span> Net × VAT rate
                      </li>
                      <li>
                        <span className="font-medium">Extract VAT:</span> Gross × (VAT rate ÷ (1 + VAT rate))
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Example</h3>
                    <p className="text-muted-foreground">
                      For a net amount of $100 with 20% VAT:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>VAT Amount: $100 × 0.20 = $20</li>
                      <li>Gross Amount: $100 × 1.20 = $120</li>
                      <li>Extract VAT from $120: $120 × (0.20 ÷ 1.20) = $20</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">VAT Registration and Compliance</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Registration Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>UK: Register when turnover exceeds £85,000</li>
                      <li>EU: Varies by country (typically €35,000 - €100,000)</li>
                      <li>Voluntary registration possible below threshold</li>
                      <li>Special rules for digital services and distance selling</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Compliance Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Keep detailed VAT records</li>
                      <li>Submit regular VAT returns</li>
                      <li>Issue proper VAT invoices</li>
                      <li>Maintain digital records (Making Tax Digital)</li>
                      <li>Report EU sales through VIES system</li>
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
              <h2 className="text-xl font-semibold">VAT Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Business Tips</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Keep detailed records of VAT paid</li>
                    <li>Consider cash accounting scheme</li>
                    <li>Review VAT status regularly</li>
                    <li>Plan for threshold breaches</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Common Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Late registration</li>
                    <li>Incorrect rate application</li>
                    <li>Missing record keeping</li>
                    <li>Late return submission</li>
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
