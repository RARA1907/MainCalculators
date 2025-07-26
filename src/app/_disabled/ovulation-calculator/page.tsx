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

interface FertilityWindow {
  start: Date;
  end: Date;
  ovulationDate: Date;
  nextPeriod: Date;
}

interface CycleDayInfo {
  day: number;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  description: string;
  fertility: 'low' | 'high' | 'peak';
  symptoms?: string[];
  recommendations?: string[];
}

const cycleDayInfo: { [key: number]: CycleDayInfo } = {
  1: {
    day: 1,
    phase: 'menstrual',
    description: 'First day of menstrual period',
    fertility: 'low',
    symptoms: ['Menstrual bleeding', 'Cramping', 'Fatigue'],
    recommendations: ['Rest', 'Stay hydrated', 'Take iron supplements if needed']
  },
  5: {
    day: 5,
    phase: 'follicular',
    description: 'Follicular phase begins',
    fertility: 'low',
    symptoms: ['Increased energy', 'Improved mood'],
    recommendations: ['Start tracking fertility signs', 'Maintain healthy diet']
  },
  12: {
    day: 12,
    phase: 'ovulatory',
    description: 'Approaching ovulation',
    fertility: 'high',
    symptoms: ['Increased cervical mucus', 'Slight temperature rise', 'Increased libido'],
    recommendations: ['Track basal body temperature', 'Monitor cervical mucus changes']
  },
  14: {
    day: 14,
    phase: 'ovulatory',
    description: 'Typical ovulation day',
    fertility: 'peak',
    symptoms: ['Possible ovulation pain', 'Peak cervical mucus', 'Temperature spike'],
    recommendations: ['Optimal time for conception', 'Continue tracking symptoms']
  },
  16: {
    day: 16,
    phase: 'luteal',
    description: 'Post-ovulation phase begins',
    fertility: 'low',
    symptoms: ['Temperature remains elevated', 'Possible breast tenderness'],
    recommendations: ['Continue temperature tracking', 'Note any early pregnancy symptoms']
  },
  28: {
    day: 28,
    phase: 'luteal',
    description: 'End of typical cycle',
    fertility: 'low',
    symptoms: ['Possible PMS symptoms', 'Mood changes'],
    recommendations: ['Prepare for next cycle', 'Review cycle notes']
  }
};

interface FertilityTip {
  category: string;
  title: string;
  description: string;
}

const fertilityTips: FertilityTip[] = [
  {
    category: 'Tracking',
    title: 'Basal Body Temperature',
    description: 'Take your temperature first thing in the morning, before getting out of bed. A slight increase indicates ovulation.'
  },
  {
    category: 'Tracking',
    title: 'Cervical Mucus',
    description: 'Monitor changes in cervical mucus. Fertile mucus is clear and stretchy, like egg whites.'
  },
  {
    category: 'Lifestyle',
    title: 'Diet and Exercise',
    description: 'Maintain a healthy diet and moderate exercise routine to support regular ovulation.'
  },
  {
    category: 'Lifestyle',
    title: 'Stress Management',
    description: 'High stress can affect ovulation. Practice stress-reduction techniques like meditation or yoga.'
  },
  {
    category: 'Medical',
    title: 'Regular Check-ups',
    description: 'Schedule regular gynecological check-ups to monitor reproductive health.'
  },
  {
    category: 'Medical',
    title: 'Supplements',
    description: 'Consider prenatal vitamins or folic acid if trying to conceive.'
  }
];

export default function OvulationCalculator() {
  const breadcrumbItems = [
    {
      label: 'Ovulation Calculator',
      href: '/ovulation-calculator'
    }
  ];

  // State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [lutealLength, setLutealLength] = useState<number>(14);
  const [fertilityWindow, setFertilityWindow] = useState<FertilityWindow | null>(null);
  const [currentCycleDay, setCurrentCycleDay] = useState<number>(0);
  const [currentPhaseInfo, setCurrentPhaseInfo] = useState<CycleDayInfo | null>(null);

  // Calculate fertility window
  const calculateFertilityWindow = () => {
    if (!lastPeriodDate) return;

    const periodStart = new Date(lastPeriodDate);
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycleLength - lutealLength);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    const nextPeriod = new Date(lastPeriodDate);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

    setFertilityWindow({
      start: fertileStart,
      end: fertileEnd,
      ovulationDate: ovulationDate,
      nextPeriod: nextPeriod
    });

    // Calculate current cycle day
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - periodStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setCurrentCycleDay(diffDays);

    // Set current phase info
    const cycleInfo = Object.values(cycleDayInfo).reduce((prev, curr) => {
      if (diffDays >= curr.day) return curr;
      return prev;
    }, cycleDayInfo[1]);
    setCurrentPhaseInfo(cycleInfo);
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

  // Get cycle phase chart
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
            { value: 5, name: 'Menstrual', itemStyle: { color: '#EF4444' } },
            { value: 7, name: 'Follicular', itemStyle: { color: '#3B82F6' } },
            { value: 2, name: 'Ovulatory', itemStyle: { color: '#10B981' } },
            { value: 14, name: 'Luteal', itemStyle: { color: '#8B5CF6' } }
          ]
        }
      ]
    };
  };

  // Calculate dates when inputs change
  useEffect(() => {
    if (lastPeriodDate) {
      calculateFertilityWindow();
    }
  }, [lastPeriodDate, cycleLength, lutealLength]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Ovulation Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Fertility Window</h2>
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
                    <span className="label-text">Luteal Phase Length (days)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time between ovulation and next period. Usually 14 days.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={lutealLength}
                    onChange={(e) => setLutealLength(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="10"
                    max="16"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateFertilityWindow}
                >
                  Calculate Fertility Window
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {fertilityWindow && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your Fertility Timeline</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Key Dates */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Fertile Window</div>
                        <div className="stat-value text-blue-500 text-lg">
                          {formatDate(fertilityWindow.start)} - {formatDate(fertilityWindow.end)}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Ovulation Date</div>
                        <div className="stat-value text-green-500 text-lg">
                          {formatDate(fertilityWindow.ovulationDate)}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Next Period</div>
                        <div className="stat-value text-purple-500 text-lg">
                          {formatDate(fertilityWindow.nextPeriod)}
                        </div>
                      </div>
                    </div>

                    {/* Cycle Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Cycle Phases</h3>
                      <ReactECharts option={getCycleChart()} style={{ height: '300px' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Phase Information */}
            {currentPhaseInfo && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Current Phase: Day {currentCycleDay}</h2>
                </CardHeader>
                <CardContent>
                  <div className="bg-base-200 p-4 rounded-lg space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{currentPhaseInfo.phase} Phase</h3>
                      <p>{currentPhaseInfo.description}</p>
                    </div>

                    {currentPhaseInfo.symptoms && (
                      <div>
                        <h4 className="font-semibold">Common Symptoms:</h4>
                        <ul className="list-disc pl-6">
                          {currentPhaseInfo.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentPhaseInfo.recommendations && (
                      <div>
                        <h4 className="font-semibold">Recommendations:</h4>
                        <ul className="list-disc pl-6">
                          {currentPhaseInfo.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fertility Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Fertility Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fertilityTips.map((tip, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          tip.category === 'Tracking'
                            ? 'bg-blue-100 text-blue-800'
                            : tip.category === 'Lifestyle'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {tip.category}
                        </span>
                      </div>
                      <p>{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
