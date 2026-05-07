import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
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
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <img src="/NeoCalc.svg" alt="NeoCalc logo" className="h-6 w-6 object-contain" />
            <div className="text-sm font-bold text-foreground">NeoCalc</div>
          </div>
          <ThemeToggle />
        </header>

        {/* Disclaimer banner */}
        <div className="border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-foreground">
          <div className="mx-auto w-full max-w-4xl flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-warning"
              aria-hidden="true"
            />
            <span>
              <span className="font-semibold text-warning">Disclaimer: </span>
              {DISCLAIMER_TEXT}
            </span>
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
