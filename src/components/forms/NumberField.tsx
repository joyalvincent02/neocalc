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
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  step?: number
  min?: number
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className={cn(error && 'text-destructive')}>{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        className={cn(error && 'border-destructive focus-visible:ring-destructive/30')}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : null}
    </div>
  )
}
