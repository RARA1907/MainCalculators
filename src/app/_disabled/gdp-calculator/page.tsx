'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Sample historical GDP data for visualization
const historicalGDP = {
  "2019": 21433.22,
  "2020": 20893.75,
  "2021": 22996.10,
  "2022": 25462.73,
  "2023": 26854.60
};

// Sample country GDP data for comparison
const countryGDP = {
  "United States": 25462.7,
  "China": 17963.2,
  "Japan": 4231.1,
  "Germany": 4072.2,
  "United Kingdom": 3070.7,
  "India": 3385.1,
  "France": 2782.9,
  "Italy": 2010.4,
  "Canada": 2139.8,
  "Brazil": 1920.1
};

export default function GDPCalculator() {
  const breadcrumbItems = [{ label: 'GDP Calculator', href: '/gdp-calculator' }];

  // State for Expenditure Approach
  const [consumption, setConsumption] = useState<number>(0);
  const [investment, setInvestment] = useState<number>(0);
  const [governmentSpending, setGovernmentSpending] = useState<number>(0);
  const [exports, setExports] = useState<number>(0);
  const [imports, setImports] = useState<number>(0);

  // State for Income Approach
  const [wages, setWages] = useState<number>(0);
  const [rents, setRents] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [profits, setProfits] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [depreciation, setDepreciation] = useState<number>(0);

  // Results state
  const [gdpExpenditure, setGdpExpenditure] = useState<number | null>(null);
  const [gdpIncome, setGdpIncome] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("United States");
  const [currency, setCurrency] = useState<string>("USD");

  // Calculate GDP using Expenditure Approach
  const calculateGDPExpenditure = () => {
    const gdp = consumption + investment + governmentSpending + (exports - imports);
    setGdpExpenditure(Number(gdp.toFixed(2)));
    setShowResults(true);
  };

  // Calculate GDP using Income Approach
  const calculateGDPIncome = () => {
    const gdp = wages + rents + interest + profits + taxes + depreciation;
    setGdpIncome(Number(gdp.toFixed(2)));
    setShowResults(true);
  };

  // Get GDP growth visualization
  const getGDPGrowthVisual = () => {
    if (!gdpExpenditure && !gdpIncome) return null;

    const gdp = gdpExpenditure || gdpIncome;
    const maxGDP = Math.max(...Object.values(historicalGDP));
    const percentage = Math.min((gdp / maxGDP) * 100, 100);

    return (
      <div className="relative h-8 bg-primary/20 rounded-full my-4">
        <motion.div
          className="absolute left-0 h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );
  };

  // Get country comparison visualization
  const getCountryComparisonVisual = () => {
    if (!gdpExpenditure && !gdpIncome) return null;

    const gdp = gdpExpenditure || gdpIncome;
    const maxGDP = Math.max(...Object.values(countryGDP));
    const percentage = (countryGDP[selectedCountry] / maxGDP) * 100;
    const calculatedPercentage = (gdp / maxGDP) * 100;

    return (
      <div className="space-y-2">
        <div className="relative h-6 bg-primary/20 rounded-full">
          <motion.div
            className="absolute left-0 h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calculatedPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="relative h-6 bg-secondary/20 rounded-full">
          <motion.div
            className="absolute left-0 h-full bg-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">GDP Calculator</h1>
        </div>

        <Tabs defaultValue="expenditure" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenditure">Expenditure Approach</TabsTrigger>
            <TabsTrigger value="income">Income Approach</TabsTrigger>
          </TabsList>

          <TabsContent value="expenditure">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Expenditure Approach Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">GDP by Expenditure</h2>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculateGDPExpenditure();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Private Consumption (C)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Household spending on goods and services</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        value={consumption}
                        onChange={(e) => setConsumption(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Investment (I)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Business spending on capital goods</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Government Spending (G)</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Public sector spending on goods and services</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        value={governmentSpending}
                        onChange={(e) => setGovernmentSpending(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Exports (X)</span>
                      </label>
                      <Input
                        type="number"
                        value={exports}
                        onChange={(e) => setExports(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Imports (M)</span>
                      </label>
                      <Input
                        type="number"
                        value={imports}
                        onChange={(e) => setImports(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate GDP
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults && gdpExpenditure !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Total GDP</h3>
                        <p className="text-4xl font-bold">
                          ${gdpExpenditure.toLocaleString()} Billion
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">GDP Growth Trend</h3>
                        {getGDPGrowthVisual()}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Country Comparison</h3>
                        <Select
                          value={selectedCountry}
                          onValueChange={setSelectedCountry}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(countryGDP).map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {getCountryComparisonVisual()}
                        <div className="flex justify-between text-sm">
                          <span>Your GDP</span>
                          <span>{selectedCountry} GDP</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter values and calculate to see GDP analysis
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Income Approach Input Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">GDP by Income</h2>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculateGDPIncome();
                    }}
                    className="space-y-4"
                  >
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Wages and Salaries</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total compensation of employees</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        type="number"
                        value={wages}
                        onChange={(e) => setWages(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Rents</span>
                      </label>
                      <Input
                        type="number"
                        value={rents}
                        onChange={(e) => setRents(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Interest</span>
                      </label>
                      <Input
                        type="number"
                        value={interest}
                        onChange={(e) => setInterest(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Corporate Profits</span>
                      </label>
                      <Input
                        type="number"
                        value={profits}
                        onChange={(e) => setProfits(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Indirect Business Taxes</span>
                      </label>
                      <Input
                        type="number"
                        value={taxes}
                        onChange={(e) => setTaxes(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Depreciation</span>
                      </label>
                      <Input
                        type="number"
                        value={depreciation}
                        onChange={(e) => setDepreciation(Number(e.target.value))}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Calculate GDP
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  {showResults && gdpIncome !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Total GDP</h3>
                        <p className="text-4xl font-bold">
                          ${gdpIncome.toLocaleString()} Billion
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">GDP Components</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Wages and Salaries</span>
                            <span>{((wages / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rents</span>
                            <span>{((rents / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Interest</span>
                            <span>{((interest / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Corporate Profits</span>
                            <span>{((profits / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Taxes</span>
                            <span>{((taxes / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Depreciation</span>
                            <span>{((depreciation / gdpIncome) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">GDP Growth Trend</h3>
                        {getGDPGrowthVisual()}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Country Comparison</h3>
                        <Select
                          value={selectedCountry}
                          onValueChange={setSelectedCountry}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(countryGDP).map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {getCountryComparisonVisual()}
                        <div className="flex justify-between text-sm">
                          <span>Your GDP</span>
                          <span>{selectedCountry} GDP</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Enter values and calculate to see GDP analysis
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">What is GDP?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Gross Domestic Product (GDP) is the total monetary value of all finished goods and services produced within a country's borders in a specific time period. It serves as a comprehensive scorecard of a country's economic health.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">Calculation Methods</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>
                  <span className="font-medium">Expenditure Approach:</span> GDP = C + I + G + (X - M)
                </li>
                <li>
                  <span className="font-medium">Income Approach:</span> Sum of all income earned in the production of goods and services
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <h3 className="text-xl font-semibold">Economic Indicators</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>GDP Growth Rate</li>
                <li>GDP per Capita</li>
                <li>Real vs Nominal GDP</li>
                <li>Purchasing Power Parity (PPP)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
