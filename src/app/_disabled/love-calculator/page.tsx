'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Info, Sparkles, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CompatibilityResult {
  score: number;
  message: string;
  traits: string[];
}

export default function LoveCalculator() {
  const breadcrumbItems = [
    {
      label: 'Love Calculator',
      href: '/love-calculator'
    }
  ];

  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const compatibilityMessages = [
    { range: [0, 20], message: "There might be some challenges ahead...", traits: ["Different interests", "Contrasting personalities", "Growth opportunity"] },
    { range: [21, 40], message: "You'll need to work on understanding each other better.", traits: ["Communication needed", "Potential for growth", "Learning experience"] },
    { range: [41, 60], message: "There's definitely potential here!", traits: ["Good foundation", "Room for development", "Shared values"] },
    { range: [61, 80], message: "Strong compatibility! You complement each other well.", traits: ["Natural chemistry", "Similar interests", "Good communication"] },
    { range: [81, 100], message: "Incredible match! Your connection is truly special.", traits: ["Deep understanding", "Strong harmony", "Perfect balance"] }
  ];

  const calculateCompatibility = (str1: string, str2: string): number => {
    // This is a fun algorithm that generates a consistent score for the same name pairs
    const combinedString = (str1.toLowerCase() + str2.toLowerCase()).replace(/[^a-z]/g, '');
    let hash = 0;
    
    for (let i = 0; i < combinedString.length; i++) {
      const char = combinedString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    // Convert hash to a number between 0 and 100
    const normalizedHash = Math.abs(hash % 100);
    
    // Add some factors based on name characteristics
    let score = normalizedHash;
    
    // Length similarity adds up to 10 points
    const lengthDiff = Math.abs(str1.length - str2.length);
    score += Math.max(0, 10 - lengthDiff);
    
    // Common letters add points
    const commonLetters = new Set(str1.toLowerCase()).intersection(new Set(str2.toLowerCase())).size;
    score += commonLetters;
    
    // Normalize final score to 0-100
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const getCompatibilityResult = (score: number): CompatibilityResult => {
    const result = compatibilityMessages.find(
      msg => score >= msg.range[0] && score <= msg.range[1]
    );
    
    return {
      score,
      message: result?.message || "Something magical is happening...",
      traits: result?.traits || []
    };
  };

  const handleCalculate = () => {
    if (!name1.trim() || !name2.trim()) {
      setError('Please enter both names');
      return;
    }

    setError('');
    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    setTimeout(() => {
      const score = calculateCompatibility(name1, name2);
      setResult(getCompatibilityResult(score));
      setIsCalculating(false);
    }, 1500);
  };

  const handleReset = () => {
    setName1('');
    setName2('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Love Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Heart className="text-red-500" />
                Calculate Compatibility
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={name1}
                      onChange={(e) => setName1(e.target.value)}
                      placeholder="Enter first name"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Second Name</label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      placeholder="Enter second name"
                      maxLength={30}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    className="btn btn-primary flex-1"
                    onClick={handleCalculate}
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="animate-spin mr-2" />
                        Calculating...
                      </>
                    ) : (
                      'Calculate Love Score'
                    )}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={handleReset}
                    disabled={isCalculating}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Sparkles className="text-yellow-500" />
                  Love Score
                </h2>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center space-y-6"
                    >
                      <div className="w-48 h-48 mx-auto">
                        <CircularProgressbar
                          value={result.score}
                          text={`${result.score}%`}
                          styles={buildStyles({
                            textSize: '16px',
                            pathTransitionDuration: 1,
                            pathColor: `rgba(255, 99, 132, ${result.score / 100})`,
                            textColor: '#888',
                            trailColor: '#d6d6d6',
                          })}
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{result.message}</h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {result.traits.map((trait, index) => (
                            <span
                              key={index}
                              className="badge badge-primary badge-outline"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 text-gray-500"
                    >
                      Enter two names and calculate their love compatibility!
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">About Love Calculator</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">How It Works</h3>
                    <p className="text-gray-600 mb-4">
                      Our Love Calculator uses a unique algorithm that analyzes names to determine compatibility.
                      While it's meant to be entertaining, it can spark interesting conversations about relationships!
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Factors Considered</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Name harmony</li>
                          <li>Letter combinations</li>
                          <li>Numerical values</li>
                          <li>Pattern matching</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Score Meaning</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>80-100%: Exceptional match</li>
                          <li>60-79%: Strong compatibility</li>
                          <li>40-59%: Good potential</li>
                          <li>Below 40%: May need work</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                    <div className="space-y-4">
                      <div className="alert alert-info">
                        <Info className="h-4 w-4" />
                        <span>
                          This calculator is for entertainment purposes only. Real relationships depend on many factors
                          beyond names!
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Remember that successful relationships are built on communication, trust, respect, and understanding.
                        While this calculator is fun, it shouldn't be used to make serious relationship decisions.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Tips for Relationships</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Building Strong Bonds</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Open communication</li>
                          <li>Mutual respect</li>
                          <li>Quality time together</li>
                          <li>Understanding differences</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Red Flags to Watch</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Poor communication</li>
                          <li>Lack of trust</li>
                          <li>Disrespect</li>
                          <li>Incompatible values</li>
                        </ul>
                      </div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
