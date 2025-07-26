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

interface AgeGroup {
  range: string;
  maxMale: number;
  maxFemale: number;
}

const ageGroups: AgeGroup[] = [
  { range: '17-20', maxMale: 20, maxFemale: 30 },
  { range: '21-27', maxMale: 22, maxFemale: 32 },
  { range: '28-39', maxMale: 24, maxFemale: 34 },
  { range: '40+', maxMale: 26, maxFemale: 36 }
];

export default function ArmyBodyFatCalculator() {
  const breadcrumbItems = [
    {
      label: 'Army Body Fat Calculator',
      href: '/army-body-fat-calculator'
    }
  ];

  // Input states
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(25);
  const [height, setHeight] = useState<number>(175);
  const [weight, setWeight] = useState<number>(75);
  const [neck, setNeck] = useState<number>(38);
  const [waist, setWaist] = useState<number>(85);
  const [hip, setHip] = useState<number>(0);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [bodyFat, setBodyFat] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [maxAllowed, setMaxAllowed] = useState<number>(0);

  // Calculate body fat percentage
  const calculateBodyFat = () => {
    // Convert measurements to centimeters if in imperial
    const heightCm = unit === 'metric' ? height : height * 2.54;
    const neckCm = unit === 'metric' ? neck : neck * 2.54;
    const waistCm = unit === 'metric' ? waist : waist * 2.54;
    const hipCm = unit === 'metric' ? hip : hip * 2.54;

    let bodyFatPercentage = 0;

    if (gender === 'male') {
      bodyFatPercentage = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
    } else {
      bodyFatPercentage = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
    }

    // Find applicable age group
    const ageGroup = ageGroups.find(group => {
      const [min, max] = group.range.split('-');
      if (max === '+') {
        return age >= parseInt(min);
      }
      return age >= parseInt(min) && age <= parseInt(max);
    });

    const maxAllowedFat = gender === 'male' ? ageGroup?.maxMale : ageGroup?.maxFemale;
    setMaxAllowed(maxAllowedFat || 0);

    // Set status based on body fat percentage
    if (bodyFatPercentage <= maxAllowedFat!) {
      setStatus('Within Standards');
    } else {
      setStatus('Exceeds Standards');
    }

    setBodyFat(Math.round(bodyFatPercentage * 10) / 10);
  };

  // Handle unit change
  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setHeight(Math.round(height / 2.54));
      setNeck(Math.round(neck / 2.54));
      setWaist(Math.round(waist / 2.54));
      if (gender === 'female') setHip(Math.round(hip / 2.54));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setHeight(Math.round(height * 2.54));
      setNeck(Math.round(neck * 2.54));
      setWaist(Math.round(waist * 2.54));
      if (gender === 'female') setHip(Math.round(hip * 2.54));
    }
    setUnit(newUnit);
  };

  // Get standards chart options
  const getStandardsChart = () => {
    return {
      title: {
        text: 'Maximum Body Fat Standards by Age',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Male', 'Female'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: ageGroups.map(g => g.range)
      },
      yAxis: {
        type: 'value',
        name: 'Body Fat %'
      },
      series: [
        {
          name: 'Male',
          type: 'bar',
          data: ageGroups.map(g => g.maxMale),
          itemStyle: {
            color: '#3B82F6'
          }
        },
        {
          name: 'Female',
          type: 'bar',
          data: ageGroups.map(g => g.maxFemale),
          itemStyle: {
            color: '#EC4899'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculateBodyFat();
  }, [gender, age, height, neck, waist, hip, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Army Body Fat Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Measurements</h2>
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
                    min="17"
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
                    <span className="label-text">Neck ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={neck}
                    onChange={(e) => setNeck(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Waist ({unit === 'metric' ? 'cm' : 'inches'})</span>
                  </label>
                  <input
                    type="number"
                    value={waist}
                    onChange={(e) => setWaist(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {gender === 'female' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Hip ({unit === 'metric' ? 'cm' : 'inches'})</span>
                    </label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(Number(e.target.value))}
                      className="input input-bordered w-full"
                      min="0"
                    />
                  </div>
                )}

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateBodyFat}
                >
                  Calculate Body Fat
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
                  {/* Body Fat Display */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Body Fat Percentage</div>
                    <div className="stat-value text-primary">{bodyFat}%</div>
                    <div className="stat-desc">Maximum Allowed: {maxAllowed}%</div>
                  </div>

                  {/* Status Display */}
                  <div className={`stat bg-base-200 rounded-lg p-4 ${
                    status === 'Within Standards' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <div className="stat-title">Status</div>
                    <div className={`stat-value ${
                      status === 'Within Standards' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {status}
                    </div>
                  </div>

                  {/* Standards Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Army Body Fat Standards</h3>
                    <ReactECharts option={getStandardsChart()} style={{ height: '300px' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurement Guide */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Measurement Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">How to Measure</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold">Neck</h4>
                      <ul className="list-disc pl-6 mb-4">
                        <li>Measure just below Adam's apple</li>
                        <li>Keep tape horizontal</li>
                        <li>Don't compress skin</li>
                      </ul>

                      <h4 className="font-semibold">Waist</h4>
                      <ul className="list-disc pl-6 mb-4">
                        <li>Measure at navel level</li>
                        <li>At the end of a normal exhale</li>
                        <li>Keep tape parallel to ground</li>
                      </ul>

                      {gender === 'female' && (
                        <>
                          <h4 className="font-semibold">Hip (Females Only)</h4>
                          <ul className="list-disc pl-6">
                            <li>Measure at largest circumference</li>
                            <li>Include buttocks in measurement</li>
                            <li>Keep tape horizontal</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Army Standards</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Standards vary by age and gender</li>
                        <li>Must be measured by trained personnel</li>
                        <li>Three measurements are taken</li>
                        <li>Average is used for final calculation</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Tips for Success</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Maintain consistent exercise routine</li>
                        <li>Focus on proper nutrition</li>
                        <li>Stay hydrated</li>
                        <li>Get adequate rest</li>
                        <li>Track progress regularly</li>
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
