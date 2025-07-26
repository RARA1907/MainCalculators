'use client';

import { useState, useEffect } from 'react';
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
import ReactECharts from 'echarts-for-react';

interface DateDifference {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  weekdays: number;
  weekends: number;
}

interface DateCalculation {
  operation: 'add' | 'subtract';
  years: number;
  months: number;
  days: number;
  result: string;
}

export default function DateCalculator() {
  const breadcrumbItems = [
    {
      label: 'Date Calculator',
      href: '/date-calculator'
    }
  ];

  // Date difference calculation
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dateDifference, setDateDifference] = useState<DateDifference>({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
    weekdays: 0,
    weekends: 0
  });

  // Date arithmetic
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [yearsToAdd, setYearsToAdd] = useState<number>(0);
  const [monthsToAdd, setMonthsToAdd] = useState<number>(0);
  const [daysToAdd, setDaysToAdd] = useState<number>(0);
  const [resultDate, setResultDate] = useState<string>('');

  // Calculation history
  const [calculationHistory, setCalculationHistory] = useState<DateCalculation[]>([]);

  // Calculate date difference
  const calculateDateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate weekdays and weekends
    let weekdays = 0;
    let weekends = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const day = currentDate.getDay();
      if (day === 0 || day === 6) {
        weekends++;
      } else {
        weekdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate years, months, and remaining days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    setDateDifference({
      years,
      months,
      days,
      totalDays,
      weekdays,
      weekends
    });
  };

  // Calculate new date
  const calculateNewDate = () => {
    const date = new Date(baseDate);
    
    if (operation === 'add') {
      date.setFullYear(date.getFullYear() + yearsToAdd);
      date.setMonth(date.getMonth() + monthsToAdd);
      date.setDate(date.getDate() + daysToAdd);
    } else {
      date.setFullYear(date.getFullYear() - yearsToAdd);
      date.setMonth(date.getMonth() - monthsToAdd);
      date.setDate(date.getDate() - daysToAdd);
    }

    const result = date.toISOString().split('T')[0];
    setResultDate(result);

    // Add to history
    const calculation: DateCalculation = {
      operation,
      years: yearsToAdd,
      months: monthsToAdd,
      days: daysToAdd,
      result
    };
    setCalculationHistory(prev => [calculation, ...prev.slice(0, 9)]);
  };

  // Get day of week
  const getDayOfWeek = (dateString: string): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    calculateDateDifference();
  }, [startDate, endDate]);

  useEffect(() => {
    calculateNewDate();
  }, [baseDate, operation, yearsToAdd, monthsToAdd, daysToAdd]);

  // Chart for weekday distribution
  const getWeekdayDistributionChart = () => {
    return {
      title: {
        text: 'Weekday Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} days ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 30
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: dateDifference.weekdays, name: 'Weekdays' },
          { value: dateDifference.weekends, name: 'Weekends' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Date Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Difference Calculator */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Date Difference</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <span className="text-sm text-gray-500 mt-1">
                    {formatDate(startDate)} ({getDayOfWeek(startDate)})
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Date</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <span className="text-sm text-gray-500 mt-1">
                    {formatDate(endDate)} ({getDayOfWeek(endDate)})
                  </span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Years</div>
                    <div className="stat-value text-lg">{dateDifference.years}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Months</div>
                    <div className="stat-value text-lg">{dateDifference.months}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Days</div>
                    <div className="stat-value text-lg">{dateDifference.days}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Days</div>
                    <div className="stat-value text-lg">{dateDifference.totalDays}</div>
                  </div>
                </div>

                <div>
                  <ReactECharts option={getWeekdayDistributionChart()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Arithmetic */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Date Arithmetic</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Base Date</span>
                    </label>
                    <input
                      type="date"
                      value={baseDate}
                      onChange={(e) => setBaseDate(e.target.value)}
                      className="input input-bordered w-full"
                    />
                    <span className="text-sm text-gray-500 mt-1">
                      {formatDate(baseDate)} ({getDayOfWeek(baseDate)})
                    </span>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Operation</span>
                    </label>
                    <select
                      value={operation}
                      onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')}
                      className="select select-bordered w-full"
                    >
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Years</span>
                      </label>
                      <input
                        type="number"
                        value={yearsToAdd}
                        onChange={(e) => setYearsToAdd(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Months</span>
                      </label>
                      <input
                        type="number"
                        value={monthsToAdd}
                        onChange={(e) => setMonthsToAdd(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Days</span>
                      </label>
                      <input
                        type="number"
                        value={daysToAdd}
                        onChange={(e) => setDaysToAdd(Number(e.target.value))}
                        className="input input-bordered w-full"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="bg-base-200 p-4 rounded-lg">
                    <div className="font-semibold">Result:</div>
                    <div className="text-lg mt-1">
                      {formatDate(resultDate)} ({getDayOfWeek(resultDate)})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation History */}
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recent Calculations</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {calculationHistory.map((calc, index) => (
                    <div key={index} className="bg-base-200 p-3 rounded-lg">
                      <div className="text-sm">
                        {calc.operation === 'add' ? 'Added' : 'Subtracted'}{' '}
                        {calc.years > 0 && `${calc.years} years`}{' '}
                        {calc.months > 0 && `${calc.months} months`}{' '}
                        {calc.days > 0 && `${calc.days} days`}
                      </div>
                      <div className="font-semibold mt-1">
                        Result: {formatDate(calc.result)}
                      </div>
                    </div>
                  ))}
                  {calculationHistory.length === 0 && (
                    <p className="text-gray-500">No recent calculations</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Date Calculation Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Dates are calculated inclusive of start and end dates</li>
                        <li>Weekends are counted as Saturday and Sunday</li>
                        <li>Month calculations account for varying month lengths</li>
                        <li>Leap years are automatically handled</li>
                        <li>History saves your last 10 calculations</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
