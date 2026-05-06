import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function InputSummary({
  title = 'Inputs Used',
  items,
}: {
  title?: string
  items: { label: string; value: string }[]
}) {
  return (
    <Card className="bg-muted/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Separator className="mb-3" />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          {items.map((i) => (
            <div key={i.label} className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{i.label}</dt>
              <dd className="font-medium text-foreground">{i.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
