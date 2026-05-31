import { useRef, useEffect } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateAdditive } from '../../calculations/additive/additiveCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { SettingsPopover } from '../../components/forms/SettingsPopover'
import { AdditiveCalculatorForm } from './AdditiveCalculatorForm'
import { AdditiveResult } from './AdditiveResult'
import type { AdditiveCalculatorResult } from '../../calculations/additive/additiveTypes'
import type { AdditiveFormValues } from './additiveFormSchema'

export function AdditiveCalculatorPage() {
  const { dp, setDp } = useRoundingPrecision()
  const resultRef = useRef<HTMLDivElement>(null)

  const { lastInput, result, run } = useCalculationResult<
    AdditiveFormValues,
    AdditiveCalculatorResult
  >((values) => calculateAdditive(values, dp))

  useEffect(() => {
    if (lastInput && result && resultRef.current) {
      resultRef.current.focus()
    }
  }, [lastInput, result])

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Additive Calculator
        </h1>
        <p className="text-sm text-muted-foreground">
          Sodium chloride / potassium chloride per-burette additive calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        {/* Inputs column */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Parameters</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Enter patient and fluid details below
                </CardDescription>
              </div>
              <SettingsPopover roundingDp={dp} onRoundingDpChange={setDp} />
            </div>
          </CardHeader>
          <CardContent>
            <AdditiveCalculatorForm defaultValues={{}} onSubmit={run} />
          </CardContent>
        </Card>

        {/* Results column */}
        <div
          ref={resultRef}
          className="space-y-4 outline-none"
          role="status"
          aria-live="polite"
          aria-label="Calculation results"
          tabIndex={-1}
        >
          {lastInput && result ? (
            <div className="result-enter">
              <AdditiveResult input={lastInput} result={result} roundingDp={dp} />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Results will appear here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill in the parameters and click Calculate
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
