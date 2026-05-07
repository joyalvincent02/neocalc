import { z } from 'zod'

const num = z.coerce.number().finite()

export const glucoseFormSchema = z.object({
  targetGlucosePercent: num.refine((n) => n > 0, 'Must be greater than 0.'),
  baseGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  additiveGlucosePercent: num.refine((n) => n > 0, 'Must be > 0.'),
  buretteSizeMl: num.refine((n) => n > 0, 'Must be > 0.'),
  reservedAdditiveVolumeMl: num.refine((n) => n >= 0, 'Must be ≥ 0.'),
})

export type GlucoseFormInput = z.input<typeof glucoseFormSchema>
export type GlucoseFormValues = z.output<typeof glucoseFormSchema>
