import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { calculatorNavItems } from '../../config/calculatorNav'
import { ThemeToggle } from './ThemeToggle'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {calculatorNavItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg border-l-2 py-2.5 pl-2.5 pr-3 text-sm transition-colors',
                isActive
                  ? cn(
                      'font-medium text-sidebar-foreground',
                      item.accent.activeIndicator,
                      item.accent.activeBg,
                    )
                  : 'border-l-transparent text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground',
              )
            }
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                item.accent.iconBg,
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{item.label}</div>
              <div className="truncate text-xs text-sidebar-muted-foreground">
                {item.description}
              </div>
            </div>
          </NavLink>
        )
      })}
    </nav>
  )
}

function SidebarBrand({
  onNavigate,
  compact,
}: {
  onNavigate?: () => void
  compact?: boolean
}) {
  return (
    <NavLink
      to="/"
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 hover:opacity-90 transition-opacity',
        compact ? 'min-w-0 flex-1 px-4 py-3.5' : 'px-5 py-5',
      )}
    >
      <img
        src="/NeoCalc.svg"
        alt="NeoCalc logo"
        className="h-9 w-9 shrink-0 object-contain"
      />
      <div className="min-w-0">
        <div className="text-sm font-bold text-sidebar-foreground">NeoCalc</div>
        <div className="text-xs text-sidebar-muted-foreground">
          Neonatal Calculators
        </div>
      </div>
    </NavLink>
  )
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      <div className="border-b border-sidebar-border">
        <SidebarBrand />
      </div>
      <div className="flex-1 overflow-auto px-3 py-4">
        <SidebarNav />
      </div>
      <div className="border-t border-sidebar-border px-5 py-4">
        <ThemeToggle />
      </div>
    </aside>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex w-64 flex-col bg-sidebar p-0 border-sidebar-border"
      >
        <div className="flex items-center border-b border-sidebar-border pr-2">
          <SidebarBrand compact onNavigate={() => setOpen(false)} />
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close navigation</span>
            </Button>
          </SheetClose>
        </div>
        <div className="flex-1 overflow-auto px-3 py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
