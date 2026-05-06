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

