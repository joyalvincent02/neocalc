import { z } from 'zod'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'

const num = z.coerce.number().finite()

export const combinedFormSchema = z.object({
  buretteSizeMl: num.refine((n) => n > 0, 'Must be > 0.'),
  patientWeightKg: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.weightKg.min &&
        n <= DEFAULT_PROTOCOL.ranges.weightKg.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.weightKg.min} and ${DEFAULT_PROTOCOL.ranges.weightKg.max}.`,
    ),
  infusionRateMlPerHour: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min &&
        n <= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min} and ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max}.`,
    ),
  targetGirMgPerKgMin: num.refine((n) => n > 0, 'Must be greater than 0.'),
  sodiumChlorideMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  potassiumChlorideMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  calciumGluconateMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  baseGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  additiveGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
})

export type CombinedFormInput = z.input<typeof combinedFormSchema>
export type CombinedFormValues = z.output<typeof combinedFormSchema>

