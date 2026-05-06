import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateAdditive } from '../../calculations/additive/additiveCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { RoundingControl } from '../../components/forms/RoundingControl'
import { AdditiveCalculatorForm } from './AdditiveCalculatorForm'
import { AdditiveResult } from './AdditiveResult'
import type { AdditiveCalculatorResult } from '../../calculations/additive/additiveTypes'
import type { AdditiveFormValues } from './additiveFormSchema'

export function AdditiveCalculatorPage() {
  const { dp, setDp } = useRoundingPrecision()

  const { lastInput, result, run } = useCalculationResult<
    AdditiveFormValues,
    AdditiveCalculatorResult
  >((values) => calculateAdditive(values, dp))

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
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
              <RoundingControl value={dp} onChange={setDp} />
            </div>
          </CardHeader>
          <CardContent>
            <AdditiveCalculatorForm defaultValues={{}} onSubmit={run} />
          </CardContent>
        </Card>

        {/* Results column */}
        <div className="space-y-4">
          {lastInput && result ? (
            <AdditiveResult input={lastInput} result={result} roundingDp={dp} />
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
