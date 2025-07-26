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

interface CollegeCosts {
  year: number;
  tuition: number;
  roomBoard: number;
  books: number;
  other: number;
  total: number;
}

interface FinancialAid {
  scholarships: number;
  grants: number;
  loans: number;
  workStudy: number;
}

export default function CollegeCostCalculator() {
  const breadcrumbItems = [
    {
      label: 'College Cost Calculator',
      href: '/college-cost-calculator'
    }
  ];

  // College details
  const [schoolType, setSchoolType] = useState<'public-in' | 'public-out' | 'private'>('public-in');
  const [yearsToGraduate, setYearsToGraduate] = useState<number>(4);
  const [startYear, setStartYear] = useState<number>(new Date().getFullYear());
  const [inflationRate, setInflationRate] = useState<number>(5);
  
  // Cost inputs
  const [annualTuition, setAnnualTuition] = useState<number>(10000);
  const [roomAndBoard, setRoomAndBoard] = useState<number>(12000);
  const [booksAndSupplies, setBooksAndSupplies] = useState<number>(1200);
  const [otherExpenses, setOtherExpenses] = useState<number>(3000);
  
  // Financial aid
  const [scholarships, setScholarships] = useState<number>(0);
  const [grants, setGrants] = useState<number>(0);
  const [loans, setLoans] = useState<number>(0);
  const [workStudy, setWorkStudy] = useState<number>(0);
  
  // Results
  const [yearlyBreakdown, setYearlyBreakdown] = useState<CollegeCosts[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [netCost, setNetCost] = useState<number>(0);
  const [monthlyLoanPayment, setMonthlyLoanPayment] = useState<number>(0);

  // Calculate costs
  const calculateCosts = () => {
    let breakdown: CollegeCosts[] = [];
    let totalCostSum = 0;
    
    for (let year = 0; year < yearsToGraduate; year++) {
      const inflationFactor = Math.pow(1 + inflationRate / 100, year);
      
      const yearTuition = annualTuition * inflationFactor;
      const yearRoomBoard = roomAndBoard * inflationFactor;
      const yearBooks = booksAndSupplies * inflationFactor;
      const yearOther = otherExpenses * inflationFactor;
      const yearTotal = yearTuition + yearRoomBoard + yearBooks + yearOther;
      
      totalCostSum += yearTotal;
      
      breakdown.push({
        year: startYear + year,
        tuition: yearTuition,
        roomBoard: yearRoomBoard,
        books: yearBooks,
        other: yearOther,
        total: yearTotal
      });
    }
    
    const totalAid = (scholarships + grants + workStudy) * yearsToGraduate;
    const totalLoans = loans * yearsToGraduate;
    
    // Calculate monthly loan payment (10-year term, 5% interest)
    const loanPayment = calculateMonthlyLoanPayment(totalLoans, 5, 10);
    
    setYearlyBreakdown(breakdown);
    setTotalCost(totalCostSum);
    setNetCost(totalCostSum - totalAid);
    setMonthlyLoanPayment(loanPayment);
  };

  // Calculate monthly loan payment
  const calculateMonthlyLoanPayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 1200;
    const numberOfPayments = years * 12;
    
    if (monthlyRate === 0) return principal / numberOfPayments;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  useEffect(() => {
    calculateCosts();
  }, [
    schoolType,
    yearsToGraduate,
    startYear,
    inflationRate,
    annualTuition,
    roomAndBoard,
    booksAndSupplies,
    otherExpenses,
    scholarships,
    grants,
    loans,
    workStudy
  ]);

  // Chart for yearly cost breakdown
  const getYearlyCostChart = () => {
    const years = yearlyBreakdown.map(data => data.year);
    const tuition = yearlyBreakdown.map(data => data.tuition);
    const roomBoard = yearlyBreakdown.map(data => data.roomBoard);
    const books = yearlyBreakdown.map(data => data.books);
    const other = yearlyBreakdown.map(data => data.other);

    return {
      title: {
        text: 'Yearly Cost Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Tuition', 'Room & Board', 'Books', 'Other'],
        top: 30
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%'
      },
      xAxis: {
        type: 'category',
        data: years
      },
      yAxis: {
        type: 'value',
        name: 'Cost ($)',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Tuition',
          type: 'bar',
          stack: 'total',
          data: tuition
        },
        {
          name: 'Room & Board',
          type: 'bar',
          stack: 'total',
          data: roomBoard
        },
        {
          name: 'Books',
          type: 'bar',
          stack: 'total',
          data: books
        },
        {
          name: 'Other',
          type: 'bar',
          stack: 'total',
          data: other
        }
      ]
    };
  };

  // Chart for financial aid breakdown
  const getFinancialAidChart = () => {
    const aid: FinancialAid = {
      scholarships: scholarships * yearsToGraduate,
      grants: grants * yearsToGraduate,
      loans: loans * yearsToGraduate,
      workStudy: workStudy * yearsToGraduate
    };

    return {
      title: {
        text: 'Financial Aid Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 30
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: aid.scholarships, name: 'Scholarships' },
          { value: aid.grants, name: 'Grants' },
          { value: aid.loans, name: 'Loans' },
          { value: aid.workStudy, name: 'Work Study' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">College Cost Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">College Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">School Type</span>
                  </label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as 'public-in' | 'public-out' | 'private')}
                    className="select select-bordered w-full"
                  >
                    <option value="public-in">Public (In-State)</option>
                    <option value="public-out">Public (Out-of-State)</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Years to Graduate</span>
                  </label>
                  <input
                    type="number"
                    value={yearsToGraduate}
                    onChange={(e) => setYearsToGraduate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="1"
                    max="6"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Year</span>
                  </label>
                  <input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min={new Date().getFullYear()}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Annual Cost Increase (%)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expected yearly increase in college costs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="15"
                    step="0.1"
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Annual Costs</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Tuition ($)</span>
                  </label>
                  <input
                    type="number"
                    value={annualTuition}
                    onChange={(e) => setAnnualTuition(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Room & Board ($)</span>
                  </label>
                  <input
                    type="number"
                    value={roomAndBoard}
                    onChange={(e) => setRoomAndBoard(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Books & Supplies ($)</span>
                  </label>
                  <input
                    type="number"
                    value={booksAndSupplies}
                    onChange={(e) => setBooksAndSupplies(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Other Expenses ($)</span>
                  </label>
                  <input
                    type="number"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="100"
                  />
                </div>

                <Separator />

                <h3 className="text-lg font-semibold">Annual Financial Aid</h3>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Scholarships ($)</span>
                  </label>
                  <input
                    type="number"
                    value={scholarships}
                    onChange={(e) => setScholarships(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Grants ($)</span>
                  </label>
                  <input
                    type="number"
                    value={grants}
                    onChange={(e) => setGrants(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Loans ($)</span>
                  </label>
                  <input
                    type="number"
                    value={loans}
                    onChange={(e) => setLoans(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Work Study ($)</span>
                  </label>
                  <input
                    type="number"
                    value={workStudy}
                    onChange={(e) => setWorkStudy(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    step="500"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateCosts}
                >
                  Calculate Costs
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Cost Analysis</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Cost</div>
                    <div className="stat-value text-lg">
                      ${totalCost.toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      For {yearsToGraduate} years
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Net Cost</div>
                    <div className="stat-value text-lg">
                      ${netCost.toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      After financial aid
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Monthly Loan Payment</div>
                    <div className="stat-value text-lg">
                      ${monthlyLoanPayment.toFixed(2)}
                    </div>
                    <div className="stat-desc">
                      10-year term, 5% interest
                    </div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Average Annual Cost</div>
                    <div className="stat-value text-lg">
                      ${(totalCost / yearsToGraduate).toLocaleString()}
                    </div>
                    <div className="stat-desc">
                      Before financial aid
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Charts */}
                <div className="space-y-6">
                  <div>
                    <ReactECharts option={getYearlyCostChart()} style={{ height: '300px' }} />
                  </div>
                  <div>
                    <ReactECharts option={getFinancialAidChart()} style={{ height: '300px' }} />
                  </div>
                </div>

                {/* Yearly Breakdown */}
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Tuition</th>
                        <th>Room & Board</th>
                        <th>Books</th>
                        <th>Other</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((year, index) => (
                        <tr key={index}>
                          <td>{year.year}</td>
                          <td>${year.tuition.toLocaleString()}</td>
                          <td>${year.roomBoard.toLocaleString()}</td>
                          <td>${year.books.toLocaleString()}</td>
                          <td>${year.other.toLocaleString()}</td>
                          <td>${year.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Understanding College Costs</h2>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Types of Expenses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Direct Costs</h4>
                      <ul className="list-disc pl-6">
                        <li>Tuition and fees</li>
                        <li>Room and board</li>
                        <li>Required materials</li>
                        <li>Student services</li>
                      </ul>
                    </div>
                    <div className="bg-base-200 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Indirect Costs</h4>
                      <ul className="list-disc pl-6">
                        <li>Books and supplies</li>
                        <li>Transportation</li>
                        <li>Personal expenses</li>
                        <li>Technology fees</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Financial Aid Options</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Federal grants (e.g., Pell Grant)</li>
                      <li>State grants and scholarships</li>
                      <li>Institutional aid</li>
                      <li>Private scholarships</li>
                      <li>Federal student loans</li>
                      <li>Work-study programs</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Cost-Saving Tips</h3>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <ul className="list-disc pl-6">
                      <li>Apply for early decision/action</li>
                      <li>Consider community college transfer</li>
                      <li>Rent or buy used textbooks</li>
                      <li>Apply for multiple scholarships</li>
                      <li>Compare housing options</li>
                      <li>Create a realistic budget</li>
                    </ul>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
