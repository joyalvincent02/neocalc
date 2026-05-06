import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'
import { ELECTROLYTE_PRESETS } from '../../config/electrolytePresets'
import { NumberField } from '../../components/forms/NumberField'
import { SelectField } from '../../components/forms/SelectField'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  additiveFormSchema,
  type AdditiveFormInput,
  type AdditiveFormValues,
} from './additiveFormSchema'

export function AdditiveCalculatorForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: Partial<AdditiveFormValues>
  onSubmit: (values: AdditiveFormValues) => void
}) {
  const form = useForm<AdditiveFormInput, unknown, AdditiveFormValues>({
    resolver: zodResolver(additiveFormSchema),
    defaultValues: {
      patientWeightKg: 2.5,
      requiredMmolPerKgPerDay: 4,
      stockStrengthMmolPerMl: 4,
      maintenanceRateMlPerHour: 12.5,
      buretteSizeMl: 100,
      additiveName: ELECTROLYTE_PRESETS[0]?.name ?? 'Sodium chloride',
      baseFluidName: 'Base fluid',
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((v) => onSubmit(v))}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="patientWeightKg"
          render={({ field }) => (
            <NumberField
              label="Patient weight (kg)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.001}
              min={DEFAULT_PROTOCOL.ranges.weightKg.min}
              error={errors.patientWeightKg?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="requiredMmolPerKgPerDay"
          render={({ field }) => (
            <NumberField
              label="Requirement (mmol/kg/day)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={DEFAULT_PROTOCOL.ranges.requiredMmolPerKgPerDay.min}
              error={errors.requiredMmolPerKgPerDay?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="stockStrengthMmolPerMl"
          render={({ field }) => (
            <NumberField
              label="Stock strength (mmol/mL)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={DEFAULT_PROTOCOL.ranges.stockStrengthMmolPerMl.min}
              error={errors.stockStrengthMmolPerMl?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="maintenanceRateMlPerHour"
          render={({ field }) => (
            <NumberField
              label="Maintenance rate (mL/hr)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.01}
              min={DEFAULT_PROTOCOL.ranges.maintenanceRateMlPerHour.min}
              error={errors.maintenanceRateMlPerHour?.message}
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
          name="additiveName"
          render={({ field }) => (
            <SelectField
              label="Additive"
              value={field.value}
              onChange={field.onChange}
              options={ELECTROLYTE_PRESETS.map((e) => ({
                value: e.name,
                label: `${e.name} (${e.stockStrengthMmolPerMl} mmol/mL)`,
              }))}
              error={errors.additiveName?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Base fluid name</Label>
        <Input {...register('baseFluidName')} />
        {errors.baseFluidName?.message ? (
          <p className="text-xs text-destructive">{errors.baseFluidName.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full">
        Calculate
      </Button>
    </form>
  )
}

