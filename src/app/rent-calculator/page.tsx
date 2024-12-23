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
import ReactECharts from 'echarts-for-react';

export default function RentCalculator() {
  const breadcrumbItems = [
    {
      label: 'Rent Calculator',
      href: '/rent-calculator'
    }
  ];

  // State for income and expenses
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(500);
  const [rentBudgetPercentage, setRentBudgetPercentage] = useState<number>(30);
  const [baseRent, setBaseRent] = useState<number>(1500);
  const [utilities, setUtilities] = useState<number>(150);
  const [parking, setParking] = useState<number>(0);
  const [petRent, setPetRent] = useState<number>(0);
  const [rentersInsurance, setRentersInsurance] = useState<number>(20);
  const [otherFees, setOtherFees] = useState<number>(0);

  // State for results
  const [maxRentPayment, setMaxRentPayment] = useState<number>(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState<number>(0);
  const [affordabilityStatus, setAffordabilityStatus] = useState<string>('');
  const [yearlyTotal, setYearlyTotal] = useState<number>(0);

  // Calculate rent affordability and costs
  const calculateRent = () => {
    // Calculate maximum affordable rent based on income percentage
    const calculatedMaxRent = (monthlyIncome * (rentBudgetPercentage / 100));
    
    // Calculate total monthly rent including all fees
    const calculatedTotalRent = baseRent + utilities + parking + petRent + rentersInsurance + otherFees;
    
    // Calculate yearly total
    const calculatedYearlyTotal = calculatedTotalRent * 12;
    
    // Determine affordability status
    let status = '';
    if (calculatedTotalRent <= calculatedMaxRent * 0.8) {
      status = 'Comfortably Affordable';
    } else if (calculatedTotalRent <= calculatedMaxRent) {
      status = 'Affordable';
    } else {
      status = 'May Be Difficult to Afford';
    }

    // Update state with results
    setMaxRentPayment(calculatedMaxRent);
    setTotalMonthlyRent(calculatedTotalRent);
    setAffordabilityStatus(status);
    setYearlyTotal(calculatedYearlyTotal);
  };

  // Chart options for cost breakdown
  const getChartOptions = () => {
    return {
      title: {
        text: 'Monthly Cost Breakdown',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: baseRent, name: 'Base Rent' },
            { value: utilities, name: 'Utilities' },
            { value: parking, name: 'Parking' },
            { value: petRent, name: 'Pet Rent' },
            { value: rentersInsurance, name: 'Renter\'s Insurance' },
            { value: otherFees, name: 'Other Fees' }
          ].filter(item => item.value > 0),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb
            items={breadcrumbItems}
          />
          <h1 className="text-3xl font-bold pt-4 text-base-content">Rent Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Enter Your Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Monthly Income Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Income ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your total monthly income before taxes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Monthly Debts Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Debts ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total monthly debt payments (credit cards, loans, etc.)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Rent Budget Percentage Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Rent Budget (% of Income)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recommended: 25-30% of monthly income</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={rentBudgetPercentage}
                    onChange={(e) => setRentBudgetPercentage(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Base Rent Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Base Rent ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly base rent amount</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={baseRent}
                    onChange={(e) => setBaseRent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Utilities Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Utilities ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated monthly utilities (electricity, water, gas, etc.)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Parking Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Parking Fee ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly parking or garage fee, if any</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={parking}
                    onChange={(e) => setParking(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Pet Rent Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Pet Rent ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Additional monthly pet rent, if applicable</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={petRent}
                    onChange={(e) => setPetRent(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Renter's Insurance Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Monthly Renter's Insurance ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Monthly renter's insurance premium</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={rentersInsurance}
                    onChange={(e) => setRentersInsurance(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                {/* Other Fees Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Other Monthly Fees ($)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Any additional monthly fees or charges</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="number"
                    value={otherFees}
                    onChange={(e) => setOtherFees(Number(e.target.value))}
                    className="input input-bordered w-full"
                    min="0"
                  />
                </div>

                <button
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={calculateRent}
                >
                  Calculate Rent
                </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Maximum Affordable Rent</div>
                    <div className="stat-value text-lg">${maxRentPayment.toLocaleString()}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Total Monthly Cost</div>
                    <div className="stat-value text-lg">${totalMonthlyRent.toLocaleString()}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Yearly Total</div>
                    <div className="stat-value text-lg">${yearlyTotal.toLocaleString()}</div>
                  </div>
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Affordability Status</div>
                    <div className="stat-value text-lg">{affordabilityStatus}</div>
                  </div>
                </div>

                <Separator />

                {/* Chart */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Cost Breakdown</h3>
                  <ReactECharts option={getChartOptions()} style={{ height: '300px' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Understanding Rent</h2>
              <p className="mb-4">
                In the context of residential property, rent refers to the payment made by a tenant to a landlord 
                for the temporary use of their property. The term also describes the act of renting itself. While 
                there are other definitions, such as economic rent, these typically pertain to different contexts 
                outside residential leasing.
              </p>
              <p className="mb-4">
                Although "rent" and "lease" are sometimes used interchangeably, they differ in meaning. A lease 
                is a legal contract outlining the terms of renting a property, including the rent amount, duration, 
                and the rules both landlord and tenant must follow. For calculations related to leases, visit the 
                Lease Calculator. For insights into managing rental properties as a landlord, explore the Rental 
                Property Calculator.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">The Renting Process</h2>
              <p className="mb-4">
                Finding a rental property can range from straightforward to challenging, depending on factors like location.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Rural Areas</h3>
                    <p>Finding rentals is often as simple as spotting "For Rent" signs or visiting apartment complexes.</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Urban Areas</h3>
                    <p>High demand and limited availability may require extensive searches on online platforms or hiring a real estate agent.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Rent vs. Buy: Deciding What's Best</h2>
              <p className="mb-4">
                Many people rent before transitioning to homeownership. At some point, renters may weigh the 
                benefits of renting versus buying a property. To determine which is more financially advantageous, 
                use the Buy vs. Rent Calculator. If buying is the better option, tools like the House Affordability 
                Calculator or Mortgage Calculator can help plan for the costs.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Key Considerations When Renting</h2>
              
              <h3 className="text-xl font-semibold mb-3">Rent Amount and Affordability</h3>
              <p className="mb-4">
                Determining affordable rent varies by individual. While some suggest keeping rent within 25% of 
                income, others recommend up to 33%. Tools like the Debt-to-Income Ratio Calculator can help 
                assess affordability.
              </p>

              <h3 className="text-xl font-semibold mb-3">Additional Costs</h3>
              <div className="bg-base-200 p-6 rounded-lg mb-6">
                <ul className="list-disc pl-6">
                  <li>Upfront Costs: Security deposits, application fees, and insurance may apply.</li>
                  <li>Recurring Costs: Utilities such as water, electricity, and internet might be included in the rent or billed separately.</li>
                  <li>Furnishing Needs: Most rentals require furnishing, which adds to the initial costs.</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-3">Location Considerations</h3>
              <p className="mb-4">
                Consider proximity to work, family, amenities, and interests. For instance, outdoor enthusiasts 
                may prefer rentals near hiking trails, while others might prioritize access to public 
                transportation or low-crime areas.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Ways to Save on Rent</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Live with Family or Friends</h3>
                    <p>Temporarily residing with others can help save money</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Consider Roommates</h3>
                    <p>Sharing housing can cut costs by as much as 30%</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Negotiate Rent</h3>
                    <p>Some landlords may agree to lower rent or more favorable terms</p>
                  </div>
                </div>
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Research Thoroughly</h3>
                    <p>Take time to compare properties and avoid overpriced deals</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Practical Renting Tips</h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Get Agreements in Writing: Document promises and responsibilities to prevent disputes</li>
                  <li>Inspect Before Moving In: Note any damages, create a condition report, and take photos</li>
                  <li>Maintain the Property: Clean and care for the rental to avoid repair charges</li>
                  <li>Purchase Renters' Insurance: Protect personal belongings from theft or damage</li>
                  <li>Understand Rent Rules: Landlords cannot raise rent during fixed leases</li>
                  <li>Assess Cell Reception: Check connectivity inside the rental property</li>
                  <li>Evaluate Safety: Contact local businesses to gauge neighborhood safety</li>
                  <li>Utility Costs: Contact utility providers to estimate monthly bills</li>
                  <li>Noise Concerns: Consider proximity to train tracks or busy streets</li>
                  <li>Build Relationships: Being courteous to landlords and neighbors can lead to a better experience</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
