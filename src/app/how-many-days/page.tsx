'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { differenceInDays } from 'date-fns';

const breadcrumbItems = [
  {
    label: 'How Many Days',
    href: '/how-many-days',
  },
];

// Important dates in 2025
const IMPORTANT_DATES = {
  "New Year's Day": new Date(2025, 0, 1),
  "Valentine's Day": new Date(2025, 1, 14),
  "St. Patrick's Day": new Date(2025, 2, 17),
  "Mother's Day": new Date(2025, 4, 11), // Second Sunday in May
  "Memorial Day": new Date(2025, 4, 26), // Last Monday in May
  "Father's Day": new Date(2025, 5, 15), // Third Sunday in June
  "Independence Day": new Date(2025, 6, 4),
  "Labor Day": new Date(2025, 8, 1), // First Monday in September
  "Columbus Day": new Date(2025, 9, 13), // Second Monday in October
  "Halloween": new Date(2025, 9, 31),
  "Veterans Day": new Date(2025, 10, 11),
  "Thanksgiving": new Date(2025, 10, 27), // Fourth Thursday in November
  "Christmas": new Date(2025, 11, 25),
  "New Year's Eve": new Date(2025, 11, 31),
  // World Holidays and Events
  "Chinese New Year": new Date(2025, 0, 29),
  "Ramadan Start": new Date(2025, 2, 1), // Approximate
  "Easter": new Date(2025, 3, 20), // Approximate
  "Earth Day": new Date(2025, 3, 22),
  "World Environment Day": new Date(2025, 5, 5),
  "World Peace Day": new Date(2025, 8, 21),
  "World Mental Health Day": new Date(2025, 9, 10),
  "Human Rights Day": new Date(2025, 11, 10)
} as const;

type HolidayKey = keyof typeof IMPORTANT_DATES;

export default function HowManyDays() {
  const [selectedDate, setSelectedDate] = useState<HolidayKey | ''>('');
  const today = new Date();

  const calculateDays = (targetDate: Date) => {
    const days = differenceInDays(targetDate, today);
    return days;
  };

  const formatResult = (days: number) => {
    if (days < 0) {
      return `This event has already passed in 2025.`;
    } else if (days === 0) {
      return "It's today!";
    } else if (days === 1) {
      return "It's tomorrow!";
    } else {
      return `${days} days until this event`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">How Many Days Until...</h1>
          <p className="text-muted-foreground mt-2">
            Find out how many days until important dates and holidays in 2025
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calculator Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Select an Event</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="event">Event or Holiday</Label>
                  <Select value={selectedDate} onValueChange={(value) => setSelectedDate(value as HolidayKey)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(IMPORTANT_DATES).map(([key]) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDate && (
                  <div>
                    <p className="text-lg font-medium">{selectedDate}:</p>
                    <p className="text-2xl font-bold mt-2">
                      {formatResult(calculateDays(IMPORTANT_DATES[selectedDate]))}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Date: {IMPORTANT_DATES[selectedDate].toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-background md:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Important Dates in 2025</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Select an event or holiday from the dropdown menu</li>
                    <li>The calculator will show you how many days are left until that date</li>
                    <li>You'll see the exact date of the event</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Included Events:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Major US Holidays (New Year's, Independence Day, etc.)</li>
                    <li>Cultural Celebrations (Mother's Day, Father's Day)</li>
                    <li>International Events (World Peace Day, Human Rights Day)</li>
                    <li>Religious and Cultural Observances (Easter, Ramadan, Chinese New Year)</li>
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
