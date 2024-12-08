import * as React from 'react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="flex justify-between items-center w-full py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-[#0EA5E9]">{question}</span>
        <span className={cn(
          "transform transition-transform duration-200",
          isOpen ? "rotate-180" : ""
        )}>
          ▼
        </span>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <div className="prose dark:prose-invert max-w-none">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface FAQListProps {
  items: FAQItemProps[];
  className?: string;
}

export function FAQList({ items, className }: FAQListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <FAQItem key={index} {...item} />
      ))}
    </div>
  );
}
