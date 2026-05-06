import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function RoundingControl({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <Label className="text-xs text-muted-foreground whitespace-nowrap">
        Rounding (d.p.)
      </Label>
      <Input
        type="number"
        min={0}
        max={6}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 h-7 text-xs px-2"
      />
    </div>
  )
}
