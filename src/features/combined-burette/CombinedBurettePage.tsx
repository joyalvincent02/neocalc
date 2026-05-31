import { useRef, useEffect } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateCombinedBurette } from '../../calculations/combined/combinedBuretteCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { SettingsPopover } from '../../components/forms/SettingsPopover'
import { CombinedBuretteForm } from './CombinedBuretteForm'
import { CombinedBuretteResultView } from './CombinedBuretteResult'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'

export function CombinedBurettePage() {
  const { dp, setDp } = useRoundingPrecision()
  const resultRef = useRef<HTMLDivElement>(null)
  const { lastInput, result, run } = useCalculationResult<
    CombinedFormValues,
    CombinedBuretteResult
  >((values) =>
    calculateCombinedBurette(
      {
        patientWeightKg: values.patientWeightKg,
        maintenanceRateMlPerHour: values.maintenanceRateMlPerHour,
        buretteSizeMl: values.buretteSizeMl,
        sodium: {
          enabled: values.sodiumEnabled,
          requirementMmolPerKgPerDay: values.sodiumRequirementMmolPerKgPerDay,
          stockStrengthMmolPerMl: values.sodiumStockStrengthMmolPerMl,
        },
        potassium: {
          enabled: values.potassiumEnabled,
          requirementMmolPerKgPerDay: values.potassiumRequirementMmolPerKgPerDay,
          stockStrengthMmolPerMl: values.potassiumStockStrengthMmolPerMl,
        },
        calciumGluconateMlPerBurette: values.calciumGluconateMlPerBurette,
        targetGlucosePercent: values.targetGlucosePercent,
        baseGlucosePercent: values.baseGlucosePercent,
        additiveGlucosePercent: values.additiveGlucosePercent,
      },
      dp,
    ),
  )

  useEffect(() => {
    if (lastInput && result && resultRef.current) {
      resultRef.current.focus()
    }
  }, [lastInput, result])

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Combined Burette
        </h1>
        <p className="text-sm text-muted-foreground">
          Derive electrolyte volumes from weight-based prescriptions, then strengthen
          glucose for the remaining space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Parameters</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Enter patient, fluid, and electrolyte details
                </CardDescription>
              </div>
              <SettingsPopover roundingDp={dp} onRoundingDpChange={setDp} />
            </div>
          </CardHeader>
          <CardContent>
            <CombinedBuretteForm defaultValues={{}} onSubmit={run} />
          </CardContent>
        </Card>

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
              <CombinedBuretteResultView input={lastInput} result={result} roundingDp={dp} />
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
