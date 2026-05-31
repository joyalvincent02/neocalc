import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme()

  const handleToggle = () => {
    // Cycle: light → dark → system → light
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const title =
    theme === 'light'
      ? 'Switch to dark mode'
      : theme === 'dark'
        ? 'Switch to system preference'
        : 'Switch to light mode'

  const icon =
    theme === 'system' ? (
      <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
    ) : effectiveTheme === 'dark' ? (
      <Moon className="h-3.5 w-3.5" aria-hidden="true" />
    ) : (
      <Sun className="h-3.5 w-3.5" aria-hidden="true" />
    )

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={title}
      aria-label={title}
      className={cn(
        'relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ease-in-out',
        'bg-muted dark:bg-secondary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          'pointer-events-none inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out motion-reduce:transition-none',
          effectiveTheme === 'dark' ? 'translate-x-7' : 'translate-x-0.5',
        )}
      >
        <span className="flex items-center justify-center text-muted-foreground">
          {icon}
        </span>
      </span>
    </button>
  )
}
