'use client';

import { useState } from 'react';
import { evaluate } from 'mathjs';

export function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [isRad, setIsRad] = useState(true);

  const buttons = [
    ['sin', 'cos', 'tan', '(', ')', 'C'],
    ['π', 'e', '^', '√', 'log', '÷'],
    ['7', '8', '9', '×', 'MC', 'MR'],
    ['4', '5', '6', '-', 'M+', 'M-'],
    ['1', '2', '3', '+', '±', '%'],
    ['0', '.', '⌫', '=', 'Rad', 'Deg'],
  ];

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setDisplay(prev => prev + op);
  };

  const handleEqual = () => {
    try {
      let expression = display
        .replace('×', '*')
        .replace('÷', '/')
        .replace('π', 'pi')
        .replace('√', 'sqrt')
        .replace('^', '**');

      // Handle trigonometric functions
      if (!isRad) {
        expression = expression
          .replace(/sin\(/g, 'sin(pi/180*')
          .replace(/cos\(/g, 'cos(pi/180*')
          .replace(/tan\(/g, 'tan(pi/180*');
      }

      const result = evaluate(expression);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.length === 1 ? '0' : prev.slice(0, -1));
  };

  const handleMemory = (operation: string) => {
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(memory.toString());
        break;
      case 'M+':
        try {
          const currentValue = evaluate(display);
          setMemory(memory + currentValue);
        } catch (error) {
          setDisplay('Error');
        }
        break;
      case 'M-':
        try {
          const currentValue = evaluate(display);
          setMemory(memory - currentValue);
        } catch (error) {
          setDisplay('Error');
        }
        break;
    }
  };

  const handleButton = (value: string) => {
    switch (value) {
      case 'C':
        handleClear();
        break;
      case '⌫':
        handleBackspace();
        break;
      case '=':
        handleEqual();
        break;
      case 'Rad':
      case 'Deg':
        setIsRad(!isRad);
        break;
      case 'MC':
      case 'MR':
      case 'M+':
      case 'M-':
        handleMemory(value);
        break;
      case '×':
      case '÷':
      case '+':
      case '-':
      case '(':
      case ')':
      case '^':
      case '.':
        handleOperator(value);
        break;
      default:
        handleNumber(value);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4">
      {/* Display */}
      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-4">
        <div className="text-right text-2xl font-mono mb-2 text-gray-900 dark:text-white overflow-x-auto">
          {display}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Memory: {memory}</span>
          <span>{isRad ? 'RAD' : 'DEG'}</span>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-6 gap-2">
        {buttons.map((row, rowIndex) =>
          row.map((button, buttonIndex) => (
            <button
              key={`${rowIndex}-${buttonIndex}`}
              onClick={() => handleButton(button)}
              className={`
                p-2 text-sm md:text-base rounded-lg transition-colors
                ${
                  ['C', '='].includes(button)
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : ['×', '÷', '+', '-', '^', '√'].includes(button)
                    ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {button}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
