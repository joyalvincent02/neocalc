import { describe, expect, it } from 'vitest'
import { calculateAdditive } from './additiveCalculator'

describe('calculateAdditive', () => {
  it('matches required sodium example (2.5 kg case)', () => {
    const result = calculateAdditive({
      patientWeightKg: 2.5,
      requiredMmolPerKgPerDay: 4,
      stockStrengthMmolPerMl: 4,
      maintenanceRateMlPerHour: 12.5,
      buretteSizeMl: 100,
      additiveName: 'Sodium chloride',
      baseFluidName: 'Base fluid',
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.totalRequirementMmolPerDay.toString()).toBe('10')
    expect(result.exact.additiveMlPerDay.toString()).toBe('2.5')
    expect(result.exact.maintenanceFluidMlPerDay.toString()).toBe('300')
    expect(result.exact.burettesPerDay.toString()).toBe('3')

    expect(result.exact.additiveMlPerBurette.toFixed(2)).toBe('0.83')
    expect(result.exact.baseFluidMlPerBurette.toFixed(2)).toBe('99.17')
  })

  it('matches required sodium example (1.75 kg case)', () => {
    const result = calculateAdditive({
      patientWeightKg: 1.75,
      requiredMmolPerKgPerDay: 4,
      stockStrengthMmolPerMl: 4,
      maintenanceRateMlPerHour: 5.83,
      buretteSizeMl: 100,
      additiveName: 'Sodium chloride',
      baseFluidName: 'Base fluid',
    })

    if (!result.ok) throw new Error('Expected ok result')

    expect(result.exact.totalRequirementMmolPerDay.toFixed(2)).toBe('7.00')
    expect(result.exact.additiveMlPerDay.toFixed(2)).toBe('1.75')
    expect(result.exact.maintenanceFluidMlPerDay.toFixed(2)).toBe('139.92')
    expect(result.exact.burettesPerDay.toFixed(3)).toBe('1.399')

    expect(result.exact.additiveMlPerBurette.toFixed(2)).toBe('1.25')
    expect(result.exact.baseFluidMlPerBurette.toFixed(2)).toBe('98.75')
  })
})

