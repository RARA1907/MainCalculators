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

interface BodyType {
  name: string;
  description: string;
  characteristics: string[];
  training: string[];
  nutrition: string[];
  color: string;
}

const bodyTypes: BodyType[] = [
  {
    name: 'Ectomorph',
    description: 'Naturally lean and long, with difficulty building muscle',
    characteristics: [
      'Lean, long limbs',
      'Small joints/bones',
      'Fast metabolism',
      'Difficulty gaining weight',
      'Narrow shoulders and hips'
    ],
    training: [
      'Focus on compound exercises',
      'Heavy weights, low reps',
      'Longer rest periods',
      'Limited cardio',
      'Progressive overload'
    ],
    nutrition: [
      'High-calorie diet',
      'Frequent meals',
      'High carb intake',
      'Moderate protein',
      'Healthy fats'
    ],
    color: '#3B82F6'
  },
  {
    name: 'Mesomorph',
    description: 'Athletic, solid, and strong, with a natural tendency to be fit',
    characteristics: [
      'Athletic build',
      'Gains muscle easily',
      'Moderate frame size',
      'Responsive to exercise',
      'Balanced proportions'
    ],
    training: [
      'Mixed training styles',
      'Moderate weights',
      'Varied rep ranges',
      'Regular cardio',
      'Sports activities'
    ],
    nutrition: [
      'Balanced macros',
      'Moderate portions',
      'Protein focus',
      'Timing nutrition',
      'Flexible diet'
    ],
    color: '#34D399'
  },
  {
    name: 'Endomorph',
    description: 'Naturally broad and thick, with a tendency to store body fat',
    characteristics: [
      'Larger frame',
      'Higher body fat',
      'Strong lower body',
      'Slower metabolism',
      'Gains weight easily'
    ],
    training: [
      'High-intensity cardio',
      'Circuit training',
      'Regular activity',
      'Strength training',
      'Focus on form'
    ],
    nutrition: [
      'Lower carb intake',
      'High protein diet',
      'Controlled portions',
      'Regular meals',
      'Avoid processed foods'
    ],
    color: '#F87171'
  }
];

export default function BodyTypeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Body Type Calculator',
      href: '/body-type-calculator'
    }
  ];

  // Input states
  const [wristMeasurement, setWristMeasurement] = useState<number>(17);
  const [shoulderWidth, setShoulderWidth] = useState<number>(45);
  const [hipWidth, setHipWidth] = useState<number>(35);
  const [weightGainPattern, setWeightGainPattern] = useState<'easy' | 'moderate' | 'difficult'>('moderate');
  const [muscleGainRate, setMuscleGainRate] = useState<'slow' | 'moderate' | 'fast'>('moderate');
  const [metabolismSpeed, setMetabolismSpeed] = useState<'slow' | 'moderate' | 'fast'>('moderate');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [bodyTypeScores, setBodyTypeScores] = useState<{
    ectomorph: number;
    mesomorph: number;
    endomorph: number;
  }>({
    ectomorph: 0,
    mesomorph: 0,
    endomorph: 0
  });
  const [primaryType, setPrimaryType] = useState<BodyType>(bodyTypes[1]);

  // Calculate body type
  const calculateBodyType = () => {
    let ectomorphScore = 0;
    let mesomorphScore = 0;
    let endomorphScore = 0;

    // Weight gain pattern
    if (weightGainPattern === 'difficult') ectomorphScore += 2;
    else if (weightGainPattern === 'easy') endomorphScore += 2;
    else mesomorphScore += 2;

    // Muscle gain rate
    if (muscleGainRate === 'slow') ectomorphScore += 2;
    else if (muscleGainRate === 'fast') mesomorphScore += 2;
    else endomorphScore += 1;

    // Metabolism speed
    if (metabolismSpeed === 'fast') ectomorphScore += 2;
    else if (metabolismSpeed === 'slow') endomorphScore += 2;
    else mesomorphScore += 2;

    // Frame size calculations
    const shoulderToHipRatio = shoulderWidth / hipWidth;
    if (shoulderToHipRatio > 1.4) mesomorphScore += 2;
    else if (shoulderToHipRatio < 1.2) ectomorphScore += 2;
    else endomorphScore += 1;

    // Wrist size consideration
    const wristThreshold = unit === 'metric' ? 17 : 6.5;
    if (wristMeasurement < wristThreshold) ectomorphScore += 1;
    else if (wristMeasurement > wristThreshold + 2) endomorphScore += 1;
    else mesomorphScore += 1;

    // Calculate percentages
    const total = ectomorphScore + mesomorphScore + endomorphScore;
    setBodyTypeScores({
      ectomorph: Math.round((ectomorphScore / total) * 100),
      mesomorph: Math.round((mesomorphScore / total) * 100),
      endomorph: Math.round((endomorphScore / total) * 100)
    });

    // Determine primary type
    const maxScore = Math.max(ectomorphScore, mesomorphScore, endomorphScore);
    if (maxScore === ectomorphScore) setPrimaryType(bodyTypes[0]);
    else if (maxScore === mesomorphScore) setPrimaryType(bodyTypes[1]);
    else setPrimaryType(bodyTypes[2]);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setWristMeasurement(Math.round(wristMeasurement / 2.54));
      setShoulderWidth(Math.round(shoulderWidth / 2.54));
      setHipWidth(Math.round(hipWidth / 2.54));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setWristMeasurement(Math.round(wristMeasurement * 2.54));
      setShoulderWidth(Math.round(shoulderWidth * 2.54));
      setHipWidth(Math.round(hipWidth * 2.54));
    }
    setUnit(newUnit);
  };

  // Get body type distribution chart
  const getBodyTypeChart = () => {
    return {
      title: {
        text: 'Body Type Distribution',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
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
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: bodyTypeScores.ectomorph, name: 'Ectomorph', itemStyle: { color: bodyTypes[0].color } },
            { value: bodyTypeScores.mesomorph, name: 'Mesomorph', itemStyle: { color: bodyTypes[1].color } },
            { value: bodyTypeScores.endomorph, name: 'Endomorph', itemStyle: { color: bodyTypes[2].color } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateBodyType();
  }, [wristMeasurement, shoulderWidth, hipWidth, weightGainPattern, muscleGainRate, metabolismSpeed, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Body Type Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Determine Your Body Type</h2>
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
                      Metric (cm)
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => handleUnitChange('imperial')}
                    >
                      Imperial (in)
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Wrist Circumference ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={wristMeasurement}
                    onChange={(e) => setWristMeasurement(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Shoulder Width ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={shoulderWidth}
                    onChange={(e) => setShoulderWidth(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hip Width ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={hipWidth}
                    onChange={(e) => setHipWidth(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Weight Gain Pattern</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${weightGainPattern === 'difficult' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setWeightGainPattern('difficult')}
                    >
                      Difficult
                    </button>
                    <button
                      className={`btn flex-1 ${weightGainPattern === 'moderate' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setWeightGainPattern('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      className={`btn flex-1 ${weightGainPattern === 'easy' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setWeightGainPattern('easy')}
                    >
                      Easy
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Muscle Gain Rate</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${muscleGainRate === 'slow' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMuscleGainRate('slow')}
                    >
                      Slow
                    </button>
                    <button
                      className={`btn flex-1 ${muscleGainRate === 'moderate' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMuscleGainRate('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      className={`btn flex-1 ${muscleGainRate === 'fast' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMuscleGainRate('fast')}
                    >
                      Fast
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Metabolism Speed</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${metabolismSpeed === 'slow' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMetabolismSpeed('slow')}
                    >
                      Slow
                    </button>
                    <button
                      className={`btn flex-1 ${metabolismSpeed === 'moderate' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMetabolismSpeed('moderate')}
                    >
                      Moderate
                    </button>
                    <button
                      className={`btn flex-1 ${metabolismSpeed === 'fast' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setMetabolismSpeed('fast')}
                    >
                      Fast
                    </button>
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateBodyType}
                >
                  Calculate Body Type
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
                  {/* Primary Type Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Primary Body Type</div>
                    <div className="stat-value text-primary">{primaryType.name}</div>
                    <div className="stat-desc">{primaryType.description}</div>
                  </div>

                  {/* Body Type Distribution */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Body Type Distribution</h3>
                    <ReactECharts option={getBodyTypeChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Personalized Recommendations</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Physical Characteristics</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {primaryType.characteristics.map((char, index) => (
                          <li key={index}>{char}</li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Training Recommendations</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {primaryType.training.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Nutrition Guidelines</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {primaryType.nutrition.map((guide, index) => (
                          <li key={index}>{guide}</li>
                        ))}
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
