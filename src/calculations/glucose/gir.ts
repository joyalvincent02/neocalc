import { d } from '../shared/decimal'
import { issue, requireFinitePositiveNumber, type ValidationIssue } from '../shared/validation'

export type GirToPercentInput = {
  patientWeightKg: number
  infusionRateMlPerHour: number
  targetGirMgPerKgMin: number
}

export type GirToPercentResult =
  | { ok: true; targetGlucosePercent: number }
  | { ok: false; errors: ValidationIssue[] }

export type PercentToGirInput = {
  patientWeightKg: number
  infusionRateMlPerHour: number
  glucosePercent: number
}

export type PercentToGirResult =
  | { ok: true; girMgPerKgMin: number }
  | { ok: false; errors: ValidationIssue[] }

/**
 * Converts a GIR target (mg/kg/min) to a target glucose concentration (% w/v),
 * given patient weight (kg) and infusion rate (mL/hr).
 *
 * Derivation:
 * - GIR (mg/kg/min) × kg = mg/min
 * - mg/min × 60 = mg/hr
 * - mg/hr ÷ (mL/hr) = mg/mL
 * - % w/v here is treated as g/100mL, consistent with existing engine mapping:
 *   10% = 0.1 g/mL → % = (g/mL)×100 = (mg/mL / 1000)×100 = mg/mL ÷ 10
 * => target% = (GIR×kg×60 / rate) / 10 = GIR×kg×6 / rate
 */
export function computeTargetGlucosePercentFromGir(
  input: GirToPercentInput,
): GirToPercentResult {
  const errors: ValidationIssue[] = []
  const w = requireFinitePositiveNumber('patientWeightKg', input.patientWeightKg, errors)
  const rate = requireFinitePositiveNumber(
    'infusionRateMlPerHour',
    input.infusionRateMlPerHour,
    errors,
  )
  const gir = requireFinitePositiveNumber(
    'targetGirMgPerKgMin',
    input.targetGirMgPerKgMin,
    errors,
  )
  if (errors.length > 0) return { ok: false, errors }

  const targetPct = d(gir!).mul(w!).mul(6).div(rate!)
  if (!targetPct.isFinite() || targetPct.lte(0)) {
    return {
      ok: false,
      errors: [issue('targetGlucosePercent', 'Computed target glucose % is invalid.')],
    }
  }

  return { ok: true, targetGlucosePercent: targetPct.toNumber() }
}

/**
 * Converts a glucose concentration (%) to GIR (mg/kg/min).
 *
 * Using % as g/100mL:
 * - % -> g/mL = % / 100
 * - g/mL -> mg/mL = (%/100) * 1000 = % * 10
 * - mg/hr = mg/mL * (mL/hr)
 * - mg/kg/min = (mg/hr) / kg / 60
 */
export function computeGirFromGlucosePercent(
  input: PercentToGirInput,
): PercentToGirResult {
  const errors: ValidationIssue[] = []
  const w = requireFinitePositiveNumber('patientWeightKg', input.patientWeightKg, errors)
  const rate = requireFinitePositiveNumber(
    'infusionRateMlPerHour',
    input.infusionRateMlPerHour,
    errors,
  )
  const pct = requireFinitePositiveNumber('glucosePercent', input.glucosePercent, errors)
  if (errors.length > 0) return { ok: false, errors }

  const mgPerMl = d(pct!).mul(10)
  const mgPerHr = mgPerMl.mul(rate!)
  const gir = mgPerHr.div(w!).div(60)

  if (!gir.isFinite() || gir.lte(0)) {
    return { ok: false, errors: [issue('girMgPerKgMin', 'Computed GIR is invalid.')] }
  }

  return { ok: true, girMgPerKgMin: gir.toNumber() }
}

