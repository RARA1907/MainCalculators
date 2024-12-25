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

type CalculationType = 'basic' | 'combination' | 'permutation' | 'conditional';

export default function ProbabilityCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('basic');
  const [n, setN] = useState<string>('');
  const [r, setR] = useState<string>('');
  const [probabilityA, setProbabilityA] = useState<string>('');
  const [probabilityB, setProbabilityB] = useState<string>('');
  const [result, setResult] = useState<{ value: number; explanation: string } | null>(null);
  const [error, setError] = useState<string>('');

  const factorial = (num: number): number => {
    if (num === 0 || num === 1) return 1;
    return num * factorial(num - 1);
  };

  const calculateCombination = (n: number, r: number): number => {
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const calculatePermutation = (n: number, r: number): number => {
    return factorial(n) / factorial(n - r);
  };

  const calculate = () => {
    try {
      setError('');
      let value: number;
      let explanation: string;

      switch (calculationType) {
        case 'combination':
          const nComb = parseInt(n);
          const rComb = parseInt(r);
          
          if (isNaN(nComb) || isNaN(rComb) || nComb < 0 || rComb < 0) {
            throw new Error('Please enter valid positive numbers');
          }
          if (rComb > nComb) {
            throw new Error('r cannot be greater than n');
          }
          
          value = calculateCombination(nComb, rComb);
          explanation = `Number of ways to choose ${rComb} items from ${nComb} items where order doesn't matter`;
          break;

        case 'permutation':
          const nPerm = parseInt(n);
          const rPerm = parseInt(r);
          
          if (isNaN(nPerm) || isNaN(rPerm) || nPerm < 0 || rPerm < 0) {
            throw new Error('Please enter valid positive numbers');
          }
          if (rPerm > nPerm) {
            throw new Error('r cannot be greater than n');
          }
          
          value = calculatePermutation(nPerm, rPerm);
          explanation = `Number of ways to arrange ${rPerm} items from ${nPerm} items where order matters`;
          break;

        case 'basic':
          const probA = parseFloat(probabilityA);
          
          if (isNaN(probA) || probA < 0 || probA > 1) {
            throw new Error('Probability must be between 0 and 1');
          }
          
          value = probA;
          explanation = `Simple probability: ${(probA * 100).toFixed(2)}%`;
          break;

        case 'conditional':
          const probAC = parseFloat(probabilityA);
          const probB = parseFloat(probabilityB);
          
          if (isNaN(probAC) || isNaN(probB) || probAC < 0 || probAC > 1 || probB < 0 || probB > 1) {
            throw new Error('Probabilities must be between 0 and 1');
          }
          
          value = probAC * probB;
          explanation = `P(A and B) = P(A) × P(B) = ${(value * 100).toFixed(2)}%`;
          break;

        default:
          throw new Error('Invalid calculation type');
      }

      setResult({ value, explanation });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Probability Calculator</h1>
          <p className="text-muted-foreground text-center mt-2">
            Calculate combinations, permutations, and probabilities
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calculation-type">Calculation Type</Label>
            <Select
              value={calculationType}
              onValueChange={(value: CalculationType) => {
                setCalculationType(value);
                setResult(null);
                setError('');
              }}
            >
              <SelectTrigger id="calculation-type">
                <SelectValue placeholder="Select calculation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Probability</SelectItem>
                <SelectItem value="combination">Combination (nCr)</SelectItem>
                <SelectItem value="permutation">Permutation (nPr)</SelectItem>
                <SelectItem value="conditional">Conditional Probability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(calculationType === 'combination' || calculationType === 'permutation') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="n">Total Items (n)</Label>
                <Input
                  id="n"
                  type="number"
                  placeholder="Enter total number of items"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r">Selected Items (r)</Label>
                <Input
                  id="r"
                  type="number"
                  placeholder="Enter number of items to select"
                  value={r}
                  onChange={(e) => setR(e.target.value)}
                />
              </div>
            </>
          )}

          {(calculationType === 'basic') && (
            <div className="space-y-2">
              <Label htmlFor="prob-a">Probability</Label>
              <Input
                id="prob-a"
                type="number"
                placeholder="Enter probability (0-1)"
                value={probabilityA}
                onChange={(e) => setProbabilityA(e.target.value)}
                step="0.01"
                min="0"
                max="1"
              />
            </div>
          )}

          {calculationType === 'conditional' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prob-a">Probability of A</Label>
                <Input
                  id="prob-a"
                  type="number"
                  placeholder="Enter P(A) (0-1)"
                  value={probabilityA}
                  onChange={(e) => setProbabilityA(e.target.value)}
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prob-b">Probability of B</Label>
                <Input
                  id="prob-b"
                  type="number"
                  placeholder="Enter P(B) (0-1)"
                  value={probabilityB}
                  onChange={(e) => setProbabilityB(e.target.value)}
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
            </>
          )}

          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2 pt-4">
              <div className="text-lg font-medium">Result:</div>
              <div className="text-xl font-bold">{result.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{result.explanation}</div>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2 mt-4">
            <p><strong>Definitions:</strong></p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Combination (nCr): Order doesn't matter (e.g., selecting team members)</li>
              <li>Permutation (nPr): Order matters (e.g., ranking contestants)</li>
              <li>Basic Probability: Simple probability of an event occurring</li>
              <li>Conditional Probability: Probability of both events A and B occurring</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
