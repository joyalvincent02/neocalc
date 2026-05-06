export function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="text-sm font-semibold">Warnings</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {warnings.map((w, idx) => (
          <li key={idx}>{w}</li>
        ))}
      </ul>
    </div>
  )
}

