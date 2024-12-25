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

interface WeightGainRecommendation {
  category: string;
  totalGain: {
    min: number;
    max: number;
  };
  weeklyGain: {
    min: number;
    max: number;
  };
  firstTrimester: {
    min: number;
    max: number;
  };
}

interface NutritionalTip {
  category: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

const weightGainGuidelines: { [key: string]: WeightGainRecommendation } = {
  underweight: {
    category: 'Underweight (BMI < 18.5)',
    totalGain: { min: 28, max: 40 },
    weeklyGain: { min: 1, max: 1.3 },
    firstTrimester: { min: 2, max: 4.4 }
  },
  normal: {
    category: 'Normal Weight (BMI 18.5-24.9)',
    totalGain: { min: 25, max: 35 },
    weeklyGain: { min: 0.8, max: 1 },
    firstTrimester: { min: 2, max: 4.4 }
  },
  overweight: {
    category: 'Overweight (BMI 25-29.9)',
    totalGain: { min: 15, max: 25 },
    weeklyGain: { min: 0.5, max: 0.7 },
    firstTrimester: { min: 2, max: 4.4 }
  },
  obese: {
    category: 'Obese (BMI ≥ 30)',
    totalGain: { min: 11, max: 20 },
    weeklyGain: { min: 0.4, max: 0.6 },
    firstTrimester: { min: 2, max: 4.4 }
  }
};

const nutritionalTips: NutritionalTip[] = [
  {
    category: 'Essential Nutrients',
    title: 'Folic Acid',
    description: 'Take 400-800 mcg daily to prevent neural tube defects.',
    importance: 'high'
  },
  {
    category: 'Essential Nutrients',
    title: 'Iron',
    description: 'Increase intake to prevent anemia and support baby\'s growth.',
    importance: 'high'
  },
  {
    category: 'Diet',
    title: 'Protein',
    description: 'Consume 75-100g daily for healthy tissue development.',
    importance: 'high'
  },
  {
    category: 'Diet',
    title: 'Calcium',
    description: '1000mg daily for bone development.',
    importance: 'medium'
  },
  {
    category: 'Hydration',
    title: 'Water Intake',
    description: 'Drink 8-12 glasses daily to maintain amniotic fluid.',
    importance: 'high'
  },
  {
    category: 'Safety',
    title: 'Food Safety',
    description: 'Avoid raw fish, unpasteurized dairy, and high-mercury fish.',
    importance: 'high'
  }
];

export default function PregnancyWeightGainCalculator() {
  const breadcrumbItems = [
    {
      label: 'Pregnancy Weight Gain Calculator',
      href: '/pregnancy-weight-gain-calculator'
    }
  ];

  // State
  const [height, setHeight] = useState<number>(165);
  const [prePregnancyWeight, setPrePregnancyWeight] = useState<number>(60);
  const [currentWeight, setCurrentWeight] = useState<number>(65);
  const [weeksPregnant, setWeeksPregnant] = useState<number>(20);
  const [isMultiples, setIsMultiples] = useState<boolean>(false);
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [recommendation, setRecommendation] = useState<WeightGainRecommendation | null>(null);

  // Calculate BMI and set category
  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = prePregnancyWeight / (heightInMeters * heightInMeters);
    setBmi(Math.round(bmiValue * 10) / 10);

    if (bmiValue < 18.5) setBmiCategory('underweight');
    else if (bmiValue < 25) setBmiCategory('normal');
    else if (bmiValue < 30) setBmiCategory('overweight');
    else setBmiCategory('obese');

    return weightGainGuidelines[bmiCategory];
  };

  // Calculate weight gain targets
  const calculateWeightGain = () => {
    const rec = calculateBMI();
    if (!rec) return;

    setRecommendation(rec);
  };

  // Calculate current progress
  const calculateProgress = () => {
    if (!recommendation) return null;

    const weightGained = currentWeight - prePregnancyWeight;
    const targetMin = recommendation.totalGain.min;
    const targetMax = recommendation.totalGain.max;
    
    return {
      current: weightGained,
      targetMin,
      targetMax,
      percentage: (weightGained / targetMax) * 100
    };
  };

  // Get weight gain chart
  const getWeightGainChart = () => {
    const progress = calculateProgress();
    if (!progress) return {};

    return {
      title: {
        text: 'Weight Gain Progress',
        left: 'center'
      },
      tooltip: {
        formatter: '{b}: {c}lbs'
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: progress.targetMax,
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
            distance: -60
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
              return Math.round(value) + 'lbs';
            },
            color: 'auto'
          },
          data: [
            {
              value: progress.current,
              name: 'Weight Gained'
            }
          ]
        }
      ]
    };
  };

  // Calculate when inputs change
  useEffect(() => {
    if (height && prePregnancyWeight) {
      calculateWeightGain();
    }
  }, [height, prePregnancyWeight, currentWeight, weeksPregnant, isMultiples]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Pregnancy Weight Gain Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Weight Gain Target</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Height (cm)</span>
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="120"
                    max="220"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pre-Pregnancy Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    value={prePregnancyWeight}
                    onChange={(e) => setPrePregnancyWeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="30"
                    max="200"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="30"
                    max="200"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Weeks Pregnant</span>
                  </label>
                  <input
                    type="number"
                    value={weeksPregnant}
                    onChange={(e) => setWeeksPregnant(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="42"
                  />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Multiple Pregnancy (Twins/Triplets)</span>
                    <input
                      type="checkbox"
                      checked={isMultiples}
                      onChange={(e) => setIsMultiples(e.target.checked)}
                      className="checkbox"
                    />
                  </label>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateWeightGain}
                >
                  Calculate Weight Gain Target
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {recommendation && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your Weight Gain Guidelines</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* BMI Information */}
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Pre-Pregnancy BMI: {bmi}</h3>
                      <p>Category: {recommendation.category}</p>
                    </div>

                    {/* Weight Gain Progress */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Weight Gain Progress</h3>
                      <ReactECharts option={getWeightGainChart()} style={{ height: '300px' }} />
                    </div>

                    {/* Recommendations */}
                    <div className="grid gap-4">
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">Total Weight Gain Target</h3>
                        <p>{recommendation.totalGain.min} - {recommendation.totalGain.max} kg</p>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">Weekly Weight Gain (2nd & 3rd Trimester)</h3>
                        <p>{recommendation.weeklyGain.min} - {recommendation.weeklyGain.max} kg</p>
                      </div>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <h3 className="font-semibold">First Trimester Total</h3>
                        <p>{recommendation.firstTrimester.min} - {recommendation.firstTrimester.max} kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Nutritional Guidelines</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nutritionalTips.map((tip, index) => (
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

            {/* Weight Gain Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Healthy Weight Gain Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Regular Monitoring</h3>
                    <ul className="list-disc pl-6">
                      <li>Track your weight weekly</li>
                      <li>Keep a food diary</li>
                      <li>Monitor your exercise routine</li>
                      <li>Discuss concerns with your healthcare provider</li>
                    </ul>
                  </div>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Warning Signs</h3>
                    <ul className="list-disc pl-6">
                      <li>Rapid weight gain (more than 2kg/week)</li>
                      <li>Insufficient weight gain</li>
                      <li>Severe swelling or water retention</li>
                      <li>Loss of appetite for extended periods</li>
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
