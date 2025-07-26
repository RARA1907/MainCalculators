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

interface Course {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

interface GPACategory {
  range: string;
  description: string;
  color: string;
  achievements: string[];
  recommendations: string[];
}

const gpaCategories: { [key: string]: GPACategory } = {
  excellent: {
    range: '3.7 - 4.0',
    description: 'Excellent',
    color: '#22C55E',
    achievements: [
      'Dean\'s List qualification',
      'Academic excellence',
      'Strong graduate school prospects',
      'Competitive for scholarships'
    ],
    recommendations: [
      'Consider honors programs',
      'Explore research opportunities',
      'Apply for academic awards',
      'Mentor other students'
    ]
  },
  good: {
    range: '3.0 - 3.69',
    description: 'Good',
    color: '#3B82F6',
    achievements: [
      'Above average performance',
      'Good academic standing',
      'Eligible for most opportunities',
      'Solid foundation'
    ],
    recommendations: [
      'Target improvement in challenging subjects',
      'Join study groups',
      'Seek additional challenges',
      'Balance academics with activities'
    ]
  },
  fair: {
    range: '2.0 - 2.99',
    description: 'Fair',
    color: '#EAB308',
    achievements: [
      'Meeting basic requirements',
      'Passing all courses',
      'Maintaining eligibility',
      'Room for improvement'
    ],
    recommendations: [
      'Utilize tutoring services',
      'Improve study habits',
      'Meet with academic advisor',
      'Consider study skills workshops'
    ]
  },
  concern: {
    range: '0.0 - 1.99',
    description: 'Needs Improvement',
    color: '#EF4444',
    achievements: [
      'Academic probation risk',
      'Graduation requirements at risk',
      'Limited opportunities',
      'Immediate attention needed'
    ],
    recommendations: [
      'Seek immediate academic help',
      'Meet with professors regularly',
      'Consider course load reduction',
      'Develop academic success plan'
    ]
  }
};

const gradePoints: { [key: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

export default function GPACalculator() {
  const breadcrumbItems = [
    {
      label: 'GPA Calculator',
      href: '/gpa-calculator'
    }
  ];

  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: '', credits: '', grade: '' }
  ]);
  const [gpa, setGpa] = useState<number>(0);
  const [category, setCategory] = useState<string>('good');
  const [error, setError] = useState<string>('');

  const addCourse = () => {
    setCourses([
      ...courses,
      { id: courses.length + 1, name: '', credits: '', grade: '' }
    ]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    setError('');
    
    // Validate inputs
    const invalidCourses = courses.filter(course => 
      !course.credits || !course.grade || isNaN(Number(course.credits))
    );
    
    if (invalidCourses.length > 0) {
      setError('Please fill in all credits and grades correctly.');
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = Number(course.credits);
      const gradePoint = gradePoints[course.grade];
      totalPoints += credits * gradePoint;
      totalCredits += credits;
    });

    const calculatedGPA = totalPoints / totalCredits;
    setGpa(Number(calculatedGPA.toFixed(2)));

    // Set category based on GPA
    if (calculatedGPA >= 3.7) {
      setCategory('excellent');
    } else if (calculatedGPA >= 3.0) {
      setCategory('good');
    } else if (calculatedGPA >= 2.0) {
      setCategory('fair');
    } else {
      setCategory('concern');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">GPA Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your GPA</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left pb-2">Course</th>
                        <th className="text-left pb-2">Credits</th>
                        <th className="text-left pb-2">Grade</th>
                        <th className="text-left pb-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-t">
                          <td className="py-2">
                            <input
                              type="text"
                              placeholder="Course Name"
                              className="input input-bordered w-full"
                              value={course.name}
                              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              max="6"
                              placeholder="Credits"
                              className="input input-bordered w-full"
                              value={course.credits}
                              onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                            />
                          </td>
                          <td className="py-2">
                            <select
                              className="select select-bordered w-full"
                              value={course.grade}
                              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                            >
                              <option value="">Select Grade</option>
                              {Object.keys(gradePoints).map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-2">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => removeCourse(course.id)}
                              disabled={courses.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={addCourse} className="btn btn-outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Course
                  </button>
                  <button onClick={calculateGPA} className="btn bg-blue-500 hover:bg-blue-600 text-white">
                    Calculate GPA
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
                <h2 className="text-2xl font-semibold">Your GPA Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* GPA Display */}
                  <div className="flex justify-center">
                    <div className="w-48">
                      <CircularProgressbar
                        value={gpa}
                        maxValue={4.0}
                        text={gpa.toFixed(2)}
                        styles={buildStyles({
                          textColor: gpaCategories[category].color,
                          pathColor: gpaCategories[category].color,
                          trailColor: '#d6d6d6'
                        })}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <div className="text-xl font-semibold" style={{ color: gpaCategories[category].color }}>
                      {gpaCategories[category].description}
                    </div>
                    <div className="text-sm text-gray-500">
                      GPA Range: {gpaCategories[category].range}
                    </div>
                  </div>

                  <Separator />

                  {/* Achievements */}
                  <div>
                    <h3 className="font-semibold mb-2">Academic Standing:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {gpaCategories[category].achievements.map((achievement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="font-semibold mb-2">Recommendations:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {gpaCategories[category].recommendations.map((rec, index) => (
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
                <h2 className="text-2xl font-semibold">Understanding GPA</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">GPA Categories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(gpaCategories).map(([key, cat]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg"
                          style={{ backgroundColor: `${cat.color}20` }}
                        >
                          <h4 className="font-semibold mb-1" style={{ color: cat.color }}>
                            {cat.description}
                          </h4>
                          <div className="text-sm">GPA: {cat.range}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">GPA Calculation Method</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Each course is weighted by its credit hours</li>
                        <li>Grade points: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0</li>
                        <li>Formula: Total Grade Points ÷ Total Credit Hours</li>
                        <li>Some institutions use different scales (e.g., 5.0 scale)</li>
                        <li>Plus/minus grades may affect point values</li>
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
