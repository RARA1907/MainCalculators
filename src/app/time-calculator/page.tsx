'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { format, addHours, addMinutes, subHours, subMinutes, differenceInMinutes, differenceInHours } from 'date-fns';
import { formatInTimeZone, getTimezoneOffset } from 'date-fns-tz';

const breadcrumbItems = [
  {
    label: 'Time Calculator',
    href: '/time-calculator',
  },
];

// Common timezone list
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
].sort();

export default function TimeCalculator() {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [operation, setOperation] = useState('add');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [result, setResult] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('UTC');
  const [convertedTime, setConvertedTime] = useState<Date | null>(null);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateTime = () => {
    try {
      setError('');
      let baseTime: Date;

      if (operation === 'difference') {
        if (!time1 || !time2) {
          throw new Error('Please enter both times for difference calculation');
        }
        const date1 = new Date(`2000-01-01T${time1}`);
        const date2 = new Date(`2000-01-01T${time2}`);
        
        const diffMinutes = differenceInMinutes(date2, date1);
        const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
        const remainingMinutes = Math.abs(diffMinutes) % 60;
        
        setResult(new Date(2000, 0, 1, diffHours, remainingMinutes));
        return;
      }

      if (!time1) {
        throw new Error('Please enter the base time');
      }

      baseTime = new Date(`2000-01-01T${time1}`);
      const hoursNum = parseInt(hours) || 0;
      const minutesNum = parseInt(minutes) || 0;

      let resultTime: Date;
      if (operation === 'add') {
        resultTime = addMinutes(addHours(baseTime, hoursNum), minutesNum);
      } else {
        resultTime = subMinutes(subHours(baseTime, hoursNum), minutesNum);
      }

      setResult(resultTime);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const convertTimezone = () => {
    try {
      setError('');
      if (!time1) {
        throw new Error('Please enter the time to convert');
      }

      const baseTime = new Date(`2000-01-01T${time1}`);
      const sourceOffset = getTimezoneOffset(sourceTimezone, baseTime);
      const targetOffset = getTimezoneOffset(targetTimezone, baseTime);
      const offsetDiff = targetOffset - sourceOffset;
      
      const convertedDate = new Date(baseTime.getTime() + offsetDiff);
      setConvertedTime(convertedDate);
    } catch (err: any) {
      setError(err.message);
      setConvertedTime(null);
    }
  };

  const formatTimeResult = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'HH:mm:ss');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Time Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate time differences, add or subtract time, and convert between time zones
          </p>
        </div>

        <Tabs defaultValue="calculator">
          <TabsList>
            <TabsTrigger value="calculator">Time Calculator</TabsTrigger>
            <TabsTrigger value="timezone">Timezone Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calculator Section */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Calculator</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="time1">
                        Time 1 (Enter the base time)
                      </Label>
                      <Input
                        id="time1"
                        type="time"
                        step="1"
                        value={time1}
                        onChange={(e) => setTime1(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="operation">Operation</Label>
                      <Select value={operation} onValueChange={setOperation}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="add">Add</SelectItem>
                          <SelectItem value="subtract">Subtract</SelectItem>
                          <SelectItem value="difference">Time Difference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {operation === 'difference' ? (
                      <div className="grid gap-1.5">
                        <Label htmlFor="time2">Time 2</Label>
                        <Input
                          id="time2"
                          type="time"
                          step="1"
                          value={time2}
                          onChange={(e) => setTime2(e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-1.5">
                          <Label htmlFor="hours">Hours</Label>
                          <Input
                            id="hours"
                            type="number"
                            min="0"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                          />
                        </div>

                        <div className="grid gap-1.5">
                          <Label htmlFor="minutes">Minutes</Label>
                          <Input
                            id="minutes"
                            type="number"
                            min="0"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <Button onClick={calculateTime} className="w-full">
                      Calculate
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Results</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <Clock value={result || currentTime} size={200} />
                    </div>

                    {result && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">
                          {operation === 'difference' ? 'Time Difference' : 'Result Time'}
                        </div>
                        <div className="mt-1">
                          <div className="text-2xl font-bold">
                            {formatTimeResult(result)}
                          </div>
                          {operation === 'difference' && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {`${format(result, 'H')} hours and ${format(result, 'm')} minutes`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timezone">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Timezone Converter Section */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Timezone Converter</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="sourceTime">Source Time</Label>
                      <Input
                        id="sourceTime"
                        type="time"
                        step="1"
                        value={time1}
                        onChange={(e) => setTime1(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="sourceTimezone">From Timezone</Label>
                      <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="targetTimezone">To Timezone</Label>
                      <Select value={targetTimezone} onValueChange={setTargetTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={convertTimezone} className="w-full">
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

              {/* Timezone Results Section */}
              <Card className="bg-background">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Converted Time</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <Clock value={convertedTime || currentTime} size={200} />
                    </div>

                    {convertedTime && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm font-medium text-muted-foreground">
                          Time in {targetTimezone}
                        </div>
                        <div className="mt-1">
                          <div className="text-2xl font-bold">
                            {formatTimeResult(convertedTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="bg-background">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Time Calculation Guide</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Time Calculator</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Add or subtract hours/minutes</li>
                  <li>Calculate time differences</li>
                  <li>Visual clock representation</li>
                  <li>Precise to the second</li>
                  <li>24-hour format support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Timezone Converter</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Convert between timezones</li>
                  <li>Major cities supported</li>
                  <li>Daylight saving aware</li>
                  <li>UTC reference time</li>
                  <li>Real-time updates</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Meeting scheduling</li>
                  <li>Travel planning</li>
                  <li>Project deadlines</li>
                  <li>Event timing</li>
                  <li>International coordination</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
