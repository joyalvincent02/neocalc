export function formatNumber(value: string | number, unit?: string): string {
  const base = typeof value === 'number' ? String(value) : value
  return unit ? `${base} ${unit}` : base
}

