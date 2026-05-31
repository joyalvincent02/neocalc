import { useId } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: { value: string; label: string }[]
  error?: string
}) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={cn(error && 'border-destructive focus:ring-destructive/30')}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
