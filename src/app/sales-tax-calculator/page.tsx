'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { SalesTaxCalculator } from '@/components/calculators/SalesTaxCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'VAT Calculator',
    description: 'Calculate Value Added Tax for different regions',
    href: '/vat-calculator'
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
    label: 'Sales Tax Calculator',
    href: '/sales-tax-calculator'
  }
];

const TOP_CITIES_RATES = [
  { cityName: 'Chicago, IL', combined: 10.25, city: 1.25, county: 1.75, state: 6.25, other: 1.00 },
  { cityName: 'Los Angeles, CA', combined: 9.50, city: 0.00, county: 2.25, state: 7.25, other: 0.00 },
  { cityName: 'New York City, NY', combined: 8.875, city: 4.50, county: 0.00, state: 4.00, other: 0.375 },
  { cityName: 'Seattle, WA', combined: 10.10, city: 0.00, county: 2.70, state: 6.50, other: 0.90 },
  { cityName: 'Phoenix, AZ', combined: 8.60, city: 2.30, county: 0.70, state: 5.60, other: 0.00 }
];

export default function SalesTaxCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <SalesTaxCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Sales Tax</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is Sales Tax?</h3>
                  <p className="text-muted-foreground">
                    Sales tax is a consumption tax imposed by state and local governments on the sale of goods and services. Unlike VAT, sales tax is generally collected only at the final point of sale to the consumer.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Components of Sales Tax</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">State Tax:</span> Base rate set by the state
                    </li>
                    <li>
                      <span className="font-medium">County Tax:</span> Additional rate imposed by counties
                    </li>
                    <li>
                      <span className="font-medium">City/Municipal Tax:</span> Local rates added by cities
                    </li>
                    <li>
                      <span className="font-medium">Special District Tax:</span> Additional taxes for specific purposes
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Major U.S. Cities Sales Tax Rates (2024)</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead>Combined Rate</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>County</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Other</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_CITIES_RATES.map((city) => (
                      <TableRow key={city.cityName}>
                        <TableCell className="font-medium">{city.cityName}</TableCell>
                        <TableCell>{city.combined}%</TableCell>
                        <TableCell>{city.city}%</TableCell>
                        <TableCell>{city.county}%</TableCell>
                        <TableCell>{city.state}%</TableCell>
                        <TableCell>{city.other}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Sales Tax Exemptions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Common Exempt Items</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Groceries and unprepared food items</li>
                      <li>Prescription medications</li>
                      <li>Medical devices and supplies</li>
                      <li>Certain clothing items (in some states)</li>
                      <li>Educational materials</li>
                      <li>Manufacturing equipment and raw materials</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tax-Exempt Organizations</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Non-profit organizations</li>
                      <li>Religious institutions</li>
                      <li>Educational institutions</li>
                      <li>Government agencies</li>
                      <li>Charitable organizations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Sales Tax Compliance</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Business Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Obtain sales tax permit/license</li>
                      <li>Collect appropriate tax rates</li>
                      <li>File returns on time (monthly/quarterly)</li>
                      <li>Maintain accurate records</li>
                      <li>Handle exemption certificates</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Economic Nexus</h3>
                    <p className="text-muted-foreground mb-2">
                      After the South Dakota v. Wayfair decision, businesses must collect sales tax if they meet either:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>$100,000 in annual sales</li>
                      <li>200 separate transactions</li>
                      <li>Physical presence in the state</li>
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
              <h2 className="text-xl font-semibold">Sales Tax Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">For Businesses</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Use automated tax software</li>
                    <li>Keep detailed records</li>
                    <li>Stay updated on rate changes</li>
                    <li>File returns on time</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Tax Holidays</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Back-to-school shopping</li>
                    <li>Energy-efficient appliances</li>
                    <li>Hurricane preparedness</li>
                    <li>Holiday shopping</li>
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
