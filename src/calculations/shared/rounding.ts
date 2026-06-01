import type Decimal from 'decimal.js'

export type RoundingMode = 'HALF_UP'

export type RoundingSpec = {
  dp: number
  mode?: RoundingMode
}

export function clampDp(dp: number): number {
  if (!Number.isFinite(dp)) return 2
  return Math.min(6, Math.max(0, Math.trunc(dp)))
}

export function roundDecimalToString(value: Decimal, spec: RoundingSpec): string {
  const dp = clampDp(spec.dp)
  return value.toFixed(dp)
}

/** Decimal places for intermediate "exact" values shown in breakdowns (not used in computation). */
export const EXACT_DISPLAY_DP = 6

/** Format a computed Decimal for breakdown display — enough precision to verify, not full engine precision. */
export function formatExactForDisplay(value: Decimal, dp: number = EXACT_DISPLAY_DP): string {
  const fixed = value.toFixed(dp)
  if (!fixed.includes('.')) return fixed
  return fixed.replace(/\.?0+$/, '')
}

