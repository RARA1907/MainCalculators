'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';
import * as echarts from 'echarts';
import { useRef } from 'react';

interface ColorBand {
  color: string;
  value?: number;
  multiplier?: number;
  tolerance?: number;
  temperatureCoefficient?: number;
  displayColor: string;
}

const colorBands: { [key: string]: ColorBand } = {
  black: { color: 'Black', value: 0, multiplier: 1, displayColor: '#000000' },
  brown: { color: 'Brown', value: 1, multiplier: 10, tolerance: 1, temperatureCoefficient: 100, displayColor: '#8B4513' },
  red: { color: 'Red', value: 2, multiplier: 100, tolerance: 2, temperatureCoefficient: 50, displayColor: '#FF0000' },
  orange: { color: 'Orange', value: 3, multiplier: 1000, temperatureCoefficient: 15, displayColor: '#FFA500' },
  yellow: { color: 'Yellow', value: 4, multiplier: 10000, temperatureCoefficient: 25, displayColor: '#FFFF00' },
  green: { color: 'Green', value: 5, multiplier: 100000, tolerance: 0.5, temperatureCoefficient: 20, displayColor: '#008000' },
  blue: { color: 'Blue', value: 6, multiplier: 1000000, tolerance: 0.25, temperatureCoefficient: 10, displayColor: '#0000FF' },
  violet: { color: 'Violet', value: 7, multiplier: 10000000, tolerance: 0.1, temperatureCoefficient: 5, displayColor: '#8A2BE2' },
  gray: { color: 'Gray', value: 8, multiplier: 100000000, tolerance: 0.05, displayColor: '#808080' },
  white: { color: 'White', value: 9, multiplier: 1000000000, displayColor: '#FFFFFF' },
  gold: { color: 'Gold', multiplier: 0.1, tolerance: 5, displayColor: '#FFD700' },
  silver: { color: 'Silver', multiplier: 0.01, tolerance: 10, displayColor: '#C0C0C0' }
};

export default function ResistorCalculator() {
  const breadcrumbItems = [
    {
      label: 'Resistor Calculator',
      href: '/resistor-calculator'
    }
  ];

  const [bandCount, setBandCount] = useState<4 | 5 | 6>(4);
  const [bands, setBands] = useState<string[]>(['brown', 'black', 'red', 'gold']);
  const [resistance, setResistance] = useState<number>(0);
  const [tolerance, setTolerance] = useState<number>(0);
  const [tempCoeff, setTempCoeff] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  const calculateResistance = () => {
    let value = 0;
    let toleranceValue = 0;
    let tempCoeffValue = null;

    if (bandCount === 4 || bandCount === 5) {
      // First two/three bands for value
      const digits = bands.slice(0, bandCount - 2).map(band => colorBands[band].value);
      value = parseInt(digits.join(''));
      
      // Multiplier
      const multiplier = colorBands[bands[bandCount - 2]].multiplier || 1;
      value *= multiplier;
      
      // Tolerance
      toleranceValue = colorBands[bands[bandCount - 1]].tolerance || 0;
    } else if (bandCount === 6) {
      // First three bands for value
      const digits = bands.slice(0, 3).map(band => colorBands[band].value);
      value = parseInt(digits.join(''));
      
      // Multiplier
      const multiplier = colorBands[bands[3]].multiplier || 1;
      value *= multiplier;
      
      // Tolerance and Temperature Coefficient
      toleranceValue = colorBands[bands[4]].tolerance || 0;
      tempCoeffValue = colorBands[bands[5]].temperatureCoefficient || 0;
    }

    setResistance(value);
    setTolerance(toleranceValue);
    setTempCoeff(tempCoeffValue);
  };

  const updateCharts = () => {
    if (chartRef.current && pieChartRef.current) {
      const resistorChart = echarts.init(chartRef.current);
      const pieChart = echarts.init(pieChartRef.current);

      // Resistor band visualization
      const bandWidth = 40;
      const bandGap = 10;
      const startX = 100;

      const bandData = bands.map((band, index) => ({
        type: 'rect',
        shape: {
          x: startX + (bandWidth + bandGap) * index,
          y: 50,
          width: bandWidth,
          height: 100
        },
        style: {
          fill: colorBands[band].displayColor,
          stroke: '#333',
          lineWidth: 2
        }
      }));

      const resistorOption = {
        backgroundColor: 'transparent',
        graphic: [
          {
            type: 'rect',
            shape: {
              x: 50,
              y: 40,
              width: 400,
              height: 120,
              r: 20
            },
            style: {
              fill: '#d3d3d3',
              stroke: '#333',
              lineWidth: 2
            }
          },
          ...bandData
        ]
      };

      // Pie chart for resistance distribution
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: 'Resistance Range',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            data: [
              { 
                value: resistance * (1 + tolerance/100) - resistance, 
                name: 'Upper Tolerance',
                itemStyle: { color: '#91cc75' }
              },
              { 
                value: resistance * 2, 
                name: 'Nominal',
                itemStyle: { color: '#5470c6' }
              },
              { 
                value: resistance - resistance * (1 - tolerance/100), 
                name: 'Lower Tolerance',
                itemStyle: { color: '#fac858' }
              }
            ]
          }
        ]
      };

      resistorChart.setOption(resistorOption);
      pieChart.setOption(pieOption);

      const handleResize = () => {
        resistorChart.resize();
        pieChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        resistorChart.dispose();
        pieChart.dispose();
      };
    }
  };

  useEffect(() => {
    calculateResistance();
  }, [bands, bandCount]);

  useEffect(() => {
    updateCharts();
  }, [resistance, tolerance]);

  const formatResistance = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} MΩ`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} kΩ`;
    }
    return `${value.toFixed(2)} Ω`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Resistor Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Band Selection</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Number of Bands</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={bandCount}
                    onChange={(e) => {
                      const count = parseInt(e.target.value) as 4 | 5 | 6;
                      setBandCount(count);
                      // Initialize bands array based on count
                      if (count === 4) {
                        setBands(['brown', 'black', 'red', 'gold']);
                      } else if (count === 5) {
                        setBands(['brown', 'black', 'black', 'red', 'gold']);
                      } else {
                        setBands(['brown', 'black', 'black', 'red', 'gold', 'brown']);
                      }
                    }}
                  >
                    <option value={4}>4 Bands</option>
                    <option value={5}>5 Bands</option>
                    <option value={6}>6 Bands</option>
                  </select>
                </div>

                {bands.map((band, index) => (
                  <div key={index} className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Band {index + 1} 
                        {index === bands.length - 2 ? ' (Multiplier)' : 
                         index === bands.length - 1 ? ' (Tolerance)' :
                         index === bands.length - 3 && bandCount === 6 ? ' (Value)' : ''}
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={band}
                      onChange={(e) => {
                        const newBands = [...bands];
                        newBands[index] = e.target.value;
                        setBands(newBands);
                      }}
                      style={{
                        backgroundColor: colorBands[band].displayColor,
                        color: ['white', 'yellow'].includes(band) ? 'black' : 'white'
                      }}
                    >
                      {Object.entries(colorBands).map(([key, data]) => (
                        <option
                          key={key}
                          value={key}
                          style={{
                            backgroundColor: data.displayColor,
                            color: ['white', 'yellow'].includes(key) ? 'black' : 'white'
                          }}
                        >
                          {data.color}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <motion.div
                  className="p-4 border rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Resistance</span>
                    <span className="text-xl font-bold">{formatResistance(resistance)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Tolerance</span>
                    <span className="text-xl font-bold">±{tolerance}%</span>
                  </div>
                  {tempCoeff !== null && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Temperature Coefficient</span>
                      <span className="text-xl font-bold">{tempCoeff} ppm/°C</span>
                    </div>
                  )}
                </motion.div>

                {/* Resistor Visualization */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Resistor Visualization</h3>
                  <div ref={chartRef} style={{ width: '100%', height: '200px' }} />
                </div>

                {/* Resistance Distribution */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Resistance Distribution</h3>
                  <div ref={pieChartRef} style={{ width: '100%', height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Color Code Reference</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(colorBands).map(([key, data]) => (
                  <div 
                    key={key} 
                    className="p-4 border rounded-lg"
                    style={{
                      borderColor: data.displayColor
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{data.color}</h3>
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: data.displayColor, border: '1px solid #333' }}
                      />
                    </div>
                    <p className="text-sm mb-1">Value: {data.value !== undefined ? data.value : 'N/A'}</p>
                    {data.multiplier && (
                      <p className="text-sm mb-1">Multiplier: ×{data.multiplier}</p>
                    )}
                    {data.tolerance && (
                      <p className="text-sm mb-1">Tolerance: ±{data.tolerance}%</p>
                    )}
                    {data.temperatureCoefficient && (
                      <p className="text-sm">Temp Coeff: {data.temperatureCoefficient} ppm/°C</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
