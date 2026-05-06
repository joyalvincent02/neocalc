export const DEFAULT_PROTOCOL = {
  roundingDp: 2,
  buretteSizesMl: [50, 100],
  // Broad guardrails for v1 validation (UI schemas enforce these).
  ranges: {
    weightKg: { min: 0.3, max: 8 },
    maintenanceRateMlPerHour: { min: 0.1, max: 30 },
    requiredMmolPerKgPerDay: { min: 0.1, max: 20 },
    stockStrengthMmolPerMl: { min: 0.1, max: 20 },
    glucosePercent: { min: 1, max: 70 },
  },
} as const

