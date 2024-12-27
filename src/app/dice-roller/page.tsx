'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Dice1, Plus, Minus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceRoll {
  id: string;
  type: number;
  result: number;
  timestamp: number;
}

interface RollHistory {
  rolls: DiceRoll[];
  total: number;
  modifier: number;
  timestamp: number;
}

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

export default function DiceRoller() {
  const breadcrumbItems = [
    {
      label: 'Dice Roller',
      href: '/dice-roller'
    }
  ];

  const [selectedDice, setSelectedDice] = useState<number[]>([20]);
  const [modifier, setModifier] = useState<number>(0);
  const [rollHistory, setRollHistory] = useState<RollHistory[]>([]);
  const [customDice, setCustomDice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [animatingDice, setAnimatingDice] = useState<boolean>(false);

  const rollDice = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1;
  };

  const handleRoll = () => {
    setError('');
    setAnimatingDice(true);

    const rolls: DiceRoll[] = selectedDice.map(sides => ({
      id: Math.random().toString(36).substr(2, 9),
      type: sides,
      result: rollDice(sides),
      timestamp: Date.now()
    }));

    const total = rolls.reduce((sum, roll) => sum + roll.result, 0) + modifier;

    setRollHistory(prev => [{
      rolls,
      total,
      modifier,
      timestamp: Date.now()
    }, ...prev].slice(0, 10));

    setTimeout(() => setAnimatingDice(false), 600);
  };

  const handleAddCustomDice = () => {
    const sides = parseInt(customDice);
    if (isNaN(sides) || sides < 2 || sides > 1000) {
      setError('Please enter a valid number between 2 and 1000');
      return;
    }
    if (!DICE_TYPES.includes(sides)) {
      setSelectedDice(prev => [...prev, sides]);
      setCustomDice('');
    }
  };

  const handleRemoveDice = (index: number) => {
    setSelectedDice(prev => prev.filter((_, i) => i !== index));
  };

  const formatRollNotation = (rolls: DiceRoll[], modifier: number): string => {
    const diceCount: { [key: number]: number } = {};
    rolls.forEach(roll => {
      diceCount[roll.type] = (diceCount[roll.type] || 0) + 1;
    });

    const notation = Object.entries(diceCount)
      .map(([sides, count]) => `${count}d${sides}`)
      .join(' + ');

    return modifier ? `${notation} ${modifier >= 0 ? '+' : ''} ${modifier}` : notation;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Dice Roller</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dice Selection Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Select Dice</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Standard Dice Buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {DICE_TYPES.map(sides => (
                    <button
                      key={sides}
                      className={`btn ${selectedDice.includes(sides) ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSelectedDice(prev => [...prev, sides])}
                    >
                      d{sides}
                    </button>
                  ))}
                </div>

                {/* Custom Dice Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Dice1 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <input
                      type="number"
                      className="input input-bordered w-full pl-10"
                      value={customDice}
                      onChange={(e) => setCustomDice(e.target.value)}
                      placeholder="Custom dice sides (2-1000)"
                      min="2"
                      max="1000"
                    />
                  </div>
                  <button
                    className="btn btn-outline"
                    onClick={handleAddCustomDice}
                    disabled={!customDice}
                  >
                    Add
                  </button>
                </div>

                {/* Selected Dice Display */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Selected Dice</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDice.map((sides, index) => (
                      <div
                        key={`${sides}-${index}`}
                        className="badge badge-lg badge-primary gap-2"
                      >
                        d{sides}
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleRemoveDice(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modifier Input */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Modifier</h3>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-square btn-sm"
                      onClick={() => setModifier(prev => prev - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      className="input input-bordered w-24 text-center"
                      value={modifier}
                      onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    />
                    <button
                      className="btn btn-square btn-sm"
                      onClick={() => setModifier(prev => prev + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="btn btn-primary w-full"
                  onClick={handleRoll}
                  disabled={selectedDice.length === 0 || animatingDice}
                >
                  Roll Dice
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Roll Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <AnimatePresence>
                    {rollHistory.map((roll, index) => (
                      <motion.div
                        key={roll.timestamp}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 ${index === 0 ? 'bg-primary/10' : 'bg-base-200'} rounded-lg`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-lg font-semibold">
                            {formatRollNotation(roll.rolls, roll.modifier)}
                          </div>
                          <div className="text-2xl font-bold">
                            {roll.total}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {roll.rolls.map((dice) => (
                            <div
                              key={dice.id}
                              className="badge badge-lg"
                              title={`d${dice.type}`}
                            >
                              {dice.result}
                            </div>
                          ))}
                          {roll.modifier !== 0 && (
                            <div className="badge badge-lg badge-outline">
                              {roll.modifier > 0 ? '+' : ''}{roll.modifier}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {rollHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Select dice and roll to see results
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Information Section */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Dice Rolling Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Standard RPG Dice</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Common Uses</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>d20: Attack rolls, skill checks</li>
                          <li>d12: Barbarian weapon damage</li>
                          <li>d10: Damage rolls, percentile</li>
                          <li>d8: Class hit points, weapon damage</li>
                          <li>d6: Ability scores, damage</li>
                          <li>d4: Dagger damage, healing</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Special Dice</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>d100: Percentile rolls (d10 x 10 + d10)</li>
                          <li>Custom: Create any sided die</li>
                          <li>Multiple: Roll any combination</li>
                          <li>Modifiers: Add/subtract from total</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Dice Notation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Basic Format</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>XdY: Roll X dice with Y sides</li>
                          <li>Modifier: Add/subtract from total</li>
                          <li>Example: 2d6 + 3</li>
                          <li>Multiple: 1d20 + 2d4 + 5</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Common Combinations</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>3d6: Ability score generation</li>
                          <li>2d20: Advantage/Disadvantage</li>
                          <li>1d20 + 5: Skill check with bonus</li>
                          <li>2d6 + 3: Weapon damage with modifier</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Tips</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Use modifiers to add bonuses from abilities or skills</li>
                      <li>Roll multiple dice at once for faster gameplay</li>
                      <li>Check your game's rules for specific dice combinations</li>
                      <li>Save commonly used combinations for quick access</li>
                      <li>Results are stored for the last 10 rolls</li>
                    </ul>
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
