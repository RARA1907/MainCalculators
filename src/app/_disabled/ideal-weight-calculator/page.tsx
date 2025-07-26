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

interface IdealWeight {
  formula: string;
  weight: number;
  description: string;
}

interface WeightRange {
  min: number;
  max: number;
  category: string;
  description: string;
}

export default function IdealWeightCalculator() {
  const breadcrumbItems = [
    {
      label: 'Ideal Weight Calculator',
      href: '/ideal-weight-calculator'
    }
  ];

  // Input states
  const [height, setHeight] = useState<number>(170);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bodyFrame, setBodyFrame] = useState<'small' | 'medium' | 'large'>('medium');
  const [currentWeight, setCurrentWeight] = useState<number>(70);

  // Result states
  const [idealWeights, setIdealWeights] = useState<IdealWeight[]>([]);
  const [weightRanges, setWeightRanges] = useState<WeightRange[]>([]);
  const [averageIdealWeight, setAverageIdealWeight] = useState<number>(0);

  // Calculate ideal weight using different formulas
  const calculateIdealWeight = () => {
    let heightInInches = unit === 'metric' ? height / 2.54 : height;
    let heightInCm = unit === 'metric' ? height : height * 2.54;
    let weights: IdealWeight[] = [];
    let totalWeight = 0;

    // Robinson Formula (1983)
    let robinsonWeight;
    if (gender === 'male') {
      robinsonWeight = 52 + 1.9 * (heightInInches - 60);
    } else {
      robinsonWeight = 49 + 1.7 * (heightInInches - 60);
    }
    weights.push({
      formula: 'Robinson',
      weight: Number(robinsonWeight.toFixed(1)),
      description: 'Based on large population studies'
    });
    totalWeight += robinsonWeight;

    // Miller Formula (1983)
    let millerWeight;
    if (gender === 'male') {
      millerWeight = 56.2 + 1.41 * (heightInInches - 60);
    } else {
      millerWeight = 53.1 + 1.36 * (heightInInches - 60);
    }
    weights.push({
      formula: 'Miller',
      weight: Number(millerWeight.toFixed(1)),
      description: 'Considers body frame size'
    });
    totalWeight += millerWeight;

    // Devine Formula (1974)
    let devineWeight;
    if (gender === 'male') {
      devineWeight = 50 + 2.3 * (heightInInches - 60);
    } else {
      devineWeight = 45.5 + 2.3 * (heightInInches - 60);
    }
    weights.push({
      formula: 'Devine',
      weight: Number(devineWeight.toFixed(1)),
      description: 'Widely used in medical settings'
    });
    totalWeight += devineWeight;

    // Hamwi Formula (1964)
    let hamwiWeight;
    if (gender === 'male') {
      hamwiWeight = 48 + 2.7 * (heightInInches - 60);
    } else {
      hamwiWeight = 45.5 + 2.2 * (heightInInches - 60);
    }
    weights.push({
      formula: 'Hamwi',
      weight: Number(hamwiWeight.toFixed(1)),
      description: 'Classic method used since 1964'
    });
    totalWeight += hamwiWeight;

    // Convert weights to selected unit
    if (unit === 'imperial') {
      weights = weights.map(w => ({
        ...w,
        weight: Number((w.weight * 2.20462).toFixed(1))
      }));
    }

    setIdealWeights(weights);
    setAverageIdealWeight(
      Number((totalWeight / 4).toFixed(1))
    );

    // Calculate weight ranges
    const avgWeight = unit === 'metric' ? totalWeight / 4 : (totalWeight / 4) * 2.20462;
    const ranges: WeightRange[] = [
      {
        min: avgWeight * 0.85,
        max: avgWeight * 0.95,
        category: 'Underweight Range',
        description: 'Below ideal weight'
      },
      {
        min: avgWeight * 0.95,
        max: avgWeight * 1.05,
        category: 'Ideal Weight Range',
        description: 'Healthy weight range'
      },
      {
        min: avgWeight * 1.05,
        max: avgWeight * 1.15,
        category: 'Overweight Range',
        description: 'Above ideal weight'
      }
    ];
    setWeightRanges(ranges);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setHeight(Math.round(height / 2.54));
      setCurrentWeight(Math.round(currentWeight * 2.20462));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setHeight(Math.round(height * 2.54));
      setCurrentWeight(Math.round(currentWeight / 2.20462));
    }
    setUnit(newUnit);
  };

  // Get weight comparison chart options
  const getWeightComparisonChart = () => {
    return {
      title: {
        text: 'Ideal Weight by Formula',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: idealWeights.map(w => w.formula),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      },
      series: [
        {
          name: 'Ideal Weight',
          type: 'bar',
          data: idealWeights.map(w => w.weight),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateIdealWeight();
  }, [height, gender, unit, bodyFrame]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Ideal Weight Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Ideal Weight</h2>
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
                    <span className="label-text">Body Frame Size</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      className={`btn flex-1 ${bodyFrame === 'small' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setBodyFrame('small')}
                    >
                      Small
                    </button>
                    <button
                      className={`btn flex-1 ${bodyFrame === 'medium' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setBodyFrame('medium')}
                    >
                      Medium
                    </button>
                    <button
                      className={`btn flex-1 ${bodyFrame === 'large' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setBodyFrame('large')}
                    >
                      Large
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      Current Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </span>
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
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
                  {/* Average Ideal Weight */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Ideal Weight</div>
                    <div className="stat-value text-primary">
                      {averageIdealWeight} {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                    <div className="stat-desc">Based on multiple formulas</div>
                  </div>

                  {/* Weight Ranges */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Weight Ranges</h3>
                    {weightRanges.map((range, index) => (
                      <div key={index} className="mb-4 bg-base-200 p-4 rounded-lg">
                        <div className="font-semibold">{range.category}</div>
                        <div>
                          {range.min.toFixed(1)} - {range.max.toFixed(1)}{' '}
                          {unit === 'metric' ? 'kg' : 'lbs'}
                        </div>
                        <div className="text-sm text-gray-500">{range.description}</div>
                      </div>
                    ))}
                  </div>

                  {/* Formula Comparison Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Formula Comparison</h3>
                    <ReactECharts option={getWeightComparisonChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Formula Details */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Formula Details</h3>
                    {idealWeights.map((weight, index) => (
                      <div key={index} className="mb-4 bg-base-200 p-4 rounded-lg">
                        <div className="font-semibold">{weight.formula} Formula</div>
                        <div>
                          {weight.weight} {unit === 'metric' ? 'kg' : 'lbs'}
                        </div>
                        <div className="text-sm text-gray-500">{weight.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding Ideal Weight</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">About the Formulas</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Robinson Formula (1983) - Based on population studies</li>
                        <li>Miller Formula (1983) - Considers frame size</li>
                        <li>Devine Formula (1974) - Common in medical settings</li>
                        <li>Hamwi Formula (1964) - Traditional approach</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Factors Affecting Ideal Weight</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Height and gender</li>
                        <li>Body frame size</li>
                        <li>Muscle mass</li>
                        <li>Age</li>
                        <li>Body composition</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Important Notes</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>These are general guidelines</li>
                        <li>Individual factors may vary</li>
                        <li>Consult healthcare providers</li>
                        <li>Consider overall health, not just weight</li>
                        <li>Use alongside other health metrics</li>
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
