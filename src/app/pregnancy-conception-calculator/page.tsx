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

interface PregnancyDates {
  conceptionDate: Date;
  dueDate: Date;
  currentWeek: number;
  currentTrimester: number;
}

interface Milestone {
  week: number;
  title: string;
  description: string;
  category: 'development' | 'medical' | 'lifestyle';
}

interface TrimesterInfo {
  trimester: number;
  weeks: string;
  description: string;
  keyChanges: string[];
  recommendations: string[];
}

const pregnancyMilestones: Milestone[] = [
  {
    week: 4,
    title: 'Implantation Complete',
    description: 'The fertilized egg has implanted in the uterus and pregnancy hormone levels are rising.',
    category: 'development'
  },
  {
    week: 6,
    title: 'First Heartbeat',
    description: 'Baby\'s heart begins to beat and basic neural tube forms.',
    category: 'development'
  },
  {
    week: 8,
    title: 'First Ultrasound',
    description: 'First ultrasound usually performed to confirm pregnancy and check development.',
    category: 'medical'
  },
  {
    week: 12,
    title: 'End of First Trimester',
    description: 'Risk of miscarriage decreases significantly. Major organs have formed.',
    category: 'development'
  },
  {
    week: 16,
    title: 'Gender Reveal',
    description: 'Baby\'s gender can usually be determined via ultrasound.',
    category: 'medical'
  },
  {
    week: 20,
    title: 'Anatomy Scan',
    description: 'Detailed ultrasound to check baby\'s anatomy and development.',
    category: 'medical'
  },
  {
    week: 24,
    title: 'Viability',
    description: 'Baby has a chance of survival if born prematurely.',
    category: 'development'
  },
  {
    week: 28,
    title: 'Third Trimester Begins',
    description: 'Baby\'s brain and nervous system are developing rapidly.',
    category: 'development'
  },
  {
    week: 32,
    title: 'Lung Development',
    description: 'Baby\'s lungs are nearly mature.',
    category: 'development'
  },
  {
    week: 36,
    title: 'Full Term Approaching',
    description: 'Baby could arrive any time in the next few weeks.',
    category: 'lifestyle'
  }
];

const trimesterInfo: TrimesterInfo[] = [
  {
    trimester: 1,
    weeks: '1-12',
    description: 'Foundation of all major organs and structures',
    keyChanges: [
      'Morning sickness may occur',
      'Fatigue is common',
      'Breast tenderness',
      'Frequent urination'
    ],
    recommendations: [
      'Take prenatal vitamins',
      'Avoid harmful substances',
      'Get plenty of rest',
      'Stay hydrated'
    ]
  },
  {
    trimester: 2,
    weeks: '13-26',
    description: 'Period of rapid growth and development',
    keyChanges: [
      'Morning sickness usually improves',
      'Energy levels increase',
      'Baby movements become noticeable',
      'Appetite increases'
    ],
    recommendations: [
      'Start pregnancy exercises',
      'Plan maternity leave',
      'Consider childbirth classes',
      'Monitor weight gain'
    ]
  },
  {
    trimester: 3,
    weeks: '27-40',
    description: 'Final preparation for birth',
    keyChanges: [
      'Shortness of breath',
      'Difficulty sleeping',
      'Braxton Hicks contractions',
      'Lower back pain'
    ],
    recommendations: [
      'Prepare hospital bag',
      'Complete nursery setup',
      'Learn about labor signs',
      'Regular fetal movement monitoring'
    ]
  }
];

export default function PregnancyConceptionCalculator() {
  const breadcrumbItems = [
    {
      label: 'Pregnancy Conception Calculator',
      href: '/pregnancy-conception-calculator'
    }
  ];

  // State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [knownConceptionDate, setKnownConceptionDate] = useState<string>('');
  const [useConceptionDate, setUseConceptionDate] = useState<boolean>(false);
  const [pregnancyDates, setPregnancyDates] = useState<PregnancyDates | null>(null);
  const [currentTrimesterInfo, setCurrentTrimesterInfo] = useState<TrimesterInfo | null>(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);

  // Calculate pregnancy dates
  const calculateDates = () => {
    let conceptionDate: Date;
    if (useConceptionDate && knownConceptionDate) {
      conceptionDate = new Date(knownConceptionDate);
    } else if (lastPeriodDate) {
      conceptionDate = new Date(lastPeriodDate);
      conceptionDate.setDate(conceptionDate.getDate() + cycleLength - 14); // Assuming ovulation 14 days before next period
    } else {
      return;
    }

    const dueDate = new Date(conceptionDate);
    dueDate.setDate(dueDate.getDate() + 266); // 38 weeks from conception

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - conceptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(diffDays / 7) + 2; // Add 2 weeks as pregnancy weeks start from LMP
    const currentTrimester = Math.ceil(currentWeek / 13);

    setPregnancyDates({
      conceptionDate,
      dueDate,
      currentWeek,
      currentTrimester
    });

    // Set current trimester info
    setCurrentTrimesterInfo(trimesterInfo[currentTrimester - 1]);

    // Set upcoming milestones
    const upcoming = pregnancyMilestones.filter(m => m.week >= currentWeek).slice(0, 5);
    setUpcomingMilestones(upcoming);
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

  // Get pregnancy progress chart
  const getProgressChart = () => {
    if (!pregnancyDates) return {};

    const totalWeeks = 40;
    const currentWeek = pregnancyDates.currentWeek;
    const progress = (currentWeek / totalWeeks) * 100;

    return {
      title: {
        text: 'Pregnancy Progress',
        left: 'center'
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 4,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.25, '#58d9f9'],
                [0.5, '#7cffb2'],
                [0.75, '#fddd60'],
                [1, '#ff6e76']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function (value: number) {
              return value + '%';
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function (value: number) {
              return Math.round(value) + '%';
            },
            color: 'auto'
          },
          data: [
            {
              value: progress,
              name: 'Progress'
            }
          ]
        }
      ]
    };
  };

  // Calculate dates when inputs change
  useEffect(() => {
    if ((useConceptionDate && knownConceptionDate) || (!useConceptionDate && lastPeriodDate)) {
      calculateDates();
    }
  }, [lastPeriodDate, cycleLength, knownConceptionDate, useConceptionDate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Pregnancy Conception Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Conception Date</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">I know my conception date</span>
                    <input
                      type="checkbox"
                      checked={useConceptionDate}
                      onChange={(e) => setUseConceptionDate(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                {useConceptionDate ? (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Conception Date</span>
                    </label>
                    <input
                      type="date"
                      value={knownConceptionDate}
                      onChange={(e) => setKnownConceptionDate(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateDates}
                >
                  Calculate Dates
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {pregnancyDates && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your Pregnancy Timeline</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Pregnancy Progress</h3>
                      <ReactECharts option={getProgressChart()} style={{ height: '300px' }} />
                    </div>

                    {/* Key Dates */}
                    <div className="grid gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">Conception Date</h3>
                        <p className="text-blue-600">{formatDate(pregnancyDates.conceptionDate)}</p>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">Due Date</h3>
                        <p className="text-green-600">{formatDate(pregnancyDates.dueDate)}</p>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">Current Progress</h3>
                        <p>Week {pregnancyDates.currentWeek} (Trimester {pregnancyDates.currentTrimester})</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Trimester Information */}
            {currentTrimesterInfo && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Trimester {currentTrimesterInfo.trimester} Overview</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Weeks {currentTrimesterInfo.weeks}</h3>
                      <p>{currentTrimesterInfo.description}</p>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Key Changes</h3>
                      <ul className="list-disc pl-6">
                        {currentTrimesterInfo.keyChanges.map((change, index) => (
                          <li key={index}>{change}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                      <ul className="list-disc pl-6">
                        {currentTrimesterInfo.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Milestones */}
            {upcomingMilestones.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Upcoming Milestones</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMilestones.map((milestone, index) => (
                      <div key={index} className="bg-base-200 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">Week {milestone.week}: {milestone.title}</h3>
                          <span className={`px-2 py-1 rounded text-sm ${
                            milestone.category === 'development'
                              ? 'bg-blue-100 text-blue-800'
                              : milestone.category === 'medical'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {milestone.category}
                          </span>
                        </div>
                        <p>{milestone.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
