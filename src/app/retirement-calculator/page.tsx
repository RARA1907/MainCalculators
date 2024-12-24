'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

export default function RetirementCalculator() {
  const breadcrumbItems = [
    {
      label: 'Retirement Calculator',
      href: '/retirement-calculator'
    }
  ];

  // Personal Information
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  
  // Investment Details
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState<number>(5000);
  const [socialSecurityIncome, setSocialSecurityIncome] = useState<number>(1500);

  // Results
  const [totalSavingsNeeded, setTotalSavingsNeeded] = useState<number>(0);
  const [projectedSavings, setProjectedSavings] = useState<number>(0);
  const [savingsGap, setSavingsGap] = useState<number>(0);
  const [monthlyGap, setMonthlyGap] = useState<number>(0);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  const calculateRetirement = () => {
    // Calculate years until retirement and retirement duration
    const yearsUntilRetirement = retirementAge - currentAge;
    const retirementDuration = lifeExpectancy - retirementAge;
    
    // Adjust returns for inflation
    const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
    
    // Calculate required retirement savings
    const monthlyNeeds = desiredMonthlyIncome - socialSecurityIncome;
    const annualNeeds = monthlyNeeds * 12;
    
    // Using the 4% rule as a baseline
    const requiredSavings = annualNeeds / 0.04;
    setTotalSavingsNeeded(requiredSavings);

    // Calculate projected savings at retirement
    let savings = currentSavings;
    const timelinePoints = [];
    
    for (let year = 0; year <= yearsUntilRetirement; year++) {
      timelinePoints.push({
        age: currentAge + year,
        savings: savings
      });

      savings = savings * (1 + realReturn) + (monthlyContribution * 12);
    }

    setProjectedSavings(savings);
    setTimelineData(timelinePoints);

    // Calculate gaps
    const savingsGapCalc = Math.max(0, requiredSavings - savings);
    setSavingsGap(savingsGapCalc);

    // Calculate additional monthly savings needed
    if (savingsGapCalc > 0 && yearsUntilRetirement > 0) {
      const monthlyGapCalc = savingsGapCalc / 
        (yearsUntilRetirement * 12) / 
        Math.pow(1 + realReturn / 12, yearsUntilRetirement * 12);
      setMonthlyGap(monthlyGapCalc);
    } else {
      setMonthlyGap(0);
    }
  };

  // Chart for savings projection
  const getSavingsProjectionChart = () => {
    return {
      title: {
        text: 'Retirement Savings Projection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0].data;
          return `Age ${data[0]}: $${data[1].toLocaleString()}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Age',
        nameLocation: 'middle',
        nameGap: 30,
        min: currentAge,
        max: retirementAge
      },
      yAxis: {
        type: 'value',
        name: 'Savings ($)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`
        }
      },
      series: [
        {
          data: timelineData.map(point => [point.age, point.savings]),
          type: 'line',
          smooth: true,
          name: 'Projected Savings',
          lineStyle: {
            width: 3,
            color: '#4ade80'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(74, 222, 128, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(74, 222, 128, 0.05)'
                }
              ]
            }
          }
        }
      ]
    };
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="font-semibold">Personal Information</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  Enter your personal details and current financial situation
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Retirement Age</label>
              <input
                type="number"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={currentAge}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Life Expectancy</label>
              <input
                type="number"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={retirementAge}
                max={120}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Savings ($)</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                step={1000}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                step={100}
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="font-semibold">Investment Details</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  Enter your investment return expectations and retirement income needs
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Annual Return (%)</label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                max={20}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Inflation Rate (%)</label>
              <input
                type="number"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                max={10}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Desired Monthly Income ($)</label>
              <input
                type="number"
                value={desiredMonthlyIncome}
                onChange={(e) => setDesiredMonthlyIncome(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                step={100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Expected Monthly Social Security ($)</label>
              <input
                type="number"
                value={socialSecurityIncome}
                onChange={(e) => setSocialSecurityIncome(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min={0}
                step={100}
              />
            </div>
            <button
              onClick={calculateRetirement}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Calculate Retirement Plan
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {projectedSavings > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ${totalSavingsNeeded.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Total Savings Needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ${projectedSavings.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Projected Savings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ${savingsGap.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Savings Gap</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  ${monthlyGap.toLocaleString()}
                </div>
                <p className="text-sm text-gray-500">Additional Monthly Savings Needed</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ReactECharts option={getSavingsProjectionChart()} style={{ height: '100%' }} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
