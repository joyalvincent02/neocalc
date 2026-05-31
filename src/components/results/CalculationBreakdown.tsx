import { useState } from 'react'
import { ChevronDown, ChevronUp, FunctionSquare } from 'lucide-react'
import { formatExactForDisplay, roundDecimalToString } from '../../calculations/shared/rounding'
import type { BreakdownStep } from '../../calculations/shared/validation'
import { MathBlock } from './MathBlock'
import { Button } from '@/components/ui/button'

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

function StepRow({
  step,
  index,
  roundingDp,
}: {
  step: BreakdownStep
  index: number
  roundingDp: number
}) {
  const formulaLatex = step.latexFormula ?? `\\text{${escapeLatexText(step.formula)}}`
  const substitutionLatex = step.latexSubstitution ?? `\\text{${escapeLatexText(step.substitution)}}`

  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3">
      {/* Step number badge */}
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
          {index + 1}
        </span>
        <div className="w-px flex-1 bg-border" aria-hidden="true" />
      </div>

      {/* Step content */}
      <div className="min-w-0 pb-5">
        <div className="text-sm font-semibold text-foreground mb-2">{step.label}</div>

        {/* Formula */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Formula
          </div>
          <div className="min-w-0 rounded-md bg-muted/40 px-3 py-1.5 overflow-x-auto">
            <MathBlock latex={formulaLatex} fallback={step.formula} />
          </div>
        </div>

        {/* Substitution */}
        <div className="mb-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Substitution
          </div>
          <div className="min-w-0 rounded-md bg-muted/40 px-3 py-1.5 overflow-x-auto">
            <MathBlock latex={substitutionLatex} fallback={step.substitution} />
          </div>
        </div>

        {/* Exact vs Rounded */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Exact
            </span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {formatExactForDisplay(step.exact)}
              {step.unit ? ` ${step.unit}` : ''}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 rounded-md bg-primary/5 px-2 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Rounded
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-primary">
              {roundDecimalToString(step.exact, { dp: roundingDp })}
              {step.unit ? (
                <span className="ml-0.5 text-xs font-normal text-primary/70">
                  {step.unit}
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export function CalculationBreakdown({
  steps,
  roundingDp,
}: {
  steps: BreakdownStep[]
  roundingDp: number
}) {
  const [open, setOpen] = useState(false)

  if (steps.length === 0) return null

  return (
    <div className="rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-muted/30 transition-colors rounded-lg"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FunctionSquare className="h-4 w-4 text-primary" aria-hidden="true" />
          Step-by-step Calculation
          <span className="text-xs font-normal text-muted-foreground">
            ({steps.length} steps)
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1">
          <div className="mb-4 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-[1fr_auto_1fr]">
            <div className="bg-muted/30 px-3 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Exact
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Intermediate step value, shown to 6 decimal places for verification.
              </p>
            </div>
            <div className="hidden sm:block w-px bg-border" aria-hidden="true" />
            <div className="h-px sm:hidden bg-border" aria-hidden="true" />
            <div className="bg-primary/5 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Rounded
                </span>
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Use this
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-snug">
                Value at your selected precision ({roundingDp} d.p.) — use for clinical preparation.
              </p>
            </div>
          </div>
          <ol className="space-y-0" aria-label="Calculation steps">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="step-enter"
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <StepRow step={s} index={idx} roundingDp={roundingDp} />
              </div>
            ))}
          </ol>
          <div className="mt-1 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Collapse
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
