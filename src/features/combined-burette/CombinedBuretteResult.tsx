import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { PrimaryResult } from '../../components/results/PrimaryResult'
import { VerificationChecks, type VerificationCheck } from '../../components/results/VerificationChecks'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import { Separator } from '@/components/ui/separator'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-xs font-medium text-foreground tabular-nums">{value}</span>
    </div>
  )
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {title}
      </div>
      {children}
    </div>
  )
}

export function CombinedBuretteResultView({
  input,
  result,
  roundingDp,
}: {
  input: CombinedFormValues
  result: CombinedBuretteResult
  roundingDp: number
}) {
  if (!result.ok) {
    return (
      <ResultCard title="Cannot Calculate">
        <WarningList warnings={result.warnings} />
        <ErrorAlert errors={result.errors} />
      </ResultCard>
    )
  }

  const e = result.exact
  const rd = (v: Parameters<typeof roundDecimalToString>[0]) =>
    roundDecimalToString(v, { dp: roundingDp })

  const concentrationDiff = e.finalConcentrationCheckPercent
    .minus(input.targetGlucosePercent)
    .abs()

  const checks: VerificationCheck[] = [
    {
      label: 'Final concentration matches target',
      detail: `${rd(e.finalConcentrationCheckPercent)}% ≈ ${input.targetGlucosePercent}%`,
      status: concentrationDiff.lte(0.01) ? 'pass' : concentrationDiff.lte(0.1) ? 'warn' : 'fail',
    },
    {
      label: 'Reserved volume < burette size',
      detail: `${rd(e.totalReservedMl)} mL < ${input.buretteSizeMl} mL`,
      status: e.totalReservedMl.lt(input.buretteSizeMl) ? 'pass' : 'fail',
    },
  ]

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Weight', value: `${input.patientWeightKg} kg` },
          { label: 'Maintenance rate', value: `${input.maintenanceRateMlPerHour} mL/hr` },
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          {
            label: 'Sodium',
            value: input.sodiumEnabled
              ? `${input.sodiumRequirementMmolPerKgPerDay} mmol/kg/day @ ${input.sodiumStockStrengthMmolPerMl} mmol/mL`
              : 'Disabled',
          },
          {
            label: 'Potassium',
            value: input.potassiumEnabled
              ? `${input.potassiumRequirementMmolPerKgPerDay} mmol/kg/day @ ${input.potassiumStockStrengthMmolPerMl} mmol/mL`
              : 'Disabled',
          },
          { label: 'Target Glucose', value: `${input.targetGlucosePercent}%` },
          { label: 'Base glucose', value: `${input.baseGlucosePercent}%` },
          { label: 'Additive glucose', value: `${input.additiveGlucosePercent}%` },
        ]}
      />

      <WarningList warnings={result.warnings} />

      {/* Hero result */}
      <PrimaryResult
        label="Complete burette mixture"
        value={rd(e.availableForGlucoseMl)}
        unit="mL available for glucose"
        instruction={result.finalInstruction}
      />

      {/* Verification */}
      <VerificationChecks checks={checks} />

      {/* Detailed breakdown sections */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">

        <SummarySection title="Fluid">
          <SummaryRow label="Maintenance fluid/day" value={`${rd(e.maintenanceFluidMlPerDay)} mL/day`} />
          <SummaryRow label="Burettes/day" value={rd(e.burettesPerDay)} />
        </SummarySection>

        <Separator />

        <SummarySection title="Electrolytes per burette">
          {e.sodium ? (
            <>
              <SummaryRow label="Na mmol/day" value={`${rd(e.sodium.mmolPerDay)} mmol/day`} />
              <SummaryRow label="Na mL/burette" value={`${rd(e.sodium.mlPerBurette)} mL`} />
            </>
          ) : (
            <SummaryRow label="Sodium" value="Disabled" />
          )}
          {e.potassium ? (
            <>
              <SummaryRow label="K mmol/day" value={`${rd(e.potassium.mmolPerDay)} mmol/day`} />
              <SummaryRow label="K mL/burette" value={`${rd(e.potassium.mlPerBurette)} mL`} />
            </>
          ) : (
            <SummaryRow label="Potassium" value="Disabled" />
          )}
          {e.calciumGluconateMlPerBurette.gt(0) && (
            <SummaryRow label="Ca-gluconate mL/burette" value={`${rd(e.calciumGluconateMlPerBurette)} mL`} />
          )}
          <div className="border-t border-border mt-2 pt-2">
            <SummaryRow label="Total reserved" value={`${rd(e.totalReservedMl)} mL`} />
          </div>
        </SummarySection>

        <Separator />

        <SummarySection title="Mixture (rounded)">
          <ul className="space-y-1.5">
            {result.mixtureItems.map((m, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.name}</span>
                <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                  {roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>
      </div>

      <Separator />

      <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
    </div>
  )
}
