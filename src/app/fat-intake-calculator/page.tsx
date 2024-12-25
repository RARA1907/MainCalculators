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
  fatMultiplier: number;
  examples: string[];
}

const activityLevels: ActivityLevel[] = [
  {
    name: 'Sedentary',
    factor: 1.2,
    description: 'Little or no exercise',
    fatMultiplier: 0.25,
    examples: ['Desk job', 'No planned exercise', 'Mostly sitting']
  },
  {
    name: 'Light',
    factor: 1.375,
    description: 'Light exercise 1-3 times/week',
    fatMultiplier: 0.275,
    examples: ['Walking', 'Light housework', 'Casual cycling']
  },
  {
    name: 'Moderate',
    factor: 1.55,
    description: 'Moderate exercise 3-5 times/week',
    fatMultiplier: 0.3,
    examples: ['Jogging', 'Light sports', 'Regular gym']
  },
  {
    name: 'Very Active',
    factor: 1.725,
    description: 'Hard exercise 6-7 times/week',
    fatMultiplier: 0.325,
    examples: ['Intense training', 'Competitive sports', 'Heavy lifting']
  },
  {
    name: 'Athlete',
    factor: 1.9,
    description: 'Professional athlete level',
    fatMultiplier: 0.35,
    examples: ['Elite athlete', 'Multiple training sessions', 'Endurance sports']
  }
];

interface DietType {
  name: string;
  fatPercentage: number;
  description: string;
  recommendations: string[];
}

const dietTypes: DietType[] = [
  {
    name: 'Low Fat',
    fatPercentage: 0.20,
    description: 'Lower fat intake for specific health conditions or goals',
    recommendations: [
      'Focus on lean proteins',
      'Limit saturated fats',
      'Choose low-fat dairy',
      'Include essential fatty acids',
      'Monitor fat-soluble vitamins'
    ]
  },
  {
    name: 'Moderate Fat',
    fatPercentage: 0.30,
    description: 'Balanced approach suitable for most people',
    recommendations: [
      'Balance fat types',
      'Include healthy fats',
      'Moderate portions',
      'Choose whole foods',
      'Regular meals'
    ]
  },
  {
    name: 'High Fat',
    fatPercentage: 0.40,
    description: 'Higher fat intake for specific dietary approaches',
    recommendations: [
      'Focus on healthy fats',
      'Include MCT sources',
      'Monitor saturated fat',
      'Balance omega ratios',
      'Include fat-soluble vitamins'
    ]
  }
];

interface FatSource {
  name: string;
  gramsPerServing: number;
  servingSize: string;
  category: string;
  type: string;
}

const fatSources: FatSource[] = [
  {
    name: 'Avocado',
    gramsPerServing: 15,
    servingSize: '1/2 medium',
    category: 'Fruits',
    type: 'Monounsaturated'
  },
  {
    name: 'Olive Oil',
    gramsPerServing: 14,
    servingSize: '1 tablespoon',
    category: 'Oils',
    type: 'Monounsaturated'
  },
  {
    name: 'Salmon',
    gramsPerServing: 13,
    servingSize: '100g',
    category: 'Fish',
    type: 'Omega-3'
  },
  {
    name: 'Almonds',
    gramsPerServing: 14,
    servingSize: '1 oz (23 nuts)',
    category: 'Nuts',
    type: 'Monounsaturated'
  },
  {
    name: 'Chia Seeds',
    gramsPerServing: 9,
    servingSize: '2 tablespoons',
    category: 'Seeds',
    type: 'Omega-3'
  },
  {
    name: 'Coconut Oil',
    gramsPerServing: 14,
    servingSize: '1 tablespoon',
    category: 'Oils',
    type: 'MCT'
  }
];

export default function FatIntakeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Fat Intake Calculator',
      href: '/fat-intake-calculator'
    }
  ];

  // Input states
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(activityLevels[2]);
  const [dietType, setDietType] = useState<DietType>(dietTypes[1]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [fatNeeds, setFatNeeds] = useState<{
    minimum: number;
    optimal: number;
    maximum: number;
  }>({
    minimum: 0,
    optimal: 0,
    maximum: 0
  });
  const [mealPlan, setMealPlan] = useState<{
    mealsPerDay: number;
    fatPerMeal: number;
  }>({
    mealsPerDay: 4,
    fatPerMeal: 0
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

  // Calculate fat needs
  const calculateFat = () => {
    const calculatedBmr = calculateBMR();
    const calculatedTdee = Math.round(calculatedBmr * activityLevel.factor);
    setTdee(calculatedTdee);

    // Calculate fat needs based on TDEE and diet type
    const optimalFat = Math.round((calculatedTdee * dietType.fatPercentage) / 9); // 9 calories per gram of fat
    
    setFatNeeds({
      minimum: Math.round(optimalFat * 0.8),
      optimal: optimalFat,
      maximum: Math.round(optimalFat * 1.2)
    });

    // Calculate meal distribution
    setMealPlan({
      mealsPerDay: 4,
      fatPerMeal: Math.round(optimalFat / 4)
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

  // Get fat distribution chart
  const getFatChart = () => {
    return {
      title: {
        text: 'Daily Fat Intake Range',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}g'
      },
      xAxis: {
        type: 'category',
        data: ['Minimum', 'Optimal', 'Maximum']
      },
      yAxis: {
        type: 'value',
        name: 'Fat (g)'
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: fatNeeds.minimum, itemStyle: { color: '#3B82F6' } },
            { value: fatNeeds.optimal, itemStyle: { color: '#34D399' } },
            { value: fatNeeds.maximum, itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateFat();
  }, [weight, height, age, gender, activityLevel, dietType, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Fat Intake Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Fat Needs</h2>
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
                    <span className="label-text">Diet Type</span>
                  </label>
                  <div className="flex gap-4">
                    {dietTypes.map((type) => (
                      <button
                        key={type.name}
                        className={`btn flex-1 ${dietType.name === type.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setDietType(type)}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {dietType.description}
                  </span>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateFat}
                >
                  Calculate Fat Needs
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Fat Needs</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Energy Calculations */}
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  {/* Fat Range Display */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Minimum</div>
                      <div className="stat-value text-blue-500">{fatNeeds.minimum}g</div>
                      <div className="stat-desc">Lower range</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Optimal</div>
                      <div className="stat-value text-green-500">{fatNeeds.optimal}g</div>
                      <div className="stat-desc">Target intake</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Maximum</div>
                      <div className="stat-value text-red-500">{fatNeeds.maximum}g</div>
                      <div className="stat-desc">Upper range</div>
                    </div>
                  </div>

                  {/* Fat Range Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Daily Fat Range</h3>
                    <ReactECharts option={getFatChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Meal Distribution */}
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Meal Distribution</h3>
                    <p>Recommended meals per day: {mealPlan.mealsPerDay}</p>
                    <p>Fat per meal: {mealPlan.fatPerMeal}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fat Sources */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Healthy Fat Sources</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="space-y-4">
                    {fatSources.map((source) => (
                      <div key={source.name} className="bg-base-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{source.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>Fat: {source.gramsPerServing}g</p>
                            <p>Serving: {source.servingSize}</p>
                          </div>
                          <div>
                            <p>Category: {source.category}</p>
                            <p>Type: {source.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommendations for {dietType.name}</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg mb-6">
                    <p className="mb-2">{dietType.description}</p>
                    <ul className="list-disc pl-6">
                      {dietType.recommendations.map((rec, index) => (
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
