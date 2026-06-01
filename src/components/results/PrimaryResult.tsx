import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrimaryResult({
  label,
  value,
  unit,
  instruction,
}: {
  /** Short label above the hero number, e.g. "Additive per burette" */
  label: string
  /** The formatted numeric string to display large */
  value: string
  /** Unit suffix, e.g. "mL" */
  unit?: string
  /** Plain-English final instruction for this result, shown below and copyable */
  instruction: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(instruction).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="rounded-lg border-l-4 border-l-primary bg-primary/5 border border-primary/20 p-4">
      {/* Hero number */}
      <div className="text-center mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
          {label}
        </div>
        <div className="text-5xl font-semibold tabular-nums text-primary leading-none">
          {value}
        </div>
        {unit && (
          <div className="mt-1 text-sm text-muted-foreground">{unit}</div>
        )}
      </div>

      {/* Final instruction */}
      <div className="border-t border-primary/15 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-1">
              Final Instruction
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {instruction}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Copy instruction to clipboard"
            aria-label="Copy final instruction to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
