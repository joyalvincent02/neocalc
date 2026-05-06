import * as React from 'react'
import { cn } from '@/lib/utils'

/* Lightweight tooltip – no Radix dep required */
const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('', className)} {...props} />
))
TooltipTrigger.displayName = 'TooltipTrigger'

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = 'TooltipContent'

export { Tooltip, TooltipTrigger, TooltipContent }
