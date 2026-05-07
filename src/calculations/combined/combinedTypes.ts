import type Decimal from 'decimal.js'
import type { BreakdownStep, ValidationIssue } from '../shared/validation'

export type ElectrolyteConfig = {
  enabled: boolean
  requirementMmolPerKgPerDay: number
  stockStrengthMmolPerMl: number
}

export type ElectrolyteExact = {
  mmolPerDay: Decimal
  mlPerDay: Decimal
  mlPerBurette: Decimal
}

export type CombinedBuretteInput = {
  patientWeightKg: number
  maintenanceRateMlPerHour: number
  buretteSizeMl: number
  sodium: ElectrolyteConfig
  potassium: ElectrolyteConfig
  calciumGluconateMlPerBurette: number
  targetGlucosePercent: number
  baseGlucosePercent: number
  additiveGlucosePercent: number
}

export type CombinedMixtureItem = {
  name: string
  volumeMl: Decimal
}

export type CombinedBuretteExact = {
  // Phase 1 — fluid
  maintenanceFluidMlPerDay: Decimal
  burettesPerDay: Decimal
  // Phase 2 — sodium (null when disabled)
  sodium: ElectrolyteExact | null
  // Phase 3 — potassium (null when disabled)
  potassium: ElectrolyteExact | null
  // Phase 4 — reserved volume
  calciumGluconateMlPerBurette: Decimal
  totalReservedMl: Decimal
  // Phase 5 — glucose (quota workflow)
  availableForGlucoseMl: Decimal
  glucoseAdditiveVolumeMl: Decimal
  glucoseBaseVolumeMl: Decimal
  finalConcentrationCheckPercent: Decimal
}

export type CombinedBuretteResult =
  | {
      ok: true
      exact: CombinedBuretteExact
      mixtureItems: CombinedMixtureItem[]
      breakdownSteps: BreakdownStep[]
      finalInstruction: string
      warnings: string[]
    }
  | {
      ok: false
      errors: ValidationIssue[]
      warnings: string[]
    }
