import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { safeGetItem, safeSetItem } from '../lib/storage'

export type Theme = 'light' | 'dark' | 'system'

export type ThemeContextValue = {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'neocalc.theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = safeGetItem(STORAGE_KEY) as Theme | null
    return saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system'
  })

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    return getSystemTheme()
  })

  useEffect(() => {
    const updateEffective = () => {
      setEffectiveTheme(theme === 'system' ? getSystemTheme() : theme)
    }

    updateEffective()

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', updateEffective)
      return () => mq.removeEventListener('change', updateEffective)
    }
  }, [theme])

  useEffect(() => {
    safeSetItem(STORAGE_KEY, theme)

    const root = document.documentElement
    if (effectiveTheme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme, effectiveTheme])

  const value = useMemo<ThemeContextValue>(() => {
    return { theme, effectiveTheme, setTheme }
  }, [theme, effectiveTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}

