'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { EstateTaxCalculator } from '@/components/calculators/EstateTaxCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Marriage Tax Calculator',
    description: 'Calculate tax implications of marriage',
    href: '/marriage-tax-calculator'
  },
  {
    name: 'Income Tax Calculator',
    description: 'Calculate income tax based on earnings',
    href: '/income-tax-calculator'
  },
  {
    name: 'Capital Gains Calculator',
    description: 'Calculate taxes on investment gains',
    href: '/capital-gains-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Estate Tax Calculator',
    href: '/estate-tax-calculator'
  }
];

const ESTATE_PLANNING_TOOLS = [
  {
    tool: 'Revocable Living Trust',
    benefits: 'Avoids probate, maintains privacy',
    taxBenefits: 'No immediate tax benefits, but helps with estate management'
  },
  {
    tool: 'Irrevocable Life Insurance Trust',
    benefits: 'Removes life insurance from estate',
    taxBenefits: 'Proceeds not subject to estate tax'
  },
  {
    tool: 'Qualified Personal Residence Trust',
    benefits: 'Transfers residence to beneficiaries',
    taxBenefits: 'Reduces gift tax value of residence transfer'
  },
  {
    tool: 'Grantor Retained Annuity Trust',
    benefits: 'Transfers appreciation to beneficiaries',
    taxBenefits: 'Minimizes gift tax on transfers'
  },
  {
    tool: 'Family Limited Partnership',
    benefits: 'Asset protection and control',
    taxBenefits: 'Enables discounted valuations for transfers'
  }
];

export default function EstateTaxCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <EstateTaxCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding Estate Tax</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is Estate Tax?</h3>
                  <p className="text-muted-foreground">
                    Estate tax is a tax on the transfer of property after death. The tax applies to the fair market value of all assets owned at death, including cash, real estate, stocks, business interests, and life insurance proceeds.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Federal Estate Tax Exemption</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>2024 exemption: $13.61 million per individual</li>
                    <li>Married couples can combine exemptions</li>
                    <li>Portability allows surviving spouse to use deceased spouse's unused exemption</li>
                    <li>Annual adjustments for inflation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What's Included in Your Estate?</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Real estate and personal property</li>
                    <li>Financial accounts and investments</li>
                    <li>Business interests and assets</li>
                    <li>Life insurance proceeds (if owned by deceased)</li>
                    <li>Retirement accounts and pensions</li>
                    <li>Certain gifts made within 3 years of death</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Estate Planning Tools</h2>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Planning Tool</TableHead>
                      <TableHead>Benefits</TableHead>
                      <TableHead>Tax Benefits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ESTATE_PLANNING_TOOLS.map((tool) => (
                      <TableRow key={tool.tool}>
                        <TableCell className="font-medium">{tool.tool}</TableCell>
                        <TableCell>{tool.benefits}</TableCell>
                        <TableCell>{tool.taxBenefits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Gift Tax Considerations</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Annual Gift Tax Exclusion</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>2024 annual exclusion: $17,000 per recipient</li>
                      <li>Spouses can combine for $34,000 per recipient</li>
                      <li>Unlimited gifts to spouse (if U.S. citizen)</li>
                      <li>Direct payments for medical/education exempt</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Lifetime Gift Tax Exemption</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Shares exemption with estate tax</li>
                      <li>Reduces available estate tax exemption</li>
                      <li>Gifts above annual exclusion use exemption</li>
                      <li>Gift tax return required for larger gifts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Estate Tax Reduction Strategies</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Lifetime Giving Strategies</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Annual exclusion gifts</li>
                      <li>Direct payment of medical/education expenses</li>
                      <li>Charitable giving</li>
                      <li>Family limited partnerships</li>
                      <li>Qualified personal residence trusts</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Life Insurance Planning</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Irrevocable life insurance trusts</li>
                      <li>Policy ownership structure</li>
                      <li>Beneficiary designations</li>
                      <li>Premium funding strategies</li>
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
              <h2 className="text-xl font-semibold">Estate Planning Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Essential Documents</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Last will and testament</li>
                    <li>Living trust</li>
                    <li>Power of attorney</li>
                    <li>Healthcare directive</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Regular Review</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Update beneficiaries</li>
                    <li>Review asset titles</li>
                    <li>Check tax law changes</li>
                    <li>Adjust for life events</li>
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
