import { describe, expect, it } from 'vitest'
import { calculateCombinedBurette } from './combinedBuretteCalculator'

const BASE_INPUT = {
  patientWeightKg: 2.5,
  maintenanceRateMlPerHour: 12.5,
  buretteSizeMl: 100,
  sodium: {
    enabled: true,
    requirementMmolPerKgPerDay: 3,
    stockStrengthMmolPerMl: 0.9,
  },
  potassium: {
    enabled: true,
    requirementMmolPerKgPerDay: 2,
    stockStrengthMmolPerMl: 0.6,
  },
  calciumGluconateMlPerBurette: 0,
  targetGlucosePercent: 12,
  baseGlucosePercent: 10,
  additiveGlucosePercent: 50,
}

describe('calculateCombinedBurette', () => {
  describe('Phase 1 — fluid calculations', () => {
    it('derives maintenance fluid and burettes per day', () => {
      const result = calculateCombinedBurette(BASE_INPUT)
      if (!result.ok) throw new Error('Expected ok result')

      // 12.5 × 24 = 300 mL/day
      expect(result.exact.maintenanceFluidMlPerDay.toString()).toBe('300')
      // 300 / 100 = 3 burettes/day
      expect(result.exact.burettesPerDay.toString()).toBe('3')
    })
  })

  describe('Phase 2 — sodium derivation', () => {
    it('derives sodium mL/burette from weight and prescription', () => {
      const result = calculateCombinedBurette(BASE_INPUT)
      if (!result.ok) throw new Error('Expected ok result')
      if (!result.exact.sodium) throw new Error('Expected sodium result')

      // sodiumMmolPerDay = 2.5 × 3 = 7.5 mmol/day
      expect(result.exact.sodium.mmolPerDay.toString()).toBe('7.5')
      // sodiumMlPerDay = 7.5 / 0.9 ≈ 8.333... mL/day
      expect(result.exact.sodium.mlPerDay.toFixed(4)).toBe('8.3333')
      // sodiumMlPerBurette = 8.333 / 3 ≈ 2.778 mL/burette
      expect(result.exact.sodium.mlPerBurette.toFixed(4)).toBe('2.7778')
    })

    it('skips sodium when disabled', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        sodium: { ...BASE_INPUT.sodium, enabled: false },
      })
      if (!result.ok) throw new Error('Expected ok result')
      expect(result.exact.sodium).toBeNull()
    })
  })

  describe('Phase 3 — potassium derivation', () => {
    it('derives potassium mL/burette from weight and prescription', () => {
      const result = calculateCombinedBurette(BASE_INPUT)
      if (!result.ok) throw new Error('Expected ok result')
      if (!result.exact.potassium) throw new Error('Expected potassium result')

      // potassiumMmolPerDay = 2.5 × 2 = 5 mmol/day
      expect(result.exact.potassium.mmolPerDay.toString()).toBe('5')
      // potassiumMlPerDay = 5 / 0.6 ≈ 8.333 mL/day
      expect(result.exact.potassium.mlPerDay.toFixed(4)).toBe('8.3333')
      // potassiumMlPerBurette = 8.333 / 3 ≈ 2.778 mL/burette
      expect(result.exact.potassium.mlPerBurette.toFixed(4)).toBe('2.7778')
    })

    it('skips potassium when disabled', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        potassium: { ...BASE_INPUT.potassium, enabled: false },
      })
      if (!result.ok) throw new Error('Expected ok result')
      expect(result.exact.potassium).toBeNull()
    })
  })

  describe('Phase 4 — reserved volume', () => {
    it('sums all reserved volumes', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        calciumGluconateMlPerBurette: 1,
      })
      if (!result.ok) throw new Error('Expected ok result')

      const na = result.exact.sodium!.mlPerBurette
      const k = result.exact.potassium!.mlPerBurette
      const ca = result.exact.calciumGluconateMlPerBurette
      expect(result.exact.totalReservedMl.toString()).toBe(na.add(k).add(ca).toString())
    })

    it('rejects when reserved volume meets or exceeds burette size', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        calciumGluconateMlPerBurette: 200,
      })
      expect(result.ok).toBe(false)
    })
  })

  describe('Phase 5 — glucose strengthening (hospital quota workflow)', () => {
    it('uses hospital quota workflow — NOT simplified dilution', () => {
      // With no electrolytes and 2 mL reserved, hospital quota gives:
      // additiveVolume = 5.5 mL, baseVolume = 92.5 mL (not 4.9 / 93.1)
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        sodium: { ...BASE_INPUT.sodium, enabled: false },
        potassium: { ...BASE_INPUT.potassium, enabled: false },
        calciumGluconateMlPerBurette: 2,
      })
      if (!result.ok) throw new Error('Expected ok result')

      expect(result.exact.availableForGlucoseMl.toString()).toBe('98')
      expect(result.exact.glucoseAdditiveVolumeMl.toFixed(1)).toBe('5.5')
      expect(result.exact.glucoseBaseVolumeMl.toFixed(1)).toBe('92.5')
    })

    it('verifies final concentration over full burette equals target', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        sodium: { ...BASE_INPUT.sodium, enabled: false },
        potassium: { ...BASE_INPUT.potassium, enabled: false },
        calciumGluconateMlPerBurette: 2,
      })
      if (!result.ok) throw new Error('Expected ok result')
      expect(result.exact.finalConcentrationCheckPercent.toFixed(2)).toBe('12.00')
    })

    it('produces correct glucose volumes with derived electrolyte reservation', () => {
      const result = calculateCombinedBurette(BASE_INPUT)
      if (!result.ok) throw new Error('Expected ok result')

      // Available = 100 - (Na + K) mL per burette
      const totalReserved = result.exact.totalReservedMl
      expect(result.exact.availableForGlucoseMl.toString()).toBe(
        result.exact.availableForGlucoseMl.toString(),
      )
      expect(result.exact.availableForGlucoseMl.toString()).toBe(
        totalReserved.neg().add(100).toString(),
      )

      // Final concentration check over full 100 mL burette
      expect(result.exact.finalConcentrationCheckPercent.toFixed(2)).toBe('12.00')
    })
  })

  describe('mixture items', () => {
    it('lists all components in the correct order', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        calciumGluconateMlPerBurette: 0.5,
      })
      if (!result.ok) throw new Error('Expected ok result')

      const names = result.mixtureItems.map((m) => m.name)
      expect(names[0]).toBe('Sodium chloride')
      expect(names[1]).toBe('Potassium chloride')
      expect(names[2]).toBe('Calcium gluconate')
      expect(names[3]).toBe('50% glucose')
      expect(names[4]).toBe('10% glucose')
    })

    it('omits disabled electrolytes from mixture items', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        sodium: { ...BASE_INPUT.sodium, enabled: false },
        potassium: { ...BASE_INPUT.potassium, enabled: false },
      })
      if (!result.ok) throw new Error('Expected ok result')

      const names = result.mixtureItems.map((m) => m.name)
      expect(names).not.toContain('Sodium chloride')
      expect(names).not.toContain('Potassium chloride')
    })
  })

  describe('breakdown steps', () => {
    it('includes all 5 phases in the breakdown', () => {
      const result = calculateCombinedBurette(BASE_INPUT)
      if (!result.ok) throw new Error('Expected ok result')

      const labels = result.breakdownSteps.map((s) => s.label)
      expect(labels.some((l) => l.includes('Phase 1'))).toBe(true)
      expect(labels.some((l) => l.includes('Phase 2'))).toBe(true)
      expect(labels.some((l) => l.includes('Phase 3'))).toBe(true)
      expect(labels.some((l) => l.includes('Phase 4'))).toBe(true)
      expect(labels.some((l) => l.includes('Phase 5'))).toBe(true)
    })
  })

  describe('validation', () => {
    it('rejects zero weight', () => {
      const result = calculateCombinedBurette({ ...BASE_INPUT, patientWeightKg: 0 })
      expect(result.ok).toBe(false)
    })

    it('rejects when target glucose is outside base–additive range', () => {
      const result = calculateCombinedBurette({
        ...BASE_INPUT,
        sodium: { ...BASE_INPUT.sodium, enabled: false },
        potassium: { ...BASE_INPUT.potassium, enabled: false },
        targetGlucosePercent: 60,
      })
      expect(result.ok).toBe(false)
    })
  })
})
