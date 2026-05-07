import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateGlucoseStrengthening } from '../../calculations/glucose/glucoseCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { RoundingControl } from '../../components/forms/RoundingControl'
import { GlucoseCalculatorForm } from './GlucoseCalculatorForm'
import { GlucoseResult } from './GlucoseResult'
import type { GlucoseCalculatorResult } from '../../calculations/glucose/glucoseTypes'
import type { GlucoseFormValues } from './glucoseFormSchema'

export function GlucoseCalculatorPage() {
  const { dp, setDp } = useRoundingPrecision()
  const { lastInput, result, run } = useCalculationResult<
    GlucoseFormValues,
    GlucoseCalculatorResult
  >((values) => {
    const warnings: string[] = []

    if (values.targetGlucosePercent > 12.5) {
      warnings.push(
        `Target glucose is ${values.targetGlucosePercent.toFixed(2)}%. This may exceed common peripheral dextrose limits (often 12.5%); verify local policy and line type.`,
      )
    }

    const engine = calculateGlucoseStrengthening(
      {
        targetGlucosePercent: values.targetGlucosePercent,
        baseGlucosePercent: values.baseGlucosePercent,
        additiveGlucosePercent: values.additiveGlucosePercent,
        buretteSizeMl: values.buretteSizeMl,
        reservedAdditiveVolumeMl: values.reservedAdditiveVolumeMl,
      },
      dp,
    )

    if (!engine.ok) {
      return { ...engine, warnings: [...warnings, ...engine.warnings] }
    }

    return { ...engine, warnings: [...warnings, ...engine.warnings] }
  })

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Glucose Strengthening
        </h1>
        <p className="text-sm text-muted-foreground">
          Calculate base + additive glucose volumes to reach a target concentration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Parameters</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Enter fluid details below
                </CardDescription>
              </div>
              <RoundingControl value={dp} onChange={setDp} />
            </div>
          </CardHeader>
          <CardContent>
            <GlucoseCalculatorForm defaultValues={{ reservedAdditiveVolumeMl: 2 }} onSubmit={run} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lastInput && result ? (
            <GlucoseResult input={lastInput} result={result} roundingDp={dp} />
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
