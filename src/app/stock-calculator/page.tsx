'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { RelatedCalculators } from '@/components/common/RelatedCalculators';
import { StockCalculator } from '@/components/calculators/StockCalculator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const relatedCalculators = [
  {
    name: 'Investment Calculator',
    description: 'Calculate investment growth over time',
    href: '/investment-calculator'
  },
  {
    name: 'ROI Calculator',
    description: 'Calculate return on investment',
    href: '/roi-calculator'
  },
  {
    name: 'Profit Margin Calculator',
    description: 'Calculate profit margins and markup',
    href: '/profit-margin-calculator'
  }
];

const breadcrumbItems = [
  {
    label: 'Stock Calculator',
    href: '/stock-calculator'
  }
];

const riskManagementExamples = [
  {
    strategy: '1% Rule',
    description: 'Risk no more than 1% of portfolio per trade',
    example: '$10,000 portfolio = $100 max risk per trade'
  },
  {
    strategy: '2:1 Risk/Reward',
    description: 'Profit target should be 2x stop loss distance',
    example: '$1 risk = $2 reward target'
  },
  {
    strategy: 'Position Sizing',
    description: 'Adjust position size based on stop distance',
    example: 'Wider stop = smaller position size'
  }
];

export default function StockCalculatorPage() {
  return (
    <div className="container mx-auto px-4 mt-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2">
          <StockCalculator />

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Stock Trading Essentials</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Position Sizing</h3>
                  <p className="text-muted-foreground">
                    Position sizing is crucial for risk management. The calculator helps you determine the optimal position size based on your risk tolerance, account size, and the stock's volatility.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Risk Management Examples</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Strategy</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Example</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riskManagementExamples.map((example) => (
                        <TableRow key={example.strategy}>
                          <TableCell className="font-medium">{example.strategy}</TableCell>
                          <TableCell>{example.description}</TableCell>
                          <TableCell>{example.example}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Metrics</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>
                      <span className="font-medium">Risk/Reward Ratio:</span> Compares potential profit to potential loss
                    </li>
                    <li>
                      <span className="font-medium">Break-even Price:</span> Price needed to cover costs including commissions
                    </li>
                    <li>
                      <span className="font-medium">Position Value:</span> Current market value of your position
                    </li>
                    <li>
                      <span className="font-medium">Unrealized P/L:</span> Current profit or loss if position is closed
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Advanced Trading Concepts</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Multiple Position Management</h3>
                    <p className="text-muted-foreground">
                      The calculator supports multiple positions with different entry prices, allowing you to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Track average entry price</li>
                      <li>Calculate weighted break-even points</li>
                      <li>Manage scaling in/out of positions</li>
                      <li>Monitor total exposure</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Commission Impact</h3>
                    <p className="text-muted-foreground">
                      Understanding how commissions affect your trading:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                      <li>Higher commission = higher break-even price</li>
                      <li>Affects minimum profitable trade size</li>
                      <li>Impacts overall return calculations</li>
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
              <h2 className="text-xl font-semibold">Trading Tips</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Successful trading requires proper planning and risk management. Use this calculator to:
              </p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Best Practices</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Always use stop losses</li>
                    <li>Plan your trades in advance</li>
                    <li>Consider commission costs</li>
                    <li>Maintain proper position sizes</li>
                    <li>Monitor your risk/reward ratios</li>
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
