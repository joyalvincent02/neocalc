import { AppLayout } from '../../components/layout/AppLayout'
import { ResultCard } from '../../components/results/ResultCard'
import { calculateGlucoseStrengthening } from '../../calculations/glucose/glucoseCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
import { GlucoseCalculatorForm } from './GlucoseCalculatorForm'
import { GlucoseResult } from './GlucoseResult'
import type { GlucoseCalculatorResult } from '../../calculations/glucose/glucoseTypes'
import type { GlucoseFormValues } from './glucoseFormSchema'

export function GlucoseCalculatorPage() {
  const { dp, setDp } = useRoundingPrecision()
  const { lastInput, result, run } = useCalculationResult<
    GlucoseFormValues,
    GlucoseCalculatorResult
  >((values) => calculateGlucoseStrengthening(values, dp))

  return (
    <AppLayout>
      <main>
        <h1 className="text-xl font-semibold">Glucose strengthening</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Calculate base + additive glucose volumes to reach a target concentration.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <ResultCard title="Inputs">
            <label className="block">
              <div className="text-sm font-medium">Rounding (decimal places)</div>
              <input
                type="number"
                min={0}
                max={6}
                step={1}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-400 dark:focus:ring-zinc-800"
                value={dp}
                onChange={(e) => setDp(Number(e.target.value))}
              />
            </label>
            <GlucoseCalculatorForm defaultValues={{ reservedAdditiveVolumeMl: 2 }} onSubmit={run} />
          </ResultCard>

          {lastInput && result ? (
            <GlucoseResult input={lastInput} result={result} roundingDp={dp} />
          ) : null}
        </div>
      </main>
    </AppLayout>
  )
}

