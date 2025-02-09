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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

interface BMICategory {
  range: string;
  description: string;
  color: string;
  risks: string[];
  recommendations: string[];
}

const bmiCategories: { [key: string]: BMICategory } = {
  underweight: {
    range: '< 18.5',
    description: 'Underweight',
    color: '#3B82F6',
    risks: [
      'Weakened immune system',
      'Nutrient deficiencies',
      'Osteoporosis risk',
      'Fertility issues'
    ],
    recommendations: [
      'Increase caloric intake',
      'Eat protein-rich foods',
      'Regular strength training',
      'Consult a nutritionist'
    ]
  },
  normal: {
    range: '18.5 - 24.9',
    description: 'Normal Weight',
    color: '#22C55E',
    risks: [
      'Lowest risk for health issues',
      'Good baseline for fitness',
      'Optimal metabolic function',
      'Better immune response'
    ],
    recommendations: [
      'Maintain balanced diet',
      'Regular exercise',
      'Regular health checkups',
      'Stay hydrated'
    ]
  },
  overweight: {
    range: '25 - 29.9',
    description: 'Overweight',
    color: '#EAB308',
    risks: [
      'Increased heart disease risk',
      'Type 2 diabetes risk',
      'Joint problems',
      'Sleep apnea'
    ],
    recommendations: [
      'Reduce caloric intake',
      'Increase physical activity',
      'Monitor portion sizes',
      'Regular health screenings'
    ]
  },
  obese: {
    range: '≥ 30',
    description: 'Obese',
    color: '#EF4444',
    risks: [
      'High heart disease risk',
      'High diabetes risk',
      'Severe joint problems',
      'Respiratory issues'
    ],
    recommendations: [
      'Seek medical guidance',
      'Structured weight loss plan',
      'Regular exercise routine',
      'Consider lifestyle changes'
    ]
  }
};

export default function BMICalculator() {
  const breadcrumbItems = [
    {
      label: 'BMI Calculator',
      href: '/bmi-calculator'
    }
  ];

  // Input values
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Results
  const [bmi, setBMI] = useState<number>(0);
  const [category, setCategory] = useState<string>('normal');
  const [healthyWeightRange, setHealthyWeightRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });

  // Calculate BMI
  const calculateBMI = () => {
    let calculatedBMI: number;
    
    if (unit === 'metric') {
      calculatedBMI = weight / Math.pow(height / 100, 2);
    } else {
      calculatedBMI = (weight / Math.pow(height, 2)) * 703;
    }
    
    setBMI(Number(calculatedBMI.toFixed(1)));

    if (calculatedBMI < 18.5) {
      setCategory('underweight');
    } else if (calculatedBMI < 25) {
      setCategory('normal');
    } else if (calculatedBMI < 30) {
      setCategory('overweight');
    } else {
      setCategory('obese');
    }

    const heightInMeters = unit === 'metric' ? height / 100 : height * 0.0254;
    const minWeight = 18.5 * Math.pow(heightInMeters, 2);
    const maxWeight = 24.9 * Math.pow(heightInMeters, 2);
    
    if (unit === 'imperial') {
      setHealthyWeightRange({
        min: Number((minWeight * 2.20462).toFixed(1)),
        max: Number((maxWeight * 2.20462).toFixed(1))
      });
    } else {
      setHealthyWeightRange({
        min: Number(minWeight.toFixed(1)),
        max: Number(maxWeight.toFixed(1))
      });
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

  useEffect(() => {
    calculateBMI();
  }, [height, weight, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4">BMI Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your BMI</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Unit System</Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={unit === 'metric' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleUnitChange('metric')}
                  >
                    Metric
                  </Button>
                  <Button
                    type="button"
                    variant={unit === 'imperial' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleUnitChange('imperial')}
                  >
                    Imperial
                  </Button>
                </div>
              </div>

              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={(value) => setGender(value as 'male' | 'female')}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <Button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={calculateBMI}
              >
                Calculate BMI
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your BMI Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* BMI Display */}
                  <div className="flex justify-center">
                    <div className="w-48">
                      <CircularProgressbar
                        value={Math.min(bmi, 40)}
                        maxValue={40}
                        text={`${bmi.toFixed(1)}`}
                        styles={buildStyles({
                          textColor: bmiCategories[category].color,
                          pathColor: bmiCategories[category].color,
                          trailColor: '#d6d6d6'
                        })}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <div className="text-xl font-semibold" style={{ color: bmiCategories[category].color }}>
                      {bmiCategories[category].description}
                    </div>
                    <div className="text-sm text-gray-500">
                      BMI Range: {bmiCategories[category].range}
                    </div>
                  </div>

                  {/* Healthy Weight Range */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <div className="font-semibold">Healthy Weight Range:</div>
                    <div className="mt-1">
                      {healthyWeightRange.min.toFixed(1)} - {healthyWeightRange.max.toFixed(1)}{' '}
                      {unit === 'metric' ? 'kg' : 'lbs'}
                    </div>
                  </div>

                  <Separator />

                  {/* Health Risks */}
                  <div>
                    <h3 className="font-semibold mb-2">Potential Health Risks:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {bmiCategories[category].risks.map((risk, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {risk}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {bmiCategories[category].recommendations.map((rec, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {rec}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Understanding BMI</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">BMI Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(bmiCategories).map(([key, cat]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: cat.color }}>
                            {cat.description}
                          </h4>
                          <div className="text-sm">BMI: {cat.range}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">BMI Limitations</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Doesn't account for muscle mass</li>
                        <li>May not be accurate for athletes</li>
                        <li>Different thresholds for different ethnicities</li>
                        <li>Not suitable for pregnant women</li>
                        <li>May not be accurate for elderly</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Tips for Healthy Weight</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Balanced, nutritious diet</li>
                        <li>Regular physical activity</li>
                        <li>Adequate sleep</li>
                        <li>Stress management</li>
                        <li>Regular health check-ups</li>
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
