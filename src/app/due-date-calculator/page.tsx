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

interface Milestone {
  week: number;
  title: string;
  description: string;
  category: 'baby' | 'mother' | 'medical';
}

const milestones: Milestone[] = [
  {
    week: 4,
    title: 'Implantation',
    description: 'The fertilized egg implants in the uterus',
    category: 'baby'
  },
  {
    week: 8,
    title: 'Major Organs Form',
    description: 'All major organs and structures have begun to form',
    category: 'baby'
  },
  {
    week: 12,
    title: 'First Trimester Screening',
    description: 'First trimester screening tests are typically performed',
    category: 'medical'
  },
  {
    week: 16,
    title: 'Gender Reveal',
    description: 'Baby\'s gender may be visible on ultrasound',
    category: 'baby'
  },
  {
    week: 20,
    title: 'Anatomy Scan',
    description: 'Detailed ultrasound to check baby\'s anatomy',
    category: 'medical'
  },
  {
    week: 24,
    title: 'Viability',
    description: 'Baby reaches viability milestone',
    category: 'baby'
  },
  {
    week: 28,
    title: 'Third Trimester',
    description: 'Beginning of the third trimester',
    category: 'mother'
  },
  {
    week: 32,
    title: 'Baby\'s Position',
    description: 'Baby should begin to move into birth position',
    category: 'baby'
  },
  {
    week: 36,
    title: 'Full Term Soon',
    description: 'Baby is considered early term at 37 weeks',
    category: 'medical'
  },
  {
    week: 40,
    title: 'Due Date',
    description: 'Your estimated due date',
    category: 'medical'
  }
];

interface PregnancyTest {
  week: number;
  name: string;
  description: string;
  recommended: boolean;
}

const pregnancyTests: PregnancyTest[] = [
  {
    week: 8,
    name: 'First Prenatal Visit',
    description: 'Initial pregnancy confirmation and health assessment',
    recommended: true
  },
  {
    week: 12,
    name: 'First Trimester Screening',
    description: 'Blood test and ultrasound for chromosomal abnormalities',
    recommended: true
  },
  {
    week: 20,
    name: 'Anatomy Scan',
    description: 'Detailed ultrasound examining baby\'s anatomy',
    recommended: true
  },
  {
    week: 24,
    name: 'Glucose Test',
    description: 'Screening for gestational diabetes',
    recommended: true
  },
  {
    week: 28,
    name: 'Rh Factor Test',
    description: 'Blood type compatibility test if mother is Rh negative',
    recommended: false
  },
  {
    week: 36,
    name: 'Group B Strep',
    description: 'Test for Group B Streptococcus bacteria',
    recommended: true
  }
];

export default function DueDateCalculator() {
  const breadcrumbItems = [
    {
      label: 'Due Date Calculator',
      href: '/due-date-calculator'
    }
  ];

  // State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [conceptionDate, setConceptionDate] = useState<string>('');
  const [useConceptionDate, setUseConceptionDate] = useState<boolean>(false);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<PregnancyTest[]>([]);

  // Calculate pregnancy dates and milestones
  const calculateDates = () => {
    let calculatedDueDate: Date | null = null;
    let startDate: Date;

    if (useConceptionDate && conceptionDate) {
      startDate = new Date(conceptionDate);
      calculatedDueDate = new Date(conceptionDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 266); // 38 weeks from conception
    } else if (lastPeriodDate) {
      startDate = new Date(lastPeriodDate);
      calculatedDueDate = new Date(lastPeriodDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 280); // 40 weeks from LMP
    } else {
      return;
    }

    setDueDate(calculatedDueDate);

    // Calculate current week
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    setCurrentWeek(diffWeeks);

    // Set upcoming milestones
    const upcoming = milestones.filter(milestone => milestone.week > diffWeeks);
    setUpcomingMilestones(upcoming);

    // Set upcoming tests
    const tests = pregnancyTests.filter(test => test.week > diffWeeks);
    setUpcomingTests(tests);
  };

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Not calculated';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get pregnancy progress chart
  const getProgressChart = () => {
    const totalWeeks = 40;
    const completed = Math.min(currentWeek, totalWeeks);
    const remaining = Math.max(totalWeeks - completed, 0);

    return {
      title: {
        text: 'Pregnancy Progress',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} weeks'
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
            { value: completed, name: 'Completed', itemStyle: { color: '#3B82F6' } },
            { value: remaining, name: 'Remaining', itemStyle: { color: '#E5E7EB' } }
          ]
        }
      ]
    };
  };

  // Calculate dates when inputs change
  useEffect(() => {
    if ((lastPeriodDate && !useConceptionDate) || (conceptionDate && useConceptionDate)) {
      calculateDates();
    }
  }, [lastPeriodDate, conceptionDate, useConceptionDate, cycleLength]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Due Date Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Due Date</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">I know my conception date</span>
                    <input
                      type="checkbox"
                      checked={useConceptionDate}
                      onChange={(e) => {
                        setUseConceptionDate(e.target.checked);
                        setLastPeriodDate('');
                        setConceptionDate('');
                      }}
                      className="checkbox"
                    />
                  </label>
                </div>

                {!useConceptionDate && (
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

                {useConceptionDate && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Conception Date</span>
                    </label>
                    <input
                      type="date"
                      value={conceptionDate}
                      onChange={(e) => setConceptionDate(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateDates}
                >
                  Calculate Due Date
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Pregnancy Timeline</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Key Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Due Date</div>
                      <div className="stat-value text-blue-500 text-lg">
                        {formatDate(dueDate)}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Current Week</div>
                      <div className="stat-value text-green-500 text-lg">
                        Week {currentWeek}
                      </div>
                    </div>
                  </div>

                  {/* Progress Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Pregnancy Progress</h3>
                    <ReactECharts option={getProgressChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Upcoming Milestones</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMilestones.map((milestone) => (
                    <div
                      key={milestone.week}
                      className="bg-base-200 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          Week {milestone.week}: {milestone.title}
                        </h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          milestone.category === 'baby'
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

            {/* Upcoming Tests */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommended Tests</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTests.map((test) => (
                    <div
                      key={test.week}
                      className="bg-base-200 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          Week {test.week}: {test.name}
                        </h3>
                        {test.recommended && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p>{test.description}</p>
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
