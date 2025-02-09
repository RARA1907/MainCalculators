'use client';

import { useState } from 'react';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateBodyFat = () => {
    if (!age || !weight || !height || !neck || !waist || (gender === 'female' && !hip)) {
      alert('Please fill in all required fields');
      return;
    }

    const heightCm = parseFloat(height);
    const waistCm = parseFloat(waist);
    const neckCm = parseFloat(neck);

    let bodyFat: number;

    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      const hipCm = parseFloat(hip);
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }

    setResult(Math.round(bodyFat * 10) / 10);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Body Fat Calculator</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded-md ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setGender('male')}
                >
                  Male
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${gender === 'female' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setGender('female')}
                >
                  Female
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter height"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neck Circumference (cm)</label>
                <input
                  type="number"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter neck circumference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waist Circumference (cm)</label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter waist circumference"
                />
              </div>

              {gender === 'female' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hip Circumference (cm)</label>
                  <input
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter hip circumference"
                  />
                </div>
              )}
            </div>

            <button
              onClick={calculateBodyFat}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Calculate Body Fat
            </button>

            {result !== null && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-semibold text-gray-900">Result</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">{result}% Body Fat</p>
                <div className="mt-4 text-sm text-gray-600">
                  <h3 className="font-medium mb-2">Body Fat Categories:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Essential fat: {gender === 'male' ? '2-5%' : '10-13%'}</li>
                    <li>Athletes: {gender === 'male' ? '6-13%' : '14-20%'}</li>
                    <li>Fitness: {gender === 'male' ? '14-17%' : '21-24%'}</li>
                    <li>Average: {gender === 'male' ? '18-24%' : '25-31%'}</li>
                    <li>Obese: {gender === 'male' ? '25%+' : '32%+'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
