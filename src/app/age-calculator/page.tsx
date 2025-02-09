'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: {
    date: Date;
    daysUntil: number;
  };
  zodiacSign: string;
  chineseZodiac: string;
}

const breadcrumbItems = [
  {
    label: 'Age Calculator',
    href: '/age-calculator',
  },
];

const ZODIAC_SIGNS = [
  { name: 'Capricorn', start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', start: [1, 20], end: [2, 18] },
  { name: 'Pisces', start: [2, 19], end: [3, 20] },
  { name: 'Aries', start: [3, 21], end: [4, 19] },
  { name: 'Taurus', start: [4, 20], end: [5, 20] },
  { name: 'Gemini', start: [5, 21], end: [6, 20] },
  { name: 'Cancer', start: [6, 21], end: [7, 22] },
  { name: 'Leo', start: [7, 23], end: [8, 22] },
  { name: 'Virgo', start: [8, 23], end: [9, 22] },
  { name: 'Libra', start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
];

const CHINESE_ZODIAC = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [calculationDate, setCalculationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>('');

  const getZodiacSign = (month: number, day: number): string => {
    for (const sign of ZODIAC_SIGNS) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && // Handle year wrap (Capricorn)
          ((month === startMonth && day >= startDay) ||
            (month === endMonth && day <= endDay) ||
            (month > startMonth || month < endMonth)))
      ) {
        return sign.name;
      }
    }
    return 'Unknown';
  };

  const getChineseZodiac = (year: number): string => {
    return CHINESE_ZODIAC[(year - 4) % 12];
  };

  const getNextBirthday = (birthDate: Date, currentDate: Date): { date: Date; daysUntil: number } => {
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(currentDate.getFullYear());
    
    if (nextBirthday < currentDate) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return { date: nextBirthday, daysUntil };
  };

  const calculate = () => {
    try {
      setError('');
      
      if (!birthDate) {
        throw new Error('Please enter your birth date');
      }

      const birth = new Date(birthDate);
      const calculation = new Date(calculationDate);

      if (birth > calculation) {
        throw new Error('Birth date cannot be in the future');
      }

      // Get birth date components
      const birthYear = birth.getFullYear();
      const birthMonth = birth.getMonth();
      const birthDay = birth.getDate();

      // Get calculation date components
      const calcYear = calculation.getFullYear();
      const calcMonth = calculation.getMonth();
      const calcDay = calculation.getDate();

      // Calculate years and months
      let years = calcYear - birthYear;
      let months = calcMonth - birthMonth;

      if (calcMonth < birthMonth || (calcMonth === birthMonth && calcDay < birthDay)) {
        years--;
        months = 12 - (birthMonth - calcMonth);
      }

      if (calcDay < birthDay) {
        months--;
        if (months < 0) {
          months = 11;
          years--;
        }
      }

      // Calculate remaining days
      const lastMonth = new Date(calculation);
      lastMonth.setDate(birthDay);
      if (calcDay < birthDay) {
        lastMonth.setMonth(lastMonth.getMonth() - 1);
      }
      
      const days = Math.floor((calculation.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate total values
      const totalDays = Math.floor((calculation.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = years * 12 + months;

      // Get next birthday
      const nextBirthday = getNextBirthday(birth, calculation);

      // Get zodiac signs
      const zodiacSign = getZodiacSign(birthMonth + 1, birthDay);
      const chineseZodiac = getChineseZodiac(birthYear);

      setResult({
        years,
        months,
        days,
        hours: days * 24,
        minutes: days * 24 * 60,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        nextBirthday,
        zodiacSign,
        chineseZodiac,
      });
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Age Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate your exact age and get detailed information including zodiac signs,
            next birthday, and more
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-xl font-semibold">Calculator</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="birthDate">
                    Birth Date{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter your date of birth</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="calculationDate">
                    Calculation Date{' '}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 inline" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the date to calculate age to (defaults to today)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="calculationDate"
                    type="date"
                    value={calculationDate}
                    onChange={(e) => setCalculationDate(e.target.value)}
                  />
                </div>

                <Button onClick={calculate} className="w-full">
                  Calculate
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Exact Age */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Exact Age
                    </div>
                    <div className="mt-1 space-y-1">
                      <div className="text-2xl font-bold">
                        {result.years} years, {result.months} months, {result.days} days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.hours} hours or {result.minutes} minutes
                      </div>
                    </div>
                  </div>

                  {/* Total Time Units */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Time Units
                    </div>
                    <div className="mt-1 space-y-1">
                      <div>Months: {result.totalMonths}</div>
                      <div>Weeks: {result.totalWeeks}</div>
                      <div>Days: {result.totalDays}</div>
                      <div>Hours: {result.totalHours}</div>
                      <div>Minutes: {result.totalMinutes}</div>
                    </div>
                  </div>

                  {/* Next Birthday */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Next Birthday
                    </div>
                    <div className="mt-1 space-y-1">
                      <div>Date: {result.nextBirthday.date.toLocaleDateString()}</div>
                      <div>Days until: {result.nextBirthday.daysUntil}</div>
                    </div>
                  </div>

                  {/* Zodiac Signs */}
                  <div className="bg-gray-50 ">
                    <div className="text-sm font-medium text-muted-foreground">
                      Zodiac Signs
                    </div>
                    <div className="mt-1 space-y-1">
                      <div>Western: {result.zodiacSign}</div>
                      <div>Chinese: {result.chineseZodiac}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Enter your birth date and click calculate to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="bg-card">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Understanding Age Calculation</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Age Units</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Years: Complete years lived</li>
                  <li>Months: Additional months</li>
                  <li>Days: Remaining days</li>
                  <li>Hours: Total hours lived</li>
                  <li>Minutes: Total minutes lived</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Zodiac Signs</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Western: Based on month/day</li>
                  <li>Chinese: Based on birth year</li>
                  <li>12 Western zodiac signs</li>
                  <li>12 Chinese zodiac animals</li>
                  <li>Different cultural meanings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Legal age verification</li>
                  <li>Birthday planning</li>
                  <li>Astrological readings</li>
                  <li>Life milestones</li>
                  <li>Age-based eligibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
