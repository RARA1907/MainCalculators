'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, Moon, Sun, Clock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface SleepTime {
  time: string;
  cycles: number;
  quality: string;
  recommendation: string;
}

interface SleepResult {
  bedtimes: SleepTime[];
  waketimes: SleepTime[];
  selectedMode: 'wake' | 'bed';
}

const SLEEP_CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 15;

const sleepQuality = {
  optimal: {
    label: 'Optimal',
    color: '#22C55E',
    description: 'Ideal amount of sleep cycles'
  },
  good: {
    label: 'Good',
    color: '#3B82F6',
    description: 'Good amount of sleep cycles'
  },
  fair: {
    label: 'Fair',
    color: '#EAB308',
    description: 'Minimum recommended cycles'
  },
  poor: {
    label: 'Not Recommended',
    color: '#EF4444',
    description: 'Too few or too many cycles'
  }
};

export default function SleepCalculator() {
  const breadcrumbItems = [
    {
      label: 'Sleep Calculator',
      href: '/sleep-calculator'
    }
  ];

  const [time, setTime] = useState<string>('');
  const [mode, setMode] = useState<'wake' | 'bed'>('wake');
  const [result, setResult] = useState<SleepResult | null>(null);

  const calculateSleepTimes = (inputTime: string, mode: 'wake' | 'bed') => {
    const times: SleepTime[] = [];
    const date = new Date();
    const [hours, minutes] = inputTime.split(':').map(Number);
    
    date.setHours(hours, minutes, 0, 0);

    // Calculate 6 sleep cycles (9 hours) backwards or forwards
    for (let i = 2; i <= 6; i++) {
      const cycleMinutes = (i * SLEEP_CYCLE_MINUTES) + FALL_ASLEEP_MINUTES;
      const newDate = new Date(date);
      
      if (mode === 'wake') {
        newDate.setMinutes(newDate.getMinutes() - cycleMinutes);
      } else {
        newDate.setMinutes(newDate.getMinutes() + cycleMinutes);
      }

      let quality: keyof typeof sleepQuality;
      if (i === 5 || i === 6) {
        quality = 'optimal';
      } else if (i === 4) {
        quality = 'good';
      } else if (i === 3) {
        quality = 'fair';
      } else {
        quality = 'poor';
      }

      times.push({
        time: newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        cycles: i,
        quality: sleepQuality[quality].label,
        recommendation: `${i * SLEEP_CYCLE_MINUTES} minutes (${i} cycles)`
      });
    }

    return times;
  };

  const handleCalculate = () => {
    if (!time) return;

    const calculatedTimes = calculateSleepTimes(time, mode);
    setResult({
      bedtimes: mode === 'wake' ? calculatedTimes : [],
      waketimes: mode === 'bed' ? calculatedTimes : [],
      selectedMode: mode
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Sleep Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Sleep Time</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mode Selection */}
                <div className="flex space-x-4">
                  <button
                    className={`btn flex-1 ${mode === 'wake' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMode('wake')}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    I want to wake up at
                  </button>
                  <button
                    className={`btn flex-1 ${mode === 'bed' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setMode('bed')}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    I want to go to bed at
                  </button>
                </div>

                {/* Time Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {mode === 'wake' ? 'Wake Up Time' : 'Bedtime'}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="inline-block ml-2 h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the time in 24-hour format (HH:MM)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCalculate}
                  disabled={!time}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Calculate {mode === 'wake' ? 'Bedtime' : 'Wake Time'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">
                  {mode === 'wake' ? 'Suggested Bedtimes' : 'Suggested Wake Times'}
                </h2>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {(mode === 'wake' ? result.bedtimes : result.waketimes).map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border"
                          style={{ borderColor: Object.values(sleepQuality).find(q => q.label === item.quality)?.color }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-2xl font-bold">{item.time}</div>
                              <div className="text-sm text-gray-500">{item.recommendation}</div>
                            </div>
                            <div
                              className="text-sm font-medium px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: Object.values(sleepQuality).find(q => q.label === item.quality)?.color + '20',
                                color: Object.values(sleepQuality).find(q => q.label === item.quality)?.color
                              }}
                            >
                              {item.quality}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Enter your {mode === 'wake' ? 'wake up time' : 'bedtime'} to see suggestions
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Sleep Cycles</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-semibold mb-3">Sleep Cycle Stages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Light Sleep (N1 & N2)</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Initial relaxation phase</li>
                          <li>Body temperature drops</li>
                          <li>Heart rate slows</li>
                        </ul>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Deep Sleep (N3)</h4>
                        <ul className="list-disc pl-4 text-sm">
                          <li>Physical restoration</li>
                          <li>Immune system boost</li>
                          <li>Tissue repair</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Sleep Quality Levels</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(sleepQuality).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${value.color}20` }}
                        >
                          <h4 className="font-medium" style={{ color: value.color }}>
                            {value.label}
                          </h4>
                          <p className="text-sm">{value.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  <section>
                    <h3 className="text-lg font-semibold mb-3">Tips for Better Sleep</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Maintain a consistent sleep schedule</li>
                      <li>Create a relaxing bedtime routine</li>
                      <li>Avoid screens before bedtime</li>
                      <li>Keep your bedroom cool and dark</li>
                      <li>Limit caffeine and heavy meals before bed</li>
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
