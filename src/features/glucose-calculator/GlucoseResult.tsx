import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
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
      <ResultCard title="Cannot calculate">
        <WarningList warnings={result.warnings} />
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
          <div className="font-semibold">Errors</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.errors.map((e, idx) => (
              <li key={idx}>
                <span className="font-medium">{e.path}:</span> {e.message}
              </li>
            ))}
          </ul>
        </div>
      </ResultCard>
    )
  }

  const e = result.exact

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Target', value: `${input.targetGlucosePercent}%` },
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
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="font-semibold">Final instruction</div>
          <div className="mt-2 whitespace-pre-wrap">{result.finalInstruction}</div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-xs text-zinc-600 dark:text-zinc-300">
              Available volume
            </div>
            <div className="mt-1 font-semibold">
              {roundDecimalToString(e.availableVolumeMl, { dp: roundingDp })} mL
            </div>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-xs text-zinc-600 dark:text-zinc-300">
              Final concentration check
            </div>
            <div className="mt-1 font-semibold">
              {roundDecimalToString(e.finalConcentrationCheckPercent, { dp: roundingDp })}%
            </div>
          </div>
        </div>

        <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
      </ResultCard>
    </div>
  )
}

