'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

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
    placeholder?: string
    min?: number
    max?: number
    step?: number
    name: string
  }[]
  onCalculate?: () => void
  results?: React.ReactNode
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Fields */}
          {inputs && (
            <div className="grid gap-6 md:grid-cols-2">
              {inputs.map((input, index) => (
                <div key={index} className="space-y-2">
                  <Label
                    htmlFor={`input-${index}`}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {input.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={`input-${index}`}
                      type={input.type}
                      value={input.value}
                      onChange={input.onChange}
                      placeholder={input.placeholder}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      name={input.name}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 ${
                        input.error
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}
                    />
                    {input.error && (
                      <p className="mt-1 text-sm text-red-500">{input.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calculator Button */}
          {onCalculate && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={onCalculate}
                className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150"
              >
                Calculate
              </Button>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Results
              </h3>
              <div className="space-y-4">{results}</div>
            </div>
          )}

          {/* Additional Content */}
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
