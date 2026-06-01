import type { ReactNode } from 'react'

export function FormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pb-1 border-b border-border w-full">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>
    </fieldset>
  )
}
