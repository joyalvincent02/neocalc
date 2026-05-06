import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

export function MathBlock({
  latex,
  fallback,
}: {
  latex: string
  fallback: string
}) {
  try {
    return (
      <div className="overflow-x-auto">
        <BlockMath math={latex} />
      </div>
    )
  } catch {
    return (
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] leading-snug text-foreground">
        {fallback}
      </pre>
    )
  }
}

