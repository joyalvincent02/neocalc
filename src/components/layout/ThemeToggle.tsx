import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme()

  const handleToggle = () => {
    if (theme === 'system') {
      setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
      return
    }
    if (theme === 'light') {
      setTheme('dark')
      return
    }
    setTheme('system')
  }

  const icon =
    theme === 'system' ? (
      <Monitor className="h-4 w-4" />
    ) : effectiveTheme === 'dark' ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    )

  const title =
    theme === 'system'
      ? `Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode`
      : theme === 'light'
        ? 'Switch to dark mode'
        : 'Switch to system preference'

  const srLabel =
    theme === 'system'
      ? `Theme: system (${effectiveTheme}). Activate to switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} mode.`
      : `Theme: ${theme}. Activate to ${title.toLowerCase()}.`

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleToggle}
      title={title}
      aria-label={srLabel}
      className="h-8 w-8 text-sidebar-foreground border-sidebar-border bg-transparent hover:bg-sidebar-muted lg:text-foreground lg:border-border lg:bg-card lg:hover:bg-secondary"
    >
      {icon}
    </Button>
  )
}
