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

interface ActivityLevel {
  name: string;
  factor: number;
  description: string;
  examples: string[];
  calorieAdjustment: string;
}

const activityLevels: ActivityLevel[] = [
  {
    name: 'Sedentary',
    factor: 1.2,
    description: 'Little or no exercise',
    examples: ['Desk job', 'No planned exercise', 'Mostly sitting'],
    calorieAdjustment: 'BMR × 1.2'
  },
  {
    name: 'Lightly Active',
    factor: 1.375,
    description: 'Light exercise 1-3 times/week',
    examples: ['Light walking', 'Basic daily activities', 'Standing job'],
    calorieAdjustment: 'BMR × 1.375'
  },
  {
    name: 'Moderately Active',
    factor: 1.55,
    description: 'Moderate exercise 3-5 times/week',
    examples: ['Jogging', 'Light sports', 'Moderate lifting'],
    calorieAdjustment: 'BMR × 1.55'
  },
  {
    name: 'Very Active',
    factor: 1.725,
    description: 'Hard exercise 6-7 times/week',
    examples: ['Heavy lifting', 'Training daily', 'Physical job'],
    calorieAdjustment: 'BMR × 1.725'
  },
  {
    name: 'Extra Active',
    factor: 1.9,
    description: 'Very hard exercise & physical job',
    examples: ['Professional athlete', 'Very intense training', 'Manual labor'],
    calorieAdjustment: 'BMR × 1.9'
  }
];

interface Goal {
  name: string;
  calorieAdjustment: number;
  description: string;
  recommendations: string[];
}

const goals: Goal[] = [
  {
    name: 'Weight Loss',
    calorieAdjustment: -500,
    description: 'Create a caloric deficit for sustainable weight loss',
    recommendations: [
      'Aim for 0.5-1kg loss per week',
      'Focus on protein intake',
      'Include strength training',
      'Stay hydrated',
      'Get adequate sleep'
    ]
  },
  {
    name: 'Maintenance',
    calorieAdjustment: 0,
    description: 'Maintain current weight and body composition',
    recommendations: [
      'Balance macronutrients',
      'Regular exercise routine',
      'Monitor portion sizes',
      'Eat whole foods',
      'Stay consistent'
    ]
  },
  {
    name: 'Weight Gain',
    calorieAdjustment: 500,
    description: 'Create a caloric surplus for muscle gain',
    recommendations: [
      'Aim for 0.25-0.5kg gain per week',
      'High protein intake',
      'Progressive overload training',
      'Quality food sources',
      'Track progress'
    ]
  }
];

export default function TDEECalculator() {
  const breadcrumbItems = [
    {
      label: 'TDEE Calculator',
      href: '/tdee-calculator'
    }
  ];

  // Input states
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(activityLevels[2]);
  const [goal, setGoal] = useState<Goal>(goals[1]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bodyFat, setBodyFat] = useState<number>(20);

  // Result states
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [targetCalories, setTargetCalories] = useState<number>(0);
  const [weeklyChange, setWeeklyChange] = useState<number>(0);

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;
    const heightCm = unit === 'metric' ? height : height * 2.54;

    const bmr = gender === 'male'
      ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
      : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

    setBmr(Math.round(bmr));
    return bmr;
  };

  // Calculate TDEE and target calories
  const calculateTDEE = () => {
    const calculatedBmr = calculateBMR();
    const calculatedTdee = Math.round(calculatedBmr * activityLevel.factor);
    setTdee(calculatedTdee);

    const calculatedTarget = calculatedTdee + goal.calorieAdjustment;
    setTargetCalories(calculatedTarget);

    // Calculate weekly weight change
    setWeeklyChange(goal.calorieAdjustment * 7 / 7700); // 7700 calories = 1kg of body weight
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setWeight(Math.round(weight * 2.20462));
      setHeight(Math.round(height / 2.54));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setWeight(Math.round(weight / 2.20462));
      setHeight(Math.round(height * 2.54));
    }
    setUnit(newUnit);
  };

  // Get calories breakdown chart
  const getCaloriesChart = () => {
    return {
      title: {
        text: 'Daily Calories Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} calories'
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
            { value: bmr, name: 'BMR', itemStyle: { color: '#3B82F6' } },
            { value: tdee - bmr, name: 'Activity', itemStyle: { color: '#34D399' } },
            { value: Math.abs(goal.calorieAdjustment), name: goal.name, itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateTDEE();
  }, [weight, height, age, gender, activityLevel, goal, unit, bodyFat]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">TDEE Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your TDEE</h2>
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
                    <span className="label-text">Gender</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${gender === 'male' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setGender('male')}
                    >
                      Male
                    </button>
                    <button
                      className={`btn flex-1 ${gender === 'female' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setGender('female')}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</span>
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
                    <span className="label-text">Height ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Body Fat Percentage</span>
                  </label>
                  <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Activity Level</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {activityLevels.map((level) => (
                      <button
                        key={level.name}
                        className={`btn ${activityLevel.name === level.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setActivityLevel(level)}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {activityLevel.description}
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Goal</span>
                  </label>
                  <div className="flex gap-4">
                    {goals.map((g) => (
                      <button
                        key={g.name}
                        className={`btn flex-1 ${goal.name === g.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setGoal(g)}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {goal.description}
                  </span>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateTDEE}
                >
                  Calculate TDEE
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
                  {/* Calorie Calculations */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">BMR</div>
                      <div className="stat-value text-blue-500">{bmr}</div>
                      <div className="stat-desc">Base Metabolic Rate</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">TDEE</div>
                      <div className="stat-value text-green-500">{tdee}</div>
                      <div className="stat-desc">Total Daily Energy</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Target</div>
                      <div className="stat-value text-red-500">{targetCalories}</div>
                      <div className="stat-desc">Daily Goal</div>
                    </div>
                  </div>

                  {/* Calories Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Daily Calories Breakdown</h3>
                    <ReactECharts option={getCaloriesChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Weekly Change */}
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Weekly Progress</h3>
                    <p>Expected weekly {goal.name === 'Weight Loss' ? 'loss' : goal.name === 'Weight Gain' ? 'gain' : 'change'}: {Math.abs(weeklyChange).toFixed(2)} kg</p>
                    <p>Daily calorie {goal.calorieAdjustment >= 0 ? 'surplus' : 'deficit'}: {Math.abs(goal.calorieAdjustment)} calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Level Details */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Activity Level Details</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">{activityLevel.name}</h3>
                    <p className="mb-2">{activityLevel.description}</p>
                    <p className="mb-2">Calorie Adjustment: {activityLevel.calorieAdjustment}</p>
                    <p className="font-semibold mt-2">Examples:</p>
                    <ul className="list-disc pl-6">
                      {activityLevel.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommendations for {goal.name}</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="mb-2">{goal.description}</p>
                    <ul className="list-disc pl-6">
                      {goal.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
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
