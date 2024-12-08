import LoanCalculator from '@/components/calculators/LoanCalculator'

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to MainCalculators.com</h1>
        <p className="text-xl text-gray-600 mt-2">Your one-stop destination for all financial calculations</p>
      </div>
      <LoanCalculator />
    </div>
  )
}
