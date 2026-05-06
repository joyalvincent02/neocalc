import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'
import { computeTargetGlucosePercentFromGir } from '../../calculations/glucose/gir'

export function CombinedBuretteResultView({
  input,
  result,
  roundingDp,
}: {
  input: CombinedFormValues
  result: CombinedBuretteResult
  roundingDp: number
}) {
  if (!result.ok) {
    return (
      <ResultCard title="Cannot Calculate">
        <WarningList warnings={result.warnings} />
        <ErrorAlert errors={result.errors} />
      </ResultCard>
    )
  }

  const computedTarget = computeTargetGlucosePercentFromGir({
    patientWeightKg: input.patientWeightKg,
    infusionRateMlPerHour: input.infusionRateMlPerHour,
    targetGirMgPerKgMin: input.targetGirMgPerKgMin,
  })

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          { label: 'Weight', value: `${input.patientWeightKg.toFixed(3)} kg` },
          { label: 'Infusion rate', value: `${input.infusionRateMlPerHour} mL/hr` },
          { label: 'Target GIR', value: `${input.targetGirMgPerKgMin} mg/kg/min` },
          {
            label: 'Computed target glucose',
            value: computedTarget.ok
              ? `${computedTarget.targetGlucosePercent.toFixed(2)}%`
              : 'Invalid',
          },
          { label: 'NaCl reserved', value: `${input.sodiumChlorideMl} mL` },
          { label: 'KCl reserved', value: `${input.potassiumChlorideMl} mL` },
          {
            label: 'Ca-gluconate reserved',
            value: `${input.calciumGluconateMl} mL`,
          },
          { label: 'Base glucose', value: `${input.baseGlucosePercent}%` },
          { label: 'Additive glucose', value: `${input.additiveGlucosePercent}%` },
        ]}
      />

      <WarningList warnings={result.warnings} />

      <ResultCard title="Result">
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
          <div className="font-semibold text-primary">Final Instruction</div>
          <div className="mt-2 whitespace-pre-wrap text-foreground">{result.finalInstruction}</div>
        </div>

        <div className="rounded-md border border-border bg-background p-3 text-sm">
          <div className="font-semibold text-foreground mb-2">Mixture (rounded)</div>
          <ul className="space-y-1.5">
            {result.mixtureItems.map((m, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-muted-foreground">{m.name}</span>
                <span className="font-medium text-foreground">
                  {roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL
                </span>
              </li>
            ))}
          </ul>
        </div>

        <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
      </ResultCard>
    </div>
  )
}
