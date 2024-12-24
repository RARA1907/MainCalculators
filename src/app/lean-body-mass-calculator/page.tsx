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

interface Formula {
  name: string;
  description: string;
  bestFor: string[];
}

const formulas: Formula[] = [
  {
    name: 'Boer',
    description: 'Uses height and weight, good for average builds',
    bestFor: [
      'Average body types',
      'General population',
      'Quick estimates'
    ]
  },
  {
    name: 'James',
    description: 'Accounts for gender differences',
    bestFor: [
      'Gender-specific calculations',
      'More accurate for extreme heights',
      'Athletic individuals'
    ]
  },
  {
    name: 'Hume',
    description: 'Most comprehensive formula',
    bestFor: [
      'Most body types',
      'Athletes',
      'Research purposes'
    ]
  }
];

export default function LeanBodyMassCalculator() {
  const breadcrumbItems = [
    {
      label: 'Lean Body Mass Calculator',
      href: '/lean-body-mass-calculator'
    }
  ];

  // Input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bodyFat, setBodyFat] = useState<number>(15);

  // Result states
  const [lbm, setLbm] = useState<{
    boer: number;
    james: number;
    hume: number;
    bodyFat: number;
    average: number;
  }>({
    boer: 0,
    james: 0,
    hume: 0,
    bodyFat: 0,
    average: 0
  });

  // Calculate LBM using different formulas
  const calculateLBM = () => {
    // Convert to metric if imperial
    const heightM = unit === 'metric' ? height / 100 : height * 0.0254;
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;

    // Boer Formula
    const boerLBM = gender === 'male'
      ? (0.407 * weightKg) + (0.267 * height) - 19.2
      : (0.252 * weightKg) + (0.473 * height) - 48.3;

    // James Formula
    const jamesLBM = gender === 'male'
      ? 1.1 * weightKg - 128 * (weightKg / height) * (weightKg / height)
      : 1.07 * weightKg - 148 * (weightKg / height) * (weightKg / height);

    // Hume Formula
    const humeLBM = gender === 'male'
      ? (0.3281 * weightKg) + (0.33929 * height) - 29.5336
      : (0.29569 * weightKg) + (0.41813 * height) - 43.2933;

    // Body Fat Method
    const bodyFatLBM = weightKg * (1 - (bodyFat / 100));

    // Calculate average
    const avgLBM = (boerLBM + jamesLBM + humeLBM + bodyFatLBM) / 4;

    setLbm({
      boer: Math.round(boerLBM * 10) / 10,
      james: Math.round(jamesLBM * 10) / 10,
      hume: Math.round(humeLBM * 10) / 10,
      bodyFat: Math.round(bodyFatLBM * 10) / 10,
      average: Math.round(avgLBM * 10) / 10
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

  // Get formula comparison chart
  const getFormulaChart = () => {
    return {
      title: {
        text: 'LBM by Formula',
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
        data: ['Boer', 'James', 'Hume', 'Body Fat', 'Average']
      },
      yAxis: {
        type: 'value',
        name: unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      },
      series: [
        {
          type: 'bar',
          data: [
            lbm.boer,
            lbm.james,
            lbm.hume,
            lbm.bodyFat,
            lbm.average
          ].map(val => unit === 'metric' ? val : val * 2.20462),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  // Get body composition chart
  const getBodyCompositionChart = () => {
    const fatMass = weight * (bodyFat / 100);
    const leanMass = weight - fatMass;

    return {
      title: {
        text: 'Body Composition',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} {d}%'
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
            { value: leanMass, name: 'Lean Mass', itemStyle: { color: '#3B82F6' } },
            { value: fatMass, name: 'Fat Mass', itemStyle: { color: '#F87171' } }
          ]
        }
      ]
    };
  };

  useEffect(() => {
    calculateLBM();
  }, [gender, height, weight, unit, bodyFat]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Lean Body Mass Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your LBM</h2>
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
                    <span className="label-text">Body Fat Percentage (%)</span>
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

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateLBM}
                >
                  Calculate LBM
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
                  {/* Average LBM Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Lean Body Mass</div>
                    <div className="stat-value text-primary">
                      {unit === 'metric' ? lbm.average : Math.round(lbm.average * 2.20462 * 10) / 10} {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="stat-desc">Based on multiple formulas</div>
                  </div>

                  {/* Formula Comparison */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Formula Comparison</h3>
                    <ReactECharts option={getFormulaChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Body Composition */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Body Composition</h3>
                    <ReactECharts option={getBodyCompositionChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding LBM</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">About the Formulas</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      {formulas.map((formula, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold">{formula.name} Formula</h4>
                          <p className="text-sm mb-2">{formula.description}</p>
                          <ul className="list-disc pl-6 text-sm">
                            {formula.bestFor.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What is Lean Body Mass?</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Total weight minus body fat</li>
                        <li>Includes muscle, bone, organs</li>
                        <li>Key indicator of fitness</li>
                        <li>Used for nutrition planning</li>
                        <li>Important for athletes</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Tips for Increasing LBM</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Regular strength training</li>
                        <li>Adequate protein intake</li>
                        <li>Proper rest and recovery</li>
                        <li>Progressive overload</li>
                        <li>Balanced nutrition</li>
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
