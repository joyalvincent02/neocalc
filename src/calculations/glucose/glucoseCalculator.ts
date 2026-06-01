import { d } from '../shared/decimal'
import { formatExactForDisplay, roundDecimalToString } from '../shared/rounding'
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

  const fd = formatExactForDisplay

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Step 1 — Available mixing volume',
      formula: 'buretteSizeMl − reservedAdditiveVolumeMl',
      substitution: `${fd(burette)} − ${fd(reserved)}`,
      exact: availableVolumeMl,
      unit: 'mL',
      latexFormula: 'V_{\\text{avail}} = V_{\\text{burette}} - V_{\\text{reserved}}',
      latexSubstitution: `V_{\\text{avail}} = ${fd(burette)} - ${fd(reserved)}`,
    },
    {
      label: 'Step 2 — Target glucose (g per 100 mL)',
      formula: 'targetGlucosePercent  [g per 100 mL]',
      substitution: `${fd(targetGramsPer100ml)} g / 100 mL`,
      exact: targetGramsPer100ml,
      unit: 'g / 100 mL',
      latexFormula: 'G_{\\text{target}} = \\text{target\\%} \\;[\\text{g per 100 mL}]',
      latexSubstitution: `G_{\\text{target}} = ${fd(targetGramsPer100ml)} \\text{ g per 100 mL}`,
    },
    {
      label: 'Step 3 — Required concentration in available volume',
      formula: 'targetGramsPer100mL ÷ availableVolumeMl',
      substitution: `${fd(targetGramsPer100ml)} ÷ ${fd(availableVolumeMl)}`,
      exact: requiredGramsPerMl,
      unit: 'g / mL',
      latexFormula: 'C_{\\text{req}} = \\dfrac{G_{\\text{target}}}{V_{\\text{avail}}}',
      latexSubstitution: `C_{\\text{req}} = \\dfrac{${fd(targetGramsPer100ml)}}{${fd(availableVolumeMl)}}`,
    },
    {
      label: `Step 4a — Base stock (${baseGlucosePercent}%) in g/mL`,
      formula: 'baseGlucosePercent ÷ 100',
      substitution: `${fd(basePct)} ÷ 100`,
      exact: baseGPerMl,
      unit: 'g / mL',
      latexFormula: 'C_{\\text{base}} = \\dfrac{\\text{base\\%}}{100}',
      latexSubstitution: `C_{\\text{base}} = \\dfrac{${fd(basePct)}}{100}`,
    },
    {
      label: `Step 4b — Additive stock (${additiveGlucosePercent}%) in g/mL`,
      formula: 'additiveGlucosePercent ÷ 100',
      substitution: `${fd(additivePct)} ÷ 100`,
      exact: additiveGPerMl,
      unit: 'g / mL',
      latexFormula: 'C_{\\text{add}} = \\dfrac{\\text{add\\%}}{100}',
      latexSubstitution: `C_{\\text{add}} = \\dfrac{${fd(additivePct)}}{100}`,
    },
    {
      label: `Step 5a — Additive quota (${additiveGlucosePercent}% side)`,
      formula: 'requiredGramsPerMl − baseGPerMl',
      substitution: `${fd(requiredGramsPerMl)} − ${fd(baseGPerMl)}`,
      exact: additiveQuota,
      unit: 'g / mL',
      latexFormula: 'Q_{\\text{add}} = C_{\\text{req}} - C_{\\text{base}}',
      latexSubstitution: `Q_{\\text{add}} = ${fd(requiredGramsPerMl)} - ${fd(baseGPerMl)}`,
    },
    {
      label: `Step 5b — Base quota (${baseGlucosePercent}% side)`,
      formula: 'additiveGPerMl − requiredGramsPerMl',
      substitution: `${fd(additiveGPerMl)} − ${fd(requiredGramsPerMl)}`,
      exact: baseQuota,
      unit: 'g / mL',
      latexFormula: 'Q_{\\text{base}} = C_{\\text{add}} - C_{\\text{req}}',
      latexSubstitution: `Q_{\\text{base}} = ${fd(additiveGPerMl)} - ${fd(requiredGramsPerMl)}`,
    },
    {
      label: 'Step 6 — Total quota',
      formula: 'additiveQuota + baseQuota',
      substitution: `${fd(additiveQuota)} + ${fd(baseQuota)}`,
      exact: totalQuota,
      unit: 'g / mL',
      latexFormula: 'Q_{\\text{total}} = Q_{\\text{add}} + Q_{\\text{base}}',
      latexSubstitution: `Q_{\\text{total}} = ${fd(additiveQuota)} + ${fd(baseQuota)}`,
    },
    {
      label: `Step 7a — Additive ratio (${additiveGlucosePercent}%)`,
      formula: 'additiveQuota ÷ totalQuota',
      substitution: `${fd(additiveQuota)} ÷ ${fd(totalQuota)}`,
      exact: additiveRatio,
      latexFormula: 'r_{\\text{add}} = \\dfrac{Q_{\\text{add}}}{Q_{\\text{total}}}',
      latexSubstitution: `r_{\\text{add}} = \\dfrac{${fd(additiveQuota)}}{${fd(totalQuota)}}`,
    },
    {
      label: `Step 7b — Base ratio (${baseGlucosePercent}%)`,
      formula: 'baseQuota ÷ totalQuota',
      substitution: `${fd(baseQuota)} ÷ ${fd(totalQuota)}`,
      exact: baseRatio,
      latexFormula: 'r_{\\text{base}} = \\dfrac{Q_{\\text{base}}}{Q_{\\text{total}}}',
      latexSubstitution: `r_{\\text{base}} = \\dfrac{${fd(baseQuota)}}{${fd(totalQuota)}}`,
    },
    {
      label: `Step 8a — Additive volume (${additiveGlucosePercent}%)`,
      formula: 'additiveRatio × availableVolumeMl',
      substitution: `${fd(additiveRatio)} × ${fd(availableVolumeMl)}`,
      exact: additiveGlucoseVolumeMl,
      unit: 'mL',
      latexFormula: 'V_{\\text{add}} = r_{\\text{add}} \\times V_{\\text{avail}}',
      latexSubstitution: `V_{\\text{add}} = ${fd(additiveRatio)} \\times ${fd(availableVolumeMl)}`,
    },
    {
      label: `Step 8b — Base volume (${baseGlucosePercent}%)`,
      formula: 'baseRatio × availableVolumeMl',
      substitution: `${fd(baseRatio)} × ${fd(availableVolumeMl)}`,
      exact: baseGlucoseVolumeMl,
      unit: 'mL',
      latexFormula: 'V_{\\text{base}} = r_{\\text{base}} \\times V_{\\text{avail}}',
      latexSubstitution: `V_{\\text{base}} = ${fd(baseRatio)} \\times ${fd(availableVolumeMl)}`,
    },
    {
      label: 'Final concentration check (full burette)',
      formula: '(addVol × addGPerMl + baseVol × baseGPerMl) ÷ buretteSizeMl × 100',
      substitution: `(${roundDecimalToString(additiveGlucoseVolumeMl, { dp: roundingDp })} × ${fd(additiveGPerMl)} + ${roundDecimalToString(baseGlucoseVolumeMl, { dp: roundingDp })} × ${fd(baseGPerMl)}) ÷ ${fd(burette)} × 100`,
      exact: finalConcentrationCheckPercent,
      unit: '%',
      latexFormula: 'C_{\\text{check}} = \\dfrac{V_{\\text{add}} \\cdot C_{\\text{add}} + V_{\\text{base}} \\cdot C_{\\text{base}}}{V_{\\text{burette}}} \\times 100',
      latexSubstitution: `C_{\\text{check}} = \\dfrac{${roundDecimalToString(additiveGlucoseVolumeMl, { dp: roundingDp })} \\times ${fd(additiveGPerMl)} + ${roundDecimalToString(baseGlucoseVolumeMl, { dp: roundingDp })} \\times ${fd(baseGPerMl)}}{${fd(burette)}} \\times 100`,
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

