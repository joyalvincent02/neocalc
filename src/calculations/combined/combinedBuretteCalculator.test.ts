import { describe, expect, it } from 'vitest'
import { calculateCombinedBurette } from './combinedBuretteCalculator'

describe('calculateCombinedBurette', () => {
  it('reserves additives then matches glucose example volumes', () => {
    const result = calculateCombinedBurette({
      buretteSizeMl: 100,
      reservedAdditives: [{ name: 'Electrolytes (reserved)', volumeMl: 2 }],
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.totalReservedAdditivesMl.toString()).toBe('2')
    expect(result.exact.remainingVolumeForGlucoseMl.toString()).toBe('98')
    expect(result.exact.glucoseBaseVolumeMl.toFixed(1)).toBe('93.1')
    expect(result.exact.glucoseAdditiveVolumeMl.toFixed(1)).toBe('4.9')
    expect(result.exact.finalVolumeCheckMl.toString()).toBe('100')

    const names = result.mixtureItems.map((m) => m.name)
    expect(names).toContain('Electrolytes (reserved)')
    expect(names).toContain('50% glucose')
    expect(names).toContain('10% glucose')
  })
})

