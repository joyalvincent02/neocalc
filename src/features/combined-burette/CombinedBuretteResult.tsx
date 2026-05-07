import { CalculationBreakdown } from '../../components/results/CalculationBreakdown'
import { InputSummary } from '../../components/results/InputSummary'
import { ResultCard } from '../../components/results/ResultCard'
import { WarningList } from '../../components/results/WarningList'
import { ErrorAlert } from '../../components/results/ErrorAlert'
import { roundDecimalToString } from '../../calculations/shared/rounding'
import type { CombinedBuretteResult } from '../../calculations/combined/combinedTypes'
import type { CombinedFormValues } from './combinedFormSchema'

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground tabular-nums">{value}</span>
    </div>
  )
}

function SummarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background p-3 text-sm space-y-1">
      <div className="font-semibold text-foreground mb-1.5">{title}</div>
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

  return (
    <div className="space-y-4">

      {/* Input summary */}
      <InputSummary
        items={[
          { label: 'Weight', value: `${input.patientWeightKg} kg` },
          { label: 'Maintenance rate', value: `${input.maintenanceRateMlPerHour} mL/hr` },
          { label: 'Burette size', value: `${input.buretteSizeMl} mL` },
          {
            label: 'Sodium prescription',
            value: input.sodiumEnabled
              ? `${input.sodiumRequirementMmolPerKgPerDay} mmol/kg/day @ ${input.sodiumStockStrengthMmolPerMl} mmol/mL`
              : 'Disabled',
          },
          {
            label: 'Potassium prescription',
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

      <ResultCard title="Result">

        {/* Final instruction */}
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
          <div className="font-semibold text-primary">Final Instruction</div>
          <div className="mt-2 whitespace-pre-wrap text-foreground">{result.finalInstruction}</div>
        </div>

        {/* Key stat cards */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-xs text-muted-foreground">Available for glucose</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {rd(e.availableForGlucoseMl)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">mL</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-xs text-muted-foreground">Final concentration</div>
            <div className="mt-1 text-lg font-bold text-primary">
              {rd(e.finalConcentrationCheckPercent)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* Fluid summary */}
        <SummarySection title="Fluid">
          <SummaryRow
            label="Maintenance fluid/day"
            value={`${rd(e.maintenanceFluidMlPerDay)} mL/day`}
          />
          <SummaryRow
            label="Burettes/day"
            value={rd(e.burettesPerDay)}
          />
        </SummarySection>

        {/* Electrolyte summary */}
        <SummarySection title="Electrolytes">
          {e.sodium ? (
            <>
              <SummaryRow label="Na mmol/day" value={`${rd(e.sodium.mmolPerDay)} mmol/day`} />
              <SummaryRow label="Na mL/day" value={`${rd(e.sodium.mlPerDay)} mL/day`} />
              <SummaryRow label="Na mL/burette" value={`${rd(e.sodium.mlPerBurette)} mL`} />
            </>
          ) : (
            <SummaryRow label="Sodium" value="Disabled" />
          )}
          {e.potassium ? (
            <>
              <SummaryRow label="K mmol/day" value={`${rd(e.potassium.mmolPerDay)} mmol/day`} />
              <SummaryRow label="K mL/day" value={`${rd(e.potassium.mlPerDay)} mL/day`} />
              <SummaryRow label="K mL/burette" value={`${rd(e.potassium.mlPerBurette)} mL`} />
            </>
          ) : (
            <SummaryRow label="Potassium" value="Disabled" />
          )}
          {e.calciumGluconateMlPerBurette.gt(0) && (
            <SummaryRow
              label="Ca-gluconate mL/burette"
              value={`${rd(e.calciumGluconateMlPerBurette)} mL`}
            />
          )}
          <div className="border-t border-border mt-1 pt-1">
            <SummaryRow label="Total reserved" value={`${rd(e.totalReservedMl)} mL`} />
          </div>
        </SummarySection>

        {/* Mixture list */}
        <SummarySection title="Mixture (rounded)">
          <ul className="space-y-1.5">
            {result.mixtureItems.map((m, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{m.name}</span>
                <span className="text-xs font-medium text-foreground tabular-nums">
                  {roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL
                </span>
              </li>
            ))}
          </ul>
        </SummarySection>

        <CalculationBreakdown steps={result.breakdownSteps} roundingDp={roundingDp} />
      </ResultCard>
    </div>
  )
}
