import type Decimal from 'decimal.js'
import type { BreakdownStep, ValidationIssue } from '../shared/validation'

export type AdditiveCalculatorInput = {
  patientWeightKg: number
  requiredMmolPerKgPerDay: number
  stockStrengthMmolPerMl: number
  maintenanceRateMlPerHour: number
  buretteSizeMl: number
  additiveName: string
  baseFluidName: string
}

export type AdditiveCalculatorExact = {
  totalRequirementMmolPerDay: Decimal
  additiveMlPerDay: Decimal
  maintenanceFluidMlPerDay: Decimal
  burettesPerDay: Decimal
  additiveMlPerBurette: Decimal
  baseFluidMlPerBurette: Decimal
}

export type AdditiveCalculatorResult =
  | {
      ok: true
      exact: AdditiveCalculatorExact
      breakdownSteps: BreakdownStep[]
      finalInstruction: string
      warnings: string[]
    }
  | {
      ok: false
      errors: ValidationIssue[]
      warnings: string[]
    }

