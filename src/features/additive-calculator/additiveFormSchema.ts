import { z } from 'zod'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'

const num = z.coerce.number().finite()

export const additiveFormSchema = z.object({
  patientWeightKg: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.weightKg.min &&
        n <= DEFAULT_PROTOCOL.ranges.weightKg.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.weightKg.min} and ${DEFAULT_PROTOCOL.ranges.weightKg.max}.`,
    ),
  requiredMmolPerKgPerDay: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.requiredMmolPerKgPerDay.min &&
        n <= DEFAULT_PROTOCOL.ranges.requiredMmolPerKgPerDay.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.requiredMmolPerKgPerDay.min} and ${DEFAULT_PROTOCOL.ranges.requiredMmolPerKgPerDay.max}.`,
    ),
  stockStrengthMmolPerMl: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.stockStrengthMmolPerMl.min &&
        n <= DEFAULT_PROTOCOL.ranges.stockStrengthMmolPerMl.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.stockStrengthMmolPerMl.min} and ${DEFAULT_PROTOCOL.ranges.stockStrengthMmolPerMl.max}.`,
    ),
  maintenanceRateMlPerHour: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min &&
        n <= DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min} and ${DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.max}.`,
    ),
  buretteSizeMl: num.refine((n) => n > 0, 'Must be greater than 0.'),
  additiveName: z.string().min(1, 'Required.'),
  baseFluidName: z.string().min(1, 'Required.'),
})

export type AdditiveFormInput = z.input<typeof additiveFormSchema>
export type AdditiveFormValues = z.output<typeof additiveFormSchema>

