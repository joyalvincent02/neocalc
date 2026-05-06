import { describe, expect, it } from 'vitest'
import { computeTargetGlucosePercentFromGir } from './gir'

describe('computeTargetGlucosePercentFromGir', () => {
  it('computes target % from GIR, weight, and infusion rate', () => {
    // Example: GIR 6 mg/kg/min, weight 2.5 kg, rate 12.5 mL/hr
    // target% = 6 * 2.5 * 6 / 12.5 = 7.2%
    const r = computeTargetGlucosePercentFromGir({
      patientWeightKg: 2.5,
      infusionRateMlPerHour: 12.5,
      targetGirMgPerKgMin: 6,
    })
    if (!r.ok) throw new Error('Expected ok')
    expect(r.targetGlucosePercent).toBeCloseTo(7.2, 10)
  })
})

