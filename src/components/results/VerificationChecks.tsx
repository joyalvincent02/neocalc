import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export type CheckStatus = 'pass' | 'warn' | 'fail'

export type VerificationCheck = {
  label: string
  detail?: string
  status: CheckStatus
}

const icons: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />,
  warn: <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />,
  fail: <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />,
}

const labelColour: Record<CheckStatus, string> = {
  pass: 'text-success',
  warn: 'text-warning',
  fail: 'text-destructive',
}

export function VerificationChecks({ checks }: { checks: VerificationCheck[] }) {
  if (checks.length === 0) return null

  const allPass = checks.every((c) => c.status === 'pass')

  return (
    <div className={`rounded-md border px-3 py-2.5 ${allPass ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Verification Checks
      </div>
      <ul className="space-y-1.5">
        {checks.map((check, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {icons[check.status]}
            <div className="min-w-0">
              <span className={`text-xs font-medium ${labelColour[check.status]}`}>
                {check.label}
              </span>
              {check.detail && (
                <span className="text-xs text-muted-foreground ml-1">{check.detail}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
