import React from 'react';
import { cn } from '@/lib/utils';

interface FormulaProps {
  title: string;
  formula: string;
  description?: string;
  className?: string;
}

export function Formula({ title, formula, description, className }: FormulaProps) {
  return (
    <div className={cn("p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", className)}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-sm">
        {formula}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </div>
  );
}
