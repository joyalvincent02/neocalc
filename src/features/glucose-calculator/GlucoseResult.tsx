import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { roundDecimalToString } from '../../calculations/shared/rounding'
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

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Target Glucose', value: `${input.targetGlucosePercent}%` },
          { label: 'Base', value: `${input.baseGlucosePercent}%` },
          { label: 'Additive', value: `${input.additiveGlucosePercent}%` },
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          {
            label: 'Reserved volume',
            value: `${input.reservedAdditiveVolumeMl} mL`,
          },
        ]}
      />

      <WarningList warnings={result.warnings} />

      <ResultCard title="Result">
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
          <div className="font-semibold text-primary">Final Instruction</div>
          <div className="mt-2 whitespace-pre-wrap text-foreground">{result.finalInstruction}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-xs text-muted-foreground">Available volume</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {roundDecimalToString(e.availableVolumeMl, { dp: roundingDp })}
              <span className="ml-1 text-xs font-normal text-muted-foreground">mL</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-xs text-muted-foreground">Final concentration</div>
            <div className="mt-1 text-lg font-bold text-primary">
              {roundDecimalToString(e.finalConcentrationCheckPercent, { dp: roundingDp })}
              <span className="ml-1 text-xs font-normal text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
      </ResultCard>
    </div>
  )
}
