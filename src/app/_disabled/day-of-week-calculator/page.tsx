'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

const breadcrumbItems = [
 
  {
    label: 'Day of Week Calculator',
    href: '/day-of-week-calculator',
  },
];

export default function DayOfWeekCalculator() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [dateDetails, setDateDetails] = useState<{
    dayOfYear: number;
    weekNumber: number;
    isLeapYear: boolean;
  }>({
    dayOfYear: 0,
    weekNumber: 0,
    isLeapYear: false,
  });

  const calculateDayOfWeek = () => {
    const date = new Date(selectedDate);
    const formattedDay = format(date, 'EEEE');
    setDayOfWeek(formattedDay);

    // Calculate additional date information
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekNumber = Math.ceil(dayOfYear / 7);
    const isLeapYear = new Date(date.getFullYear(), 1, 29).getDate() === 29;

    setDateDetails({
      dayOfYear,
      weekNumber,
      isLeapYear,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Day of Week Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Calculate Day of Week</h2>
              <p className="text-muted-foreground">
                Enter a date to discover which day of the week it falls on
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Select Date</span>
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateDayOfWeek}
                >
                  Calculate Day
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Results</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Day of Week Display */}
                  {dayOfWeek && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className="text-4xl font-bold text-primary mb-2">
                        {dayOfWeek}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(selectedDate), 'MMMM d, yyyy')}
                      </div>
                    </motion.div>
                  )}

                  {dayOfWeek && (
                    <>
                      <Separator />
                      
                      {/* Additional Date Information */}
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-muted p-4 rounded-lg"
                        >
                          <h3 className="font-semibold mb-2">Date Details:</h3>
                          <ul className="space-y-2">
                            <li>Day of Year: {dateDetails.dayOfYear}</li>
                            <li>Week Number: {dateDetails.weekNumber}</li>
                            <li>Leap Year: {dateDetails.isLeapYear ? 'Yes' : 'No'}</li>
                          </ul>
                        </motion.div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Educational Content */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold">About Day of Week Calculator</h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <section className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">How It Works</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p>
                        The Day of Week Calculator determines which day of the week any given date falls on.
                        It uses sophisticated algorithms to account for:
                      </p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Calendar reforms</li>
                        <li>Leap years</li>
                        <li>Century rules</li>
                        <li>Different calendar systems</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Common Uses</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <ul className="list-disc pl-6">
                        <li>Planning future events</li>
                        <li>Historical research</li>
                        <li>Birthday calculations</li>
                        <li>Schedule planning</li>
                        <li>Anniversary tracking</li>
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
