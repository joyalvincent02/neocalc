import type { ReactNode } from 'react'
import { DISCLAIMER_TEXT } from '../../config/safetyMessages'
import { Header } from './Header'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <div className="mx-auto w-full max-w-3xl">
          <div className="font-semibold">Disclaimer</div>
          <div className="mt-1 leading-snug">{DISCLAIMER_TEXT}</div>
        </div>
      </div>
      <Header />
      <div className="mx-auto w-full max-w-3xl px-4 py-4">{children}</div>
    </div>
  )
}

