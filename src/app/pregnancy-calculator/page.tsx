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

interface Trimester {
  name: string;
  startWeek: number;
  endWeek: number;
  description: string;
  milestones: string[];
  recommendations: string[];
}

const trimesters: Trimester[] = [
  {
    name: 'First Trimester',
    startWeek: 1,
    endWeek: 12,
    description: 'Major organ development and highest risk period',
    milestones: [
      'Week 4: Implantation occurs',
      'Week 6: Heart begins to beat',
      'Week 8: All major organs form',
      'Week 12: Risk of miscarriage decreases'
    ],
    recommendations: [
      'Take prenatal vitamins',
      'Avoid alcohol and smoking',
      'Get plenty of rest',
      'Stay hydrated',
      'Schedule prenatal visits'
    ]
  },
  {
    name: 'Second Trimester',
    startWeek: 13,
    endWeek: 26,
    description: 'Period of rapid growth and movement',
    milestones: [
      'Week 16: Baby movements may be felt',
      'Week 18-20: Gender can be determined',
      'Week 20: Detailed anatomy scan',
      'Week 24: Viable age reached'
    ],
    recommendations: [
      'Continue prenatal care',
      'Exercise moderately',
      'Monitor weight gain',
      'Plan for maternity leave',
      'Consider childbirth classes'
    ]
  },
  {
    name: 'Third Trimester',
    startWeek: 27,
    endWeek: 40,
    description: 'Final growth and preparation for birth',
    milestones: [
      'Week 28: Baby can open eyes',
      'Week 32: Baby practices breathing',
      'Week 36: Baby drops into pelvis',
      'Week 40: Due date reached'
    ],
    recommendations: [
      'Monitor baby movements',
      'Prepare for labor',
      'Pack hospital bag',
      'Complete nursery setup',
      'Rest frequently'
    ]
  }
];

interface PregnancyTest {
  name: string;
  timing: string;
  description: string;
  importance: string;
}

const pregnancyTests: PregnancyTest[] = [
  {
    name: 'First Trimester Screening',
    timing: '11-13 weeks',
    description: 'Blood test and ultrasound to check for chromosomal abnormalities',
    importance: 'Early detection of potential issues'
  },
  {
    name: 'Anatomy Scan',
    timing: '18-22 weeks',
    description: 'Detailed ultrasound to check baby\'s development',
    importance: 'Comprehensive check of baby\'s organs and growth'
  },
  {
    name: 'Glucose Screening',
    timing: '24-28 weeks',
    description: 'Test for gestational diabetes',
    importance: 'Essential for managing pregnancy health'
  },
  {
    name: 'Group B Strep Test',
    timing: '35-37 weeks',
    description: 'Swab test for bacterial infection',
    importance: 'Important for delivery planning'
  }
];

export default function PregnancyCalculator() {
  const breadcrumbItems = [
    {
      label: 'Pregnancy Calculator',
      href: '/pregnancy-calculator'
    }
  ];

  // Input states
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [knownConceptionDate, setKnownConceptionDate] = useState<boolean>(false);
  const [conceptionDate, setConceptionDate] = useState<string>('');
  const [ultrasoundDate, setUltrasoundDate] = useState<string>('');
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState<number>(8);

  // Result states
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentTrimester, setCurrentTrimester] = useState<Trimester | null>(null);
  const [upcomingTests, setUpcomingTests] = useState<PregnancyTest[]>([]);
  const [importantDates, setImportantDates] = useState<{
    conception: Date | null;
    firstTrimester: Date | null;
    secondTrimester: Date | null;
    thirdTrimester: Date | null;
    viabilityDate: Date | null;
  }>({
    conception: null,
    firstTrimester: null,
    secondTrimester: null,
    thirdTrimester: null,
    viabilityDate: null
  });

  // Calculate pregnancy dates
  const calculateDates = () => {
    let calculatedDueDate: Date | null = null;

    if (knownConceptionDate && conceptionDate) {
      // Calculate from conception date
      calculatedDueDate = new Date(conceptionDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 266); // 38 weeks from conception
    } else if (ultrasoundDate) {
      // Calculate from ultrasound date
      calculatedDueDate = new Date(ultrasoundDate);
      const daysToAdd = (40 - ultrasoundWeeks) * 7;
      calculatedDueDate.setDate(calculatedDueDate.getDate() + daysToAdd);
    } else if (lastPeriodDate) {
      // Calculate from last menstrual period
      calculatedDueDate = new Date(lastPeriodDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 280); // 40 weeks
    }

    if (calculatedDueDate) {
      setDueDate(calculatedDueDate);

      // Calculate current week
      const today = new Date();
      const startDate = knownConceptionDate ? new Date(conceptionDate) : new Date(lastPeriodDate);
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      setCurrentWeek(diffWeeks);

      // Set current trimester
      const currentTrim = trimesters.find(trim => 
        diffWeeks >= trim.startWeek && diffWeeks <= trim.endWeek
      );
      setCurrentTrimester(currentTrim || null);

      // Calculate important dates
      const conceptionDateObj = new Date(startDate);
      if (!knownConceptionDate) {
        conceptionDateObj.setDate(conceptionDateObj.getDate() + 14); // Approximate conception
      }

      setImportantDates({
        conception: conceptionDateObj,
        firstTrimester: addWeeksToDate(startDate, 13),
        secondTrimester: addWeeksToDate(startDate, 27),
        thirdTrimester: addWeeksToDate(startDate, 40),
        viabilityDate: addWeeksToDate(startDate, 24)
      });

      // Set upcoming tests
      const remainingTests = pregnancyTests.filter(test => {
        const [startWeek] = test.timing.split('-').map(Number);
        return startWeek > diffWeeks;
      });
      setUpcomingTests(remainingTests);
    }
  };

  // Add weeks to date helper
  const addWeeksToDate = (date: Date, weeks: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (weeks * 7));
    return newDate;
  };

  // Format date helper
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Not calculated';
    return date.toLocaleDateString('en-US', {
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

  useEffect(() => {
    if (lastPeriodDate || (knownConceptionDate && conceptionDate) || ultrasoundDate) {
      calculateDates();
    }
  }, [lastPeriodDate, cycleLength, knownConceptionDate, conceptionDate, ultrasoundDate, ultrasoundWeeks]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Pregnancy Calculator</h1>
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
                  <label className="label">
                    <span className="label-text">Last Menstrual Period Date</span>
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    className="input input-bordered w-full"
                    disabled={knownConceptionDate || !!ultrasoundDate}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cycle Length (days)</span>
                  </label>
                  <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="21"
                    max="35"
                    disabled={knownConceptionDate || !!ultrasoundDate}
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">I know my conception date</span>
                    <input
                      type="checkbox"
                      checked={knownConceptionDate}
                      onChange={(e) => {
                        setKnownConceptionDate(e.target.checked);
                        if (e.target.checked) {
                          setLastPeriodDate('');
                          setUltrasoundDate('');
                        }
                      }}
                      className="checkbox"
                    />
                  </label>
                </div>

                {knownConceptionDate && (
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ultrasound Date (optional)</span>
                  </label>
                  <input
                    type="date"
                    value={ultrasoundDate}
                    onChange={(e) => setUltrasoundDate(e.target.value)}
                    className="input input-bordered w-full"
                    disabled={knownConceptionDate}
                  />
                </div>

                {ultrasoundDate && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Gestational Age at Ultrasound (weeks)</span>
                    </label>
                    <input
                      type="number"
                      value={ultrasoundWeeks}
                      onChange={(e) => setUltrasoundWeeks(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="6"
                      max="20"
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
                        {dueDate ? formatDate(dueDate) : 'Not calculated'}
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

                  {/* Important Dates */}
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Important Dates</h3>
                    <div className="space-y-2">
                      <p><strong>Conception:</strong> {formatDate(importantDates.conception)}</p>
                      <p><strong>First Trimester End:</strong> {formatDate(importantDates.firstTrimester)}</p>
                      <p><strong>Second Trimester End:</strong> {formatDate(importantDates.secondTrimester)}</p>
                      <p><strong>Viability Date:</strong> {formatDate(importantDates.viabilityDate)}</p>
                      <p><strong>Due Date:</strong> {formatDate(importantDates.thirdTrimester)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Trimester */}
            {currentTrimester && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold">{currentTrimester.name}</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p className="mb-4">{currentTrimester.description}</p>
                      
                      <h3 className="text-lg font-semibold mb-2">Key Milestones</h3>
                      <ul className="list-disc pl-6 mb-4">
                        {currentTrimester.milestones.map((milestone, index) => (
                          <li key={index}>{milestone}</li>
                        ))}
                      </ul>

                      <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                      <ul className="list-disc pl-6">
                        {currentTrimester.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Tests */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Upcoming Tests & Screenings</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="space-y-4">
                    {upcomingTests.map((test) => (
                      <div key={test.name} className="bg-base-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{test.name}</h3>
                        <div className="grid grid-cols-1 gap-2">
                          <p><strong>When:</strong> {test.timing}</p>
                          <p><strong>What:</strong> {test.description}</p>
                          <p><strong>Why:</strong> {test.importance}</p>
                        </div>
                      </div>
                    ))}
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
