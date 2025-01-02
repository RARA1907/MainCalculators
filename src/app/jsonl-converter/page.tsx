'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, Copy, ArrowDownUp, Check, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

const JSONLConverter = () => {
  const breadcrumbItems = [
    {
      label: 'JSONL Converter',
      href: '/jsonl-converter'
    }
  ];

  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [conversionType, setConversionType] = useState<'jsonToJsonl' | 'jsonlToJson'>('jsonToJsonl');

  const convertJsonToJsonl = (jsonStr: string) => {
    try {
      const jsonData = JSON.parse(jsonStr);
      if (!Array.isArray(jsonData)) {
        throw new Error('Input must be a JSON array');
      }
      return jsonData.map(item => JSON.stringify(item)).join('\n');
    } catch (err: any) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }
  };

  const convertJsonlToJson = (jsonlStr: string) => {
    try {
      const lines = jsonlStr.trim().split('\n');
      const jsonArray = lines.map(line => {
        try {
          return JSON.parse(line.trim());
        } catch (err) {
          throw new Error(`Invalid JSONL line: ${line}`);
        }
      });
      return JSON.stringify(jsonArray, null, 2);
    } catch (err: any) {
      throw new Error(`Invalid JSONL: ${err.message}`);
    }
  };

  const handleConvert = () => {
    setError('');
    setOutput('');
    
    if (!input.trim()) {
      setError('Please enter some input text');
      return;
    }

    try {
      const result = conversionType === 'jsonToJsonl' 
        ? convertJsonToJsonl(input)
        : convertJsonlToJson(input);
      setOutput(result);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleConversionType = () => {
    setConversionType(prev => prev === 'jsonToJsonl' ? 'jsonlToJson' : 'jsonToJsonl');
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="container mx-auto mb-6 mt-6 px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">JSONL Converter</h1>
              <p className="text-muted-foreground">
                Convert between JSON and JSONL (JSON Lines) formats. JSONL is a convenient format for storing structured data that may be processed one record at a time.
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    onClick={toggleConversionType}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                    {conversionType === 'jsonToJsonl' ? 'JSON → JSONL' : 'JSONL → JSON'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to toggle conversion direction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              <h2 className="font-medium text-foreground mb-2">About JSONL Format:</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each line must be a valid JSON value (typically objects or arrays)</li>
                <li>UTF-8 encoding is required</li>
                <li>Lines are separated by '\n' (or '\r\n')</li>
                <li>Perfect for log files and data streaming</li>
                <li>Better than CSV for handling nested data structures</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">
                  Input {conversionType === 'jsonToJsonl' ? 'JSON' : 'JSONL'}:
                </label>
                {conversionType === 'jsonToJsonl' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter a valid JSON array</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={conversionType === 'jsonToJsonl' 
                  ? '[\n  {"name": "Gilbert", "wins": [["straight", "7♣"], ["one pair", "10♥"]]},\n  {"name": "Alexa", "wins": [["two pair", "4♠"]]}\n]'
                  : '{"name": "Gilbert", "wins": [["straight", "7♣"], ["one pair", "10♥"]]}\n{"name": "Alexa", "wins": [["two pair", "4♠"]]}'}
                className="font-mono h-48"
              />
            </div>

            <div className="flex justify-center">
              <Button onClick={handleConvert} className="w-full md:w-auto">
                Convert
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 text-red-600 bg-red-50 rounded-md"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}

            {output && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">
                    Output {conversionType === 'jsonToJsonl' ? 'JSONL' : 'JSON'}:
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Textarea
                  value={output}
                  readOnly
                  className="font-mono h-48"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JSONLConverter;
