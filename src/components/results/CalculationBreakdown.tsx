import type Decimal from 'decimal.js'
import { FunctionSquare, Calculator } from 'lucide-react'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import type { BreakdownStep } from '../../calculations/shared/validation'
import { MathBlock } from './MathBlock'
import { Separator } from '@/components/ui/separator'

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
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
        <FunctionSquare className="h-4 w-4 text-primary" aria-hidden="true" />
        Calculation Breakdown
      </div>
      <ol className="space-y-4">
        {steps.map((s, idx) => (
          <li key={idx}>
            {idx > 0 && <Separator className="mb-4" />}
            <div className="text-sm font-medium text-foreground">{s.label}</div>
            <div className="mt-1.5 space-y-2 text-xs text-muted-foreground">
              <div>
                <div className="text-xs font-medium text-foreground/70 mb-0.5">Equation</div>
                <MathBlock
                  latex={`\\text{${escapeLatexText(s.formula)}}`}
                  fallback={s.formula}
                />
              </div>
              <div>
                <div className="text-xs font-medium text-foreground/70 mb-0.5">Substitution</div>
                <MathBlock
                  latex={`\\text{${escapeLatexText(s.substitution)}}`}
                  fallback={s.substitution}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Exact: </span>
                <span className="font-mono text-foreground">
                  {formatExact(s.exact)} {s.unit ?? ''}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calculator className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="font-medium text-muted-foreground">Rounded: </span>
                <span className="font-mono font-semibold text-foreground">
                  {roundDecimalToString(s.exact, { dp: roundingDp })} {s.unit ?? ''}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function escapeLatexText(text: string): string {
  return text
    .replaceAll('\\', '\\textbackslash ')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('_', '\\_')
    .replaceAll('%', '\\%')
    .replaceAll('#', '\\#')
    .replaceAll('&', '\\&')
    .replaceAll('$', '\\$')
}
