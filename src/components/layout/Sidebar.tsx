import { NavLink } from 'react-router-dom'
import { Activity, FlaskConical, Droplets, Layers, Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  description: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    to: '/additives',
    label: 'Additive Calculator',
    description: 'NaCl / KCl per-burette',
    icon: <FlaskConical className="h-4 w-4" />,
  },
  {
    to: '/glucose',
    label: 'Glucose Strengthening',
    description: 'Target GIR concentration',
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    to: '/combined',
    label: 'Combined Burette',
    description: 'Electrolytes + glucose',
    icon: <Layers className="h-4 w-4" />,
  },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-muted',
            )
          }
        >
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
              'bg-sidebar-muted group-[.active]:bg-sidebar-accent/30',
            )}
          >
            {item.icon}
          </span>
          <div className="min-w-0">
            <div className="truncate font-medium">{item.label}</div>
            <div className="truncate text-xs text-sidebar-muted-foreground">
              {item.description}
            </div>
          </div>
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarBrand() {
  return (
    <NavLink
      to="/"
      className="flex items-center gap-3 px-6 py-5 hover:opacity-90 transition-opacity"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
        <Activity className="h-5 w-5 text-white" />
      </div>
      <div>
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
      <SidebarBrand />
      <div className="flex-1 overflow-auto py-2">
        <SidebarNav />
      </div>
      <div className="px-4 py-4 border-t border-sidebar-border">
        <ThemeToggle />
      </div>
    </aside>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-sidebar p-0 border-sidebar-border">
        <SidebarBrand />
        <div className="flex-1 py-2">
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  )
}
