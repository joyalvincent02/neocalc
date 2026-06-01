import { useRef, useEffect } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { calculateAdditive } from '../../calculations/additive/additiveCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { SettingsPopover } from '../../components/forms/SettingsPopover'
import { ParametersCard } from '../../components/forms/ParametersCard'
import { AdditiveCalculatorForm } from './AdditiveCalculatorForm'
import { AdditiveResult } from './AdditiveResult'
import type { AdditiveCalculatorResult } from '../../calculations/additive/additiveTypes'
import type { AdditiveFormValues } from './additiveFormSchema'

export function AdditiveCalculatorPage() {
  const { dp, setDp } = useRoundingPrecision()
  const resultRef = useRef<HTMLDivElement>(null)

  const { lastInput, result, run, submissionCount } = useCalculationResult<
    AdditiveFormValues,
    AdditiveCalculatorResult
  >((values) => calculateAdditive(values, dp))

  const hasResult = Boolean(lastInput && result)

  useEffect(() => {
    if (hasResult && resultRef.current) {
      resultRef.current.focus()
    }
  }, [hasResult, lastInput, result])

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
        <ParametersCard
          description="Enter patient and fluid details below"
          hasResult={hasResult}
          submissionCount={submissionCount}
          settings={<SettingsPopover roundingDp={dp} onRoundingDpChange={setDp} />}
        >
          <AdditiveCalculatorForm defaultValues={{}} onSubmit={run} />
        </ParametersCard>

        <div
          ref={resultRef}
          className="space-y-4 outline-none"
          role="status"
          aria-live="polite"
          aria-label="Calculation results"
          tabIndex={-1}
        >
          {hasResult ? (
            <div className="result-enter">
              <AdditiveResult input={lastInput!} result={result!} roundingDp={dp} />
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
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