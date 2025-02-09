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
    <div className={cn("p-4 bg-gray-50 ", className)}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="p-3 bg-white ">
        {formula}
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-600 ">{description}</p>
      )}
    </div>
  );
}
