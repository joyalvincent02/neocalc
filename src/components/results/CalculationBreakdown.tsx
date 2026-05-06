import type Decimal from 'decimal.js'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import type { BreakdownStep } from '../../calculations/shared/validation'

function formatExact(dec: Decimal) {
  return dec.toString()
}

export function CalculationBreakdown({
  steps,
  roundingDp,
}: {
  steps: BreakdownStep[]
  roundingDp: number
}) {
  if (steps.length === 0) return null
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="text-sm font-semibold">Breakdown</div>
      <ol className="mt-2 space-y-3">
        {steps.map((s, idx) => (
          <li key={idx} className="text-sm">
            <div className="font-medium">{s.label}</div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
              <div>{s.formula}</div>
              <div className="mt-0.5">{s.substitution}</div>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="font-medium">Exact:</span>{' '}
                {formatExact(s.exact)} {s.unit ?? ''}
              </div>
              <div>
                <span className="font-medium">Rounded:</span>{' '}
                {roundDecimalToString(s.exact, { dp: roundingDp })} {s.unit ?? ''}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

