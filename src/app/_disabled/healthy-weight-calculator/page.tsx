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

interface WeightRange {
  category: string;
  min: number;
  max: number;
  description: string;
  recommendations: string[];
  color: string;
}

interface BodyFrame {
  name: string;
  adjustment: number;
  description: string;
}

const bodyFrames: BodyFrame[] = [
  { name: 'Small', adjustment: -10, description: 'Wrist circumference < 6.5 inches (males) or < 5.5 inches (females)' },
  { name: 'Medium', adjustment: 0, description: 'Average wrist circumference' },
  { name: 'Large', adjustment: 10, description: 'Wrist circumference > 7.5 inches (males) or > 6.5 inches (females)' }
];

export default function HealthyWeightCalculator() {
  const breadcrumbItems = [
    {
      label: 'Healthy Weight Calculator',
      href: '/healthy-weight-calculator'
    }
  ];

  // Input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [bodyFrame, setBodyFrame] = useState<BodyFrame>(bodyFrames[1]);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [bmi, setBmi] = useState<number>(0);
  const [weightRanges, setWeightRanges] = useState<WeightRange[]>([]);
  const [idealWeight, setIdealWeight] = useState<number>(0);
  const [weightStatus, setWeightStatus] = useState<string>('');

  // Calculate healthy weight ranges
  const calculateHealthyWeight = () => {
    // Convert to metric if imperial
    const heightM = unit === 'metric' ? height / 100 : height * 0.0254;
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;

    // Calculate BMI
    const bmiValue = weightKg / (heightM * heightM);
    setBmi(Math.round(bmiValue * 10) / 10);

    // Calculate ideal weight using Hamwi formula with frame adjustment
    const baseIdealWeight = gender === 'male'
      ? 48 + 2.7 * ((height - 152.4) / 2.54)
      : 45.5 + 2.2 * ((height - 152.4) / 2.54);
    
    const adjustedIdealWeight = baseIdealWeight * (1 + (bodyFrame.adjustment / 100));
    setIdealWeight(Math.round(adjustedIdealWeight));

    // Calculate weight ranges
    const ranges: WeightRange[] = [
      {
        category: 'Underweight',
        min: Math.round((18.5 * heightM * heightM) * 10) / 10,
        max: Math.round((20 * heightM * heightM) * 10) / 10,
        description: 'Below healthy BMI range',
        recommendations: [
          'Increase caloric intake',
          'Add strength training',
          'Eat protein-rich foods',
          'Consult a nutritionist'
        ],
        color: '#FCD34D'
      },
      {
        category: 'Healthy',
        min: Math.round((20 * heightM * heightM) * 10) / 10,
        max: Math.round((25 * heightM * heightM) * 10) / 10,
        description: 'Optimal weight range',
        recommendations: [
          'Maintain balanced diet',
          'Regular exercise',
          'Adequate sleep',
          'Stay hydrated'
        ],
        color: '#34D399'
      },
      {
        category: 'Overweight',
        min: Math.round((25 * heightM * heightM) * 10) / 10,
        max: Math.round((30 * heightM * heightM) * 10) / 10,
        description: 'Above healthy BMI range',
        recommendations: [
          'Reduce caloric intake',
          'Increase physical activity',
          'Focus on whole foods',
          'Track food intake'
        ],
        color: '#F87171'
      }
    ];

    setWeightRanges(ranges);

    // Determine weight status
    if (bmiValue < 18.5) {
      setWeightStatus('Underweight');
    } else if (bmiValue < 25) {
      setWeightStatus('Healthy Weight');
    } else if (bmiValue < 30) {
      setWeightStatus('Overweight');
    } else {
      setWeightStatus('Obese');
    }
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

  // Get weight range chart
  const getWeightRangeChart = () => {
    return {
      title: {
        text: 'Weight Ranges',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const range = weightRanges[params[0].dataIndex];
          return `${range.category}<br/>
            Range: ${range.min}-${range.max} ${unit === 'metric' ? 'kg' : 'lbs'}<br/>
            ${range.description}`;
        }
      },
      xAxis: {
        type: 'category',
        data: weightRanges.map(r => r.category)
      },
      yAxis: {
        type: 'value',
        name: unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      },
      series: [
        {
          type: 'bar',
          data: weightRanges.map((range, index) => ({
            value: (range.max + range.min) / 2,
            itemStyle: {
              color: range.color
            }
          }))
        }
      ]
    };
  };

  useEffect(() => {
    calculateHealthyWeight();
  }, [gender, age, height, weight, activityLevel, bodyFrame, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Healthy Weight Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Healthy Weight</h2>
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
                    min="18"
                    max="100"
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
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${activityLevel === 'sedentary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setActivityLevel('sedentary')}
                    >
                      Sedentary
                    </button>
                    <button
                      className={`btn flex-1 ${activityLevel === 'moderate' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setActivityLevel('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      className={`btn flex-1 ${activityLevel === 'active' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setActivityLevel('active')}
                    >
                      Active
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Body Frame</span>
                  </label>
                  <div className="flex gap-4">
                    {bodyFrames.map((frame) => (
                      <button
                        key={frame.name}
                        className={`btn flex-1 ${bodyFrame.name === frame.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setBodyFrame(frame)}
                      >
                        {frame.name}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1">
                    {bodyFrame.description}
                  </span>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateHealthyWeight}
                >
                  Calculate Healthy Weight
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
                  {/* BMI Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">BMI</div>
                    <div className="stat-value text-primary">{bmi}</div>
                    <div className="stat-desc">Body Mass Index</div>
                  </div>

                  {/* Weight Status */}
                  <div className={`stat rounded-lg p-4 ${
                    weightStatus === 'Healthy Weight' ? 'bg-green-100' :
                    weightStatus === 'Underweight' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <div className="stat-title">Weight Status</div>
                    <div className={`stat-value ${
                      weightStatus === 'Healthy Weight' ? 'text-green-600' :
                      weightStatus === 'Underweight' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {weightStatus}
                    </div>
                  </div>

                  {/* Ideal Weight */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Ideal Weight</div>
                    <div className="stat-value text-secondary">
                      {unit === 'metric' ? idealWeight : Math.round(idealWeight * 2.20462)} {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="stat-desc">Based on height and frame</div>
                  </div>

                  {/* Weight Ranges Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Weight Ranges</h3>
                    <ReactECharts option={getWeightRangeChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recommendations</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {weightRanges.map((range, index) => (
                    <section key={index} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{range.category} Range</h3>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <p className="mb-2">
                          {unit === 'metric' ? 
                            `${range.min} - ${range.max} kg` :
                            `${Math.round(range.min * 2.20462)} - ${Math.round(range.max * 2.20462)} lbs`}
                        </p>
                        <ul className="list-disc pl-6">
                          {range.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  ))}

                  <section>
                    <h3 className="text-xl font-semibold mb-3">General Health Tips</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Maintain a balanced diet</li>
                        <li>Exercise regularly</li>
                        <li>Get adequate sleep</li>
                        <li>Stay hydrated</li>
                        <li>Manage stress levels</li>
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
