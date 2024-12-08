import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CalculatorLayoutProps {
  title: string
  description?: string
  children?: React.ReactNode
  inputs?: {
    label: string
    type: string
    value: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
          <div key={index} className="grid grid-cols-3 items-center gap-4">
            <label className="text-right">{input.label}</label>
            <input
              type={input.type}
              value={input.value}
              onChange={input.onChange}
              className="col-span-2 border p-2 rounded"
            />
          </div>
        ))}
        
        {onCalculate && (
          <div className="flex justify-center">
            <button 
              onClick={onCalculate}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            >
              Calculate
            </button>
          </div>
        )}
        
        {results && results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Results</h3>
            {results.map((result, index) => (
              <div key={index} className="grid grid-cols-3 items-center gap-4">
                <label className="text-right">{result.label}</label>
                <span className="col-span-2 font-bold">{result.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  )
}
