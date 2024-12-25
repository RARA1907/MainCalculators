'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import ReactECharts from 'echarts-for-react';

interface CycleDay {
  date: Date;
  type: 'period' | 'fertile' | 'ovulation' | 'normal';
  description: string;
}

interface PeriodPrediction {
  periodStart: Date;
  periodEnd: Date;
  ovulationDate: Date;
  fertileWindow: {
    start: Date;
    end: Date;
  };
}

interface CycleSymptom {
  phase: string;
  symptoms: string[];
  recommendations: string[];
}

const cycleSymptoms: CycleSymptom[] = [
  {
    phase: 'Menstrual',
    symptoms: [
      'Menstrual bleeding',
      'Cramping',
      'Fatigue',
      'Lower back pain',
      'Mood changes'
    ],
    recommendations: [
      'Stay hydrated',
      'Get enough rest',
      'Exercise gently',
      'Use heat therapy for cramps',
      'Take iron-rich foods'
    ]
  },
  {
    phase: 'Follicular',
    symptoms: [
      'Increased energy',
      'Higher motivation',
      'Better mood',
      'Increased mental clarity',
      'Skin improvement'
    ],
    recommendations: [
      'Engage in high-intensity workouts',
      'Take on challenging tasks',
      'Plan important events',
      'Focus on goals',
      'Start new projects'
    ]
  },
  {
    phase: 'Ovulatory',
    symptoms: [
      'Increased libido',
      'Clear cervical mucus',
      'Mild ovulation pain',
      'Breast tenderness',
      'Heightened senses'
    ],
    recommendations: [
      'Track fertility signs',
      'Monitor body temperature',
      'Note cervical mucus changes',
      'Plan conception if desired',
      'Stay active'
    ]
  },
  {
    phase: 'Luteal',
    symptoms: [
      'PMS symptoms',
      'Bloating',
      'Food cravings',
      'Mood swings',
      'Fatigue'
    ],
    recommendations: [
      'Practice stress management',
      'Maintain healthy diet',
      'Reduce caffeine intake',
      'Get regular sleep',
      'Do gentle exercise'
    ]
  }
];

export default function PeriodCalculator() {
  const breadcrumbItems = [
    {
      label: 'Period Calculator',
      href: '/period-calculator'
    }
  ];

  // State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [predictions, setPredictions] = useState<PeriodPrediction[]>([]);
  const [currentPhase, setCurrentPhase] = useState<CycleSymptom | null>(null);
  const [nextMonths, setNextMonths] = useState<number>(3);

  // Calculate predictions
  const calculatePredictions = () => {
    if (!lastPeriodDate) return;

    const predictions: PeriodPrediction[] = [];
    let currentDate = new Date(lastPeriodDate);

    for (let i = 0; i < nextMonths; i++) {
      // Calculate period dates
      const periodStart = new Date(currentDate);
      const periodEnd = new Date(currentDate);
      periodEnd.setDate(periodEnd.getDate() + periodLength - 1);

      // Calculate ovulation date (typically 14 days before next period)
      const ovulationDate = new Date(currentDate);
      ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14);

      // Calculate fertile window (5 days before and 1 day after ovulation)
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(fertileStart.getDate() - 5);
      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      predictions.push({
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        ovulationDate: new Date(ovulationDate),
        fertileWindow: {
          start: fertileStart,
          end: fertileEnd
        }
      });

      // Move to next cycle
      currentDate.setDate(currentDate.getDate() + cycleLength);
    }

    setPredictions(predictions);
    calculateCurrentPhase(predictions[0]);
  };

  // Calculate current cycle phase
  const calculateCurrentPhase = (nextPrediction: PeriodPrediction) => {
    const today = new Date();
    const periodStart = new Date(lastPeriodDate);
    const daysSinceStart = Math.floor((today.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));

    let phase: CycleSymptom;
    if (daysSinceStart <= periodLength) {
      phase = cycleSymptoms[0]; // Menstrual
    } else if (daysSinceStart <= 10) {
      phase = cycleSymptoms[1]; // Follicular
    } else if (daysSinceStart <= 14) {
      phase = cycleSymptoms[2]; // Ovulatory
    } else {
      phase = cycleSymptoms[3]; // Luteal
    }

    setCurrentPhase(phase);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get cycle visualization chart
  const getCycleChart = () => {
    return {
      title: {
        text: 'Menstrual Cycle Phases',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} days'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: periodLength, name: 'Menstrual', itemStyle: { color: '#EF4444' } },
            { value: 9 - periodLength, name: 'Follicular', itemStyle: { color: '#3B82F6' } },
            { value: 5, name: 'Ovulatory', itemStyle: { color: '#10B981' } },
            { value: 14, name: 'Luteal', itemStyle: { color: '#8B5CF6' } }
          ]
        }
      ]
    };
  };

  // Calculate predictions when inputs change
  useEffect(() => {
    if (lastPeriodDate) {
      calculatePredictions();
    }
  }, [lastPeriodDate, cycleLength, periodLength, nextMonths]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Period Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Future Periods</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Day of Last Period</span>
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Average Cycle Length (days)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Typical cycle length is 28 days, but can range from 21-35 days</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="21"
                    max="35"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Period Length (days)</span>
                  </label>
                  <input
                    type="number"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="3"
                    max="7"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Predict Next Months</span>
                  </label>
                  <input
                    type="number"
                    value={nextMonths}
                    onChange={(e) => setNextMonths(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="12"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculatePredictions}
                >
                  Calculate Predictions
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {predictions.length > 0 && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Predicted Dates</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Cycle Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Cycle Overview</h3>
                      <ReactECharts option={getCycleChart()} style={{ height: '300px' }} />
                    </div>

                    {/* Predictions List */}
                    <div className="space-y-4">
                      {predictions.map((prediction, index) => (
                        <div key={index} className="bg-base-200 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">Cycle {index + 1}</h3>
                          <div className="grid gap-2">
                            <div>
                              <span className="font-medium">Period:</span>
                              <div className="text-red-600">
                                {formatDate(prediction.periodStart)} - {formatDate(prediction.periodEnd)}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Fertile Window:</span>
                              <div className="text-green-600">
                                {formatDate(prediction.fertileWindow.start)} - {formatDate(prediction.fertileWindow.end)}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Ovulation:</span>
                              <div className="text-blue-600">{formatDate(prediction.ovulationDate)}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Phase Information */}
            {currentPhase && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Current Phase: {currentPhase.phase}</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Common Symptoms</h3>
                      <ul className="list-disc pl-6">
                        {currentPhase.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                      <ul className="list-disc pl-6">
                        {currentPhase.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips and Information */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Cycle Health Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Track Your Cycle</h3>
                    <ul className="list-disc pl-6">
                      <li>Note the start and end dates of your period</li>
                      <li>Monitor cycle length variations</li>
                      <li>Record symptoms throughout your cycle</li>
                      <li>Track energy levels and mood changes</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">When to Seek Medical Advice</h3>
                    <ul className="list-disc pl-6">
                      <li>Periods lasting longer than 7 days</li>
                      <li>Cycles shorter than 21 or longer than 35 days</li>
                      <li>Excessive bleeding or severe pain</li>
                      <li>Irregular or missed periods</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
