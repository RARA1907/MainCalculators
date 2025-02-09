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
    <div className="p-4">
      <div className="mb-4 bg-gray-600 rounded-lg p-2 shadow-sm">
        <input
          type="text"
          value={display}
          readOnly
          className="w-full text-right text-2xl p-4 bg-gray-50 rounded-lg text-gray-900 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {buttons.map((row, i) =>
          row.map((btn, j) => (
            <button
              key={`${i}-${j}`}
              onClick={() => handleButton(btn)}
              className={`
                p-4 text-lg rounded-lg transition-colors
                ${btn === '=' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                  ['C', '⌫'].includes(btn) ? 'bg-red-500 hover:bg-red-600 text-white' : 
                  ['sin', 'cos', 'tan', 'log', '√', '^'].includes(btn) ? 'bg-gray-700 hover:bg-gray-800 text-white' :
                  ['×', '÷', '+', '-'].includes(btn) ? 'bg-gray-600 hover:bg-gray-700 text-white' :
                  ['MC', 'MR', 'M+', 'M-'].includes(btn) ? 'bg-gray-500 hover:bg-gray-600 text-white' :
                  ['π', 'e', '(', ')', '%', '±'].includes(btn) ? 'bg-gray-600 hover:bg-gray-700 text-white' :
                  'bg-gray-700 hover:bg-gray-800 text-white'}
              `}
            >
              {btn}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
