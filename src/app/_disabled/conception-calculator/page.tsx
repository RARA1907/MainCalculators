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

interface ConceptionWindow {
  start: Date;
  end: Date;
  ovulationDate: Date;
  dueDate: Date;
}

interface ConceptionTip {
  category: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

const conceptionTips: ConceptionTip[] = [
  {
    category: 'Timing',
    title: 'Optimal Intercourse Timing',
    description: 'Have intercourse every 1-2 days during your fertile window, particularly 2-3 days before ovulation.',
    importance: 'high'
  },
  {
    category: 'Health',
    title: 'Prenatal Vitamins',
    description: 'Start taking prenatal vitamins with folic acid at least 3 months before trying to conceive.',
    importance: 'high'
  },
  {
    category: 'Lifestyle',
    title: 'Maintain Healthy Weight',
    description: 'Keep BMI between 18.5-24.9 for optimal fertility. Being under or overweight can affect conception.',
    importance: 'medium'
  },
  {
    category: 'Health',
    title: 'Track Basal Temperature',
    description: 'Monitor your basal body temperature to identify ovulation patterns.',
    importance: 'medium'
  },
  {
    category: 'Lifestyle',
    title: 'Reduce Stress',
    description: 'Practice stress-reduction techniques as high stress can affect fertility.',
    importance: 'medium'
  },
  {
    category: 'Health',
    title: 'Avoid Alcohol',
    description: 'Stop alcohol consumption when trying to conceive as it can affect fertility and fetal development.',
    importance: 'high'
  }
];

interface PreConceptionTest {
  name: string;
  description: string;
  timing: string;
  recommended: boolean;
}

const preConceptionTests: PreConceptionTest[] = [
  {
    name: 'General Health Check',
    description: 'Complete physical exam and health history review',
    timing: 'Before trying to conceive',
    recommended: true
  },
  {
    name: 'STI Screening',
    description: 'Test for sexually transmitted infections',
    timing: 'Before trying to conceive',
    recommended: true
  },
  {
    name: 'Genetic Carrier Screening',
    description: 'Test for inherited genetic conditions',
    timing: '3-6 months before trying',
    recommended: false
  },
  {
    name: 'Blood Type and Rh Factor',
    description: 'Determine blood type and Rh status',
    timing: 'Before pregnancy',
    recommended: true
  },
  {
    name: 'Immunity Check',
    description: 'Test immunity to rubella and chickenpox',
    timing: 'Before trying to conceive',
    recommended: true
  }
];

export default function ConceptionCalculator() {
  const breadcrumbItems = [
    {
      label: 'Conception Calculator',
      href: '/conception-calculator'
    }
  ];

  // State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [age, setAge] = useState<number>(30);
  const [conceptionWindow, setConceptionWindow] = useState<ConceptionWindow | null>(null);
  const [monthsTrying, setMonthsTrying] = useState<number>(0);
  const [fertilityFactors, setFertilityFactors] = useState({
    regularCycles: true,
    normalBMI: true,
    noSmoking: true,
    limitedAlcohol: true,
    takingPrenatals: false
  });

  // Calculate conception window
  const calculateConceptionWindow = () => {
    if (!lastPeriodDate) return;

    const periodStart = new Date(lastPeriodDate);
    const ovulationDate = new Date(lastPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14); // Assuming 14-day luteal phase

    const windowStart = new Date(ovulationDate);
    windowStart.setDate(windowStart.getDate() - 5);

    const windowEnd = new Date(ovulationDate);
    windowEnd.setDate(windowEnd.getDate() + 1);

    const dueDate = new Date(ovulationDate);
    dueDate.setDate(dueDate.getDate() + 266); // 38 weeks from ovulation

    setConceptionWindow({
      start: windowStart,
      end: windowEnd,
      ovulationDate: ovulationDate,
      dueDate: dueDate
    });
  };

  // Calculate conception probability
  const calculateConceptionProbability = (): number => {
    let probability = 0;

    // Base probability by age
    if (age < 30) probability = 25;
    else if (age < 35) probability = 20;
    else if (age < 40) probability = 15;
    else probability = 10;

    // Adjust for fertility factors
    if (fertilityFactors.regularCycles) probability += 5;
    if (fertilityFactors.normalBMI) probability += 3;
    if (fertilityFactors.noSmoking) probability += 4;
    if (fertilityFactors.limitedAlcohol) probability += 3;
    if (fertilityFactors.takingPrenatals) probability += 2;

    // Cap at 40%
    return Math.min(probability, 40);
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

  // Get conception probability chart
  const getProbabilityChart = () => {
    const probability = calculateConceptionProbability();
    
    return {
      title: {
        text: 'Monthly Conception Probability',
        left: 'center'
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 40,
          splitNumber: 4,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.25, '#ff6e76'],
                [0.5, '#fddd60'],
                [0.75, '#7cffb2'],
                [1, '#58d9f9']
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
              if (value === 0) return '0%';
              if (value === 40) return '40%';
              return '';
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
              value: probability,
              name: 'Probability'
            }
          ]
        }
      ]
    };
  };

  // Calculate dates when inputs change
  useEffect(() => {
    if (lastPeriodDate) {
      calculateConceptionWindow();
    }
  }, [lastPeriodDate, cycleLength]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Conception Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Conception Window</h2>
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
                    <span className="label-text">Your Age</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="18"
                    max="50"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Months Trying to Conceive</span>
                  </label>
                  <input
                    type="number"
                    value={monthsTrying}
                    onChange={(e) => setMonthsTrying(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Fertility Factors</h3>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Regular Menstrual Cycles</span>
                      <input
                        type="checkbox"
                        checked={fertilityFactors.regularCycles}
                        onChange={(e) => setFertilityFactors({
                          ...fertilityFactors,
                          regularCycles: e.target.checked
                        })}
                        className="checkbox"
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Normal BMI (18.5-24.9)</span>
                      <input
                        type="checkbox"
                        checked={fertilityFactors.normalBMI}
                        onChange={(e) => setFertilityFactors({
                          ...fertilityFactors,
                          normalBMI: e.target.checked
                        })}
                        className="checkbox"
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Non-Smoker</span>
                      <input
                        type="checkbox"
                        checked={fertilityFactors.noSmoking}
                        onChange={(e) => setFertilityFactors({
                          ...fertilityFactors,
                          noSmoking: e.target.checked
                        })}
                        className="checkbox"
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Limited/No Alcohol</span>
                      <input
                        type="checkbox"
                        checked={fertilityFactors.limitedAlcohol}
                        onChange={(e) => setFertilityFactors({
                          ...fertilityFactors,
                          limitedAlcohol: e.target.checked
                        })}
                        className="checkbox"
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Taking Prenatal Vitamins</span>
                      <input
                        type="checkbox"
                        checked={fertilityFactors.takingPrenatals}
                        onChange={(e) => setFertilityFactors({
                          ...fertilityFactors,
                          takingPrenatals: e.target.checked
                        })}
                        className="checkbox"
                      />
                    </label>
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateConceptionWindow}
                >
                  Calculate Conception Window
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {conceptionWindow && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your Conception Timeline</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Key Dates */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Fertile Window</div>
                        <div className="stat-value text-blue-500 text-lg">
                          {formatDate(conceptionWindow.start)} - {formatDate(conceptionWindow.end)}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Ovulation Date</div>
                        <div className="stat-value text-green-500 text-lg">
                          {formatDate(conceptionWindow.ovulationDate)}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Potential Due Date</div>
                        <div className="stat-value text-purple-500 text-lg">
                          {formatDate(conceptionWindow.dueDate)}
                        </div>
                      </div>
                    </div>

                    {/* Probability Chart */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Conception Probability</h3>
                      <ReactECharts option={getProbabilityChart()} style={{ height: '300px' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Pre-Conception Tests</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {preConceptionTests.map((test, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{test.name}</h3>
                        {test.recommended && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="mb-2">{test.description}</p>
                      <p className="text-sm text-gray-600">Timing: {test.timing}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conception Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Conception Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conceptionTips.map((tip, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          tip.importance === 'high'
                            ? 'bg-red-100 text-red-800'
                            : tip.importance === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tip.importance} priority
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
