import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'

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

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          { label: 'NaCl reserved', value: `${input.sodiumChlorideMl} mL` },
          { label: 'KCl reserved', value: `${input.potassiumChlorideMl} mL` },
          {
            label: 'Calcium gluconate reserved',
            value: `${input.calciumGluconateMl} mL`,
          },
          { label: 'Target glucose', value: `${input.targetGlucosePercent}%` },
          { label: 'Base glucose', value: `${input.baseGlucosePercent}%` },
          { label: 'Additive glucose', value: `${input.additiveGlucosePercent}%` },
        ]}
      />

      <WarningList warnings={result.warnings} />

      <ResultCard title="Result">
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="font-semibold">Final instruction</div>
          <div className="mt-2 whitespace-pre-wrap">{result.finalInstruction}</div>
        </div>

        <div className="rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="font-semibold">Mixture (rounded)</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.mixtureItems.map((m, idx) => (
              <li key={idx}>
                {roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL {m.name}
              </li>
            ))}
          </ul>
        </div>

        <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
      </ResultCard>
    </div>
  )
}

