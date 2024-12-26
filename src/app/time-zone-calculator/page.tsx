'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const breadcrumbItems = [
  {
    label: 'Time Zone Calculator',
    href: '/time-zone-calculator',
  },
];

// Popular time zones with their UTC offsets and major cities
const TIME_ZONES = [
  {
    value: 'UTC',
    label: 'UTC (Coordinated Universal Time)',
    group: 'UTC'
  },
  {
    value: 'America/New_York',
    label: 'New York (UTC-5)',
    group: 'Americas'
  },
  {
    value: 'America/Los_Angeles',
    label: 'Los Angeles (UTC-8)',
    group: 'Americas'
  },
  {
    value: 'America/Chicago',
    label: 'Chicago (UTC-6)',
    group: 'Americas'
  },
  {
    value: 'America/Toronto',
    label: 'Toronto (UTC-5)',
    group: 'Americas'
  },
  {
    value: 'Europe/London',
    label: 'London (UTC+0)',
    group: 'Europe'
  },
  {
    value: 'Europe/Paris',
    label: 'Paris (UTC+1)',
    group: 'Europe'
  },
  {
    value: 'Europe/Berlin',
    label: 'Berlin (UTC+1)',
    group: 'Europe'
  },
  {
    value: 'Europe/Moscow',
    label: 'Moscow (UTC+3)',
    group: 'Europe'
  },
  {
    value: 'Asia/Dubai',
    label: 'Dubai (UTC+4)',
    group: 'Asia'
  },
  {
    value: 'Asia/Singapore',
    label: 'Singapore (UTC+8)',
    group: 'Asia'
  },
  {
    value: 'Asia/Tokyo',
    label: 'Tokyo (UTC+9)',
    group: 'Asia'
  },
  {
    value: 'Asia/Shanghai',
    label: 'Shanghai (UTC+8)',
    group: 'Asia'
  },
  {
    value: 'Australia/Sydney',
    label: 'Sydney (UTC+11)',
    group: 'Pacific'
  },
  {
    value: 'Pacific/Auckland',
    label: 'Auckland (UTC+13)',
    group: 'Pacific'
  }
].sort((a, b) => a.label.localeCompare(b.label));

// Group time zones by region
const GROUPED_TIME_ZONES = TIME_ZONES.reduce((groups, zone) => {
  const group = groups[zone.group] || [];
  group.push(zone);
  groups[zone.group] = group;
  return groups;
}, {} as Record<string, typeof TIME_ZONES>);

export default function TimeZoneCalculator() {
  const [sourceTime, setSourceTime] = useState('');
  const [sourceZone, setSourceZone] = useState('UTC');
  const [targetZone, setTargetZone] = useState('UTC');
  const [convertedTime, setConvertedTime] = useState<string | null>(null);
  const [error, setError] = useState('');

  const convertTime = () => {
    try {
      setError('');
      if (!sourceTime) {
        throw new Error('Please enter a time to convert');
      }

      // Create a date object for today with the input time
      const today = new Date();
      const [hours, minutes] = sourceTime.split(':');
      const sourceDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      // Format the time in target timezone
      const converted = formatInTimeZone(sourceDate, targetZone, 'HH:mm');
      setConvertedTime(converted);
    } catch (err: any) {
      setError(err.message);
      setConvertedTime(null);
    }
  };

  // Get current time in selected timezone
  const getCurrentTime = (timezone: string) => {
    const now = new Date();
    return formatInTimeZone(now, timezone, 'HH:mm');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Time Zone Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Convert times between different time zones around the world
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Convert Time</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="sourceTime">Time</Label>
                  <Input
                    id="sourceTime"
                    type="time"
                    value={sourceTime}
                    onChange={(e) => setSourceTime(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="sourceZone">From Time Zone</Label>
                  <Select value={sourceZone} onValueChange={setSourceZone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.entries(GROUPED_TIME_ZONES).map(([group, zones]) => (
                        <div key={group}>
                          <Label className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {group}
                          </Label>
                          {zones.map((zone) => (
                            <SelectItem key={zone.value} value={zone.value}>
                              {zone.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Current time: {getCurrentTime(sourceZone)}
                  </p>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="targetZone">To Time Zone</Label>
                  <Select value={targetZone} onValueChange={setTargetZone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.entries(GROUPED_TIME_ZONES).map(([group, zones]) => (
                        <div key={group}>
                          <Label className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {group}
                          </Label>
                          {zones.map((zone) => (
                            <SelectItem key={zone.value} value={zone.value}>
                              {zone.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Current time: {getCurrentTime(targetZone)}
                  </p>
                </div>

                <Button onClick={convertTime} className="w-full">
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

          {/* Results Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Converted Time</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {convertedTime && (
                  <div>
                    <p className="text-lg font-medium">When it is {sourceTime} in {TIME_ZONES.find(z => z.value === sourceZone)?.label},</p>
                    <p className="text-2xl font-bold mt-2">it is {convertedTime} in {TIME_ZONES.find(z => z.value === targetZone)?.label}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-background md:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Time Zone Conversion</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Enter the time you want to convert</li>
                    <li>Select the source time zone (where the time is from)</li>
                    <li>Select the target time zone (where you want to convert to)</li>
                    <li>Click "Convert" to see the result</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Features:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Convert times between major cities worldwide</li>
                    <li>See current times in selected time zones</li>
                    <li>Grouped time zones by region for easy selection</li>
                    <li>Support for daylight saving time adjustments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
