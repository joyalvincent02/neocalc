import { d } from '../shared/decimal'
import { roundDecimalToString } from '../shared/rounding'
import {
  issue,
  requireDecimalNonNegative,
  requireFinitePositiveNumber,
  type BreakdownStep,
  type ValidationIssue,
} from '../shared/validation'
import type {
  AdditiveCalculatorExact,
  AdditiveCalculatorInput,
  AdditiveCalculatorResult,
} from './additiveTypes'

export function calculateAdditive(
  input: AdditiveCalculatorInput,
  roundingDp: number = 2,
): AdditiveCalculatorResult {
  const errors: ValidationIssue[] = []
  const warnings: string[] = []

  const patientWeightKg = requireFinitePositiveNumber(
    'patientWeightKg',
    input.patientWeightKg,
    errors,
  )
  const requiredMmolPerKgPerDay = requireFinitePositiveNumber(
    'requiredMmolPerKgPerDay',
    input.requiredMmolPerKgPerDay,
    errors,
  )
  const stockStrengthMmolPerMl = requireFinitePositiveNumber(
    'stockStrengthMmolPerMl',
    input.stockStrengthMmolPerMl,
    errors,
  )
  const maintenanceRateMlPerHour = requireFinitePositiveNumber(
    'maintenanceRateMlPerHour',
    input.maintenanceRateMlPerHour,
    errors,
  )
  const buretteSizeMl = requireFinitePositiveNumber(
    'buretteSizeMl',
    input.buretteSizeMl,
    errors,
  )

  if (!input.additiveName.trim()) {
    errors.push(issue('additiveName', 'Additive name is required.'))
  }
  if (!input.baseFluidName.trim()) {
    errors.push(issue('baseFluidName', 'Base fluid name is required.'))
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings }
  }

  const w = d(patientWeightKg!)
  const req = d(requiredMmolPerKgPerDay!)
  const strength = d(stockStrengthMmolPerMl!)
  const rate = d(maintenanceRateMlPerHour!)
  const buretteSize = d(buretteSizeMl!)

  const totalRequirementMmolPerDay = w.mul(req)
  const additiveMlPerDay = totalRequirementMmolPerDay.div(strength)
  const maintenanceFluidMlPerDay = rate.mul(24)
  const burettesPerDay = maintenanceFluidMlPerDay.div(buretteSize)

  if (burettesPerDay.lte(0)) {
    return {
      ok: false,
      errors: [issue('burettesPerDay', 'Maintenance volume must be > 0.')],
      warnings,
    }
  }

  const additiveMlPerBurette = additiveMlPerDay.div(burettesPerDay)
  const baseFluidMlPerBurette = buretteSize.sub(additiveMlPerBurette)

  requireDecimalNonNegative('additiveMlPerDay', additiveMlPerDay, errors)
  requireDecimalNonNegative(
    'maintenanceFluidMlPerDay',
    maintenanceFluidMlPerDay,
    errors,
  )
  requireDecimalNonNegative('burettesPerDay', burettesPerDay, errors)
  requireDecimalNonNegative('additiveMlPerBurette', additiveMlPerBurette, errors)
  requireDecimalNonNegative(
    'baseFluidMlPerBurette',
    baseFluidMlPerBurette,
    errors,
  )

  if (additiveMlPerBurette.gt(buretteSize)) {
    errors.push(
      issue(
        'additiveMlPerBurette',
        'Additive volume exceeds burette size.',
      ),
    )
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings }
  }

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Total requirement (mmol/day)',
      formula: 'patientWeightKg × requiredMmolPerKgPerDay',
      substitution: `${w.toString()} × ${req.toString()}`,
      exact: totalRequirementMmolPerDay,
      unit: 'mmol/day',
    },
    {
      label: 'Additive volume per day (mL/day)',
      formula: 'totalRequirementMmolPerDay ÷ stockStrengthMmolPerMl',
      substitution: `${totalRequirementMmolPerDay.toString()} ÷ ${strength.toString()}`,
      exact: additiveMlPerDay,
      unit: 'mL/day',
    },
    {
      label: 'Maintenance fluid per day (mL/day)',
      formula: 'maintenanceRateMlPerHour × 24',
      substitution: `${rate.toString()} × 24`,
      exact: maintenanceFluidMlPerDay,
      unit: 'mL/day',
    },
    {
      label: 'Burettes per day (burettes/day)',
      formula: 'maintenanceFluidMlPerDay ÷ buretteSizeMl',
      substitution: `${maintenanceFluidMlPerDay.toString()} ÷ ${buretteSize.toString()}`,
      exact: burettesPerDay,
      unit: 'burettes/day',
    },
    {
      label: 'Additive per burette (mL)',
      formula: 'additiveMlPerDay ÷ burettesPerDay',
      substitution: `${additiveMlPerDay.toString()} ÷ ${burettesPerDay.toString()}`,
      exact: additiveMlPerBurette,
      unit: 'mL/burette',
    },
    {
      label: 'Base fluid per burette (mL)',
      formula: 'buretteSizeMl − additiveMlPerBurette',
      substitution: `${buretteSize.toString()} − ${additiveMlPerBurette.toString()}`,
      exact: baseFluidMlPerBurette,
      unit: 'mL/burette',
    },
  ]

  const exact: AdditiveCalculatorExact = {
    totalRequirementMmolPerDay,
    additiveMlPerDay,
    maintenanceFluidMlPerDay,
    burettesPerDay,
    additiveMlPerBurette,
    baseFluidMlPerBurette,
  }

  const additivePerBuretteRounded = roundDecimalToString(additiveMlPerBurette, {
    dp: roundingDp,
  })
  const basePerBuretteRounded = roundDecimalToString(baseFluidMlPerBurette, {
    dp: roundingDp,
  })

  return {
    ok: true,
    exact,
    breakdownSteps,
    finalInstruction: `Per ${buretteSizeMl} mL burette: add ${additivePerBuretteRounded} mL ${input.additiveName}, then add ${basePerBuretteRounded} mL ${input.baseFluidName}.`,
    warnings,
  }
}

