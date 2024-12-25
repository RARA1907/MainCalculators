'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NumberSequenceCalculator() {
  const [numbers, setNumbers] = useState<string>('');
  const [sequenceType, setSequenceType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [result, setResult] = useState<{
    nextTerm: number;
    commonDifference?: number;
    commonRatio?: number;
    sequence: number[];
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculateSequence = () => {
    try {
      setError('');
      const sequence = numbers
        .split(',')
        .map(num => num.trim())
        .filter(num => num !== '')
        .map(num => {
          const parsed = parseFloat(num);
          if (isNaN(parsed)) throw new Error('Please enter valid numbers');
          return parsed;
        });

      if (sequence.length < 2) {
        throw new Error('Please enter at least 2 numbers');
      }

      if (sequenceType === 'arithmetic') {
        const differences = sequence.slice(1).map((num, i) => num - sequence[i]);
        const isArithmetic = differences.every(diff => Math.abs(diff - differences[0]) < 0.0001);
        
        if (!isArithmetic) {
          throw new Error('The numbers do not form an arithmetic sequence');
        }

        const commonDifference = differences[0];
        const nextTerm = sequence[sequence.length - 1] + commonDifference;

        setResult({
          nextTerm,
          commonDifference,
          sequence: [...sequence, nextTerm],
        });
      } else {
        const ratios = sequence.slice(1).map((num, i) => num / sequence[i]);
        const isGeometric = ratios.every(ratio => Math.abs(ratio - ratios[0]) < 0.0001);

        if (!isGeometric) {
          throw new Error('The numbers do not form a geometric sequence');
        }

        const commonRatio = ratios[0];
        const nextTerm = sequence[sequence.length - 1] * commonRatio;

        setResult({
          nextTerm,
          commonRatio,
          sequence: [...sequence, nextTerm],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Number Sequence Calculator</h1>
          <p className="text-muted-foreground text-center mt-2">
            Calculate the next term in arithmetic or geometric sequences
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sequence-type">Sequence Type</Label>
            <Select
              value={sequenceType}
              onValueChange={(value: 'arithmetic' | 'geometric') => setSequenceType(value)}
            >
              <SelectTrigger id="sequence-type">
                <SelectValue placeholder="Select sequence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arithmetic">Arithmetic Sequence</SelectItem>
                <SelectItem value="geometric">Geometric Sequence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numbers">Enter numbers (comma-separated)</Label>
            <Input
              id="numbers"
              placeholder="e.g., 2, 4, 6, 8"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
          </div>

          <Button onClick={calculateSequence} className="w-full">
            Calculate Next Term
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2 pt-4">
              <div className="text-lg font-medium">Results:</div>
              <div>
                <span className="font-medium">Sequence: </span>
                {result.sequence.join(', ')}
              </div>
              <div>
                <span className="font-medium">Next Term: </span>
                {result.nextTerm}
              </div>
              {sequenceType === 'arithmetic' && result.commonDifference !== undefined && (
                <div>
                  <span className="font-medium">Common Difference: </span>
                  {result.commonDifference}
                </div>
              )}
              {sequenceType === 'geometric' && result.commonRatio !== undefined && (
                <div>
                  <span className="font-medium">Common Ratio: </span>
                  {result.commonRatio}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
