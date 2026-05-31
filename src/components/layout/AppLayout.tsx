import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import { DISCLAIMER_TEXT } from '../../config/safetyMessages'
import { DesktopSidebar, MobileSidebar } from './Sidebar'
import { ThemeToggle } from './ThemeToggle'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <DesktopSidebar />

      {/* Main content area — offset for desktop sidebar */}
      <div className="lg:pl-60 flex flex-col min-h-dvh">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-4 py-3">
          <MobileSidebar />
          <Link
            to="/"
            className="flex flex-1 items-center gap-2 min-w-0 hover:opacity-90 transition-opacity"
            aria-label="NeoCalc home"
          >
            <img src="/NeoCalc.svg" alt="" className="h-6 w-6 object-contain" aria-hidden="true" />
            <div className="text-sm font-bold text-foreground">NeoCalc</div>
          </Link>
          <ThemeToggle />
        </header>

        {/* Disclaimer banner — persistent safety notice, softer than inline clinical warnings */}
        <div className="border-b border-warning/30 bg-warning/5 dark:bg-warning/10 px-4 py-2 text-xs text-amber-900/90 dark:text-amber-100/90">
          <div className="mx-auto w-full max-w-4xl flex items-center gap-2">
            <Info
              className="h-3.5 w-3.5 shrink-0 text-warning"
              aria-hidden="true"
            />
            <span>{DISCLAIMER_TEXT}</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 mx-auto w-full max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  )
}
