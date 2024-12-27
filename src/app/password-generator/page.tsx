'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Info, Copy, RefreshCw, Check, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  message: string;
}

export default function PasswordGenerator() {
  const breadcrumbItems = [
    {
      label: 'Password Generator',
      href: '/password-generator'
    }
  ];

  const [password, setPassword] = useState<string>('');
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'iIlL1oO0',
    ambiguous: '{}[]()/\\\'"`~,;:.<>',
  };

  const generatePassword = () => {
    let chars = '';
    if (includeLowercase) chars += characterSets.lowercase;
    if (includeUppercase) chars += characterSets.uppercase;
    if (includeNumbers) chars += characterSets.numbers;
    if (includeSymbols) chars += characterSets.symbols;

    if (excludeSimilar) {
      characterSets.similar.split('').forEach(char => {
        chars = chars.replace(new RegExp(char, 'g'), '');
      });
    }

    if (excludeAmbiguous) {
      characterSets.ambiguous.split('').forEach(char => {
        chars = chars.replace(new RegExp('\\' + char, 'g'), '');
      });
    }

    if (chars.length === 0) {
      setPassword('Please select at least one character type');
      return;
    }

    let result = '';
    const requirements = {
      uppercase: includeUppercase,
      lowercase: includeLowercase,
      numbers: includeNumbers,
      symbols: includeSymbols,
    };

    // First, ensure at least one character from each required set
    Object.entries(requirements).forEach(([type, required]) => {
      if (required) {
        const set = characterSets[type as keyof typeof characterSets];
        result += set[Math.floor(Math.random() * set.length)];
      }
    });

    // Fill the rest randomly
    for (let i = result.length; i < passwordLength; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle the password
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password || password.includes('Please select')) {
      return {
        score: 0,
        label: 'None',
        color: 'bg-gray-200',
        message: 'No password generated'
      };
    }

    let score = 0;
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
      noRepeating: !/(.)\1{2,}/.test(password),
    };

    score += checks.length ? 2 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.symbols ? 2 : 0;
    score += checks.noRepeating ? 1 : 0;

    if (score >= 7) {
      return {
        score,
        label: 'Very Strong',
        color: 'bg-green-500',
        message: 'Excellent password strength!'
      };
    } else if (score >= 5) {
      return {
        score,
        label: 'Strong',
        color: 'bg-blue-500',
        message: 'Good password strength'
      };
    } else if (score >= 3) {
      return {
        score,
        label: 'Medium',
        color: 'bg-yellow-500',
        message: 'Moderate password strength'
      };
    } else {
      return {
        score,
        label: 'Weak',
        color: 'bg-red-500',
        message: 'Consider adding more complexity'
      };
    }
  };

  useEffect(() => {
    generatePassword();
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    excludeAmbiguous
  ]);

  const strength = calculatePasswordStrength(password);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Password Generator</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Generated Password</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      value={password}
                      readOnly
                      className="pr-24 font-mono"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={generatePassword}
                        className="h-8 w-8"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyToClipboard}
                        className="h-8 w-8"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strength: {strength.label}</span>
                      <span>{strength.message}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${(strength.score / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Password Length</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[passwordLength]}
                      onValueChange={([value]) => setPasswordLength(value)}
                      min={8}
                      max={64}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">{passwordLength}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Options Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Character Types</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Uppercase (A-Z)</span>
                    </label>
                    <span className="text-muted-foreground">e.g., ABCDEF</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Lowercase (a-z)</span>
                    </label>
                    <span className="text-muted-foreground">e.g., abcdef</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Numbers (0-9)</span>
                    </label>
                    <span className="text-muted-foreground">e.g., 123456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Symbols</span>
                    </label>
                    <span className="text-muted-foreground">e.g., !@#$%^</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Advanced Options</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={excludeSimilar}
                        onChange={(e) => setExcludeSimilar(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Exclude Similar Characters</span>
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excludes similar characters like i, l, 1, L, o, 0, O</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={excludeAmbiguous}
                        onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                        className="checkbox"
                      />
                      <span>Exclude Ambiguous Characters</span>
                    </label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excludes ambiguous characters like { } [ ] ( ) / \ ' " ` ~ , ; : . < ></p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Password Tips Section */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Password Security Tips</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Length Matters</h3>
                  <p className="text-muted-foreground">
                    Use passwords that are at least 12 characters long. Longer passwords are generally more secure.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mix Characters</h3>
                  <p className="text-muted-foreground">
                    Combine uppercase, lowercase, numbers, and symbols to create a more complex password.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Avoid Personal Information</h3>
                  <p className="text-muted-foreground">
                    Don’t use easily guessable information like birthdays, names, or common words.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Unique Passwords</h3>
                  <p className="text-muted-foreground">
                    Use different passwords for different accounts. Never reuse passwords across multiple sites.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Regular Updates</h3>
                  <p className="text-muted-foreground">
                    Change your passwords periodically, especially for critical accounts.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Password Manager</h3>
                  <p className="text-muted-foreground">
                    Consider using a password manager to securely store and generate strong passwords.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
