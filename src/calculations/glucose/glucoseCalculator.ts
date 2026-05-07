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

  // Step 1: Available mixing volume after electrolyte/additive displacement.
  const availableVolumeMl = burette.sub(reserved)

  // Step 2: Target glucose expressed as grams per 100 mL (numerically equal to the % value).
  const targetGramsPer100ml = targetPct

  // Step 3: Required g/mL in the available mixing volume.
  // Dividing by availableVolumeMl (not buretteSize) scales the concentration upward
  // so that the completed burette (including reserved volume) delivers the target %.
  const requiredGramsPerMl = targetGramsPer100ml.div(availableVolumeMl)

  // Step 4: Convert stock concentrations to g/mL.
  const baseGPerMl = basePct.div(100)
  const additiveGPerMl = additivePct.div(100)

  // Step 5: Quotas (proportional pull from each stock towards the required concentration).
  const additiveQuota = requiredGramsPerMl.sub(baseGPerMl)
  const baseQuota = additiveGPerMl.sub(requiredGramsPerMl)

  // Step 6: Total quota.
  const totalQuota = additiveQuota.add(baseQuota)

  // Step 7: Volume ratios.
  const additiveRatio = additiveQuota.div(totalQuota)
  const baseRatio = baseQuota.div(totalQuota)

  // Step 8: Final volumes.
  const additiveGlucoseVolumeMl = additiveRatio.mul(availableVolumeMl)
  const baseGlucoseVolumeMl = baseRatio.mul(availableVolumeMl)

  requireDecimalNonNegative('availableVolumeMl', availableVolumeMl, errors)
  requireDecimalNonNegative('additiveGlucoseVolumeMl', additiveGlucoseVolumeMl, errors)
  requireDecimalNonNegative('baseGlucoseVolumeMl', baseGlucoseVolumeMl, errors)

  if (errors.length > 0) return { ok: false, errors, warnings }

  // Final concentration check over the complete burette (including reserved volume).
  const totalGlucoseGrams = baseGlucoseVolumeMl
    .mul(baseGPerMl)
    .add(additiveGlucoseVolumeMl.mul(additiveGPerMl))
  const finalConcentrationCheckPercent = totalGlucoseGrams.div(burette).mul(100)

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Step 1 — Available mixing volume',
      formula: 'buretteSizeMl − reservedAdditiveVolumeMl',
      substitution: `${burette.toString()} − ${reserved.toString()}`,
      exact: availableVolumeMl,
      unit: 'mL',
    },
    {
      label: 'Step 2 — Target glucose (g per 100 mL)',
      formula: 'targetGlucosePercent  [g per 100 mL]',
      substitution: `${targetGramsPer100ml.toString()} g / 100 mL`,
      exact: targetGramsPer100ml,
      unit: 'g / 100 mL',
    },
    {
      label: 'Step 3 — Required concentration in available volume',
      formula: 'targetGramsPer100mL ÷ availableVolumeMl',
      substitution: `${targetGramsPer100ml.toString()} ÷ ${availableVolumeMl.toString()}`,
      exact: requiredGramsPerMl,
      unit: 'g / mL',
    },
    {
      label: `Step 4a — Base stock (${baseGlucosePercent}%) in g/mL`,
      formula: 'baseGlucosePercent ÷ 100',
      substitution: `${basePct.toString()} ÷ 100`,
      exact: baseGPerMl,
      unit: 'g / mL',
    },
    {
      label: `Step 4b — Additive stock (${additiveGlucosePercent}%) in g/mL`,
      formula: 'additiveGlucosePercent ÷ 100',
      substitution: `${additivePct.toString()} ÷ 100`,
      exact: additiveGPerMl,
      unit: 'g / mL',
    },
    {
      label: `Step 5a — Additive quota (${additiveGlucosePercent}% side)`,
      formula: 'requiredGramsPerMl − baseGPerMl',
      substitution: `${requiredGramsPerMl.toString()} − ${baseGPerMl.toString()}`,
      exact: additiveQuota,
      unit: 'g / mL',
    },
    {
      label: `Step 5b — Base quota (${baseGlucosePercent}% side)`,
      formula: 'additiveGPerMl − requiredGramsPerMl',
      substitution: `${additiveGPerMl.toString()} − ${requiredGramsPerMl.toString()}`,
      exact: baseQuota,
      unit: 'g / mL',
    },
    {
      label: 'Step 6 — Total quota',
      formula: 'additiveQuota + baseQuota',
      substitution: `${additiveQuota.toString()} + ${baseQuota.toString()}`,
      exact: totalQuota,
      unit: 'g / mL',
    },
    {
      label: `Step 7a — Additive ratio (${additiveGlucosePercent}%)`,
      formula: 'additiveQuota ÷ totalQuota',
      substitution: `${additiveQuota.toString()} ÷ ${totalQuota.toString()}`,
      exact: additiveRatio,
    },
    {
      label: `Step 7b — Base ratio (${baseGlucosePercent}%)`,
      formula: 'baseQuota ÷ totalQuota',
      substitution: `${baseQuota.toString()} ÷ ${totalQuota.toString()}`,
      exact: baseRatio,
    },
    {
      label: `Step 8a — Additive volume (${additiveGlucosePercent}%)`,
      formula: 'additiveRatio × availableVolumeMl',
      substitution: `${additiveRatio.toString()} × ${availableVolumeMl.toString()}`,
      exact: additiveGlucoseVolumeMl,
      unit: 'mL',
    },
    {
      label: `Step 8b — Base volume (${baseGlucosePercent}%)`,
      formula: 'baseRatio × availableVolumeMl',
      substitution: `${baseRatio.toString()} × ${availableVolumeMl.toString()}`,
      exact: baseGlucoseVolumeMl,
      unit: 'mL',
    },
    {
      label: 'Final concentration check (full burette)',
      formula: '(addVol × addGPerMl + baseVol × baseGPerMl) ÷ buretteSizeMl × 100',
      substitution: `(${roundDecimalToString(additiveGlucoseVolumeMl, { dp: roundingDp })} × ${additiveGPerMl.toString()} + ${roundDecimalToString(baseGlucoseVolumeMl, { dp: roundingDp })} × ${baseGPerMl.toString()}) ÷ ${burette.toString()} × 100`,
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

