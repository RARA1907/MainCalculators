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
  proteinMultiplier: number;
}

const activityLevels: ActivityLevel[] = [
  {
    name: 'Sedentary',
    factor: 1.2,
    description: 'Little or no exercise',
    proteinMultiplier: 0.8
  },
  {
    name: 'Light',
    factor: 1.375,
    description: 'Light exercise 1-3 times/week',
    proteinMultiplier: 1.0
  },
  {
    name: 'Moderate',
    factor: 1.55,
    description: 'Moderate exercise 3-5 times/week',
    proteinMultiplier: 1.2
  },
  {
    name: 'Active',
    factor: 1.725,
    description: 'Heavy exercise 6-7 times/week',
    proteinMultiplier: 1.4
  },
  {
    name: 'Athlete',
    factor: 1.9,
    description: 'Professional athlete level',
    proteinMultiplier: 1.6
  }
];

interface FitnessGoal {
  name: string;
  proteinMultiplier: number;
  description: string;
  recommendations: string[];
}

const fitnessGoals: FitnessGoal[] = [
  {
    name: 'Weight Loss',
    proteinMultiplier: 1.2,
    description: 'Higher protein needs to preserve muscle mass during caloric deficit',
    recommendations: [
      'Spread protein intake throughout the day',
      'Focus on lean protein sources',
      'Combine with strength training',
      'Consider protein supplements if needed',
      'Maintain adequate hydration'
    ]
  },
  {
    name: 'Maintenance',
    proteinMultiplier: 1.0,
    description: 'Moderate protein needs to maintain current body composition',
    recommendations: [
      'Balance protein across meals',
      'Mix animal and plant proteins',
      'Regular exercise routine',
      'Focus on whole foods',
      'Monitor portion sizes'
    ]
  },
  {
    name: 'Muscle Gain',
    proteinMultiplier: 1.6,
    description: 'Higher protein needs to support muscle growth and recovery',
    recommendations: [
      'Increase protein with training volume',
      'Post-workout protein timing',
      'Quality protein sources',
      'Progressive overload training',
      'Adequate rest between sessions'
    ]
  }
];

interface ProteinSource {
  name: string;
  gramsPerServing: number;
  servingSize: string;
  category: string;
  calories: number;
}

const proteinSources: ProteinSource[] = [
  {
    name: 'Chicken Breast',
    gramsPerServing: 31,
    servingSize: '100g',
    category: 'Lean Meat',
    calories: 165
  },
  {
    name: 'Eggs',
    gramsPerServing: 13,
    servingSize: '2 large eggs',
    category: 'Eggs & Dairy',
    calories: 155
  },
  {
    name: 'Greek Yogurt',
    gramsPerServing: 17,
    servingSize: '170g',
    category: 'Eggs & Dairy',
    calories: 100
  },
  {
    name: 'Salmon',
    gramsPerServing: 25,
    servingSize: '100g',
    category: 'Fish',
    calories: 208
  },
  {
    name: 'Lentils',
    gramsPerServing: 18,
    servingSize: '200g (cooked)',
    category: 'Plant-Based',
    calories: 230
  },
  {
    name: 'Whey Protein',
    gramsPerServing: 24,
    servingSize: '30g scoop',
    category: 'Supplements',
    calories: 120
  }
];

export default function ProteinCalculator() {
  const breadcrumbItems = [
    {
      label: 'Protein Calculator',
      href: '/protein-calculator'
    }
  ];

  // Input states
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(activityLevels[2]);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(fitnessGoals[1]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bodyFat, setBodyFat] = useState<number>(20);

  // Result states
  const [proteinNeeds, setProteinNeeds] = useState<{
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
    proteinPerMeal: number;
  }>({
    mealsPerDay: 4,
    proteinPerMeal: 0
  });

  // Calculate protein needs
  const calculateProtein = () => {
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;
    const leanMass = weightKg * (1 - (bodyFat / 100));

    // Calculate base protein needs based on lean mass
    const baseProtein = leanMass * activityLevel.proteinMultiplier;
    
    // Adjust for fitness goal
    const adjustedProtein = baseProtein * fitnessGoal.proteinMultiplier;

    // Set range of protein needs
    setProteinNeeds({
      minimum: Math.round(adjustedProtein * 0.8),
      optimal: Math.round(adjustedProtein),
      maximum: Math.round(adjustedProtein * 1.2)
    });

    // Calculate meal distribution
    setMealPlan({
      mealsPerDay: 4,
      proteinPerMeal: Math.round(adjustedProtein / 4)
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

  // Get protein distribution chart
  const getProteinChart = () => {
    return {
      title: {
        text: 'Daily Protein Range',
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
        name: 'Protein (g)'
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: proteinNeeds.minimum, itemStyle: { color: '#3B82F6' } },
            { value: proteinNeeds.optimal, itemStyle: { color: '#34D399' } },
            { value: proteinNeeds.maximum, itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateProtein();
  }, [weight, height, age, gender, activityLevel, fitnessGoal, unit, bodyFat]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Protein Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Protein Needs</h2>
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
                    <span className="label-text">Fitness Goal</span>
                  </label>
                  <div className="flex gap-4">
                    {fitnessGoals.map((goal) => (
                      <button
                        key={goal.name}
                        className={`btn flex-1 ${fitnessGoal.name === goal.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setFitnessGoal(goal)}
                      >
                        {goal.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {fitnessGoal.description}
                  </span>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateProtein}
                >
                  Calculate Protein Needs
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Protein Needs</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Protein Range Display */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Minimum</div>
                      <div className="stat-value text-blue-500">{proteinNeeds.minimum}g</div>
                      <div className="stat-desc">Lower range</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Optimal</div>
                      <div className="stat-value text-green-500">{proteinNeeds.optimal}g</div>
                      <div className="stat-desc">Target intake</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Maximum</div>
                      <div className="stat-value text-red-500">{proteinNeeds.maximum}g</div>
                      <div className="stat-desc">Upper range</div>
                    </div>
                  </div>

                  {/* Protein Range Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Daily Protein Range</h3>
                    <ReactECharts option={getProteinChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Meal Distribution */}
                  <div className="bg-base-200 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">Meal Distribution</h3>
                    <p>Recommended meals per day: {mealPlan.mealsPerDay}</p>
                    <p>Protein per meal: {mealPlan.proteinPerMeal}g</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protein Sources */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Protein Sources</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="space-y-4">
                    {proteinSources.map((source) => (
                      <div key={source.name} className="bg-base-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{source.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>Protein: {source.gramsPerServing}g</p>
                            <p>Serving: {source.servingSize}</p>
                          </div>
                          <div>
                            <p>Category: {source.category}</p>
                            <p>Calories: {source.calories}</p>
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
                <h2 className="text-2xl font-semibold">Recommendations for {fitnessGoal.name}</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="mb-2">{fitnessGoal.description}</p>
                    <ul className="list-disc pl-6">
                      {fitnessGoal.recommendations.map((rec, index) => (
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
