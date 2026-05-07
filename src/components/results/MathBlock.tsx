import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

// #region agent log
const _dbgLog = (msg: string, data: Record<string, unknown>, hyp: string) =>
  fetch('http://127.0.0.1:7820/ingest/7c145b9b-6f73-4a24-8522-66d55a68b431', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '24024a' },
    body: JSON.stringify({ sessionId: '24024a', location: 'MathBlock.tsx', message: msg, data, hypothesisId: hyp, timestamp: Date.now() }),
  }).catch(() => {})
// #endregion

export function MathBlock({
  latex,
  fallback,
}: {
  latex: string
  fallback: string
}) {
  // #region agent log
  const katexStylesLoaded = Array.from(document.styleSheets).some(ss => {
    try { return ss.href?.includes('katex') ?? false } catch { return false }
  })
  _dbgLog('MathBlock render', { latex: latex.slice(0, 80), fallback: fallback.slice(0, 80), katexStylesLoaded, styleSheetCount: document.styleSheets.length }, 'A-D')
  // #endregion

  try {
    // #region agent log
    _dbgLog('BlockMath attempt', { latex: latex.slice(0, 80), blockMathType: typeof BlockMath }, 'B-C')
    // #endregion
    return (
      <div className="overflow-x-auto">
        <BlockMath math={latex} />
      </div>
    )
  } catch (err) {
    // #region agent log
    _dbgLog('BlockMath caught error', { error: String(err), latex: latex.slice(0, 80), fallback: fallback.slice(0, 80) }, 'B')
    // #endregion
    return (
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] leading-snug text-foreground">
        {fallback}
      </pre>
    )
  }
}

