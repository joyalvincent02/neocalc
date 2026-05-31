import { d } from '../shared/decimal'
import { formatExactForDisplay, roundDecimalToString } from '../shared/rounding'
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

  const fd = formatExactForDisplay

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Total requirement (mmol/day)',
      formula: 'patientWeightKg × requiredMmolPerKgPerDay',
      substitution: `${fd(w)} × ${fd(req)}`,
      exact: totalRequirementMmolPerDay,
      unit: 'mmol/day',
      latexFormula: 'T_{\\text{req}} = W \\times R',
      latexSubstitution: `T_{\\text{req}} = ${fd(w)} \\times ${fd(req)}`,
    },
    {
      label: 'Additive volume per day (mL/day)',
      formula: 'totalRequirementMmolPerDay ÷ stockStrengthMmolPerMl',
      substitution: `${fd(totalRequirementMmolPerDay)} ÷ ${fd(strength)}`,
      exact: additiveMlPerDay,
      unit: 'mL/day',
      latexFormula: 'V_{\\text{add/day}} = \\dfrac{T_{\\text{req}}}{C_{\\text{stock}}}',
      latexSubstitution: `V_{\\text{add/day}} = \\dfrac{${fd(totalRequirementMmolPerDay)}}{${fd(strength)}}`,
    },
    {
      label: 'Maintenance fluid per day (mL/day)',
      formula: 'maintenanceRateMlPerHour × 24',
      substitution: `${fd(rate)} × 24`,
      exact: maintenanceFluidMlPerDay,
      unit: 'mL/day',
      latexFormula: 'V_{\\text{maint/day}} = R_{\\text{rate}} \\times 24',
      latexSubstitution: `V_{\\text{maint/day}} = ${fd(rate)} \\times 24`,
    },
    {
      label: 'Burettes per day (burettes/day)',
      formula: 'maintenanceFluidMlPerDay ÷ buretteSizeMl',
      substitution: `${fd(maintenanceFluidMlPerDay)} ÷ ${fd(buretteSize)}`,
      exact: burettesPerDay,
      unit: 'burettes/day',
      latexFormula: 'N_{\\text{burettes}} = \\dfrac{V_{\\text{maint/day}}}{V_{\\text{burette}}}',
      latexSubstitution: `N_{\\text{burettes}} = \\dfrac{${fd(maintenanceFluidMlPerDay)}}{${fd(buretteSize)}}`,
    },
    {
      label: 'Additive per burette (mL)',
      formula: 'additiveMlPerDay ÷ burettesPerDay',
      substitution: `${fd(additiveMlPerDay)} ÷ ${fd(burettesPerDay)}`,
      exact: additiveMlPerBurette,
      unit: 'mL/burette',
      latexFormula: 'V_{\\text{add/burette}} = \\dfrac{V_{\\text{add/day}}}{N_{\\text{burettes}}}',
      latexSubstitution: `V_{\\text{add/burette}} = \\dfrac{${fd(additiveMlPerDay)}}{${fd(burettesPerDay)}}`,
    },
    {
      label: 'Base fluid per burette (mL)',
      formula: 'buretteSizeMl − additiveMlPerBurette',
      substitution: `${fd(buretteSize)} − ${fd(additiveMlPerBurette)}`,
      exact: baseFluidMlPerBurette,
      unit: 'mL/burette',
      latexFormula: 'V_{\\text{base/burette}} = V_{\\text{burette}} - V_{\\text{add/burette}}',
      latexSubstitution: `V_{\\text{base/burette}} = ${fd(buretteSize)} - ${fd(additiveMlPerBurette)}`,
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

