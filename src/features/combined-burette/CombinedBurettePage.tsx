import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateCombinedBurette } from '../../calculations/combined/combinedBuretteCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { RoundingControl } from '../../components/forms/RoundingControl'
import { CombinedBuretteForm } from './CombinedBuretteForm'
import { CombinedBuretteResultView } from './CombinedBuretteResult'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'

export function CombinedBurettePage() {
  const { dp, setDp } = useRoundingPrecision()
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

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
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
              <RoundingControl value={dp} onChange={setDp} />
            </div>
          </CardHeader>
          <CardContent>
            <CombinedBuretteForm defaultValues={{}} onSubmit={run} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lastInput && result ? (
            <CombinedBuretteResultView input={lastInput} result={result} roundingDp={dp} />
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
