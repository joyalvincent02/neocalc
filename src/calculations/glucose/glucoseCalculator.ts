import { d } from '../shared/decimal'
import { roundDecimalToString } from '../shared/rounding'
import {
  issue,
  requireDecimalNonNegative,
  requireFiniteNonNegativeNumber,
  requireFinitePositiveNumber,
  type BreakdownStep,
  type ValidationIssue,
} from '../shared/validation'
import type {
  GlucoseCalculatorExact,
  GlucoseCalculatorInput,
  GlucoseCalculatorResult,
} from './glucoseTypes'

function percentToGramsPerMl(percent: number) {
  return d(percent).div(100)
}

export function calculateGlucoseStrengthening(
  input: GlucoseCalculatorInput,
  roundingDp: number = 2,
): GlucoseCalculatorResult {
  const errors: ValidationIssue[] = []
  const warnings: string[] = []

  const targetGlucosePercent = requireFinitePositiveNumber(
    'targetGlucosePercent',
    input.targetGlucosePercent,
    errors,
  )
  const baseGlucosePercent = requireFinitePositiveNumber(
    'baseGlucosePercent',
    input.baseGlucosePercent,
    errors,
  )
  const additiveGlucosePercent = requireFinitePositiveNumber(
    'additiveGlucosePercent',
    input.additiveGlucosePercent,
    errors,
  )
  const buretteSizeMl = requireFinitePositiveNumber(
    'buretteSizeMl',
    input.buretteSizeMl,
    errors,
  )
  const reservedAdditiveVolumeMl = requireFiniteNonNegativeNumber(
    'reservedAdditiveVolumeMl',
    input.reservedAdditiveVolumeMl,
    errors,
  )

  if (errors.length > 0) return { ok: false, errors, warnings }

  const targetPct = d(targetGlucosePercent!)
  const basePct = d(baseGlucosePercent!)
  const additivePct = d(additiveGlucosePercent!)
  const burette = d(buretteSizeMl!)
  const reserved = d(reservedAdditiveVolumeMl!)

  if (reserved.gt(burette)) {
    return {
      ok: false,
      errors: [
        issue(
          'reservedAdditiveVolumeMl',
          'Reserved volume exceeds burette size.',
        ),
      ],
      warnings,
    }
  }

  if (additivePct.eq(basePct)) {
    return {
      ok: false,
      errors: [
        issue(
          'additiveGlucosePercent',
          'Additive glucose % must differ from base glucose %.',
        ),
      ],
      warnings,
    }
  }

  const minPct = DecimalMin(basePct, additivePct)
  const maxPct = DecimalMax(basePct, additivePct)
  if (targetPct.lt(minPct) || targetPct.gt(maxPct)) {
    return {
      ok: false,
      errors: [
        issue(
          'targetGlucosePercent',
          'Target glucose % must be between base and additive glucose %.',
        ),
      ],
      warnings,
    }
  }

  // Typical strengthening assumption: additive is the higher-strength solution.
  if (additivePct.lt(targetPct)) {
    return {
      ok: false,
      errors: [
        issue(
          'additiveGlucosePercent',
          'Additive glucose % must be greater than or equal to target glucose %.',
        ),
      ],
      warnings,
    }
  }

  const availableVolumeMl = burette.sub(reserved)

  const target = percentToGramsPerMl(targetGlucosePercent!)
  const base = percentToGramsPerMl(baseGlucosePercent!)
  const additive = percentToGramsPerMl(additiveGlucosePercent!)

  const additiveGlucoseVolumeMl = availableVolumeMl
    .mul(target.sub(base))
    .div(additive.sub(base))
  const baseGlucoseVolumeMl = availableVolumeMl.sub(additiveGlucoseVolumeMl)

  requireDecimalNonNegative('availableVolumeMl', availableVolumeMl, errors)
  requireDecimalNonNegative(
    'additiveGlucoseVolumeMl',
    additiveGlucoseVolumeMl,
    errors,
  )
  requireDecimalNonNegative('baseGlucoseVolumeMl', baseGlucoseVolumeMl, errors)

  if (errors.length > 0) return { ok: false, errors, warnings }

  // Concentration check: weighted average.
  const finalConcGPerMl = baseGlucoseVolumeMl
    .mul(base)
    .add(additiveGlucoseVolumeMl.mul(additive))
    .div(availableVolumeMl)
  const finalConcentrationCheckPercent = finalConcGPerMl.mul(100)

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Available volume (mL)',
      formula: 'buretteSizeMl − reservedAdditiveVolumeMl',
      substitution: `${burette.toString()} − ${reserved.toString()}`,
      exact: availableVolumeMl,
      unit: 'mL',
    },
    {
      label: 'Additive glucose volume (mL)',
      formula:
        '(availableVolume × (target − base)) ÷ (additive − base)  [all in g/mL]',
      substitution: `(${availableVolumeMl.toString()} × (${target.toString()} − ${base.toString()})) ÷ (${additive.toString()} − ${base.toString()})`,
      exact: additiveGlucoseVolumeMl,
      unit: 'mL',
    },
    {
      label: 'Base glucose volume (mL)',
      formula: 'availableVolume − additiveVolume',
      substitution: `${availableVolumeMl.toString()} − ${additiveGlucoseVolumeMl.toString()}`,
      exact: baseGlucoseVolumeMl,
      unit: 'mL',
    },
    {
      label: 'Final concentration check (%)',
      formula:
        '((baseVol×baseConc)+(addVol×addConc)) ÷ availableVol  [convert to %]',
      substitution: 'weighted average',
      exact: finalConcentrationCheckPercent,
      unit: '%',
    },
  ]

  const exact: GlucoseCalculatorExact = {
    availableVolumeMl,
    baseGlucoseVolumeMl,
    additiveGlucoseVolumeMl,
    finalConcentrationCheckPercent,
  }

  const additiveRounded = roundDecimalToString(additiveGlucoseVolumeMl, {
    dp: roundingDp,
  })
  const baseRounded = roundDecimalToString(baseGlucoseVolumeMl, { dp: roundingDp })

  return {
    ok: true,
    exact,
    breakdownSteps,
    finalInstruction: `In the remaining ${roundDecimalToString(availableVolumeMl, { dp: roundingDp })} mL: add ${additiveRounded} mL of ${additiveGlucosePercent}% glucose and ${baseRounded} mL of ${baseGlucosePercent}% glucose.`,
    warnings,
  }
}

function DecimalMin(a: ReturnType<typeof d>, b: ReturnType<typeof d>) {
  return a.lt(b) ? a : b
}

function DecimalMax(a: ReturnType<typeof d>, b: ReturnType<typeof d>) {
  return a.gt(b) ? a : b
}

