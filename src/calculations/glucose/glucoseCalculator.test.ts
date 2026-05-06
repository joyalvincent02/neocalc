import { describe, expect, it } from 'vitest'
import { calculateGlucoseStrengthening } from './glucoseCalculator'

describe('calculateGlucoseStrengthening', () => {
  it('matches required glucose example', () => {
    const result = calculateGlucoseStrengthening({
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 2,
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.availableVolumeMl.toString()).toBe('98')
    expect(result.exact.baseGlucoseVolumeMl.toFixed(1)).toBe('93.1')
    expect(result.exact.additiveGlucoseVolumeMl.toFixed(1)).toBe('4.9')

    // sanity: final concentration check should equal target (within rounding)
    expect(result.exact.finalConcentrationCheckPercent.toFixed(2)).toBe('12.00')
  })
})

