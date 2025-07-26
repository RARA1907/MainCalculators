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

interface Exercise {
  name: string;
  category: string;
  description: string;
  tips: string[];
}

const exercises: Exercise[] = [
  {
    name: 'Bench Press',
    category: 'Push',
    description: 'Classic chest exercise performed lying on a bench',
    tips: [
      'Keep your feet flat on the ground',
      'Maintain a slight arch in your back',
      'Keep your wrists straight',
      'Lower the bar to mid-chest'
    ]
  },
  {
    name: 'Squat',
    category: 'Legs',
    description: 'Fundamental lower body exercise',
    tips: [
      'Keep your chest up',
      'Push your knees out',
      'Break at the hips first',
      'Keep your weight on your heels'
    ]
  },
  {
    name: 'Deadlift',
    category: 'Pull',
    description: 'Compound exercise targeting multiple muscle groups',
    tips: [
      'Keep the bar close to your body',
      'Maintain a neutral spine',
      'Push through your heels',
      'Engage your lats before lifting'
    ]
  },
  {
    name: 'Overhead Press',
    category: 'Push',
    description: 'Standing shoulder press movement',
    tips: [
      'Keep your core tight',
      'Don\'t lean back excessively',
      'Press straight up',
      'Lock out at the top'
    ]
  },
  {
    name: 'Barbell Row',
    category: 'Pull',
    description: 'Bent-over rowing movement',
    tips: [
      'Keep your back straight',
      'Pull to your lower chest',
      'Keep your elbows close',
      'Control the descent'
    ]
  }
];

export default function OneRepMaxCalculator() {
  const breadcrumbItems = [
    {
      label: 'One Rep Max Calculator',
      href: '/one-rep-max-calculator'
    }
  ];

  // Input states
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [oneRepMax, setOneRepMax] = useState<{
    brzycki: number;
    epley: number;
    lander: number;
    average: number;
  }>({
    brzycki: 0,
    epley: 0,
    lander: 0,
    average: 0
  });

  // Calculate 1RM using different formulas
  const calculateOneRepMax = () => {
    // Brzycki Formula
    const brzyckiMax = weight / (1.0278 - 0.0278 * reps);
    
    // Epley Formula
    const epleyMax = weight * (1 + 0.0333 * reps);
    
    // Lander Formula
    const landerMax = (100 * weight) / (101.3 - 2.67123 * reps);
    
    // Average of all formulas
    const avgMax = (brzyckiMax + epleyMax + landerMax) / 3;

    setOneRepMax({
      brzycki: Math.round(brzyckiMax),
      epley: Math.round(epleyMax),
      lander: Math.round(landerMax),
      average: Math.round(avgMax)
    });
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setWeight(Math.round(weight * 2.20462));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setWeight(Math.round(weight / 2.20462));
    }
    setUnit(newUnit);
  };

  // Get percentage chart options
  const getPercentageChart = () => {
    const percentages = [100, 95, 90, 85, 80, 75, 70, 65];
    const weights = percentages.map(p => Math.round((oneRepMax.average * p) / 100));

    return {
      title: {
        text: 'Training Percentages',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${percentages[data.dataIndex]}%: ${data.value} ${unit === 'metric' ? 'kg' : 'lbs'}`;
        }
      },
      xAxis: {
        type: 'category',
        data: percentages.map(p => p + '%'),
      },
      yAxis: {
        type: 'value',
        name: unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      },
      series: [
        {
          type: 'bar',
          data: weights,
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  // Get formula comparison chart
  const getFormulaChart = () => {
    return {
      title: {
        text: 'Formula Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}: ${data.value} ${unit === 'metric' ? 'kg' : 'lbs'}`;
        }
      },
      xAxis: {
        type: 'category',
        data: ['Brzycki', 'Epley', 'Lander', 'Average'],
      },
      yAxis: {
        type: 'value',
        name: unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      },
      series: [
        {
          type: 'bar',
          data: [
            oneRepMax.brzycki,
            oneRepMax.epley,
            oneRepMax.lander,
            oneRepMax.average
          ],
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateOneRepMax();
  }, [weight, reps, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">One Rep Max Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your 1RM</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit System</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${unit === 'metric' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => handleUnitChange('metric')}
                    >
                      Metric
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => handleUnitChange('imperial')}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Exercise</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedExercise.name}
                    onChange={(e) => setSelectedExercise(exercises.find(ex => ex.name === e.target.value) || exercises[0])}
                  >
                    {exercises.map((exercise) => (
                      <option key={exercise.name} value={exercise.name}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 mt-1">
                    {selectedExercise.description}
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </span>
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Repetitions</span>
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="10"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateOneRepMax}
                >
                  Calculate 1RM
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 1RM Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Estimated One Rep Max</div>
                    <div className="stat-value text-primary">
                      {oneRepMax.average} {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="stat-desc">Average of three formulas</div>
                  </div>

                  {/* Formula Comparison */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Formula Comparison</h3>
                    <ReactECharts option={getFormulaChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Training Percentages */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Training Percentages</h3>
                    <ReactECharts option={getPercentageChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Guide */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Exercise Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Form Tips</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {selectedExercise.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">About 1RM Formulas</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Brzycki: Most accurate for 1-5 reps</li>
                        <li>Epley: Good for higher rep ranges</li>
                        <li>Lander: Balanced across rep ranges</li>
                        <li>Average: Most reliable estimate</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Training Tips</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Use 90-95% for single reps</li>
                        <li>70-85% for multiple sets</li>
                        <li>60-70% for technique work</li>
                        <li>Test 1RM every 8-12 weeks</li>
                        <li>Always warm up properly</li>
                      </ul>
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
