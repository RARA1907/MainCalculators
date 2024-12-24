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

interface Distance {
  name: string;
  km: number;
  miles: number;
  description: string;
}

const distances: Distance[] = [
  { name: '5K', km: 5, miles: 3.11, description: 'Popular race distance for beginners' },
  { name: '10K', km: 10, miles: 6.21, description: 'Common intermediate race distance' },
  { name: 'Half Marathon', km: 21.1, miles: 13.1, description: 'Challenging endurance race' },
  { name: 'Marathon', km: 42.2, miles: 26.2, description: 'Ultimate distance running challenge' },
  { name: 'Custom', km: 0, miles: 0, description: 'Enter your own distance' }
];

interface Split {
  distance: number;
  time: string;
  pace: string;
}

export default function PaceCalculator() {
  const breadcrumbItems = [
    {
      label: 'Pace Calculator',
      href: '/pace-calculator'
    }
  ];

  // Input states
  const [selectedDistance, setSelectedDistance] = useState<Distance>(distances[0]);
  const [customDistance, setCustomDistance] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Result states
  const [pace, setPace] = useState<{
    perKm: string;
    perMile: string;
    avgSpeed: number;
  }>({
    perKm: '00:00',
    perMile: '00:00',
    avgSpeed: 0
  });
  const [splits, setSplits] = useState<Split[]>([]);

  // Calculate pace and splits
  const calculatePace = () => {
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const distance = selectedDistance.name === 'Custom' ? 
      (unit === 'metric' ? customDistance : customDistance * 1.60934) :
      (unit === 'metric' ? selectedDistance.km : selectedDistance.miles);

    if (distance <= 0 || totalSeconds <= 0) return;

    // Calculate pace per km and mile
    const secondsPerKm = totalSeconds / (unit === 'metric' ? distance : distance * 1.60934);
    const secondsPerMile = totalSeconds / (unit === 'metric' ? distance * 0.621371 : distance);

    // Convert to pace format
    const pacePerKm = formatPace(secondsPerKm);
    const pacePerMile = formatPace(secondsPerMile);

    // Calculate average speed
    const avgSpeed = (distance / totalSeconds) * 3600;

    setPace({
      perKm: pacePerKm,
      perMile: pacePerMile,
      avgSpeed: Number(avgSpeed.toFixed(2))
    });

    // Calculate splits
    const splitDistance = unit === 'metric' ? 1 : 1.60934; // 1km or 1mile splits
    const numSplits = Math.ceil(distance / splitDistance);
    const newSplits: Split[] = [];

    for (let i = 1; i <= numSplits; i++) {
      const splitTime = formatTime((totalSeconds / distance) * splitDistance * i);
      newSplits.push({
        distance: Number((splitDistance * i).toFixed(2)),
        time: splitTime,
        pace: unit === 'metric' ? pacePerKm : pacePerMile
      });
    }

    setSplits(newSplits);
  };

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format seconds to pace format (MM:SS)
  const formatPace = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Get splits chart options
  const getSplitsChart = () => {
    return {
      title: {
        text: `${unit === 'metric' ? 'Kilometer' : 'Mile'} Splits`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `Distance: ${data.name} ${unit === 'metric' ? 'km' : 'mi'}<br/>Time: ${splits[data.dataIndex].time}`;
        }
      },
      xAxis: {
        type: 'category',
        data: splits.map(s => s.distance),
        name: unit === 'metric' ? 'Distance (km)' : 'Distance (mi)'
      },
      yAxis: {
        type: 'value',
        name: 'Time (min:sec)',
        axisLabel: {
          formatter: (value: number) => formatTime(value)
        }
      },
      series: [
        {
          type: 'line',
          data: splits.map(s => {
            const [min, sec] = s.time.split(':').map(Number);
            return min * 60 + sec;
          }),
          itemStyle: {
            color: '#3B82F6'
          }
        }
      ]
    };
  };

  useEffect(() => {
    calculatePace();
  }, [selectedDistance, customDistance, hours, minutes, seconds, unit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Pace Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Your Pace</h2>
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
                      onClick={() => setUnit('metric')}
                    >
                      Metric (km)
                    </button>
                    <button
                      className={`btn flex-1 ${unit === 'imperial' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'btn-outline hover:bg-blue-100'}`}
                      onClick={() => setUnit('imperial')}
                    >
                      Imperial (mi)
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Distance</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedDistance.name}
                    onChange={(e) => {
                      const selected = distances.find(d => d.name === e.target.value);
                      if (selected) setSelectedDistance(selected);
                    }}
                  >
                    {distances.map((distance) => (
                      <option key={distance.name} value={distance.name}>
                        {distance.name} ({unit === 'metric' ? 
                          `${distance.km} km` : 
                          `${distance.miles} mi`})
                      </option>
                    ))}
                  </select>
                  {selectedDistance.name === 'Custom' && (
                    <input
                      type="number"
                      value={customDistance}
                      onChange={(e) => setCustomDistance(Number(e.target.value))}
                      className="input input-bordered w-full mt-2"
                      placeholder={`Enter distance in ${unit === 'metric' ? 'kilometers' : 'miles'}`}
                      min="0"
                      step="0.1"
                    />
                  )}
                  <span className="text-sm text-gray-500 mt-1">
                    {selectedDistance.description}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Hours</span>
                    </label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="input input-bordered"
                      min="0"
                      max="99"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Minutes</span>
                    </label>
                    <input
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="input input-bordered"
                      min="0"
                      max="59"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Seconds</span>
                    </label>
                    <input
                      type="number"
                      value={seconds}
                      onChange={(e) => setSeconds(Number(e.target.value))}
                      className="input input-bordered"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105"
                  onClick={calculatePace}
                >
                  Calculate Pace
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
                  {/* Pace Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Pace per km</div>
                      <div className="stat-value text-primary">{pace.perKm}</div>
                      <div className="stat-desc">minutes per kilometer</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                      <div className="stat-title">Pace per mile</div>
                      <div className="stat-value text-secondary">{pace.perMile}</div>
                      <div className="stat-desc">minutes per mile</div>
                    </div>
                  </div>

                  {/* Average Speed */}
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Speed</div>
                    <div className="stat-value">
                      {pace.avgSpeed} {unit === 'metric' ? 'km/h' : 'mph'}
                    </div>
                  </div>

                  {/* Splits Chart */}
                  {splits.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Split Times</h3>
                      <ReactECharts option={getSplitsChart()} style={{ height: '300px' }} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Training Guide */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">Training Guide</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Common Race Paces</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>5K: 4:30-6:00 min/km (7:15-9:40 min/mile)</li>
                        <li>10K: 4:45-6:30 min/km (7:40-10:30 min/mile)</li>
                        <li>Half Marathon: 5:00-7:00 min/km (8:00-11:15 min/mile)</li>
                        <li>Marathon: 5:30-8:00 min/km (8:50-12:50 min/mile)</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Training Pace Guidelines</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Easy Runs: Race pace + 1:00-2:00 min/km</li>
                        <li>Tempo Runs: Race pace - 0:15-0:30 min/km</li>
                        <li>Intervals: Race pace - 0:30-1:00 min/km</li>
                        <li>Long Runs: Race pace + 0:45-1:30 min/km</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Pacing Tips</h3>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Start slow and build up gradually</li>
                        <li>Maintain consistent effort level</li>
                        <li>Account for terrain and weather</li>
                        <li>Practice race pace during training</li>
                        <li>Use splits to track progress</li>
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
