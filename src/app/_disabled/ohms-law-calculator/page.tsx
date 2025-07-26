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

interface OhmsLawValues {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export default function OhmsLawCalculator() {
  const breadcrumbItems = [
    {
      label: 'Ohms Law Calculator',
      href: '/ohms-law-calculator'
    }
  ];

  const [values, setValues] = useState<OhmsLawValues>({
    voltage: 12,
    current: 1,
    resistance: 12,
    power: 12
  });

  const [activeInput, setActiveInput] = useState<keyof OhmsLawValues | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const powerChartRef = useRef<HTMLDivElement>(null);

  const calculateMissing = (input1: keyof OhmsLawValues, input2: keyof OhmsLawValues) => {
    const newValues = { ...values };

    // Calculate based on which two values are provided
    if (input1 === 'voltage' && input2 === 'current') {
      newValues.resistance = values.voltage / values.current;
      newValues.power = values.voltage * values.current;
    } else if (input1 === 'voltage' && input2 === 'resistance') {
      newValues.current = values.voltage / values.resistance;
      newValues.power = (values.voltage * values.voltage) / values.resistance;
    } else if (input1 === 'voltage' && input2 === 'power') {
      newValues.current = values.power / values.voltage;
      newValues.resistance = (values.voltage * values.voltage) / values.power;
    } else if (input1 === 'current' && input2 === 'resistance') {
      newValues.voltage = values.current * values.resistance;
      newValues.power = values.current * values.current * values.resistance;
    } else if (input1 === 'current' && input2 === 'power') {
      newValues.voltage = values.power / values.current;
      newValues.resistance = values.power / (values.current * values.current);
    } else if (input1 === 'resistance' && input2 === 'power') {
      newValues.current = Math.sqrt(values.power / values.resistance);
      newValues.voltage = Math.sqrt(values.power * values.resistance);
    }

    setValues(newValues);
  };

  const handleInputChange = (key: keyof OhmsLawValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newValues = { ...values, [key]: numValue };
    setValues(newValues);
    setActiveInput(key);

    // Find another non-zero value to calculate with
    const otherValue = Object.entries(newValues).find(([k, v]) => k !== key && v !== 0);
    if (otherValue) {
      calculateMissing(key, otherValue[0] as keyof OhmsLawValues);
    }
  };

  const updateCharts = () => {
    if (chartRef.current && powerChartRef.current) {
      const ohmsChart = echarts.init(chartRef.current);
      const powerChart = echarts.init(powerChartRef.current);

      // Generate data points for V=IR curve
      const currentPoints = Array.from({ length: 100 }, (_, i) => i * 0.1);
      const voltagePoints = currentPoints.map(i => i * values.resistance);
      
      const ohmsOption = {
        title: {
          text: 'V-I Characteristic',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params: any) {
            return `Current: ${params[0].data[0].toFixed(2)}A<br/>Voltage: ${params[0].data[1].toFixed(2)}V`;
          }
        },
        xAxis: {
          type: 'value',
          name: 'Current (A)',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: 'Voltage (V)',
          nameLocation: 'middle',
          nameGap: 30
        },
        series: [{
          type: 'line',
          data: currentPoints.map((i, index) => [i, voltagePoints[index]]),
          smooth: true,
          lineStyle: {
            color: '#5470c6',
            width: 3
          },
          markPoint: {
            data: [
              { 
                coord: [values.current, values.voltage],
                symbol: 'circle',
                symbolSize: 10,
                itemStyle: { color: '#91cc75' }
              }
            ]
          }
        }]
      };

      // Power triangle visualization
      const powerOption = {
        title: {
          text: 'Power Triangle',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Power Components',
            type: 'pie',
            radius: ['30%', '70%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}W ({d}%)'
            },
            data: [
              { 
                value: values.power, 
                name: 'Power',
                itemStyle: { color: '#5470c6' }
              },
              { 
                value: values.voltage * values.current, 
                name: 'V×I',
                itemStyle: { color: '#91cc75' }
              },
              { 
                value: values.current * values.current * values.resistance, 
                name: 'I²R',
                itemStyle: { color: '#fac858' }
              }
            ]
          }
        ]
      };

      ohmsChart.setOption(ohmsOption);
      powerChart.setOption(powerOption);

      const handleResize = () => {
        ohmsChart.resize();
        powerChart.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        ohmsChart.dispose();
        powerChart.dispose();
      };
    }
  };

  useEffect(() => {
    updateCharts();
  }, [values]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Ohm's Law Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Circuit Parameters</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Voltage (V)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the voltage in volts (V)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={values.voltage || ''}
                    onChange={(e) => handleInputChange('voltage', e.target.value)}
                    placeholder="Enter voltage"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current (A)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the current in amperes (A)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={values.current || ''}
                    onChange={(e) => handleInputChange('current', e.target.value)}
                    placeholder="Enter current"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Resistance (Ω)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the resistance in ohms (Ω)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={values.resistance || ''}
                    onChange={(e) => handleInputChange('resistance', e.target.value)}
                    placeholder="Enter resistance"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Power (W)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the power in watts (W)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <Input
                    type="number"
                    value={values.power || ''}
                    onChange={(e) => handleInputChange('power', e.target.value)}
                    placeholder="Enter power"
                    min="0"
                    step="0.1"
                  />
                </div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Ohm's Law</h3>
                      <p className="text-sm mb-2">V = IR</p>
                      <p className="text-sm mb-2">I = V/R</p>
                      <p className="text-sm">R = V/I</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Power Laws</h3>
                      <p className="text-sm mb-2">P = VI</p>
                      <p className="text-sm mb-2">P = I²R</p>
                      <p className="text-sm">P = V²/R</p>
                    </div>
                  </div>
                </motion.div>

                {/* V-I Characteristic */}
                <div className="border rounded-lg p-4">
                  <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
                </div>

                {/* Power Triangle */}
                <div className="border rounded-lg p-4">
                  <div ref={powerChartRef} style={{ width: '100%', height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-card lg:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Reference Guide</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Voltage (V)</h3>
                  <p className="text-sm">The electrical pressure or potential difference between two points in a circuit.</p>
                  <p className="text-sm mt-2">Unit: Volts (V)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Current (I)</h3>
                  <p className="text-sm">The flow rate of electric charge through a conductor.</p>
                  <p className="text-sm mt-2">Unit: Amperes (A)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Resistance (R)</h3>
                  <p className="text-sm">The opposition that a material offers to the flow of electric current.</p>
                  <p className="text-sm mt-2">Unit: Ohms (Ω)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Power (P)</h3>
                  <p className="text-sm">The rate at which electrical energy is transferred in a circuit.</p>
                  <p className="text-sm mt-2">Unit: Watts (W)</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Common Applications</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Circuit design</li>
                    <li>Power consumption analysis</li>
                    <li>Component selection</li>
                    <li>Battery life calculation</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Tips</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Enter any two values to calculate the others</li>
                    <li>Check power ratings of components</li>
                    <li>Consider temperature effects</li>
                    <li>Use appropriate safety margins</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
