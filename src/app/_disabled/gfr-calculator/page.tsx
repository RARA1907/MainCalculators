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

interface GFRResult {
  gfr: number;
  stage: string;
  description: string;
  recommendations: string[];
}

interface KidneyHealthTip {
  category: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

const kidneyStages = [
  {
    stage: 'Stage 1',
    range: '≥90',
    description: 'Normal kidney function',
    color: '#10B981'
  },
  {
    stage: 'Stage 2',
    range: '60-89',
    description: 'Mild loss of kidney function',
    color: '#3B82F6'
  },
  {
    stage: 'Stage 3a',
    range: '45-59',
    description: 'Mild to moderate loss of kidney function',
    color: '#FBBF24'
  },
  {
    stage: 'Stage 3b',
    range: '30-44',
    description: 'Moderate to severe loss of kidney function',
    color: '#F59E0B'
  },
  {
    stage: 'Stage 4',
    range: '15-29',
    description: 'Severe loss of kidney function',
    color: '#EF4444'
  },
  {
    stage: 'Stage 5',
    range: '<15',
    description: 'Kidney failure',
    color: '#DC2626'
  }
];

const kidneyHealthTips: KidneyHealthTip[] = [
  {
    category: 'Diet',
    title: 'Reduce Salt Intake',
    description: 'Limit sodium to less than 2,300mg per day to help control blood pressure.',
    importance: 'high'
  },
  {
    category: 'Diet',
    title: 'Protein Management',
    description: 'Consult with healthcare provider about appropriate protein intake for your kidney function.',
    importance: 'high'
  },
  {
    category: 'Lifestyle',
    title: 'Stay Hydrated',
    description: 'Drink adequate water unless fluid restricted by your healthcare provider.',
    importance: 'high'
  },
  {
    category: 'Lifestyle',
    title: 'Regular Exercise',
    description: 'Maintain physical activity to help control blood pressure and maintain healthy weight.',
    importance: 'medium'
  },
  {
    category: 'Medical',
    title: 'Blood Pressure Control',
    description: 'Keep blood pressure below 130/80 mmHg to protect kidneys.',
    importance: 'high'
  },
  {
    category: 'Medical',
    title: 'Regular Monitoring',
    description: 'Get regular kidney function tests as recommended by your healthcare provider.',
    importance: 'high'
  }
];

export default function GFRCalculator() {
  const breadcrumbItems = [
    {
      label: 'GFR Calculator',
      href: '/gfr-calculator'
    }
  ];

  // State
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [race, setRace] = useState<'black' | 'non-black'>('non-black');
  const [creatinine, setCreatinine] = useState<number>(1.0);
  const [gfrResult, setGfrResult] = useState<GFRResult | null>(null);

  // Calculate GFR using CKD-EPI equation
  const calculateGFR = () => {
    let gfr: number;
    const k = gender === 'female' ? 0.7 : 0.9;
    const a = gender === 'female' ? -0.329 : -0.411;
    const raceCoef = race === 'black' ? 1.159 : 1;

    // CKD-EPI equation
    const creatRatio = creatinine / k;
    const minTerm = Math.min(creatRatio, 1);
    const maxTerm = Math.max(creatRatio, 1);
    
    gfr = 141 *
          Math.pow(minTerm, a) *
          Math.pow(maxTerm, -1.209) *
          Math.pow(0.993, age) *
          (gender === 'female' ? 1.018 : 1) *
          raceCoef;

    gfr = Math.round(gfr * 10) / 10;

    // Determine stage and recommendations
    let stage: string;
    let description: string;
    let recommendations: string[];

    if (gfr >= 90) {
      stage = 'Stage 1';
      description = 'Normal kidney function';
      recommendations = [
        'Maintain healthy lifestyle',
        'Regular exercise',
        'Balanced diet',
        'Annual checkups'
      ];
    } else if (gfr >= 60) {
      stage = 'Stage 2';
      description = 'Mild loss of kidney function';
      recommendations = [
        'Monitor blood pressure',
        'Control blood sugar',
        'Regular exercise',
        'Limit salt intake'
      ];
    } else if (gfr >= 45) {
      stage = 'Stage 3a';
      description = 'Mild to moderate loss of kidney function';
      recommendations = [
        'Regular kidney function tests',
        'Blood pressure control',
        'Dietary modifications',
        'Medication review'
      ];
    } else if (gfr >= 30) {
      stage = 'Stage 3b';
      description = 'Moderate to severe loss of kidney function';
      recommendations = [
        'Frequent medical monitoring',
        'Strict dietary control',
        'Blood pressure management',
        'Avoid nephrotoxic medications'
      ];
    } else if (gfr >= 15) {
      stage = 'Stage 4';
      description = 'Severe loss of kidney function';
      recommendations = [
        'Prepare for possible dialysis',
        'Very strict diet control',
        'Regular specialist visits',
        'Careful medication management'
      ];
    } else {
      stage = 'Stage 5';
      description = 'Kidney failure';
      recommendations = [
        'Immediate medical attention',
        'Dialysis or transplant evaluation',
        'Strict dietary restrictions',
        'Close medical supervision'
      ];
    }

    setGfrResult({ gfr, stage, description, recommendations });
  };

  // Get GFR gauge chart
  const getGFRChart = () => {
    if (!gfrResult) return {};

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 120,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.125, '#DC2626'], // Stage 5
                [0.25, '#EF4444'],  // Stage 4
                [0.375, '#F59E0B'], // Stage 3b
                [0.5, '#FBBF24'],   // Stage 3a
                [0.75, '#3B82F6'],  // Stage 2
                [1, '#10B981']      // Stage 1
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '30%'],
            valueAnimation: true,
            formatter: function (value: number) {
              return value + ' mL/min';
            },
            color: 'auto'
          },
          data: [
            {
              value: gfrResult.gfr,
              name: 'GFR'
            }
          ]
        }
      ]
    };
  };

  // Calculate GFR when inputs change
  useEffect(() => {
    if (age && creatinine) {
      calculateGFR();
    }
  }, [age, gender, race, creatinine]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">GFR Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate GFR</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age (years)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="18"
                    max="120"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="select select-bordered w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Race</span>
                  </label>
                  <select
                    value={race}
                    onChange={(e) => setRace(e.target.value as 'black' | 'non-black')}
                    className="select select-bordered w-full"
                  >
                    <option value="black">Black</option>
                    <option value="non-black">Non-Black</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Serum Creatinine (mg/dL)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Normal range: 0.7-1.3 mg/dL for men, 0.6-1.1 mg/dL for women</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={creatinine}
                    onChange={(e) => setCreatinine(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0.1"
                    max="20"
                    step="0.1"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateGFR}
                >
                  Calculate GFR
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {gfrResult && (
              <Card className="bg-card">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Your GFR Results</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* GFR Gauge */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">GFR Measurement</h3>
                      <ReactECharts option={getGFRChart()} style={{ height: '300px' }} />
                    </div>

                    {/* Stage Information */}
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{gfrResult.stage}</h3>
                      <p>{gfrResult.description}</p>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                      <ul className="list-disc pl-6">
                        {gfrResult.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kidney Health Tips */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Kidney Health Tips</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kidneyHealthTips.map((tip, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{tip.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${
                          tip.importance === 'high'
                            ? 'bg-red-100 text-red-800'
                            : tip.importance === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {tip.importance} priority
                        </span>
                      </div>
                      <p>{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CKD Stages Reference */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">CKD Stages Reference</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kidneyStages.map((stage, index) => (
                    <div key={index} className="bg-base-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{stage.stage}</h3>
                        <span className="px-2 py-1 rounded text-sm" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>
                          GFR {stage.range} mL/min
                        </span>
                      </div>
                      <p>{stage.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
