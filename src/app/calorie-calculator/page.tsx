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
}

const activityLevels: ActivityLevel[] = [
  {
    name: 'Sedentary',
    factor: 1.2,
    description: 'Little or no exercise',
    examples: ['Desk job', 'No planned physical activity', 'Mostly sitting']
  },
  {
    name: 'Lightly Active',
    factor: 1.375,
    description: 'Light exercise 1-3 times/week',
    examples: ['Light walking', 'Basic daily activities', 'Standing job']
  },
  {
    name: 'Moderately Active',
    factor: 1.55,
    description: 'Moderate exercise 3-5 times/week',
    examples: ['Jogging', 'Light sports', 'Moderate lifting']
  },
  {
    name: 'Very Active',
    factor: 1.725,
    description: 'Hard exercise 6-7 times/week',
    examples: ['Heavy lifting', 'Training daily', 'Physical job']
  },
  {
    name: 'Extra Active',
    factor: 1.9,
    description: 'Very hard exercise & physical job',
    examples: ['Professional athlete', 'Very intense training', 'Manual labor']
  }
];

interface Goal {
  name: string;
  factor: number;
  description: string;
  recommendations: string[];
}

const goals: Goal[] = [
  {
    name: 'Weight Loss',
    factor: 0.8,
    description: 'Caloric deficit for healthy weight loss',
    recommendations: [
      'High protein intake',
      'Focus on whole foods',
      'Regular strength training',
      'Adequate sleep',
      'Stress management'
    ]
  },
  {
    name: 'Maintenance',
    factor: 1.0,
    description: 'Maintain current weight',
    recommendations: [
      'Balanced macronutrients',
      'Regular exercise',
      'Consistent meal timing',
      'Hydration',
      'Regular monitoring'
    ]
  },
  {
    name: 'Weight Gain',
    factor: 1.2,
    description: 'Caloric surplus for muscle gain',
    recommendations: [
      'Progressive overload training',
      'Increased protein intake',
      'Healthy fats',
      'Complex carbohydrates',
      'Post-workout nutrition'
    ]
  }
];

interface MacroRatio {
  name: string;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
}

const macroRatios: MacroRatio[] = [
  {
    name: 'Balanced',
    protein: 30,
    carbs: 40,
    fats: 30,
    description: 'Standard balanced diet suitable for most people'
  },
  {
    name: 'Low Carb',
    protein: 40,
    carbs: 20,
    fats: 40,
    description: 'Higher protein and fat, lower carbs for weight loss'
  },
  {
    name: 'High Protein',
    protein: 45,
    carbs: 35,
    fats: 20,
    description: 'Emphasis on protein for muscle building'
  }
];

export default function CalorieCalculator() {
  const breadcrumbItems = [
    {
      label: 'Calorie Calculator',
      href: '/calorie-calculator'
    }
  ];

  // Input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(activityLevels[1]);
  const [goal, setGoal] = useState<Goal>(goals[1]);
  const [macroRatio, setMacroRatio] = useState<MacroRatio>(macroRatios[0]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [targetCalories, setTargetCalories] = useState<number>(0);
  const [macros, setMacros] = useState<{
    protein: number;
    carbs: number;
    fats: number;
  }>({ protein: 0, carbs: 0, fats: 0 });

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    const heightCm = unit === 'metric' ? height : height * 2.54;
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;

    const bmr = gender === 'male'
      ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
      : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

    setBmr(Math.round(bmr));
    return bmr;
  };

  // Calculate TDEE and target calories
  const calculateCalories = () => {
    const calculatedBmr = calculateBMR();
    const calculatedTdee = Math.round(calculatedBmr * activityLevel.factor);
    setTdee(calculatedTdee);

    const calculatedTarget = Math.round(calculatedTdee * goal.factor);
    setTargetCalories(calculatedTarget);

    // Calculate macros
    const proteinGrams = Math.round((calculatedTarget * (macroRatio.protein / 100)) / 4);
    const carbGrams = Math.round((calculatedTarget * (macroRatio.carbs / 100)) / 4);
    const fatGrams = Math.round((calculatedTarget * (macroRatio.fats / 100)) / 9);

    setMacros({
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams
    });
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setHeight(Math.round(height / 2.54));
      setWeight(Math.round(weight * 2.20462));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setHeight(Math.round(height * 2.54));
      setWeight(Math.round(weight / 2.20462));
    }
    setUnit(newUnit);
  };

  // Get macros chart
  const getMacrosChart = () => {
    return {
      title: {
        text: 'Macro Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}g ({d}%)'
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
            { value: macros.protein, name: 'Protein', itemStyle: { color: '#3B82F6' } },
            { value: macros.carbs, name: 'Carbs', itemStyle: { color: '#34D399' } },
            { value: macros.fats, name: 'Fats', itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  // Get calories breakdown chart
  const getCaloriesChart = () => {
    return {
      title: {
        text: 'Calories Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} calories'
      },
      xAxis: {
        type: 'category',
        data: ['BMR', 'TDEE', 'Target']
      },
      yAxis: {
        type: 'value',
        name: 'Calories'
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: bmr, itemStyle: { color: '#3B82F6' } },
            { value: tdee, itemStyle: { color: '#34D399' } },
            { value: targetCalories, itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateCalories();
  }, [gender, age, height, weight, activityLevel, goal, macroRatio, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Calorie Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Calories</h2>
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
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Macro Distribution</span>
                  </label>
                  <div className="flex gap-4">
                    {macroRatios.map((ratio) => (
                      <button
                        key={ratio.name}
                        className={`btn flex-1 ${macroRatio.name === ratio.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setMacroRatio(ratio)}
                      >
                        {ratio.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {macroRatio.description}
                  </span>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateCalories}
                >
                  Calculate Calories
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">BMR</div>
                      <div className="stat-value text-primary">{bmr}</div>
                      <div className="stat-desc">Base Metabolic Rate</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">TDEE</div>
                      <div className="stat-value text-secondary">{tdee}</div>
                      <div className="stat-desc">Total Daily Energy</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Target</div>
                      <div className="stat-value text-accent">{targetCalories}</div>
                      <div className="stat-desc">Daily Goal</div>
                    </div>
                  </div>

                  {/* Calories Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Calories Breakdown</h3>
                    <ReactECharts option={getCaloriesChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Macros Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Macro Distribution</h3>
                    <ReactECharts option={getMacrosChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Macro Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Protein</div>
                      <div className="stat-value text-blue-500">{macros.protein}g</div>
                      <div className="stat-desc">{macroRatio.protein}% of calories</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Carbs</div>
                      <div className="stat-value text-green-500">{macros.carbs}g</div>
                      <div className="stat-desc">{macroRatio.carbs}% of calories</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Fats</div>
                      <div className="stat-value text-red-500">{macros.fats}g</div>
                      <div className="stat-desc">{macroRatio.fats}% of calories</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommendations for {goal.name}</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg mb-6">
                    <p className="mb-2">{goal.description}</p>
                    <ul className="list-disc pl-6">
                      {goal.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">Activity Level Details</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="mb-2">{activityLevel.description}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
