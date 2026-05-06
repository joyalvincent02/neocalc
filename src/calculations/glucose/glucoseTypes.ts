import type Decimal from 'decimal.js'
import type { BreakdownStep, ValidationIssue } from '../shared/validation'

export type GlucoseCalculatorInput = {
  targetGlucosePercent: number
  baseGlucosePercent: number
  additiveGlucosePercent: number
  buretteSizeMl: number
  reservedAdditiveVolumeMl: number
}

export type GlucoseCalculatorExact = {
  availableVolumeMl: Decimal
  baseGlucoseVolumeMl: Decimal
  additiveGlucoseVolumeMl: Decimal
  finalConcentrationCheckPercent: Decimal
}

export type GlucoseCalculatorResult =
  | {
      ok: true
      exact: GlucoseCalculatorExact
      breakdownSteps: BreakdownStep[]
      finalInstruction: string
      warnings: string[]
    }
  | {
      ok: false
      errors: ValidationIssue[]
      warnings: string[]
    }

