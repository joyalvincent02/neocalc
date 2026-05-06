import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { calculateCombinedBurette } from '../../calculations/combined/combinedBuretteCalculator'
import { computeTargetGlucosePercentFromGir } from '../../calculations/glucose/gir'
import { computeGirFromGlucosePercent } from '../../calculations/glucose/gir'
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
  >((values) => {
    const target = computeTargetGlucosePercentFromGir({
      patientWeightKg: values.patientWeightKg,
      infusionRateMlPerHour: values.infusionRateMlPerHour,
      targetGirMgPerKgMin: values.targetGirMgPerKgMin,
    })

    if (!target.ok) {
      return {
        ok: false,
        errors: target.errors.map((e) => ({
          path: `gir.${e.path}`,
          message: e.message,
        })),
        warnings: [],
      }
    }

    const engine = calculateCombinedBurette(
      {
        buretteSizeMl: values.buretteSizeMl,
        reservedAdditives: [
          ...(values.sodiumChlorideMl > 0
            ? [{ name: 'Sodium chloride', volumeMl: values.sodiumChlorideMl }]
            : []),
          ...(values.potassiumChlorideMl > 0
            ? [{ name: 'Potassium chloride', volumeMl: values.potassiumChlorideMl }]
            : []),
          ...(values.calciumGluconateMl > 0
            ? [{ name: 'Calcium gluconate', volumeMl: values.calciumGluconateMl }]
            : []),
        ],
        targetGlucosePercent: target.targetGlucosePercent,
        baseGlucosePercent: values.baseGlucosePercent,
        additiveGlucosePercent: values.additiveGlucosePercent,
      },
      dp,
    )

    const warnings: string[] = []
    if (values.calciumGluconateMl > 0) {
      warnings.push(
        'Calcium gluconate compatibility depends on full solution composition (e.g. phosphate/amino acids), temperature, concentration, and local policy. Verify compatibility independently.',
      )
    }
    if (target.targetGlucosePercent > 12.5) {
      warnings.push(
        `Computed target glucose is ${target.targetGlucosePercent.toFixed(
          2,
        )}%. This may exceed common peripheral dextrose limits (often 12.5%); verify local policy and line type.`,
      )
    }
    const girCheck = computeGirFromGlucosePercent({
      patientWeightKg: values.patientWeightKg,
      infusionRateMlPerHour: values.infusionRateMlPerHour,
      glucosePercent: target.targetGlucosePercent,
    })
    if (girCheck.ok) {
      if (girCheck.girMgPerKgMin < 3 || girCheck.girMgPerKgMin > 12) {
        warnings.push(
          `Computed GIR is ${girCheck.girMgPerKgMin.toFixed(
            2,
          )} mg/kg/min. Verify appropriateness and local policy.`,
        )
      }
    }

    if (!engine.ok) {
      return {
        ...engine,
        warnings: [...warnings, ...engine.warnings],
        errors: [
          ...engine.errors,
          {
            path: 'computedTargetGlucosePercent',
            message: `Computed target glucose is ${target.targetGlucosePercent.toFixed(
              2,
            )}% from GIR/weight/rate.`,
          },
        ],
      }
    }

    return { ...engine, warnings: [...warnings, ...engine.warnings] }
  })

  return (
    <AppLayout>
      <div className="space-y-1 mb-6">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Combined Burette
        </h1>
        <p className="text-sm text-muted-foreground">
          Reserve electrolyte volumes first, then calculate glucose strengthening
          for the remaining space.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
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
            <CombinedBuretteForm
              defaultValues={{
                patientWeightKg: 2.5,
                infusionRateMlPerHour: 12.5,
                targetGirMgPerKgMin: 10,
                sodiumChlorideMl: 0.83,
                potassiumChlorideMl: 0.4,
                calciumGluconateMl: 0,
              }}
              onSubmit={run}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lastInput && result ? (
            <CombinedBuretteResultView
              input={lastInput}
              result={result}
              roundingDp={dp}
            />
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
