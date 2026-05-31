import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { PrimaryResult } from '../../components/results/PrimaryResult'
import { VerificationChecks, type VerificationCheck } from '../../components/results/VerificationChecks'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import { Separator } from '@/components/ui/separator'
import type { GlucoseCalculatorResult } from '../../calculations/glucose/glucoseTypes'
import type { GlucoseFormValues } from './glucoseFormSchema'

export function GlucoseResult({
  input,
  result,
  roundingDp,
}: {
  input: GlucoseFormValues
  result: GlucoseCalculatorResult
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

  const e = result.exact
  const rd = (v: Parameters<typeof roundDecimalToString>[0]) =>
    roundDecimalToString(v, { dp: roundingDp })

  const concentrationDiff = e.finalConcentrationCheckPercent
    .minus(input.targetGlucosePercent)
    .abs()
  const concentrationPass = concentrationDiff.lte(0.01)

  const checks: VerificationCheck[] = [
    {
      label: 'Final concentration matches target',
      detail: `${rd(e.finalConcentrationCheckPercent)}% ≈ ${input.targetGlucosePercent}%`,
      status: concentrationPass ? 'pass' : concentrationDiff.lte(0.1) ? 'warn' : 'fail',
    },
    {
      label: 'Volumes sum to available volume',
      detail: `${rd(e.baseGlucoseVolumeMl)} + ${rd(e.additiveGlucoseVolumeMl)} mL`,
      status: 'pass',
    },
  ]

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Target Glucose', value: `${input.targetGlucosePercent}%` },
          { label: 'Base', value: `${input.baseGlucosePercent}%` },
          { label: 'Additive', value: `${input.additiveGlucosePercent}%` },
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          { label: 'Reserved volume', value: `${input.reservedAdditiveVolumeMl} mL` },
        ]}
      />

      <WarningList warnings={result.warnings} />

      {/* Hero result — instruction summarises both volumes */}
      <PrimaryResult
        label="Glucose mix"
        value={`${rd(e.baseGlucoseVolumeMl)} + ${rd(e.additiveGlucoseVolumeMl)}`}
        unit={`mL (base + additive)`}
        instruction={result.finalInstruction}
      />

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-background p-3">
          <div className="text-xs text-muted-foreground">Available volume</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {rd(e.availableVolumeMl)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">mL</span>
          </div>
        </div>
        <div className="rounded-md border border-border bg-background p-3">
          <div className="text-xs text-muted-foreground">Final concentration (check)</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {rd(e.finalConcentrationCheckPercent)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <VerificationChecks checks={checks} />

      <Separator />

      <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
    </div>
  )
}
