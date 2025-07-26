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

interface Activity {
  name: string;
  metValue: number;
  category: string;
  description: string;
}

const activities: Activity[] = [
  // Cardio Activities
  { name: 'Walking (3 mph)', metValue: 3.5, category: 'Cardio', description: 'Moderate pace on level ground' },
  { name: 'Walking (4 mph)', metValue: 4.3, category: 'Cardio', description: 'Very brisk pace' },
  { name: 'Jogging', metValue: 7.0, category: 'Cardio', description: 'General jogging' },
  { name: 'Running (5 mph)', metValue: 8.3, category: 'Cardio', description: '12 min/mile' },
  { name: 'Running (6 mph)', metValue: 9.8, category: 'Cardio', description: '10 min/mile' },
  { name: 'Running (7.5 mph)', metValue: 11.8, category: 'Cardio', description: '8 min/mile' },
  { name: 'Cycling (12-14 mph)', metValue: 8.0, category: 'Cardio', description: 'Moderate effort' },
  { name: 'Swimming', metValue: 7.0, category: 'Cardio', description: 'Freestyle, moderate effort' },

  // Sports
  { name: 'Basketball', metValue: 6.5, category: 'Sports', description: 'General playing, non-game' },
  { name: 'Soccer', metValue: 7.0, category: 'Sports', description: 'Casual, general' },
  { name: 'Tennis', metValue: 7.3, category: 'Sports', description: 'Singles' },
  { name: 'Volleyball', metValue: 4.0, category: 'Sports', description: 'Non-competitive' },
  { name: 'Golf', metValue: 4.8, category: 'Sports', description: 'Walking and carrying clubs' },

  // Strength Training
  { name: 'Weight Lifting', metValue: 3.5, category: 'Strength', description: 'General, light/moderate effort' },
  { name: 'Circuit Training', metValue: 8.0, category: 'Strength', description: 'General' },
  { name: 'Body Weight Exercise', metValue: 3.8, category: 'Strength', description: 'Push-ups, sit-ups, etc.' },

  // Daily Activities
  { name: 'Gardening', metValue: 3.8, category: 'Daily Activities', description: 'General' },
  { name: 'House Cleaning', metValue: 3.3, category: 'Daily Activities', description: 'Moderate effort' },
  { name: 'Stair Climbing', metValue: 4.0, category: 'Daily Activities', description: 'Slow pace' },
];

export default function CaloriesBurnedCalculator() {
  const breadcrumbItems = [
    {
      label: 'Calories Burned Calculator',
      href: '/calories-burned-calculator'
    }
  ];

  // Input states
  const [weight, setWeight] = useState<number>(70);
  const [duration, setDuration] = useState<number>(30);
  const [selectedActivity, setSelectedActivity] = useState<Activity>(activities[0]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  // Result states
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(0);

  // Calculate calories burned
  const calculateCaloriesBurned = () => {
    let weightInKg = unit === 'metric' ? weight : weight * 0.453592;
    
    // Adjust MET value based on intensity
    let adjustedMET = selectedActivity.metValue;
    if (intensity === 'low') {
      adjustedMET *= 0.85;
    } else if (intensity === 'high') {
      adjustedMET *= 1.15;
    }

    // Calories = MET × weight (kg) × time (hours)
    const hours = duration / 60;
    const calories = adjustedMET * weightInKg * hours;
    
    setCaloriesBurned(Math.round(calories));
    setHourlyRate(Math.round(calories / hours));
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

  // Get activity comparison chart
  const getActivityComparisonChart = () => {
    const compareActivities = activities
      .filter(a => a.category === selectedActivity.category)
      .sort((a, b) => b.metValue - a.metValue)
      .slice(0, 6);

    return {
      title: {
        text: `Calories Burned Comparison (${selectedActivity.category})`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>Calories: ${data.value} cal/hour`;
        }
      },
      xAxis: {
        type: 'category',
        data: compareActivities.map(a => a.name),
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Calories/Hour'
      },
      series: [
        {
          type: 'bar',
          data: compareActivities.map(a => Math.round(a.metValue * (unit === 'metric' ? weight : weight * 0.453592))),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateCaloriesBurned();
  }, [weight, duration, selectedActivity, unit, intensity]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Calories Burned Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Calories Burned</h2>
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
                    <span className="label-text">Activity</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedActivity.name}
                    onChange={(e) => setSelectedActivity(activities.find(a => a.name === e.target.value) || activities[0])}
                  >
                    {activities.map((activity) => (
                      <option key={activity.name} value={activity.name}>
                        {activity.name} (MET: {activity.metValue})
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500 mt-1">
                    {selectedActivity.description}
                  </span>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Intensity Level</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${intensity === 'low' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setIntensity('low')}
                    >
                      Low
                    </button>
                    <button
                      className={`btn flex-1 ${intensity === 'medium' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setIntensity('medium')}
                    >
                      Medium
                    </button>
                    <button
                      className={`btn flex-1 ${intensity === 'high' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setIntensity('high')}
                    >
                      High
                    </button>
                  </div>
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
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateCaloriesBurned}
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
                <h2 className="text-2xl font-semibold">Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Calories Burned Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Calories Burned</div>
                    <div className="stat-value text-primary">{caloriesBurned} calories</div>
                    <div className="stat-desc">For {duration} minutes of {selectedActivity.name}</div>
                  </div>

                  {/* Hourly Rate Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Calories Burned Per Hour</div>
                    <div className="stat-value text-secondary">{hourlyRate} calories/hour</div>
                    <div className="stat-desc">At your selected intensity</div>
                  </div>

                  {/* Activity Comparison */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Activity Comparison</h3>
                    <ReactECharts option={getActivityComparisonChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Calorie Burn</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What is MET?</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p>
                        Metabolic Equivalent of Task (MET) is a measure of the energy cost of physical activities:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>1 MET = Energy used while sitting quietly</li>
                        <li>2 METs = 2x the energy of sitting quietly</li>
                        <li>Higher MET values indicate more intense activities</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Factors Affecting Calorie Burn</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Body weight and composition</li>
                        <li>Exercise intensity</li>
                        <li>Duration of activity</li>
                        <li>Fitness level</li>
                        <li>Age and gender</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Tips for Effective Exercise</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Start slowly and gradually increase intensity</li>
                        <li>Mix different types of activities</li>
                        <li>Stay hydrated during exercise</li>
                        <li>Listen to your body</li>
                        <li>Maintain proper form</li>
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
