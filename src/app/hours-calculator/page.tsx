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

const breadcrumbItems = [
  {
    label: 'Hours Calculator',
    href: '/hours-calculator',
  },
];

export default function HoursCalculator() {
  const [hours1, setHours1] = useState('');
  const [hours2, setHours2] = useState('');
  const [operation, setOperation] = useState('add');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const calculateHours = () => {
    try {
      setError('');
      if (!hours1) {
        throw new Error('Please enter the first hours value');
      }

      const hours1Num = parseFloat(hours1);
      let resultValue: number;

      if (operation === 'difference') {
        if (!hours2) {
          throw new Error('Please enter both hours for difference calculation');
        }
        const hours2Num = parseFloat(hours2);
        resultValue = Math.abs(hours2Num - hours1Num);
      } else {
        if (!hours2) {
          throw new Error('Please enter both hours values');
        }
        const hours2Num = parseFloat(hours2);
        resultValue = operation === 'add' ? hours1Num + hours2Num : hours1Num - hours2Num;
      }

      // Format the result to handle decimal places
      setResult(resultValue.toFixed(2));
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Hours Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Add, subtract, or find the difference between hours
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Calculator</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="hours1">
                    Hours 1 (Enter the first value)
                  </Label>
                  <Input
                    id="hours1"
                    type="number"
                    step="0.01"
                    value={hours1}
                    onChange={(e) => setHours1(e.target.value)}
                    placeholder="0.00"
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
                      <SelectItem value="difference">Difference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="hours2">
                    Hours 2 (Enter the second value)
                  </Label>
                  <Input
                    id="hours2"
                    type="number"
                    step="0.01"
                    value={hours2}
                    onChange={(e) => setHours2(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <Button onClick={calculateHours} className="w-full">
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
              <div className="space-y-4">
                {result !== null && (
                  <div>
                    <p className="text-lg font-medium">Result:</p>
                    <p className="text-2xl font-bold">{result} hours</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-background md:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Hours Calculation Guide</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Enter the first hours value in the "Hours 1" field</li>
                    <li>Select the operation you want to perform (Add, Subtract, or find the Difference)</li>
                    <li>Enter the second hours value in the "Hours 2" field</li>
                    <li>Click "Calculate" to see the result</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Features:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Add two hour values together</li>
                    <li>Subtract one hour value from another</li>
                    <li>Find the absolute difference between two hour values</li>
                    <li>Support for decimal hours (e.g., 1.5 hours = 1 hour and 30 minutes)</li>
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
