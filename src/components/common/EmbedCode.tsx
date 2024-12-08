'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface EmbedCodeProps {
  calculatorId: string;
}

export function EmbedCode({ calculatorId }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe 
  src="https://yourcalculatorsite.com/embed/${calculatorId}" 
  width="100%" 
  height="500" 
  frameborder="0"
  title="Calculator Widget"
></iframe>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Embed Calculator
        </h2>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
          {embedCode}
        </pre>
      </div>
    </div>
  );
}
