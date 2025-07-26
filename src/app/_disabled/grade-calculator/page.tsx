'use client';

import { useState } from 'react';
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
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

interface GradeItem {
  id: number;
  name: string;
  score: string;
  weight: string;
}

interface GradeCategory {
  range: string;
  description: string;
  color: string;
  feedback: string[];
  recommendations: string[];
}

const gradeCategories: { [key: string]: GradeCategory } = {
  excellent: {
    range: '90-100',
    description: 'Excellent',
    color: '#22C55E',
    feedback: [
      'Outstanding performance',
      'Exceptional understanding of material',
      'Above and beyond expectations',
      'Mastery of course content'
    ],
    recommendations: [
      'Consider tutoring other students',
      'Explore advanced topics',
      'Take on additional challenges',
      'Share study techniques with classmates'
    ]
  },
  good: {
    range: '80-89',
    description: 'Good',
    color: '#3B82F6',
    feedback: [
      'Strong performance',
      'Good grasp of concepts',
      'Consistent effort',
      'Above average work'
    ],
    recommendations: [
      'Review missed questions for full mastery',
      'Participate more in discussions',
      'Seek extra credit opportunities',
      'Maintain current study habits'
    ]
  },
  satisfactory: {
    range: '70-79',
    description: 'Satisfactory',
    color: '#EAB308',
    feedback: [
      'Meeting basic requirements',
      'Room for improvement',
      'Adequate understanding',
      'Passing performance'
    ],
    recommendations: [
      'Attend office hours regularly',
      'Form study groups',
      'Practice with additional problems',
      'Take detailed notes in class'
    ]
  },
  needsWork: {
    range: '0-69',
    description: 'Needs Improvement',
    color: '#EF4444',
    feedback: [
      'Below passing threshold',
      'Significant gaps in understanding',
      'Immediate attention required',
      'Risk of course failure'
    ],
    recommendations: [
      'Schedule meeting with instructor',
      'Seek tutoring assistance',
      'Review fundamental concepts',
      'Develop structured study plan'
    ]
  }
};

export default function GradeCalculator() {
  const breadcrumbItems = [
    {
      label: 'Grade Calculator',
      href: '/grade-calculator'
    }
  ];

  const [items, setItems] = useState<GradeItem[]>([
    { id: 1, name: '', score: '', weight: '' }
  ]);
  const [finalGrade, setFinalGrade] = useState<number>(0);
  const [category, setCategory] = useState<string>('satisfactory');
  const [error, setError] = useState<string>('');
  const [remainingWeight, setRemainingWeight] = useState<number>(100);

  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: '', score: '', weight: '' }
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      updateRemainingWeight(updatedItems);
    }
  };

  const updateItem = (id: number, field: keyof GradeItem, value: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
    
    if (field === 'weight') {
      updateRemainingWeight(updatedItems);
    }
  };

  const updateRemainingWeight = (currentItems: GradeItem[]) => {
    const totalWeight = currentItems.reduce((sum, item) => {
      const weight = parseFloat(item.weight) || 0;
      return sum + weight;
    }, 0);
    setRemainingWeight(100 - totalWeight);
  };

  const calculateGrade = () => {
    setError('');
    
    // Validate inputs
    const invalidItems = items.filter(item => 
      !item.score || !item.weight || 
      isNaN(Number(item.score)) || isNaN(Number(item.weight)) ||
      Number(item.score) < 0 || Number(item.score) > 100 ||
      Number(item.weight) <= 0
    );
    
    if (invalidItems.length > 0) {
      setError('Please fill in all scores (0-100) and weights (> 0) correctly.');
      return;
    }

    const totalWeight = items.reduce((sum, item) => sum + Number(item.weight), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      setError('Total weight must equal 100%.');
      return;
    }

    let weightedTotal = 0;
    items.forEach(item => {
      const score = Number(item.score);
      const weight = Number(item.weight) / 100;
      weightedTotal += score * weight;
    });

    setFinalGrade(Number(weightedTotal.toFixed(2)));

    // Set category based on final grade
    if (weightedTotal >= 90) {
      setCategory('excellent');
    } else if (weightedTotal >= 80) {
      setCategory('good');
    } else if (weightedTotal >= 70) {
      setCategory('satisfactory');
    } else {
      setCategory('needsWork');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Grade Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Grade</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-2">Item</th>
                        <th className="text-left pb-2">Score (%)</th>
                        <th className="text-left pb-2">Weight (%)</th>
                        <th className="text-left pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2">
                            <input
                              type="text"
                              placeholder="Assignment/Test Name"
                              className="input input-bordered w-full"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Score"
                              className="input input-bordered w-full"
                              value={item.score}
                              onChange={(e) => updateItem(item.id, 'score', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="Weight"
                              className="input input-bordered w-full"
                              value={item.weight}
                              onChange={(e) => updateItem(item.id, 'weight', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-sm text-gray-500">
                  Remaining Weight: {remainingWeight}%
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={addItem} className="btn btn-outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                  </button>
                  <button onClick={calculateGrade} className="btn bg-blue-500 hover:bg-blue-600 text-white">
                    Calculate Grade
                  </button>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Your Grade Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Grade Display */}
                  <div className="flex justify-center">
                    <div className="w-48">
                      <CircularProgressbar
                        value={finalGrade}
                        maxValue={100}
                        text={`${finalGrade}%`}
                        styles={buildStyles({
                          textColor: gradeCategories[category].color,
                          pathColor: gradeCategories[category].color,
                          trailColor: '#d6d6d6'
                        })}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <div className="text-xl font-semibold" style={{ color: gradeCategories[category].color }}>
                      {gradeCategories[category].description}
                    </div>
                    <div className="text-sm text-gray-500">
                      Grade Range: {gradeCategories[category].range}%
                    </div>
                  </div>

                  <Separator />

                  {/* Feedback */}
                  <div>
                    <h3 className="font-semibold mb-2">Performance Feedback:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {gradeCategories[category].feedback.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {gradeCategories[category].recommendations.map((rec, index) => (
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
                <h2 className="text-2xl font-semibold">Understanding Grade Calculation</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Grade Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(gradeCategories).map(([key, cat]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: cat.color }}>
                            {cat.description}
                          </h4>
                          <div className="text-sm">Range: {cat.range}%</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">How Grades Are Calculated</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Each item is weighted based on its importance</li>
                        <li>Weights must total exactly 100%</li>
                        <li>Formula: Sum of (Score × Weight%)</li>
                        <li>Scores should be entered as percentages (0-100)</li>
                        <li>Higher weights have more impact on final grade</li>
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
