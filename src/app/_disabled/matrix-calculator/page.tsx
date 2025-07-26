'use client';

import { useState } from 'react';
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

interface CalculationMode {
  id: string;
  name: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  {
    id: 'add',
    name: 'Addition',
    description: 'Add two matrices',
  },
  {
    id: 'subtract',
    name: 'Subtraction',
    description: 'Subtract two matrices',
  },
  {
    id: 'multiply',
    name: 'Multiplication',
    description: 'Multiply two matrices',
  },
  {
    id: 'determinant',
    name: 'Determinant',
    description: 'Calculate matrix determinant',
  },
  {
    id: 'inverse',
    name: 'Inverse',
    description: 'Find matrix inverse',
  },
  {
    id: 'transpose',
    name: 'Transpose',
    description: 'Transpose matrix',
  },
];

const breadcrumbItems = [
  {
    label: 'Matrix Calculator',
    href: '/matrix-calculator',
  },
];

type Matrix = number[][];

export default function MatrixCalculator() {
  // Calculator state
  const [mode, setMode] = useState<string>('add');
  const [matrixA, setMatrixA] = useState<Matrix>([[0, 0], [0, 0]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[0, 0], [0, 0]]);
  const [rowsA, setRowsA] = useState<number>(2);
  const [colsA, setColsA] = useState<number>(2);
  const [rowsB, setRowsB] = useState<number>(2);
  const [colsB, setColsB] = useState<number>(2);
  const [result, setResult] = useState<Matrix | number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Create empty matrix
  const createEmptyMatrix = (rows: number, cols: number): Matrix => {
    return Array(rows).fill(0).map(() => Array(cols).fill(0));
  };

  // Update matrix dimensions
  const updateMatrixDimensions = (
    matrix: 'A' | 'B',
    newRows: number,
    newCols: number
  ) => {
    const rows = Math.max(1, Math.min(10, newRows));
    const cols = Math.max(1, Math.min(10, newCols));

    if (matrix === 'A') {
      const newMatrix = createEmptyMatrix(rows, cols);
      for (let i = 0; i < Math.min(rows, matrixA.length); i++) {
        for (let j = 0; j < Math.min(cols, matrixA[0].length); j++) {
          newMatrix[i][j] = matrixA[i][j];
        }
      }
      setMatrixA(newMatrix);
      setRowsA(rows);
      setColsA(cols);
    } else {
      const newMatrix = createEmptyMatrix(rows, cols);
      for (let i = 0; i < Math.min(rows, matrixB.length); i++) {
        for (let j = 0; j < Math.min(cols, matrixB[0].length); j++) {
          newMatrix[i][j] = matrixB[i][j];
        }
      }
      setMatrixB(newMatrix);
      setRowsB(rows);
      setColsB(cols);
    }
  };

  // Update matrix cell value
  const updateMatrixCell = (
    matrix: 'A' | 'B',
    row: number,
    col: number,
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (matrix === 'A') {
      const newMatrix = [...matrixA];
      newMatrix[row][col] = numValue;
      setMatrixA(newMatrix);
    } else {
      const newMatrix = [...matrixB];
      newMatrix[row][col] = numValue;
      setMatrixB(newMatrix);
    }
  };

  // Matrix addition
  const addMatrices = (A: Matrix, B: Matrix): Matrix => {
    return A.map((row, i) => row.map((val, j) => val + B[i][j]));
  };

  // Matrix subtraction
  const subtractMatrices = (A: Matrix, B: Matrix): Matrix => {
    return A.map((row, i) => row.map((val, j) => val - B[i][j]));
  };

  // Matrix multiplication
  const multiplyMatrices = (A: Matrix, B: Matrix): Matrix => {
    const result = Array(A.length).fill(0)
      .map(() => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }

    return result;
  };

  // Matrix determinant (2x2 and 3x3)
  const calculateDeterminant = (matrix: Matrix): number => {
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      det += matrix[0][i] * getCofactor(matrix, 0, i);
    }
    return det;
  };

  // Get cofactor for determinant calculation
  const getCofactor = (matrix: Matrix, row: number, col: number): number => {
    const subMatrix = matrix
      .filter((_, index) => index !== row)
      .map(row => row.filter((_, index) => index !== col));
    return Math.pow(-1, row + col) * calculateDeterminant(subMatrix);
  };

  // Matrix inverse (2x2 and 3x3)
  const calculateInverse = (matrix: Matrix): Matrix => {
    const det = calculateDeterminant(matrix);
    if (det === 0) throw new Error('Matrix is not invertible');

    if (matrix.length === 2) {
      return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
      ];
    }

    const cofactorMatrix = matrix.map((row, i) =>
      row.map((_, j) => getCofactor(matrix, i, j))
    );
    const adjugate = transposeMatrix(cofactorMatrix);
    return adjugate.map(row => row.map(val => val / det));
  };

  // Matrix transpose
  const transposeMatrix = (matrix: Matrix): Matrix => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  };

  // Format matrix for display
  const formatMatrix = (matrix: Matrix | number): string => {
    if (typeof matrix === 'number') return matrix.toString();
    return matrix.map(row => row.map(val => 
      Number.isInteger(val) ? val.toString() : val.toFixed(4)
    ).join('\t')).join('\n');
  };

  // Calculate result
  const calculate = () => {
    try {
      let calculatedResult: Matrix | number | null = null;
      const steps: string[] = [];

      switch (mode) {
        case 'add':
          if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error('Matrices must have the same dimensions for addition');
          }
          steps.push('Step 1: Add corresponding elements');
          calculatedResult = addMatrices(matrixA, matrixB);
          break;

        case 'subtract':
          if (rowsA !== rowsB || colsA !== colsB) {
            throw new Error('Matrices must have the same dimensions for subtraction');
          }
          steps.push('Step 1: Subtract corresponding elements');
          calculatedResult = subtractMatrices(matrixA, matrixB);
          break;

        case 'multiply':
          if (colsA !== rowsB) {
            throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
          }
          steps.push('Step 1: Multiply row by column');
          steps.push('Step 2: Sum the products');
          calculatedResult = multiplyMatrices(matrixA, matrixB);
          break;

        case 'determinant':
          if (rowsA !== colsA || rowsA > 3) {
            throw new Error('Matrix must be square (2x2 or 3x3)');
          }
          steps.push('Step 1: Calculate determinant');
          if (rowsA === 2) {
            steps.push('Formula: ad - bc');
          } else {
            steps.push('Formula: a(ei-fh) - b(di-fg) + c(dh-eg)');
          }
          calculatedResult = calculateDeterminant(matrixA);
          break;

        case 'inverse':
          if (rowsA !== colsA || rowsA > 3) {
            throw new Error('Matrix must be square (2x2 or 3x3)');
          }
          steps.push('Step 1: Calculate determinant');
          steps.push('Step 2: Calculate cofactor matrix');
          steps.push('Step 3: Calculate adjugate');
          steps.push('Step 4: Divide by determinant');
          calculatedResult = calculateInverse(matrixA);
          break;

        case 'transpose':
          steps.push('Step 1: Swap rows and columns');
          calculatedResult = transposeMatrix(matrixA);
          break;
      }

      setResult(calculatedResult);
      setSteps(steps);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
      setSteps([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Matrix Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {calculationModes.map((calcMode) => (
                    <button
                      key={calcMode.id}
                      onClick={() => {
                        setMode(calcMode.id);
                        setResult(null);
                        setSteps([]);
                        setError('');
                      }}
                      className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:scale-105 ${
                        mode === calcMode.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">{calcMode.name}</div>
                      <div className="text-sm opacity-90">{calcMode.description}</div>
                    </button>
                  ))}
                </div>

                {/* Matrix A */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold">Matrix A</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={rowsA}
                        onChange={(e) => updateMatrixDimensions('A', parseInt(e.target.value), colsA)}
                        className="input input-bordered w-20"
                        min="1"
                        max="10"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        value={colsA}
                        onChange={(e) => updateMatrixDimensions('A', rowsA, parseInt(e.target.value))}
                        className="input input-bordered w-20"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colsA}, minmax(0, 1fr))` }}>
                    {matrixA.map((row, i) =>
                      row.map((val, j) => (
                        <input
                          key={`A-${i}-${j}`}
                          type="number"
                          value={val || ''}
                          onChange={(e) => updateMatrixCell('A', i, j, e.target.value)}
                          className="input input-bordered w-full"
                          step="any"
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Matrix B (for operations that need it) */}
                {['add', 'subtract', 'multiply'].includes(mode) && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-semibold">Matrix B</h3>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={rowsB}
                          onChange={(e) => updateMatrixDimensions('B', parseInt(e.target.value), colsB)}
                          className="input input-bordered w-20"
                          min="1"
                          max="10"
                        />
                        <span>×</span>
                        <input
                          type="number"
                          value={colsB}
                          onChange={(e) => updateMatrixDimensions('B', rowsB, parseInt(e.target.value))}
                          className="input input-bordered w-20"
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colsB}, minmax(0, 1fr))` }}>
                      {matrixB.map((row, i) =>
                        row.map((val, j) => (
                          <input
                            key={`B-${i}-${j}`}
                            type="number"
                            value={val || ''}
                            onChange={(e) => updateMatrixCell('B', i, j, e.target.value)}
                            className="input input-bordered w-full"
                            step="any"
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={calculate}
                  className="btn w-full bg-[#0EA5E9] hover:bg-blue-600 text-white"
                >
                  Calculate
                </button>

                {error && (
                  <div className="text-error text-sm mt-2">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              {result !== null && (
                <div className="space-y-6">
                  {/* Results Summary */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Result</h3>
                    <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                      {formatMatrix(result)}
                    </pre>
                  </div>

                  {/* Step by Step Solution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Step by Step Solution</h3>
                    <div className="bg-base-200 p-4 rounded-lg space-y-2">
                      {steps.map((step, index) => (
                        <div key={index} className="text-sm font-mono break-words">
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center text-gray-500">
                  Enter matrix values and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Matrix Operations</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Basic Operations</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Addition (same dimensions)</li>
                  <li className="break-words">Subtraction (same dimensions)</li>
                  <li className="break-words">Multiplication (cols A = rows B)</li>
                  <li className="break-words">Transpose (swap rows/cols)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Advanced Operations</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Determinant (square matrix)</li>
                  <li className="break-words">Inverse (square matrix)</li>
                  <li className="break-words">Cofactor expansion</li>
                  <li className="break-words">Adjugate matrix</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Properties</h3>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li className="break-words">Matrix dimensions</li>
                  <li className="break-words">Square matrices</li>
                  <li className="break-words">Invertible matrices</li>
                  <li className="break-words">Singular matrices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
