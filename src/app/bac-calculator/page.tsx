'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface DrinkType {
  name: string;
  alcoholContent: number;
  standardDrinks: number;
  volume: number;
  description: string;
}

const drinkTypes: DrinkType[] = [
  {
    name: 'Beer (Regular)',
    alcoholContent: 0.05,
    standardDrinks: 1,
    volume: 355,
    description: '12 oz of regular beer (5% alcohol)'
  },
  {
    name: 'Beer (Light)',
    alcoholContent: 0.042,
    standardDrinks: 0.85,
    volume: 355,
    description: '12 oz of light beer (4.2% alcohol)'
  },
  {
    name: 'Wine',
    alcoholContent: 0.12,
    standardDrinks: 1.2,
    volume: 148,
    description: '5 oz of wine (12% alcohol)'
  },
  {
    name: 'Spirits',
    alcoholContent: 0.40,
    standardDrinks: 1.5,
    volume: 44,
    description: '1.5 oz of 80-proof spirits (40% alcohol)'
  }
];

interface BACLevel {
  level: number;
  effects: string[];
  risks: string[];
  legalImplications: string;
}

const bacLevels: BACLevel[] = [
  {
    level: 0.02,
    effects: [
      'Mild mood changes',
      'Slight relaxation',
      'Minor judgment impairment'
    ],
    risks: [
      'Slightly decreased inhibitions',
      'Mild alteration in mood'
    ],
    legalImplications: 'Under legal limit for adults 21+, may be over limit for under 21'
  },
  {
    level: 0.05,
    effects: [
      'Increased relaxation',
      'Lowered alertness',
      'Reduced coordination',
      'Impaired judgment'
    ],
    risks: [
      'Reduced inhibitions',
      'Impaired judgment',
      'Altered behavior'
    ],
    legalImplications: 'Under legal limit for adults 21+, over limit for under 21'
  },
  {
    level: 0.08,
    effects: [
      'Significant impairment',
      'Poor muscle coordination',
      'Slurred speech',
      'Impaired driving ability'
    ],
    risks: [
      'Legal intoxication',
      'Dangerous driving conditions',
      'Increased risk of accidents'
    ],
    legalImplications: 'Legal limit for driving (21+). Criminal penalties may apply.'
  },
  {
    level: 0.10,
    effects: [
      'Clear deterioration of reaction time',
      'Poor coordination',
      'Slowed thinking',
      'Poor judgment'
    ],
    risks: [
      'Significant impairment',
      'High accident risk',
      'Poor decision-making'
    ],
    legalImplications: 'Over legal limit. Criminal penalties apply.'
  },
  {
    level: 0.15,
    effects: [
      'Major impairment',
      'Far less muscle control',
      'Vomiting may occur',
      'Major loss of balance'
    ],
    risks: [
      'Severe impairment',
      'Blackout risk',
      'Injury risk'
    ],
    legalImplications: 'Severe criminal penalties. Possible aggravated DUI.'
  }
];

export default function BACCalculator() {
  const breadcrumbItems = [{ label: 'BAC Calculator', href: '/bac-calculator' }];

  // State definitions
  const [weight, setWeight] = useState<number>(70);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [hours, setHours] = useState<number>(1);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [drinks, setDrinks] = useState<{type: DrinkType; quantity: number}[]>([]);
  const [bac, setBac] = useState<number>(0);
  const [peakBac, setPeakBac] = useState<number>(0);
  const [timeToSober, setTimeToSober] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<BACLevel | null>(null);
  const [age, setAge] = useState<number>(25);

  // Calculate BAC
  const calculateBAC = useCallback(() => {
    const weightKg = unit === 'metric' ? weight : weight * 0.453592;
    const genderConstant = gender === 'male' ? 0.68 : 0.55;
    
    const totalAlcohol = drinks.reduce((acc, drink) => {
      return acc + (drink.type.alcoholContent * drink.type.volume * drink.quantity * 0.789);
    }, 0);

    let calculatedBac = (totalAlcohol / (weightKg * 1000 * genderConstant)) * 100;
    calculatedBac -= hours * 0.015;
    calculatedBac = Math.max(0, calculatedBac);
    
    setBac(Number(calculatedBac.toFixed(3)));
    setPeakBac(Number((calculatedBac + (hours * 0.015)).toFixed(3)));
    
    const hoursToSober = calculatedBac / 0.015;
    setTimeToSober(Math.ceil(hoursToSober));

    const currentLevel = bacLevels.reduce((prev, curr) => {
      if (calculatedBac >= curr.level) return curr;
      return prev;
    }, bacLevels[0]);
    
    setCurrentLevel(currentLevel);
  }, [weight, gender, hours, drinks, unit]);

  useEffect(() => {
    if (weight && gender && hours >= 0 && drinks.length >= 0) {
      calculateBAC();
    }
  }, [weight, gender, hours, drinks, unit, calculateBAC]);

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    if (newUnit === 'imperial' && unit === 'metric') {
      setWeight(Math.round(weight * 2.20462));
    } else if (newUnit === 'metric' && unit === 'imperial') {
      setWeight(Math.round(weight / 2.20462));
    }
    setUnit(newUnit);
  };

  const addDrink = (drinkType: DrinkType) => {
    setDrinks([...drinks, { type: drinkType, quantity: 1 }]);
  };

  const removeDrink = (index: number) => {
    const newDrinks = [...drinks];
    newDrinks.splice(index, 1);
    setDrinks(newDrinks);
  };

  const updateDrinkQuantity = (index: number, quantity: number) => {
    const newDrinks = [...drinks];
    newDrinks[index].quantity = quantity;
    setDrinks(newDrinks);
  };

  const getBacChart = () => ({
    title: {
      text: 'BAC Over Time',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b} hours: {c}% BAC'
    },
    xAxis: {
      type: 'category',
      name: 'Hours',
      data: Array.from({ length: timeToSober + 1 }, (_, i) => i)
    },
    yAxis: {
      type: 'value',
      name: 'BAC %'
    },
    series: [{
      data: Array.from({ length: timeToSober + 1 }, (_, i) => {
        const bacAtTime = Math.max(0, bac - (i * 0.015));
        return Number(bacAtTime.toFixed(3));
      }),
      type: 'line',
      smooth: true,
      markLine: {
        data: [
          { yAxis: 0.08, name: 'Legal Limit', lineStyle: { color: '#ff4d4f' } }
        ]
      }
    }]
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">BAC Calculator</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your BAC</h2>
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
                    <span className="label-text">Hours Since First Drink</span>
                  </label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Add Drinks</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {drinkTypes.map((drink) => (
                      <button
                        key={drink.name}
                        className="btn btn-outline hover:bg-blue-100"
                        onClick={() => addDrink(drink)}
                      >
                        {drink.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drinks List */}
                <div className="space-y-2">
                  {drinks.map((drink, index) => (
                    <div key={index} className="flex items-center gap-2 bg-base-200 p-2 rounded-lg">
                      <span className="flex-grow">{drink.type.name}</span>
                      <input
                        type="number"
                        value={drink.quantity}
                        onChange={(e) => updateDrinkQuantity(index, Number(e.target.value))}
                        className="input input-bordered w-20"
                        min="1"
                      />
                      <button
                        className="btn btn-square btn-sm btn-error"
                        onClick={() => removeDrink(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculateBAC}
                >
                  Calculate BAC
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your BAC Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* BAC Display */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Current BAC</div>
                      <div className={`stat-value ${bac >= 0.08 ? 'text-red-500' : 'text-green-500'}`}>
                        {bac.toFixed(3)}%
                      </div>
                      <div className="stat-desc">
                        {bac >= 0.08 ? 'Over legal limit' : 'Under legal limit'}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Peak BAC</div>
                      <div className={`stat-value ${peakBac >= 0.08 ? 'text-red-500' : 'text-green-500'}`}>
                        {peakBac.toFixed(3)}%
                      </div>
                      <div className="stat-desc">Maximum level reached</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Time to Sober</div>
                      <div className="stat-value text-blue-500">{timeToSober}h</div>
                      <div className="stat-desc">Until BAC &lt; 0.01%</div>
                    </div>
                  </div>

                  {/* BAC Chart */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">BAC Over Time</h3>
                    <ReactECharts option={getBacChart()} style={{ height: '300px' }} />
                  </div>

                  {/* Current Effects */}
                  {currentLevel && (
                    <div className="bg-base-200 rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2">Current Effects</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Physical Effects:</h4>
                          <ul className="list-disc pl-6">
                            {currentLevel.effects.map((effect, index) => (
                              <li key={index}>{effect}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold">Risks:</h4>
                          <ul className="list-disc pl-6">
                            {currentLevel.risks.map((risk, index) => (
                              <li key={index}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold">Legal Status:</h4>
                          <p>{currentLevel.legalImplications}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Legal Information</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Legal Limits</h3>
                    <ul className="list-disc pl-6">
                      <li>For drivers 21 and older: 0.08% BAC is the legal limit</li>
                      <li>For drivers under 21: Limits vary by state (0.01% - 0.05%)</li>
                      <li>Commercial drivers: 0.04% BAC limit</li>
                    </ul>
                    <div className="mt-4">
                      <h4 className="font-semibold">Important Notes:</h4>
                      <ul className="list-disc pl-6">
                        <li>This calculator provides estimates only</li>
                        <li>Actual BAC may vary based on many factors</li>
                        <li>Never drink and drive, regardless of calculated BAC</li>
                        <li>Always have a designated driver or use a ride service</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Standard Drinks */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Standard Drinks Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="space-y-4">
                    {drinkTypes.map((drink) => (
                      <div key={drink.name} className="bg-base-200 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">{drink.name}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>Alcohol: {(drink.alcoholContent * 100).toFixed(1)}%</p>
                            <p>Volume: {drink.volume}ml</p>
                          </div>
                          <div>
                            <p>Standard Drinks: {drink.standardDrinks}</p>
                            <p>{drink.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
