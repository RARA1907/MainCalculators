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

interface BSAFormula {
  name: string;
  description: string;
  formula: string;
  bestFor: string[];
  limitations: string[];
}

const bsaFormulas: BSAFormula[] = [
  {
    name: 'Mosteller',
    description: 'Most widely used formula, validated for all body types',
    formula: 'BSA (m²) = √((height × weight) / 3600)',
    bestFor: [
      'General population',
      'Clinical settings',
      'Drug dosing',
      'All age groups'
    ],
    limitations: [
      'Less accurate for extreme body types',
      'May underestimate in obesity'
    ]
  },
  {
    name: 'DuBois and DuBois',
    description: 'Traditional formula, still widely used in clinical practice',
    formula: 'BSA (m²) = 0.007184 × height^0.725 × weight^0.425',
    bestFor: [
      'Research settings',
      'Historical comparisons',
      'Normal BMI range'
    ],
    limitations: [
      'Less accurate for obese patients',
      'Developed from limited sample size'
    ]
  },
  {
    name: 'Haycock',
    description: 'Good for pediatric patients and varying body sizes',
    formula: 'BSA (m²) = 0.024265 × height^0.3964 × weight^0.5378',
    bestFor: [
      'Pediatric patients',
      'Varying body sizes',
      'Clinical trials'
    ],
    limitations: [
      'Less common in general practice',
      'Limited validation in elderly'
    ]
  }
];

interface MedicalApplication {
  category: string;
  description: string;
  examples: string[];
}

const medicalApplications: MedicalApplication[] = [
  {
    category: 'Drug Dosing',
    description: 'Used to calculate appropriate medication doses',
    examples: [
      'Chemotherapy drugs',
      'Cardiac medications',
      'Antibiotics for severe infections'
    ]
  },
  {
    category: 'Burn Assessment',
    description: 'Calculating total body surface area affected by burns',
    examples: [
      'Fluid replacement therapy',
      'Burn severity assessment',
      'Treatment planning'
    ]
  },
  {
    category: 'Cardiac Function',
    description: 'Indexing cardiac measurements',
    examples: [
      'Cardiac output',
      'Stroke volume',
      'Valve area calculations'
    ]
  }
];

export default function BodySurfaceAreaCalculator() {
  const breadcrumbItems = [
    {
      label: 'Body Surface Area Calculator',
      href: '/body-surface-area-calculator'
    }
  ];

  // Input states
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [selectedFormula, setSelectedFormula] = useState<BSAFormula>(bsaFormulas[0]);

  // Result states
  const [bsaResults, setBsaResults] = useState<{[key: string]: number}>({});
  const [averageBSA, setAverageBSA] = useState<number>(0);

  // Calculate BSA using different formulas
  const calculateBSA = () => {
    const heightM = unit === 'metric' ? height / 100 : height * 0.0254;
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;

    const results: {[key: string]: number} = {
      // Mosteller formula
      Mosteller: Math.sqrt((heightM * 100 * weightKg) / 3600),
      
      // DuBois formula
      'DuBois and DuBois': 0.007184 * Math.pow(heightM * 100, 0.725) * Math.pow(weightKg, 0.425),
      
      // Haycock formula
      Haycock: 0.024265 * Math.pow(heightM * 100, 0.3964) * Math.pow(weightKg, 0.5378)
    };

    setBsaResults(results);
    setAverageBSA(Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length);
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

  // Get BSA comparison chart
  const getBSAChart = () => {
    return {
      title: {
        text: 'BSA by Formula',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} m²'
      },
      xAxis: {
        type: 'category',
        data: Object.keys(bsaResults)
      },
      yAxis: {
        type: 'value',
        name: 'BSA (m²)',
        min: Math.min(...Object.values(bsaResults)) * 0.95,
        max: Math.max(...Object.values(bsaResults)) * 1.05
      },
      series: [
        {
          type: 'bar',
          data: Object.values(bsaResults),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateBSA();
  }, [height, weight, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Body Surface Area Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your BSA</h2>
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
                    <span className="label-text">Formula Selection</span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {bsaFormulas.map((formula) => (
                      <button
                        key={formula.name}
                        className={`btn ${selectedFormula.name === formula.name ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                        onClick={() => setSelectedFormula(formula)}
                      >
                        {formula.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateBSA}
                >
                  Calculate BSA
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
                  {/* Average BSA Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average BSA</div>
                    <div className="stat-value text-primary">{averageBSA.toFixed(2)} m²</div>
                    <div className="stat-desc">Based on multiple formulas</div>
                  </div>

                  {/* Individual Formula Results */}
                  <div className="space-y-4">
                    {Object.entries(bsaResults).map(([formula, value]) => (
                      <div key={formula} className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title">{formula}</div>
                        <div className="stat-value text-secondary">{value.toFixed(2)} m²</div>
                      </div>
                    ))}
                  </div>

                  {/* BSA Comparison Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Formula Comparison</h3>
                    <ReactECharts option={getBSAChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Formula Details */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">{selectedFormula.name} Formula Details</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <p className="mb-2">{selectedFormula.description}</p>
                      <p className="font-mono">{selectedFormula.formula}</p>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Best Used For</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {selectedFormula.bestFor.map((use, index) => (
                          <li key={index}>{use}</li>
                        ))}
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Limitations</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        {selectedFormula.limitations.map((limitation, index) => (
                          <li key={index}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>

            {/* Medical Applications */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Medical Applications</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {medicalApplications.map((app, index) => (
                    <section key={index} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{app.category}</h3>
                      <div className="bg-base-200 p-4 rounded-lg">
                        <p className="mb-2">{app.description}</p>
                        <ul className="list-disc pl-6">
                          {app.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
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
