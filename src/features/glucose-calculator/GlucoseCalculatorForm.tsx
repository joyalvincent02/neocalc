import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'
import { GLUCOSE_PRESETS } from '../../config/glucosePresets'
import { NumberField } from '../../components/forms/NumberField'
import { SelectField } from '../../components/forms/SelectField'
import {
  glucoseFormSchema,
  type GlucoseFormInput,
  type GlucoseFormValues,
} from './glucoseFormSchema'

export function GlucoseCalculatorForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: Partial<GlucoseFormValues>
  onSubmit: (values: GlucoseFormValues) => void
}) {
  const form = useForm<GlucoseFormInput, unknown, GlucoseFormValues>({
    resolver: zodResolver(glucoseFormSchema),
    defaultValues: {
      targetGlucosePercent: 12,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      buretteSizeMl: 100,
      reservedAdditiveVolumeMl: 0,
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(v))}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="targetGlucosePercent"
          render={({ field }) => (
            <NumberField
              label="Target glucose (%)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={DEFAULT_PROTOCOL.ranges.glucosePercent.min}
              error={errors.targetGlucosePercent?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="buretteSizeMl"
          render={({ field }) => (
            <SelectField
              label="Burette size (mL)"
              value={String(field.value)}
              onChange={field.onChange}
              options={DEFAULT_PROTOCOL.buretteSizesMl.map((n) => ({
                value: String(n),
                label: `${n} mL`,
              }))}
              error={errors.buretteSizeMl?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="baseGlucosePercent"
          render={({ field }) => (
            <SelectField
              label="Base glucose (%)"
              value={String(field.value)}
              onChange={(v) => field.onChange(Number(v))}
              options={GLUCOSE_PRESETS.map((p) => ({
                value: String(p.percent),
                label: p.label,
              }))}
              error={errors.baseGlucosePercent?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="additiveGlucosePercent"
          render={({ field }) => (
            <SelectField
              label="Additive glucose (%)"
              value={String(field.value)}
              onChange={(v) => field.onChange(Number(v))}
              options={GLUCOSE_PRESETS.map((p) => ({
                value: String(p.percent),
                label: p.label,
              }))}
              error={errors.additiveGlucosePercent?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="reservedAdditiveVolumeMl"
          render={({ field }) => (
            <NumberField
              label="Reserved additive volume (mL)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={0}
              error={errors.reservedAdditiveVolumeMl?.message}
            />
          )}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Calculate
      </button>
    </form>
  )
}

