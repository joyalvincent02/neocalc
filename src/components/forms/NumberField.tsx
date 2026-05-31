import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  step,
  min,
  error,
  disabled,
  unit,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  step?: number
  min?: number
  error?: string
  disabled?: boolean
  /** Optional unit suffix displayed inside the input, e.g. "kg", "mL/hr" */
  unit?: string
}) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', disabled && 'opacity-40')}>
      <Label htmlFor={id} className={cn(error && 'text-destructive')}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          min={min}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive/30',
            unit && 'pr-10',
          )}
        />
        {unit && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none"
            aria-hidden="true"
          >
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
