'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface ValidationResult {
  isValid: boolean;
  lineNumber?: number;
  message: string;
}

const JSONLValidator = () => {
  const breadcrumbItems = [
    {
      label: 'JSONL Validator',
      href: '/jsonl-validator'
    }
  ];

  const [input, setInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateJSONL = (jsonlStr: string): ValidationResult => {
    if (!jsonlStr.trim()) {
      return {
        isValid: false,
        message: 'Please enter some JSONL content to validate'
      };
    }

    const lines = jsonlStr.trim().split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        return {
          isValid: false,
          lineNumber: i + 1,
          message: `Empty line found at line ${i + 1}`
        };
      }

      try {
        JSON.parse(line);
      } catch (err: any) {
        return {
          isValid: false,
          lineNumber: i + 1,
          message: `Invalid JSON at line ${i + 1}: ${err.message}`
        };
      }
    }

    return {
      isValid: true,
      message: `Valid JSONL format with ${lines.length} line${lines.length === 1 ? '' : 's'}`
    };
  };

  const handleValidate = () => {
    const result = validateJSONL(input);
    setValidationResult(result);
  };

  return (
    <div className="container mx-auto px-4 mb-6 mt-6 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">JSONL Validator</h1>
              <p className="text-muted-foreground">
                Validate your JSONL (JSON Lines) format. JSONL is a format for storing structured data where each line is a valid JSON value.
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>JSONL files must be UTF-8 encoded with each line containing a valid JSON value. Perfect for log files, data streaming, and handling nested data structures.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <h2 className="font-medium text-foreground mb-2">JSONL Format Requirements:</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>UTF-8 encoding (no byte order mark)</li>
                <li>Each line must be a valid JSON value</li>
                <li>Line separator must be '\n' (or '\r\n')</li>
                <li>Common file extensions: .jsonl, .jsonl.gz, .jsonl.bz2</li>
              </ul>
            </div>

            <div>
              <label className="text-sm font-medium">
                Enter JSONL Content:
              </label>
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setValidationResult(null);
                }}
                placeholder={'{"name": "Gilbert", "wins": [["straight", "7♣"], ["one pair", "10♥"]]}\n{"name": "Alexa", "wins": [["two pair", "4♠"]]}\n{"name": "May", "wins": []}\n{"name": "Deloise", "wins": [["three of a kind", "5♣"]]}'}
                className="font-mono h-48 mt-2"
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleValidate} className="w-full md:w-auto">
                Validate JSONL
              </Button>
            </div>

            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-md ${
                  validationResult.isValid
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                }`}
              >
                {validationResult.isValid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>
                  {validationResult.message}
                  {validationResult.lineNumber && (
                    <span className="block text-sm mt-1">
                      Check line {validationResult.lineNumber} of your input
                    </span>
                  )}
                </span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JSONLValidator;
