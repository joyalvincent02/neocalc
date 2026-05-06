import { AppLayout } from '../../components/layout/AppLayout'
import { ResultCard } from '../../components/results/ResultCard'
import { calculateCombinedBurette } from '../../calculations/combined/combinedBuretteCalculator'
import { useCalculationResult } from '../../hooks/useCalculationResult'
import { useRoundingPrecision } from '../../hooks/useRoundingPrecision'
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
        targetGlucosePercent: values.targetGlucosePercent,
        baseGlucosePercent: values.baseGlucosePercent,
        additiveGlucosePercent: values.additiveGlucosePercent,
      },
      dp,
    ),
  )

  return (
    <AppLayout>
      <main>
        <h1 className="text-xl font-semibold">Combined burette</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Reserve electrolyte volumes first, then calculate glucose strengthening
          for the remaining space.
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
            <CombinedBuretteForm
              defaultValues={{
                sodiumChlorideMl: 0.83,
                potassiumChlorideMl: 0.4,
                calciumGluconateMl: 0,
              }}
              onSubmit={run}
            />
          </ResultCard>

          {lastInput && result ? (
            <CombinedBuretteResultView
              input={lastInput}
              result={result}
              roundingDp={dp}
            />
          ) : null}
        </div>
      </main>
    </AppLayout>
  )
}

