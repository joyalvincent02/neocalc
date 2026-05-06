import { z } from 'zod'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'

const num = z.coerce.number().finite()

export const combinedFormSchema = z.object({
  buretteSizeMl: num.refine((n) => n > 0, 'Must be > 0.'),
  sodiumChlorideMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  potassiumChlorideMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  calciumGluconateMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
  targetGlucosePercent: num
    .refine((n) => n > 0, 'Must be > 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.glucosePercent.min &&
        n <= DEFAULT_PROTOCOL.ranges.glucosePercent.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.glucosePercent.min} and ${DEFAULT_PROTOCOL.ranges.glucosePercent.max}.`,
    ),
  baseGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  additiveGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
})

export type CombinedFormInput = z.input<typeof combinedFormSchema>
export type CombinedFormValues = z.output<typeof combinedFormSchema>

