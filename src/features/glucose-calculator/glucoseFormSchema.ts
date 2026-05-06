import { z } from 'zod'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'

const num = z.coerce.number().finite()

export const glucoseFormSchema = z.object({
  targetGlucosePercent: num
    .refine((n) => n > 0, 'Must be greater than 0.')
    .refine(
      (n) =>
        n >= DEFAULT_PROTOCOL.ranges.glucosePercent.min &&
        n <= DEFAULT_PROTOCOL.ranges.glucosePercent.max,
      `Must be between ${DEFAULT_PROTOCOL.ranges.glucosePercent.min} and ${DEFAULT_PROTOCOL.ranges.glucosePercent.max}.`,
    ),
  baseGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  additiveGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  buretteSizeMl: num.refine((n) => n > 0, 'Must be > 0.'),
  reservedAdditiveVolumeMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
})

export type GlucoseFormInput = z.input<typeof glucoseFormSchema>
export type GlucoseFormValues = z.output<typeof glucoseFormSchema>

