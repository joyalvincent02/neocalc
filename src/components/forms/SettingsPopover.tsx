import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function SettingsPopover({
  roundingDp,
  onRoundingDpChange,
}: {
  roundingDp: number
  onRoundingDpChange: (v: number) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title="Display settings"
          aria-label="Open display settings"
        >
          <Settings2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4" align="end">
        <div className="text-sm font-semibold text-foreground mb-3">Display settings</div>
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs text-muted-foreground">
            Rounding precision (d.p.)
          </Label>
          <Input
            type="number"
            min={0}
            max={6}
            step={1}
            value={roundingDp}
            onChange={(e) => onRoundingDpChange(Number(e.target.value))}
            className="w-16 h-7 text-xs px-2"
            aria-label="Decimal places for rounding"
          />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Controls how many decimal places are shown in results and breakdowns.
          Exact values are always computed at full precision.
        </p>
      </PopoverContent>
    </Popover>
  )
}
