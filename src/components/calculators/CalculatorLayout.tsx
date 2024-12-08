import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

interface CalculatorLayoutProps {
  title: string
  description?: string
  children?: React.ReactNode
  inputs?: {
    label: string
    type: string
    value: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
  }[]
  onCalculate?: () => void
  results?: { label: string; value: string }[]
}

export default function CalculatorLayout({
  title,
  description,
  children,
  inputs,
  onCalculate,
  results,
}: CalculatorLayoutProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {inputs && inputs.map((input, index) => (
          <div key={index} className="space-y-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-right font-medium">{input.label}</label>
              <div className="col-span-2">
                <input
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    input.error ? 'border-red-500' : 'border-input'
                  }`}
                />
                {input.error && (
                  <p className="text-sm text-red-500 mt-1">{input.error}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {onCalculate && (
          <div className="flex justify-center pt-4">
            <button 
              onClick={onCalculate}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md
                transition-colors duration-200 font-medium focus:outline-none focus:ring-2 
                focus:ring-primary/50 active:scale-95 transform"
            >
              Calculate
            </button>
          </div>
        )}
        
        {results && results.length > 0 && (
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold text-center">Results</h3>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="grid grid-cols-3 items-center gap-4 bg-muted/50 p-3 rounded-lg">
                  <label className="text-right font-medium">{result.label}</label>
                  <span className="col-span-2 font-bold text-primary">{result.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  )
}
