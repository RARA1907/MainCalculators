'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Calculator } from 'lucide-react';

interface ConversionResult {
  bits: number;
  bytes: number;
  kilobits: number;
  kilobytes: number;
  megabits: number;
  megabytes: number;
  gigabits: number;
  gigabytes: number;
  terabits: number;
  terabytes: number;
}

export default function BandwidthCalculator() {
  const breadcrumbItems = [
    {
      label: 'Bandwidth Calculator',
      href: '/bandwidth-calculator',
    },
  ];

  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<string>('mbps');
  const [time, setTime] = useState<string>('1');
  const [timeUnit, setTimeUnit] = useState<string>('hour');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const calculateBandwidth = () => {
    if (!value || isNaN(Number(value))) {
      return;
    }

    const numValue = Number(value);
    let bitsPerSecond: number;

    // Convert input to bits per second
    switch (unit) {
      case 'bps':
        bitsPerSecond = numValue;
        break;
      case 'kbps':
        bitsPerSecond = numValue * 1000;
        break;
      case 'mbps':
        bitsPerSecond = numValue * 1000000;
        break;
      case 'gbps':
        bitsPerSecond = numValue * 1000000000;
        break;
      case 'tbps':
        bitsPerSecond = numValue * 1000000000000;
        break;
      default:
        bitsPerSecond = 0;
    }

    // Calculate time in seconds
    let timeInSeconds: number;
    switch (timeUnit) {
      case 'second':
        timeInSeconds = Number(time);
        break;
      case 'minute':
        timeInSeconds = Number(time) * 60;
        break;
      case 'hour':
        timeInSeconds = Number(time) * 3600;
        break;
      case 'day':
        timeInSeconds = Number(time) * 86400;
        break;
      case 'week':
        timeInSeconds = Number(time) * 604800;
        break;
      case 'month':
        timeInSeconds = Number(time) * 2592000; // Assuming 30 days
        break;
      default:
        timeInSeconds = 0;
    }

    const totalBits = bitsPerSecond * timeInSeconds;

    setResult({
      bits: totalBits,
      bytes: totalBits / 8,
      kilobits: totalBits / 1000,
      kilobytes: totalBits / 8000,
      megabits: totalBits / 1000000,
      megabytes: totalBits / 8000000,
      gigabits: totalBits / 1000000000,
      gigabytes: totalBits / 8000000000,
      terabits: totalBits / 1000000000000,
      terabytes: totalBits / 8000000000000,
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + ' T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + ' G';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + ' M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + ' K';
    }
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold mt-4">Bandwidth Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate network bandwidth and convert between different units
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Calculate Bandwidth</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Bandwidth
                    </label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter value"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Unit</label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bps">bps</SelectItem>
                        <SelectItem value="kbps">Kbps</SelectItem>
                        <SelectItem value="mbps">Mbps</SelectItem>
                        <SelectItem value="gbps">Gbps</SelectItem>
                        <SelectItem value="tbps">Tbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Time
                    </label>
                    <Input
                      type="number"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="Enter time"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Time Unit
                    </label>
                    <Select value={timeUnit} onValueChange={setTimeUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="second">Second</SelectItem>
                        <SelectItem value="minute">Minute</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={calculateBandwidth}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-4">Bits</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Bits:</span>
                        <span>{formatNumber(result.bits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kilobits:</span>
                        <span>{formatNumber(result.kilobits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Megabits:</span>
                        <span>{formatNumber(result.megabits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gigabits:</span>
                        <span>{formatNumber(result.gigabits)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Terabits:</span>
                        <span>{formatNumber(result.terabits)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Bytes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Bytes:</span>
                        <span>{formatNumber(result.bytes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kilobytes:</span>
                        <span>{formatNumber(result.kilobytes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Megabytes:</span>
                        <span>{formatNumber(result.megabytes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gigabytes:</span>
                        <span>{formatNumber(result.gigabytes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Terabytes:</span>
                        <span>{formatNumber(result.terabytes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Enter values and click Calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
