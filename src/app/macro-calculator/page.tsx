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
  calorieAdjustment: number;
  proteinRatio: number;
  carbRatio: number;
  fatRatio: number;
  description: string;
  recommendations: string[];
}

const goals: Goal[] = [
  {
    name: 'Weight Loss',
    calorieAdjustment: -500,
    proteinRatio: 0.40,
    carbRatio: 0.30,
    fatRatio: 0.30,
    description: 'Caloric deficit with higher protein for muscle preservation',
    recommendations: [
      'Higher protein to preserve muscle',
      'Moderate carbs for energy',
      'Essential fats for hormone function',
      'Focus on nutrient-dense foods',
      'Regular strength training'
    ]
  },
  {
    name: 'Maintenance',
    calorieAdjustment: 0,
    proteinRatio: 0.30,
    carbRatio: 0.40,
    fatRatio: 0.30,
    description: 'Balanced macros for weight maintenance',
    recommendations: [
      'Balanced protein for muscle maintenance',
      'Moderate carbs for energy',
      'Healthy fats for satiety',
      'Regular exercise routine',
      'Consistent meal timing'
    ]
  },
  {
    name: 'Muscle Gain',
    calorieAdjustment: 500,
    proteinRatio: 0.35,
    carbRatio: 0.45,
    fatRatio: 0.20,
    description: 'Caloric surplus with higher carbs for muscle growth',
    recommendations: [
      'High protein for muscle growth',
      'Higher carbs for energy and recovery',
      'Moderate fats for hormones',
      'Progressive overload training',
      'Post-workout nutrition'
    ]
  }
];

export default function MacroCalculator() {
  const breadcrumbItems = [
    {
      label: 'Macro Calculator',
      href: '/macro-calculator'
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
  const [macros, setMacros] = useState<{
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fats: { grams: number; calories: number };
  }>({
    protein: { grams: 0, calories: 0 },
    carbs: { grams: 0, calories: 0 },
    fats: { grams: 0, calories: 0 }
  });

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

  // Calculate macros
  const calculateMacros = () => {
    const calculatedBmr = calculateBMR();
    const calculatedTdee = Math.round(calculatedBmr * activityLevel.factor);
    setTdee(calculatedTdee);

    const calculatedTarget = calculatedTdee + goal.calorieAdjustment;
    setTargetCalories(calculatedTarget);

    // Calculate macros in grams and calories
    const proteinCals = calculatedTarget * goal.proteinRatio;
    const carbsCals = calculatedTarget * goal.carbRatio;
    const fatsCals = calculatedTarget * goal.fatRatio;

    setMacros({
      protein: {
        grams: Math.round(proteinCals / 4),
        calories: Math.round(proteinCals)
      },
      carbs: {
        grams: Math.round(carbsCals / 4),
        calories: Math.round(carbsCals)
      },
      fats: {
        grams: Math.round(fatsCals / 9),
        calories: Math.round(fatsCals)
      }
    });
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

  // Get macros chart
  const getMacrosChart = () => {
    return {
      title: {
        text: 'Macro Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} calories ({d}%)'
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
            { value: macros.protein.calories, name: 'Protein', itemStyle: { color: '#3B82F6' } },
            { value: macros.carbs.calories, name: 'Carbs', itemStyle: { color: '#34D399' } },
            { value: macros.fats.calories, name: 'Fats', itemStyle: { color: '#F87171' } }
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
    calculateMacros();
  }, [weight, height, age, gender, activityLevel, goal, unit, bodyFat]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Macro Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Macros</h2>
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
                  onClick={calculateMacros}
                >
                  Calculate Macros
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
                      <div className="stat-value text-blue-500">{macros.protein.grams}g</div>
                      <div className="stat-desc">{macros.protein.calories} calories</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Carbs</div>
                      <div className="stat-value text-green-500">{macros.carbs.grams}g</div>
                      <div className="stat-desc">{macros.carbs.calories} calories</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Fats</div>
                      <div className="stat-value text-red-500">{macros.fats.grams}g</div>
                      <div className="stat-desc">{macros.fats.calories} calories</div>
                    </div>
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
