import { TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function WarningList({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null
  return (
    <Alert variant="warning" className="border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50">
      <TriangleAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-900 dark:text-amber-200">Clinical Warnings</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
          {warnings.map((w, idx) => (
            <li key={idx}>{w}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
