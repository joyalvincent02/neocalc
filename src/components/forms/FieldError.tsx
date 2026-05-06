export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <div className="mt-1 text-xs text-red-600 dark:text-red-400">{message}</div>
}

