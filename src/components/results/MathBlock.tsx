import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'
import { cn } from '@/lib/utils'

export function MathBlock({
  latex,
  fallback,
  compact = false,
}: {
  latex: string
  fallback: string
  compact?: boolean
}) {
  const math = compact
    ? `{\\small \\displaystyle ${latex}}`
    : `{\\displaystyle ${latex}}`

  try {
    return (
      <div
        className={cn(
          'formula-scroll px-3 py-1.5',
          compact ? 'formula-scroll-compact' : 'formula-scroll-default',
        )}
        tabIndex={0}
        aria-label="Formula — scroll horizontally if needed"
      >
        <div className="formula-scroll-inner">
          <InlineMath math={math} />
        </div>
      </div>
    )
  } catch {
    return (
      <pre className="formula-scroll px-3 py-1.5 font-mono text-[11px] leading-snug whitespace-pre text-foreground">
        {fallback}
      </pre>
    )
  }
}
