import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { DEFAULT_PROTOCOL } from '../../config/defaultProtocol'
import { GLUCOSE_PRESETS } from '../../config/glucosePresets'
import { NumberField } from '../../components/forms/NumberField'
import { SelectField } from '../../components/forms/SelectField'
import { Button } from '@/components/ui/button'
import {
  combinedFormSchema,
  type CombinedFormInput,
  type CombinedFormValues,
} from './combinedFormSchema'

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full pt-1 pb-0.5 border-b border-border">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {children}
      </span>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="col-span-full flex items-center gap-2">
      <input
        type="checkbox"
        id={`toggle-${label}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
      />
      <label
        htmlFor={`toggle-${label}`}
        className="text-sm font-medium text-foreground cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}

export function CombinedBuretteForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: Partial<CombinedFormValues>
  onSubmit: (values: CombinedFormValues) => void
}) {
  const form = useForm<CombinedFormInput, unknown, CombinedFormValues>({
    resolver: zodResolver(combinedFormSchema),
    defaultValues: {
      patientWeightKg: 2.5,
      maintenanceRateMlPerHour: 12.5,
      buretteSizeMl: 100,
      sodiumEnabled: true,
      sodiumRequirementMmolPerKgPerDay: 3,
      sodiumStockStrengthMmolPerMl: 0.9,
      potassiumEnabled: true,
      potassiumRequirementMmolPerKgPerDay: 2,
      potassiumStockStrengthMmolPerMl: 0.6,
      calciumGluconateMlPerBurette: 0,
      targetGlucosePercent: 10,
      baseGlucosePercent: 10,
      additiveGlucosePercent: 50,
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form

  const sodiumEnabled = watch('sodiumEnabled')
  const potassiumEnabled = watch('potassiumEnabled')

  return (
    <form className="space-y-4" onSubmit={handleSubmit((v) => onSubmit(v))}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <SectionHeading>Patient &amp; Fluid</SectionHeading>

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

        <SectionHeading>Sodium</SectionHeading>

        <Controller
          control={control}
          name="sodiumEnabled"
          render={({ field }) => (
            <ToggleRow
              label="Include sodium"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="sodiumRequirementMmolPerKgPerDay"
          render={({ field }) => (
            <NumberField
              label="Na requirement (mmol/kg/day)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={0.1}
              disabled={!sodiumEnabled}
              error={sodiumEnabled ? errors.sodiumRequirementMmolPerKgPerDay?.message : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="sodiumStockStrengthMmolPerMl"
          render={({ field }) => (
            <NumberField
              label="Na stock strength (mmol/mL)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.01}
              min={0.01}
              disabled={!sodiumEnabled}
              error={sodiumEnabled ? errors.sodiumStockStrengthMmolPerMl?.message : undefined}
            />
          )}
        />

        <SectionHeading>Potassium</SectionHeading>

        <Controller
          control={control}
          name="potassiumEnabled"
          render={({ field }) => (
            <ToggleRow
              label="Include potassium"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="potassiumRequirementMmolPerKgPerDay"
          render={({ field }) => (
            <NumberField
              label="K requirement (mmol/kg/day)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={0.1}
              disabled={!potassiumEnabled}
              error={potassiumEnabled ? errors.potassiumRequirementMmolPerKgPerDay?.message : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="potassiumStockStrengthMmolPerMl"
          render={({ field }) => (
            <NumberField
              label="K stock strength (mmol/mL)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.01}
              min={0.01}
              disabled={!potassiumEnabled}
              error={potassiumEnabled ? errors.potassiumStockStrengthMmolPerMl?.message : undefined}
            />
          )}
        />

        <SectionHeading>Calcium &amp; Glucose</SectionHeading>

        <Controller
          control={control}
          name="calciumGluconateMlPerBurette"
          render={({ field }) => (
            <NumberField
              label="Calcium gluconate (mL/burette)"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.01}
              min={0}
              error={errors.calciumGluconateMlPerBurette?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="targetGlucosePercent"
          render={({ field }) => (
            <NumberField
              label="Target Glucose %"
              value={String(field.value ?? '')}
              onChange={field.onChange}
              step={0.1}
              min={0.1}
              error={errors.targetGlucosePercent?.message}
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
      </div>

      <Button type="submit" className="w-full">
        Calculate
      </Button>
    </form>
  )
}
