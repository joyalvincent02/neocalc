import Decimal from 'decimal.js'

Decimal.set({
  precision: 40,
  rounding: Decimal.ROUND_HALF_UP,
})

export type DecimalInput = Decimal.Value

export function d(value: DecimalInput): Decimal {
  const dec = new Decimal(value)
  if (!dec.isFinite()) {
    throw new Error(`Non-finite Decimal: ${String(value)}`)
  }
  return dec
}

export function isDecimalFinite(value: Decimal): boolean {
  return value.isFinite()
}

