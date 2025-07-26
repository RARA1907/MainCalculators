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
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ReactECharts from 'echarts-for-react';

interface ActivityLevel {
  label: string;
  value: number;
  description: string;
}

const activityLevels: ActivityLevel[] = [
  {
    label: 'Sedentary',
    value: 1.2,
    description: 'Little or no exercise, desk job'
  },
  {
    label: 'Lightly Active',
    value: 1.375,
    description: 'Light exercise 1-3 days/week'
  },
  {
    label: 'Moderately Active',
    value: 1.55,
    description: 'Moderate exercise 3-5 days/week'
  },
  {
    label: 'Very Active',
    value: 1.725,
    description: 'Hard exercise 6-7 days/week'
  },
  {
    label: 'Extra Active',
    value: 1.9,
    description: 'Very hard exercise, physical job or training twice per day'
  }
];

interface MacroNutrient {
  protein: number;
  carbs: number;
  fats: number;
}

export default function BMRCalculator() {
  const breadcrumbItems = [
    {
      label: 'BMR Calculator',
      href: '/bmr-calculator'
    }
  ];

  // Input states
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');

  // Result states
  const [bmr, setBMR] = useState<number>(0);
  const [tdee, setTDEE] = useState<number>(0);
  const [targetCalories, setTargetCalories] = useState<number>(0);
  const [macros, setMacros] = useState<MacroNutrient>({
    protein: 0,
    carbs: 0,
    fats: 0
  });

  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    let weightKg = unit === 'metric' ? weight : weight * 0.453592;
    let heightCm = unit === 'metric' ? height : height * 2.54;

    let calculatedBMR: number;
    if (gender === 'male') {
      calculatedBMR = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      calculatedBMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    setBMR(Math.round(calculatedBMR));
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const calculatedTDEE = Math.round(calculatedBMR * activityLevel);
    setTDEE(calculatedTDEE);

    // Calculate target calories based on goal
    let calculatedTargetCalories: number;
    switch (goal) {
      case 'lose':
        calculatedTargetCalories = calculatedTDEE - 500; // 500 calorie deficit
        break;
      case 'gain':
        calculatedTargetCalories = calculatedTDEE + 500; // 500 calorie surplus
        break;
      default:
        calculatedTargetCalories = calculatedTDEE;
    }
    setTargetCalories(calculatedTargetCalories);

    // Calculate macros (protein: 30%, carbs: 40%, fats: 30%)
    const calculatedMacros = {
      protein: Math.round((calculatedTargetCalories * 0.3) / 4), // 4 calories per gram of protein
      carbs: Math.round((calculatedTargetCalories * 0.4) / 4), // 4 calories per gram of carbs
      fats: Math.round((calculatedTargetCalories * 0.3) / 9) // 9 calories per gram of fat
    };
    setMacros(calculatedMacros);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setHeight(Math.round(height / 2.54)); // cm to inches
      setWeight(Math.round(weight * 2.20462)); // kg to lbs
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setHeight(Math.round(height * 2.54)); // inches to cm
      setWeight(Math.round(weight / 2.20462)); // lbs to kg
    }
    setUnit(newUnit);
  };

  // Get macros chart options
  const getMacrosChartOption = () => {
    return {
      title: {
        text: 'Daily Macronutrient Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}g ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: macros.protein, name: 'Protein' },
            { value: macros.carbs, name: 'Carbohydrates' },
            { value: macros.fats, name: 'Fats' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateBMR();
  }, [age, gender, weight, height, unit, activityLevel, goal]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">BMR Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your BMR</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Unit System</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUnitChange('metric')}
                    >
                      Metric
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-outline'}`}
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
                      className={`btn flex-1 ${gender === 'male' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGender('male')}
                    >
                      Male
                    </button>
                    <button
                      className={`btn flex-1 ${gender === 'female' ? 'btn-primary' : 'btn-outline'}`}
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
                    min="15"
                    max="80"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Height ({unit === 'metric' ? 'cm' : 'inches'})
                    </span>
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
                    <span className="label-text">Activity Level</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(Number(e.target.value))}
                  >
                    {activityLevels.map((level) => (
                      <option key={level.label} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Goal</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${goal === 'lose' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGoal('lose')}
                    >
                      Lose Weight
                    </button>
                    <button
                      className={`btn flex-1 ${goal === 'maintain' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGoal('maintain')}
                    >
                      Maintain
                    </button>
                    <button
                      className={`btn flex-1 ${goal === 'gain' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setGoal('gain')}
                    >
                      Gain Weight
                    </button>
                  </div>
                </div>
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
                  {/* BMR Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Basal Metabolic Rate (BMR)</div>
                    <div className="stat-value text-primary">{bmr} calories/day</div>
                    <div className="stat-desc">Calories burned at complete rest</div>
                  </div>

                  {/* TDEE Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Daily Energy Expenditure (TDEE)</div>
                    <div className="stat-value text-secondary">{tdee} calories/day</div>
                    <div className="stat-desc">Calories burned including activity</div>
                  </div>

                  {/* Target Calories */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Target Daily Calories</div>
                    <div className="stat-value text-accent">{targetCalories} calories/day</div>
                    <div className="stat-desc">
                      Based on your goal to {goal === 'maintain' ? 'maintain weight' : goal === 'lose' ? 'lose weight' : 'gain weight'}
                    </div>
                  </div>

                  <Separator />

                  {/* Macronutrients */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Recommended Macronutrients</h3>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Protein</div>
                        <div className="stat-value text-lg">{macros.protein}g</div>
                        <div className="stat-desc">{macros.protein * 4} calories</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Carbs</div>
                        <div className="stat-value text-lg">{macros.carbs}g</div>
                        <div className="stat-desc">{macros.carbs * 4} calories</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">Fats</div>
                        <div className="stat-value text-lg">{macros.fats}g</div>
                        <div className="stat-desc">{macros.fats * 9} calories</div>
                      </div>
                    </div>
                    <ReactECharts option={getMacrosChartOption()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding BMR & TDEE</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What is BMR?</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>
                        Basal Metabolic Rate (BMR) is the number of calories your body burns while
                        performing basic life-sustaining functions like:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Breathing</li>
                        <li>Circulating blood</li>
                        <li>Growing and repairing cells</li>
                        <li>Managing hormone levels</li>
                        <li>Maintaining body temperature</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What is TDEE?</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>
                        Total Daily Energy Expenditure (TDEE) is the total number of calories you burn
                        in a day, including:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Basal Metabolic Rate (BMR)</li>
                        <li>Physical Activity</li>
                        <li>Thermic Effect of Food</li>
                        <li>Non-exercise Activity Thermogenesis (NEAT)</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Tips for Success</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Track your food intake accurately</li>
                        <li>Stay consistent with your activity level</li>
                        <li>Adjust calories based on results</li>
                        <li>Get adequate protein for muscle maintenance</li>
                        <li>Stay hydrated and get enough sleep</li>
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
