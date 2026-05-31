import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ParametersCard({
  title = 'Parameters',
  description,
  settings,
  children,
  hasResult,
  submissionCount,
  className,
}: {
  title?: string
  description: string
  settings: ReactNode
  children: ReactNode
  hasResult: boolean
  submissionCount: number
  className?: string
}) {
  const [open, setOpen] = useState(true)
  const collapsible = hasResult

  useEffect(() => {
    if (submissionCount > 0) {
      setOpen(false)
    }
  }, [submissionCount])

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            disabled={!collapsible}
            onClick={() => collapsible && setOpen((v) => !v)}
            className={cn(
              'flex min-w-0 flex-1 items-start gap-2 text-left',
              collapsible && 'lg:cursor-default lg:pointer-events-none',
            )}
            aria-expanded={collapsible ? open : true}
          >
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm">{title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {collapsible && !open
                  ? 'Tap to edit parameters'
                  : description}
              </CardDescription>
            </div>
            {collapsible ? (
              <ChevronDown
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform lg:hidden',
                  open && 'rotate-180',
                )}
                aria-hidden="true"
              />
            ) : null}
          </button>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {settings}
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={cn(collapsible && !open && 'hidden lg:block')}
      >
        {children}
      </CardContent>
    </Card>
  )
}
