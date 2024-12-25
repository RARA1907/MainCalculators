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

export default function SampleSizeCalculator() {
  const [populationSize, setPopulationSize] = useState<string>('');
  const [confidenceLevel, setConfidenceLevel] = useState<string>('95');
  const [marginOfError, setMarginOfError] = useState<string>('5');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calculateSampleSize = () => {
    try {
      setError('');
      
      // Validate inputs
      const population = parseInt(populationSize);
      const margin = parseFloat(marginOfError);
      const confidence = parseFloat(confidenceLevel);

      if (isNaN(population) || population <= 0) {
        throw new Error('Please enter a valid population size');
      }
      if (isNaN(margin) || margin <= 0 || margin >= 100) {
        throw new Error('Margin of error must be between 0 and 100');
      }
      if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
        throw new Error('Confidence level must be between 0 and 100');
      }

      // Z-score values for common confidence levels
      const zScores: { [key: string]: number } = {
        '80': 1.28,
        '85': 1.44,
        '90': 1.645,
        '95': 1.96,
        '99': 2.576
      };

      const z = zScores[confidenceLevel] || 1.96; // Default to 95% confidence level
      const p = 0.5; // Use 0.5 for maximum sample size

      // Calculate sample size using the formula
      const numerator = Math.pow(z, 2) * p * (1 - p) * population;
      const denominator = Math.pow(margin / 100, 2) * (population - 1) + Math.pow(z, 2) * p * (1 - p);
      const sampleSize = Math.ceil(numerator / denominator);

      setResult(sampleSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Sample Size Calculator</h1>
          <p className="text-muted-foreground text-center mt-2">
            Calculate the required sample size for your research or survey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="population-size">Population Size</Label>
            <Input
              id="population-size"
              type="number"
              placeholder="e.g., 1000"
              value={populationSize}
              onChange={(e) => setPopulationSize(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence-level">Confidence Level (%)</Label>
            <Select
              value={confidenceLevel}
              onValueChange={setConfidenceLevel}
            >
              <SelectTrigger id="confidence-level">
                <SelectValue placeholder="Select confidence level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="80">80%</SelectItem>
                <SelectItem value="85">85%</SelectItem>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
                <SelectItem value="99">99%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin-error">Margin of Error (%)</Label>
            <Input
              id="margin-error"
              type="number"
              placeholder="e.g., 5"
              value={marginOfError}
              onChange={(e) => setMarginOfError(e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <Button onClick={calculateSampleSize} className="w-full">
            Calculate Sample Size
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && (
            <div className="space-y-2 pt-4">
              <div className="text-lg font-medium">Results:</div>
              <div>
                <span className="font-medium">Required Sample Size: </span>
                {result.toLocaleString()} samples
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                This calculation assumes a 50/50 split in the population (maximum variability).
                For a more precise calculation, you may need to adjust based on your specific case.
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2 mt-4">
            <p><strong>How to use this calculator:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Enter your total population size</li>
              <li>Select your desired confidence level (typically 95%)</li>
              <li>Enter your acceptable margin of error (typically 5%)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
