import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { PrimaryResult } from '../../components/results/PrimaryResult'
import { VerificationChecks, type VerificationCheck } from '../../components/results/VerificationChecks'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import { Separator } from '@/components/ui/separator'
import type { AdditiveFormValues } from './additiveFormSchema'
import type { AdditiveCalculatorResult } from '../../calculations/additive/additiveTypes'

export function AdditiveResult({
  input,
  result,
  roundingDp,
}: {
  input: AdditiveFormValues
  result: AdditiveCalculatorResult
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

  const checks: VerificationCheck[] = [
    {
      label: 'Additive volume ≤ burette size',
      detail: `${rd(e.additiveMlPerBurette)} mL ≤ ${input.buretteSizeMl} mL`,
      status: e.additiveMlPerBurette.lte(input.buretteSizeMl) ? 'pass' : 'fail',
    },
    {
      label: 'Base + additive = burette size',
      detail: `${rd(e.baseFluidMlPerBurette)} + ${rd(e.additiveMlPerBurette)} mL`,
      status: e.baseFluidMlPerBurette.add(e.additiveMlPerBurette).toDecimalPlaces(6).eq(
        e.additiveMlPerBurette.add(e.baseFluidMlPerBurette).toDecimalPlaces(6)
      ) ? 'pass' : 'warn',
    },
  ]

  return (
    <div className="space-y-4">
      <InputSummary
        items={[
          { label: 'Weight', value: `${input.patientWeightKg.toFixed(3)} kg` },
          { label: 'Requirement', value: `${input.requiredMmolPerKgPerDay} mmol/kg/day` },
          { label: 'Stock strength', value: `${input.stockStrengthMmolPerMl} mmol/mL` },
          { label: 'Maintenance rate', value: `${input.maintenanceRateMlPerHour} mL/hr` },
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          { label: 'Additive', value: input.additiveName },
        ]}
      />

      <WarningList warnings={result.warnings} />

      {/* Hero primary result with copy */}
      <PrimaryResult
        label="Additive per burette"
        value={rd(e.additiveMlPerBurette)}
        unit="mL"
        instruction={result.finalInstruction}
      />

      {/* Secondary stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-background p-3">
          <div className="text-xs text-muted-foreground">Total requirement</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {rd(e.totalRequirementMmolPerDay)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">mmol/day</span>
          </div>
        </div>
        <div className="rounded-md border border-border bg-background p-3">
          <div className="text-xs text-muted-foreground">Base fluid per burette</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {rd(e.baseFluidMlPerBurette)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">mL</span>
          </div>
        </div>
      </div>

      <VerificationChecks checks={checks} />

      <Separator />

      <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
    </div>
  )
}
