import { TriangleAlert } from 'lucide-react'

export function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null
  return (
    <div
      role="alert"
      className="rounded-md border border-warning/40 border-l-4 border-l-warning bg-warning/8 dark:bg-warning/10 px-4 py-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <TriangleAlert className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
        <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Clinical Warnings
        </span>
      </div>
      <ul className="space-y-1.5 pl-6">
        {warnings.map((w, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
            <span>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
