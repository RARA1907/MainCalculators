'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorButtonProps {
  value: string;
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'function' | 'number' | 'operation';
}

function CalculatorButton({ value, onClick, className, variant = 'default' }: CalculatorButtonProps) {
  const baseStyles = "h-12 text-sm font-medium transition-colors";
  const variantStyles = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    function: "bg-blue-100 hover:bg-blue-200 text-blue-900",
    number: "bg-white hover:bg-gray-100 text-gray-900",
    operation: "bg-[#0EA5E9] hover:bg-[#7DD3FC] text-white"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        "rounded-lg",
        className
      )}
    >
      {value}
    </button>
  );
}

export function ScientificCalculator() {
  const [display, setDisplay] = React.useState("0");
  const [memory, setMemory] = React.useState<number>(0);
  const [isRad, setIsRad] = React.useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === "0" ? num : prev + num);
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleOperation = (op: string) => {
    setDisplay(prev => prev + op);
  };

  const handleEquals = () => {
    try {
      // Note: In a real calculator, you'd want to implement proper expression parsing
      setDisplay(eval(display).toString());
    } catch {
      setDisplay("Error");
    }
  };

  const buttons = [
    [
      { value: "sin", variant: "function" },
      { value: "cos", variant: "function" },
      { value: "tan", variant: "function" },
      { value: "7", variant: "number" },
      { value: "8", variant: "number" },
      { value: "9", variant: "number" },
      { value: "+", variant: "operation" },
      { value: "Back", variant: "function" },
    ],
    [
      { value: "sin⁻¹", variant: "function" },
      { value: "cos⁻¹", variant: "function" },
      { value: "tan⁻¹", variant: "function" },
      { value: "4", variant: "number" },
      { value: "5", variant: "number" },
      { value: "6", variant: "number" },
      { value: "-", variant: "operation" },
      { value: "Ans", variant: "function" },
    ],
    [
      { value: "xʸ", variant: "function" },
      { value: "x³", variant: "function" },
      { value: "x²", variant: "function" },
      { value: "1", variant: "number" },
      { value: "2", variant: "number" },
      { value: "3", variant: "number" },
      { value: "×", variant: "operation" },
      { value: "M+", variant: "function" },
    ],
    [
      { value: "(", variant: "function" },
      { value: ")", variant: "function" },
      { value: "1/x", variant: "function" },
      { value: "0", variant: "number" },
      { value: ".", variant: "number" },
      { value: "=", variant: "operation" },
      { value: "÷", variant: "operation" },
      { value: "M-", variant: "function" },
    ],
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Display */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-right text-3xl font-mono">{display}</div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center mb-4 space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={!isRad}
            onChange={() => setIsRad(false)}
            className="form-radio text-[#0EA5E9]"
          />
          <span>Deg</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            checked={isRad}
            onChange={() => setIsRad(true)}
            className="form-radio text-[#0EA5E9]"
          />
          <span>Rad</span>
        </label>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-8 gap-2">
        {buttons.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((button, j) => (
              <CalculatorButton
                key={`${i}-${j}`}
                value={button.value}
                variant={button.variant as any}
                onClick={() => {
                  if (button.value === "=") handleEquals();
                  else if (button.value === "Back") handleClear();
                  else if ("0123456789.".includes(button.value)) handleNumber(button.value);
                  else handleOperation(button.value);
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
