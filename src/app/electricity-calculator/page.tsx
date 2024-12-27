'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface Appliance {
  name: string;
  category: string;
  minWattage: number;
  maxWattage: number;
  defaultHoursPerDay: number;
}

const appliances: Appliance[] = [
  // Home appliances
  { name: 'Air Conditioner (HVAC)', category: 'Home', minWattage: 2500, maxWattage: 10000, defaultHoursPerDay: 8 },
  { name: 'Air Conditioner (Window)', category: 'Home', minWattage: 1500, maxWattage: 5000, defaultHoursPerDay: 8 },
  { name: 'Heater (Home)', category: 'Home', minWattage: 5000, maxWattage: 20000, defaultHoursPerDay: 6 },
  { name: 'Heater (Portable)', category: 'Home', minWattage: 750, maxWattage: 2000, defaultHoursPerDay: 4 },
  { name: 'Humidifier', category: 'Home', minWattage: 25, maxWattage: 350, defaultHoursPerDay: 8 },
  { name: 'Dehumidifier', category: 'Home', minWattage: 200, maxWattage: 750, defaultHoursPerDay: 8 },
  { name: 'Fan (Ceiling/Table)', category: 'Home', minWattage: 15, maxWattage: 200, defaultHoursPerDay: 8 },
  { name: 'Light Bulb (LED)', category: 'Home', minWattage: 3, maxWattage: 25, defaultHoursPerDay: 6 },
  { name: 'Light Bulb (Incandescent)', category: 'Home', minWattage: 15, maxWattage: 200, defaultHoursPerDay: 6 },
  { name: 'Electric Water Heater', category: 'Home', minWattage: 3000, maxWattage: 6600, defaultHoursPerDay: 3 },
  
  // Kitchen appliances
  { name: 'Refrigerator', category: 'Kitchen', minWattage: 500, maxWattage: 1000, defaultHoursPerDay: 24 },
  { name: 'Electric Range/Oven', category: 'Kitchen', minWattage: 2000, maxWattage: 5000, defaultHoursPerDay: 1 },
  { name: 'Electric Cooktop/Stove', category: 'Kitchen', minWattage: 750, maxWattage: 5000, defaultHoursPerDay: 1 },
  { name: 'Microwave Oven', category: 'Kitchen', minWattage: 750, maxWattage: 1500, defaultHoursPerDay: 0.5 },
  { name: 'Dishwasher', category: 'Kitchen', minWattage: 1200, maxWattage: 2000, defaultHoursPerDay: 1 },
  { name: 'Coffee Maker', category: 'Kitchen', minWattage: 600, maxWattage: 1200, defaultHoursPerDay: 0.5 },
  { name: 'Toaster', category: 'Kitchen', minWattage: 750, maxWattage: 1500, defaultHoursPerDay: 0.2 },
  { name: 'Electric Kettle', category: 'Kitchen', minWattage: 1000, maxWattage: 2000, defaultHoursPerDay: 0.5 },
  
  // Other appliances
  { name: 'Electric Vehicle Charger', category: 'Other', minWattage: 1500, maxWattage: 20000, defaultHoursPerDay: 8 },
  { name: 'Television', category: 'Other', minWattage: 25, maxWattage: 500, defaultHoursPerDay: 4 },
  { name: 'Washing Machine', category: 'Other', minWattage: 400, maxWattage: 1500, defaultHoursPerDay: 1 },
  { name: 'Clothes Dryer', category: 'Other', minWattage: 1800, maxWattage: 5000, defaultHoursPerDay: 1 },
  { name: 'Desktop Computer', category: 'Other', minWattage: 100, maxWattage: 250, defaultHoursPerDay: 4 },
  { name: 'Laptop Computer', category: 'Other', minWattage: 35, maxWattage: 150, defaultHoursPerDay: 4 },
];

interface ApplianceUsage {
  appliance: Appliance;
  wattage: number;
  hoursPerDay: number;
  enabled: boolean;
}

export default function ElectricityCalculator() {
  const breadcrumbItems = [
    {
      label: 'Electricity Calculator',
      href: '/electricity-calculator'
    }
  ];

  const [electricityRate, setElectricityRate] = useState<number>(0.12); // Default rate in $ per kWh
  const [applianceUsages, setApplianceUsages] = useState<ApplianceUsage[]>(
    appliances.map(appliance => ({
      appliance,
      wattage: (appliance.minWattage + appliance.maxWattage) / 2,
      hoursPerDay: appliance.defaultHoursPerDay,
      enabled: false
    }))
  );

  const [totalDailyUsage, setTotalDailyUsage] = useState<number>(0);
  const [totalMonthlyUsage, setTotalMonthlyUsage] = useState<number>(0);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState<number>(0);

  const calculateUsage = () => {
    const dailyUsage = applianceUsages
      .filter(usage => usage.enabled)
      .reduce((total, usage) => {
        return total + (usage.wattage * usage.hoursPerDay) / 1000; // Convert to kWh
      }, 0);

    const monthlyUsage = dailyUsage * 30;
    const monthlyCost = monthlyUsage * electricityRate;

    setTotalDailyUsage(dailyUsage);
    setTotalMonthlyUsage(monthlyUsage);
    setTotalMonthlyCost(monthlyCost);
  };

  useEffect(() => {
    calculateUsage();
  }, [applianceUsages, electricityRate]);

  const updateApplianceUsage = (index: number, updates: Partial<ApplianceUsage>) => {
    const newUsages = [...applianceUsages];
    newUsages[index] = { ...newUsages[index], ...updates };
    setApplianceUsages(newUsages);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Electricity Usage & Cost Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card mb-8">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Electricity Rate</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                    placeholder="Enter rate per kWh"
                    className="max-w-xs"
                  />
                  <span>$ per kWh</span>
                </div>
              </CardContent>
            </Card>

            {['Home', 'Kitchen', 'Other'].map(category => (
              <Card key={category} className="bg-card mb-8">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">{category} Appliances</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {applianceUsages
                      .filter(usage => usage.appliance.category === category)
                      .map((usage, index) => {
                        const originalIndex = applianceUsages.indexOf(usage);
                        return (
                          <div key={usage.appliance.name} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={usage.enabled}
                                onChange={(e) => updateApplianceUsage(originalIndex, { enabled: e.target.checked })}
                                className="checkbox"
                              />
                              <span>{usage.appliance.name}</span>
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={usage.wattage}
                                onChange={(e) => updateApplianceUsage(originalIndex, { wattage: parseFloat(e.target.value) || 0 })}
                                placeholder="Watts"
                                disabled={!usage.enabled}
                              />
                              <span className="text-sm text-muted-foreground">
                                Range: {usage.appliance.minWattage}-{usage.appliance.maxWattage}W
                              </span>
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={usage.hoursPerDay}
                                onChange={(e) => updateApplianceUsage(originalIndex, { hoursPerDay: parseFloat(e.target.value) || 0 })}
                                placeholder="Hours per day"
                                disabled={!usage.enabled}
                              />
                            </div>
                            <div className="text-right">
                              {((usage.wattage * usage.hoursPerDay) / 1000 * electricityRate).toFixed(2)} $/day
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Results Section */}
          <div>
            <Card className="bg-card sticky top-8">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Usage Summary</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold">Daily Usage</h3>
                    <p className="text-2xl">{totalDailyUsage.toFixed(2)} kWh</p>
                    <p className="text-muted-foreground">${(totalDailyUsage * electricityRate).toFixed(2)} per day</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Monthly Usage</h3>
                    <p className="text-2xl">{totalMonthlyUsage.toFixed(2)} kWh</p>
                    <p className="text-muted-foreground">${totalMonthlyCost.toFixed(2)} per month</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Yearly Projection</h3>
                    <p className="text-2xl">{(totalMonthlyUsage * 12).toFixed(2)} kWh</p>
                    <p className="text-muted-foreground">${(totalMonthlyCost * 12).toFixed(2)} per year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Energy Saving Tips */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Energy Saving Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Monitor Usage</h3>
                  <p className="text-muted-foreground">
                    Track your energy habits and turn off unused appliances. Use fans instead of AC when possible.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Lighting</h3>
                  <p className="text-muted-foreground">
                    Replace incandescent bulbs with LED bulbs. A 75W incandescent can be replaced with a 9W LED.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Temperature Control</h3>
                  <p className="text-muted-foreground">
                    Install a programmable thermostat and adjust temperature based on your daily schedule.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Appliance Efficiency</h3>
                  <p className="text-muted-foreground">
                    Choose energy-efficient appliances. Consider long-term savings over initial purchase cost.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Windows</h3>
                  <p className="text-muted-foreground">
                    Check for heat loss through windows. Use curtains and consider energy-efficient replacements.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Insulation</h3>
                  <p className="text-muted-foreground">
                    Properly insulate your home including windows, doors, walls, and attic to reduce heating/cooling costs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
