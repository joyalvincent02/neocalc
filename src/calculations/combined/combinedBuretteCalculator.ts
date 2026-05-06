import { d } from '../shared/decimal'
import { roundDecimalToString } from '../shared/rounding'
import {
  issue,
  requireDecimalNonNegative,
  requireFinitePositiveNumber,
  type BreakdownStep,
  type ValidationIssue,
} from '../shared/validation'
import { calculateGlucoseStrengthening } from '../glucose/glucoseCalculator'
import type {
  CombinedBuretteExact,
  CombinedBuretteInput,
  CombinedBuretteResult,
  CombinedMixtureItemExact,
} from './combinedTypes'

export function calculateCombinedBurette(
  input: CombinedBuretteInput,
  roundingDp: number = 2,
): CombinedBuretteResult {
  const errors: ValidationIssue[] = []
  const warnings: string[] = []

  const buretteSizeMl = requireFinitePositiveNumber(
    'buretteSizeMl',
    input.buretteSizeMl,
    errors,
  )
  if (errors.length > 0) return { ok: false, errors, warnings }

  const burette = d(buretteSizeMl!)

  const reservedItems: CombinedMixtureItemExact[] = []
  let totalReserved = d(0)

  input.reservedAdditives.forEach((a, idx) => {
    if (!a.name.trim()) {
      errors.push(issue(`reservedAdditives[${idx}].name`, 'Name is required.'))
      return
    }
    if (!Number.isFinite(a.volumeMl) || a.volumeMl < 0) {
      errors.push(
        issue(`reservedAdditives[${idx}].volumeMl`, 'Must be 0 or greater.'),
      )
      return
    }
    const vol = d(a.volumeMl)
    reservedItems.push({ name: a.name, volumeMl: vol })
    totalReserved = totalReserved.add(vol)
  })

  requireDecimalNonNegative('totalReservedAdditivesMl', totalReserved, errors)
  if (totalReserved.gt(burette)) {
    errors.push(
      issue('reservedAdditives', 'Reserved additives exceed burette size.'),
    )
  }

  if (errors.length > 0) return { ok: false, errors, warnings }

  const glucose = calculateGlucoseStrengthening(
    {
      targetGlucosePercent: input.targetGlucosePercent,
      baseGlucosePercent: input.baseGlucosePercent,
      additiveGlucosePercent: input.additiveGlucosePercent,
      buretteSizeMl: buretteSizeMl!,
      reservedAdditiveVolumeMl: totalReserved.toNumber(),
    },
    roundingDp,
  )

  if (!glucose.ok) {
    return {
      ok: false,
      errors: glucose.errors.map((e) => ({
        path: `glucose.${e.path}`,
        message: e.message,
      })),
      warnings,
    }
  }

  const remainingVolumeForGlucoseMl = glucose.exact.availableVolumeMl
  const glucoseAdditiveVolumeMl = glucose.exact.additiveGlucoseVolumeMl
  const glucoseBaseVolumeMl = glucose.exact.baseGlucoseVolumeMl

  const finalVolumeCheckMl = totalReserved
    .add(glucoseAdditiveVolumeMl)
    .add(glucoseBaseVolumeMl)

  // Exact equality should hold because we carry Decimal through, but keep a guard.
  if (!finalVolumeCheckMl.eq(burette)) {
    errors.push(
      issue(
        'finalVolumeCheckMl',
        'Final mixture volumes do not sum to burette size.',
      ),
    )
    return { ok: false, errors, warnings }
  }

  const breakdownSteps: BreakdownStep[] = [
    {
      label: 'Total reserved additives (mL)',
      formula: 'sum(reservedAdditives.volumeMl)',
      substitution: input.reservedAdditives.length
        ? input.reservedAdditives.map((a) => String(a.volumeMl)).join(' + ')
        : '0',
      exact: totalReserved,
      unit: 'mL',
    },
    {
      label: 'Remaining volume for glucose (mL)',
      formula: 'buretteSizeMl − totalReservedAdditivesMl',
      substitution: `${burette.toString()} − ${totalReserved.toString()}`,
      exact: remainingVolumeForGlucoseMl,
      unit: 'mL',
    },
    ...glucose.breakdownSteps.map((s) => ({
      ...s,
      label: `Glucose: ${s.label}`,
    })),
  ]

  const mixtureItems: CombinedMixtureItemExact[] = [
    ...reservedItems,
    {
      name: `${input.additiveGlucosePercent}% glucose`,
      volumeMl: glucoseAdditiveVolumeMl,
    },
    {
      name: `${input.baseGlucosePercent}% glucose`,
      volumeMl: glucoseBaseVolumeMl,
    },
  ]

  const lines = mixtureItems.map(
    (m) => `- ${roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL ${m.name}`,
  )

  const exact: CombinedBuretteExact = {
    totalReservedAdditivesMl: totalReserved,
    remainingVolumeForGlucoseMl,
    glucoseAdditiveVolumeMl,
    glucoseBaseVolumeMl,
    finalVolumeCheckMl,
  }

  return {
    ok: true,
    exact,
    mixtureItems,
    breakdownSteps,
    finalInstruction: `Add:\n${lines.join('\n')}`,
    warnings,
  }
}

