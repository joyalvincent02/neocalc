import { Navigation } from './Navigation'

export function Header() {
  return (
    <header className="border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-950/60">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            NeoCalc
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300">
            Neonatal fluid/electrolyte/glucose calculators
          </div>
        </div>
        <Navigation />
      </div>
    </header>
  )
}

