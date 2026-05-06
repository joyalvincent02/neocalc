import type Decimal from 'decimal.js'
import type { BreakdownStep, ValidationIssue } from '../shared/validation'

export type ReservedAdditive = {
  name: string
  volumeMl: number
}

export type CombinedBuretteInput = {
  buretteSizeMl: number
  reservedAdditives: ReservedAdditive[]
  targetGlucosePercent: number
  baseGlucosePercent: number
  additiveGlucosePercent: number
}

export type CombinedMixtureItemExact = {
  name: string
  volumeMl: Decimal
}

export type CombinedBuretteExact = {
  totalReservedAdditivesMl: Decimal
  remainingVolumeForGlucoseMl: Decimal
  glucoseAdditiveVolumeMl: Decimal
  glucoseBaseVolumeMl: Decimal
  finalVolumeCheckMl: Decimal
}

export type CombinedBuretteResult =
  | {
      ok: true
      exact: CombinedBuretteExact
      mixtureItems: CombinedMixtureItemExact[]
      breakdownSteps: BreakdownStep[]
      finalInstruction: string
      warnings: string[]
    }
  | {
      ok: false
      errors: ValidationIssue[]
      warnings: string[]
    }

