import { describe, expect, it } from 'vitest'
import { calculateGlucoseStrengthening } from './glucoseCalculator'

describe('calculateGlucoseStrengthening', () => {
  /**
   * Hospital document reference example:
   *   target 12%, base 10%, additive 50%, burette 100 mL, reserved 2 mL
   *
   * Step 1: availableVolume = 100 - 2 = 98 mL
   * Step 3: requiredGPerMl  = 12 / 98 ≈ 0.12245 g/mL
   * Step 5: additiveQuota   = 0.12245 - 0.10 ≈ 0.02245
   *         baseQuota       = 0.50 - 0.12245 ≈ 0.37755
   * Step 6: totalQuota      = 0.4
   * Step 7: additiveRatio   = 0.02245 / 0.4 ≈ 0.05612
   *         baseRatio       = 0.37755 / 0.4 ≈ 0.94388
   * Step 8: additiveVolume  = 0.05612 × 98 = 5.5 mL
   *         baseVolume      = 0.94388 × 98 = 92.5 mL
   * Check:  (5.5×0.5 + 92.5×0.1) / 100 × 100 = 12%
   */
  it('matches hospital document reference example', () => {
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 2,
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.availableVolumeMl.toString()).toBe('98')
    expect(result.exact.additiveGlucoseVolumeMl.toFixed(1)).toBe('5.5')
    expect(result.exact.baseGlucoseVolumeMl.toFixed(1)).toBe('92.5')

    // Final check: glucose delivered over the full 100 mL burette equals target
    expect(result.exact.finalConcentrationCheckPercent.toFixed(2)).toBe('12.00')
  })

  it('produces correct volumes with no reserved volume', () => {
    // With reservedVolume = 0, availableVolume = buretteSize,
    // and the quota formula reduces to the standard dilution equation.
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 0,
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.availableVolumeMl.toString()).toBe('100')
    // additiveVolume = (12/100 - 10/100) / (50/100 - 10/100) × 100 = 5 mL
    expect(result.exact.additiveGlucoseVolumeMl.toFixed(2)).toBe('5.00')
    expect(result.exact.baseGlucoseVolumeMl.toFixed(2)).toBe('95.00')
    expect(result.exact.finalConcentrationCheckPercent.toFixed(2)).toBe('12.00')
  })

  it('returns breakdown steps matching the 8-step hospital workflow', () => {
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 2,
    })

    if (!result.ok) throw new Error('Expected ok result')

    const labels = result.breakdownSteps.map((s) => s.label)
    expect(labels[0]).toMatch(/Step 1/)
    expect(labels[1]).toMatch(/Step 2/)
    expect(labels[2]).toMatch(/Step 3/)
    expect(labels[3]).toMatch(/Step 4a/)
    expect(labels[4]).toMatch(/Step 4b/)
    expect(labels[5]).toMatch(/Step 5a/)
    expect(labels[6]).toMatch(/Step 5b/)
    expect(labels[7]).toMatch(/Step 6/)
    expect(labels[8]).toMatch(/Step 7a/)
    expect(labels[9]).toMatch(/Step 7b/)
    expect(labels[10]).toMatch(/Step 8a/)
    expect(labels[11]).toMatch(/Step 8b/)
  })

  it('rejects when reserved volume exceeds burette size', () => {
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 110,
    })
    expect(result.ok).toBe(false)
  })

  it('rejects when target is outside base–additive range', () => {
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 60,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 0,
    })
    expect(result.ok).toBe(false)
  })
})
