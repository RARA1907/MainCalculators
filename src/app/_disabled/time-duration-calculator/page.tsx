'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const breadcrumbItems = [
  {
    label: 'Time Duration Calculator',
    href: '/time-duration-calculator',
  },
];

const TIME_UNITS = [
  { value: 'seconds', label: 'Seconds' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
] as const;

type TimeUnit = typeof TIME_UNITS[number]['value'];

const CONVERSION_FACTORS: Record<TimeUnit, Record<TimeUnit, number>> = {
  seconds: {
    seconds: 1,
    minutes: 1/60,
    hours: 1/3600,
    days: 1/86400,
    weeks: 1/604800,
  },
  minutes: {
    seconds: 60,
    minutes: 1,
    hours: 1/60,
    days: 1/1440,
    weeks: 1/10080,
  },
  hours: {
    seconds: 3600,
    minutes: 60,
    hours: 1,
    days: 1/24,
    weeks: 1/168,
  },
  days: {
    seconds: 86400,
    minutes: 1440,
    hours: 24,
    days: 1,
    weeks: 1/7,
  },
  weeks: {
    seconds: 604800,
    minutes: 10080,
    hours: 168,
    days: 7,
    weeks: 1,
  },
};

export default function TimeDurationCalculator() {
  // Time Difference Calculator state
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [diffResult, setDiffResult] = useState<string | null>(null);
  
  // Time Unit Converter state
  const [amount, setAmount] = useState('');
  const [fromUnit, setFromUnit] = useState<TimeUnit>('hours');
  const [toUnit, setToUnit] = useState<TimeUnit>('minutes');
  const [convertResult, setConvertResult] = useState<string | null>(null);
  
  const [error, setError] = useState('');

  const calculateTimeDifference = () => {
    try {
      setError('');
      if (!startTime || !endTime) {
        throw new Error('Please enter both start and end times');
      }

      // Create Date objects using a base date
      const baseDate = new Date('2000-01-01');
      const start = new Date(`${baseDate.toDateString()} ${startTime}`);
      const end = new Date(`${baseDate.toDateString()} ${endTime}`);

      // Calculate the difference in milliseconds
      let diff = end.getTime() - start.getTime();
      
      // If end time is earlier than start time, add 24 hours
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000;
      }

      // Convert to hours and minutes
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDiffResult(`${hours}h ${minutes}m ${seconds}s`);
    } catch (err: any) {
      setError(err.message);
      setDiffResult(null);
    }
  };

  const convertTimeUnit = () => {
    try {
      setError('');
      if (!amount) {
        throw new Error('Please enter an amount to convert');
      }

      const inputAmount = parseFloat(amount);
      if (isNaN(inputAmount)) {
        throw new Error('Please enter a valid number');
      }

      const factor = CONVERSION_FACTORS[fromUnit][toUnit];
      const result = inputAmount * factor;

      // Format the result based on the size
      let formattedResult: string;
      if (result >= 1000000 || result < 0.01) {
        formattedResult = result.toExponential(2);
      } else {
        formattedResult = result.toFixed(2);
      }

      setConvertResult(`${formattedResult} ${toUnit}`);
    } catch (err: any) {
      setError(err.message);
      setConvertResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Time Duration Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate time differences and convert between time units
          </p>
        </div>

        <Tabs defaultValue="difference">
          <TabsList>
            <TabsTrigger value="difference">Time Difference</TabsTrigger>
            <TabsTrigger value="converter">Time Unit Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="difference">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Time Difference Calculator */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Calculate Time Difference</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        step="1"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        step="1"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>

                    <Button onClick={calculateTimeDifference} className="w-full">
                      Calculate Difference
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Time Difference Results */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Time Difference</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {diffResult && (
                      <div>
                        <p className="text-lg font-medium">Duration:</p>
                        <p className="text-2xl font-bold mt-2">{diffResult}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="converter">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Time Unit Converter */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Convert Time Units</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="fromUnit">From</Label>
                      <Select value={fromUnit} onValueChange={(value) => setFromUnit(value as TimeUnit)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="toUnit">To</Label>
                      <Select value={toUnit} onValueChange={(value) => setToUnit(value as TimeUnit)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_UNITS.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={convertTimeUnit} className="w-full">
                      Convert
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Results */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Conversion Result</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {convertResult && (
                      <div>
                        <p className="text-lg font-medium">Result:</p>
                        <p className="text-2xl font-bold mt-2">{convertResult}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Help Section */}
          <Card className="bg-background mt-6">
            <CardHeader>
              <h2 className="text-2xl font-semibold">How to Use</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Time Difference Calculator:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Enter the start time</li>
                    <li>Enter the end time</li>
                    <li>Get the duration in hours, minutes, and seconds</li>
                    <li>Works across midnight (e.g., 11:00 PM to 1:00 AM)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Time Unit Converter:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Enter the amount to convert</li>
                    <li>Select the source unit (convert from)</li>
                    <li>Select the target unit (convert to)</li>
                    <li>Supports seconds, minutes, hours, days, and weeks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
