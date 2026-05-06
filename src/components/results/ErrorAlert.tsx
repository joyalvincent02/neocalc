import { CircleX } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ErrorAlert({
  errors,
}: {
  errors: { path: string; message: string }[]
}) {
  if (errors.length === 0) return null
  return (
    <Alert variant="destructive">
      <CircleX className="h-4 w-4" />
      <AlertTitle>Calculation Errors</AlertTitle>
      <AlertDescription>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {errors.map((e, idx) => (
            <li key={idx}>
              <span className="font-medium">{e.path}:</span> {e.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
