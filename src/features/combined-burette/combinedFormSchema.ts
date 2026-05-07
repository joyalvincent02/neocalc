import { z } from 'zod'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'

const num = z.coerce.number().finite()
const pos = num.refine((n) => n > 0, 'Must be greater than 0.')
const nonNeg = num.refine((n) => n >= 0, 'Must be ≥ 0.')

export const combinedFormSchema = z.object({
  patientWeightKg: pos.refine(
    (n) =>
      n >= DEFAULT_PROTOCOL.ranges.weightKg.min &&
      n <= DEFAULT_PROTOCOL.ranges.weightKg.max,
    `Must be between ${DEFAULT_PROTOCOL.ranges.weightKg.min} and ${DEFAULT_PROTOCOL.ranges.weightKg.max} kg.`,
  ),
  maintenanceRateMlPerHour: pos.refine(
    (n) =>
      n >= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min &&
      n <= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max,
    `Must be between ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min} and ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max} mL/hr.`,
  ),
  buretteSizeMl: pos,

  sodiumEnabled: z.boolean(),
  sodiumRequirementMmolPerKgPerDay: pos,
  sodiumStockStrengthMmolPerMl: pos,

  potassiumEnabled: z.boolean(),
  potassiumRequirementMmolPerKgPerDay: pos,
  potassiumStockStrengthMmolPerMl: pos,

  calciumGluconateMlPerBurette: nonNeg,

  targetGlucosePercent: pos,
  baseGlucosePercent: pos,
  additiveGlucosePercent: pos,
})

export type CombinedFormInput = z.input<typeof combinedFormSchema>
export type CombinedFormValues = z.output<typeof combinedFormSchema>
