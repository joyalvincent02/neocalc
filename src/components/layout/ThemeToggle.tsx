import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme, type Theme } from '../../hooks/useTheme'
import { cn } from '@/lib/utils'

const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
  {
    value: 'light',
    icon: <Sun className="h-3.5 w-3.5" aria-hidden="true" />,
    label: 'Light mode',
  },
  {
    value: 'system',
    icon: <Monitor className="h-3.5 w-3.5" aria-hidden="true" />,
    label: 'System preference',
  },
  {
    value: 'dark',
    icon: <Moon className="h-3.5 w-3.5" aria-hidden="true" />,
    label: 'Dark mode',
  },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="inline-flex rounded-md border border-sidebar-border overflow-hidden lg:border-border"
    >
      {options.map((opt) => {
        const active = theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            aria-pressed={active}
            title={opt.label}
            className={cn(
              'flex h-7 w-9 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground lg:bg-primary lg:text-primary-foreground'
                : 'text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground lg:text-muted-foreground lg:hover:bg-secondary lg:hover:text-foreground',
            )}
          >
            {opt.icon}
          </button>
        )
      })}
    </div>
  )
}
