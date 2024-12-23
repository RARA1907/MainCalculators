'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { FhaLoanCalculator } from '@/components/calculators/FhaLoanCalculator';

const relatedCalculators = [
  {
    name: 'Mortgage Calculator',
    description: 'Calculate your monthly mortgage payments',
    href: '/mortgage-calculator'
  },
  {
    name: 'Down Payment Calculator',
    description: 'Determine how much down payment you need',
    href: '/down-payment-calculator'
  },
  {
    name: 'VA Loan Calculator',
    description: 'Calculate VA loan payments and benefits',
    href: '/va-loan-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'FHA Loan Calculator',
    href: '/fha-loan-calculator'
  }
];

export default function FhaLoanCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <FhaLoanCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Understanding FHA Loans</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">What is an FHA Loan?</h3>
                  <p className="text-muted-foreground">
                    An FHA loan is a mortgage insured by the Federal Housing Administration, designed to help homebuyers with lower credit scores and smaller down payments purchase a home. These loans are particularly popular among first-time homebuyers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Lower down payment requirements (as low as 3.5%)</li>
                    <li>Lower credit score requirements</li>
                    <li>Competitive interest rates</li>
                    <li>Available for various property types</li>
                    <li>Assumable by future buyers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">FHA Loan Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Minimum credit score of 580 for 3.5% down payment</li>
                    <li>Credit scores 500-579 require 10% down</li>
                    <li>Property must meet FHA standards</li>
                    <li>Primary residence only</li>
                    <li>Debt-to-income ratio requirements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">FHA Mortgage Insurance</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Upfront MIP</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>1.75% of the base loan amount</li>
                      <li>Can be financed into the loan</li>
                      <li>One-time payment at closing</li>
                      <li>Non-refundable</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Annual MIP</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>0.85% for most loans</li>
                      <li>Paid monthly with mortgage payment</li>
                      <li>Required for the life of the loan in most cases</li>
                      <li>Can be removed with 20% down payment</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">FHA Loan Limits</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">2024 Loan Limits</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Standard Areas: $726,200</li>
                      <li>High-Cost Areas: $1,089,300</li>
                      <li>Special Exception Areas: Higher limits</li>
                      <li>Alaska and Hawaii: Higher limits</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Property Types</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Single-family homes</li>
                      <li>Multi-unit properties (up to 4 units)</li>
                      <li>Condominiums (FHA approved)</li>
                      <li>Manufactured homes</li>
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
              <h2 className="text-xl font-semibold">FHA Loan Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Application Tips</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Check credit score first</li>
                    <li>Save for down payment</li>
                    <li>Get pre-approved</li>
                    <li>Compare lenders</li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold">Common Mistakes</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Not checking loan limits</li>
                    <li>Ignoring property conditions</li>
                    <li>Forgetting about MIP</li>
                    <li>Not shopping rates</li>
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
