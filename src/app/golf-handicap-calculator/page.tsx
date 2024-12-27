'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, PlusCircle, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GolfRound {
  id: number;
  score: string;
  courseRating: string;
  slopeRating: string;
}

interface HandicapResult {
  handicapIndex: number;
  differentials: number[];
  category: string;
  description: string;
  color: string;
}

const handicapCategories = {
  scratch: {
    range: '0 or better',
    description: 'Scratch Golfer',
    color: '#22C55E',
    details: 'Exceptional player capable of shooting par or better'
  },
  lowHandicap: {
    range: '1-9',
    description: 'Low Handicap',
    color: '#3B82F6',
    details: 'Very skilled player with consistent performance'
  },
  midHandicap: {
    range: '10-18',
    description: 'Mid Handicap',
    color: '#EAB308',
    details: 'Average golfer with good fundamentals'
  },
  highHandicap: {
    range: '19+',
    description: 'High Handicap',
    color: '#EF4444',
    details: 'Developing player working on consistency'
  }
};

export default function GolfHandicapCalculator() {
  const breadcrumbItems = [
    {
      label: 'Golf Handicap Calculator',
      href: '/golf-handicap-calculator'
    }
  ];

  const [rounds, setRounds] = useState<GolfRound[]>([
    { id: 1, score: '', courseRating: '', slopeRating: '' }
  ]);
  const [result, setResult] = useState<HandicapResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateHandicapDifferential = (score: number, courseRating: number, slopeRating: number) => {
    return ((score - courseRating) * 113) / slopeRating;
  };

  const getHandicapCategory = (handicapIndex: number) => {
    if (handicapIndex <= 0) return { ...handicapCategories.scratch };
    if (handicapIndex <= 9) return { ...handicapCategories.lowHandicap };
    if (handicapIndex <= 18) return { ...handicapCategories.midHandicap };
    return { ...handicapCategories.highHandicap };
  };

  const calculateHandicap = () => {
    setError('');

    // Validate inputs
    const invalidRounds = rounds.filter(round => {
      const score = parseFloat(round.score);
      const courseRating = parseFloat(round.courseRating);
      const slopeRating = parseFloat(round.slopeRating);

      return !round.score || !round.courseRating || !round.slopeRating ||
             isNaN(score) || isNaN(courseRating) || isNaN(slopeRating) ||
             score < 30 || score > 200 ||
             courseRating < 50 || courseRating > 80 ||
             slopeRating < 55 || slopeRating > 155;
    });

    if (invalidRounds.length > 0) {
      setError('Please enter valid scores (30-200), course ratings (50-80), and slope ratings (55-155)');
      return;
    }

    // Calculate differentials
    const differentials = rounds.map(round => {
      return calculateHandicapDifferential(
        parseFloat(round.score),
        parseFloat(round.courseRating),
        parseFloat(round.slopeRating)
      );
    });

    // Sort differentials and take the lowest ones based on number of rounds
    const sortedDifferentials = [...differentials].sort((a, b) => a - b);
    const numberOfDifferentials = Math.min(
      rounds.length >= 20 ? 10 : Math.floor(rounds.length * 0.4),
      sortedDifferentials.length
    );
    
    const lowestDifferentials = sortedDifferentials.slice(0, numberOfDifferentials);
    
    // Calculate handicap index
    const handicapIndex = Number((lowestDifferentials.reduce((sum, diff) => sum + diff, 0) / 
                                lowestDifferentials.length * 0.96).toFixed(1));

    const category = getHandicapCategory(handicapIndex);

    setResult({
      handicapIndex,
      differentials: sortedDifferentials,
      category: category.description,
      description: category.details,
      color: category.color
    });
  };

  const addRound = () => {
    setRounds([
      ...rounds,
      { id: rounds.length + 1, score: '', courseRating: '', slopeRating: '' }
    ]);
  };

  const removeRound = (id: number) => {
    if (rounds.length > 1) {
      const updatedRounds = rounds.filter(round => round.id !== id);
      setRounds(updatedRounds);
    }
  };

  const updateRound = (id: number, field: keyof GolfRound, value: string) => {
    const updatedRounds = rounds.map(round =>
      round.id === id ? { ...round, [field]: value } : round
    );
    setRounds(updatedRounds);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Golf Handicap Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Golf Rounds</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-2">Score</th>
                        <th className="text-left pb-2">Course Rating</th>
                        <th className="text-left pb-2">Slope Rating</th>
                        <th className="text-left pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rounds.map((round) => (
                        <tr key={round.id} className="border-t">
                          <td className="py-2">
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={round.score}
                              onChange={(e) => updateRound(round.id, 'score', e.target.value)}
                              placeholder="Score"
                              min="30"
                              max="200"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={round.courseRating}
                              onChange={(e) => updateRound(round.id, 'courseRating', e.target.value)}
                              placeholder="Course"
                              min="50"
                              max="80"
                              step="0.1"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              className="input input-bordered w-full"
                              value={round.slopeRating}
                              onChange={(e) => updateRound(round.id, 'slopeRating', e.target.value)}
                              placeholder="Slope"
                              min="55"
                              max="155"
                            />
                          </td>
                          <td className="py-2">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => removeRound(round.id)}
                              disabled={rounds.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={addRound} className="btn btn-outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Round
                  </button>
                  <button onClick={calculateHandicap} className="btn btn-primary">
                    Calculate Handicap
                  </button>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Handicap Results</h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="w-48">
                        <CircularProgressbar
                          value={Math.min(Math.max(result.handicapIndex, 0), 36)}
                          maxValue={36}
                          text={result.handicapIndex.toString()}
                          styles={buildStyles({
                            textColor: result.color,
                            pathColor: result.color,
                            trailColor: '#d6d6d6'
                          })}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl font-semibold" style={{ color: result.color }}>
                        {result.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.description}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Score Differentials:</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {result.differentials.map((diff, index) => (
                          <div
                            key={index}
                            className="bg-base-200 p-2 rounded text-center"
                          >
                            {diff.toFixed(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter your golf rounds to calculate your handicap index
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Golf Handicap</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Handicap Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(handicapCategories).map(([key, cat]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: cat.color }}>
                            {cat.description}
                          </h4>
                          <div className="text-sm">Range: {cat.range}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">How It's Calculated</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Score Differential = (Score - Course Rating) × 113 ÷ Slope Rating</li>
                      <li>Uses the lowest 40% of your differentials</li>
                      <li>Averages those differentials and multiplies by 0.96</li>
                      <li>Result is rounded to one decimal place</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Tips for Accurate Handicap</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Required Information</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Accurate gross scores</li>
                          <li>Course rating</li>
                          <li>Slope rating</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Best Practices</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Enter scores promptly</li>
                          <li>Include all eligible rounds</li>
                          <li>Verify course/slope ratings</li>
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
