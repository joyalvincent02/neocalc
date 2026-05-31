import { d } from '../shared/decimal'
import { formatExactForDisplay, roundDecimalToString } from '../shared/rounding'
import {
  issue,
  requireDecimalNonNegative,
  requireFiniteNonNegativeNumber,
  requireFinitePositiveNumber,
  type BreakdownStep,
  type ValidationIssue,
} from '../shared/validation'
import { calculateGlucoseStrengthening } from '../glucose/glucoseCalculator'
import type {
  CombinedBuretteExact,
  CombinedBuretteInput,
  CombinedBuretteResult,
  CombinedMixtureItem,
  ElectrolyteExact,
} from './combinedTypes'

function deriveElectrolyte(
  weightKg: ReturnType<typeof d>,
  requirementMmolPerKgPerDay: ReturnType<typeof d>,
  stockStrengthMmolPerMl: ReturnType<typeof d>,
  burettesPerDay: ReturnType<typeof d>,
): ElectrolyteExact {
  const mmolPerDay = weightKg.mul(requirementMmolPerKgPerDay)
  const mlPerDay = mmolPerDay.div(stockStrengthMmolPerMl)
  const mlPerBurette = mlPerDay.div(burettesPerDay)
  return { mmolPerDay, mlPerDay, mlPerBurette }
}

export function calculateCombinedBurette(
  input: CombinedBuretteInput,
  roundingDp: number = 2,
): CombinedBuretteResult {
  const errors: ValidationIssue[] = []
  const warnings: string[] = []

  // ── Validate shared inputs ────────────────────────────────────────────────
  const patientWeightKg = requireFinitePositiveNumber('patientWeightKg', input.patientWeightKg, errors)
  const maintenanceRateMlPerHour = requireFinitePositiveNumber('maintenanceRateMlPerHour', input.maintenanceRateMlPerHour, errors)
  const buretteSizeMl = requireFinitePositiveNumber('buretteSizeMl', input.buretteSizeMl, errors)
  const calciumMlPerBurette = requireFiniteNonNegativeNumber('calciumGluconateMlPerBurette', input.calciumGluconateMlPerBurette, errors)

  let sodiumReq: number | null = null
  let sodiumStrength: number | null = null
  if (input.sodium.enabled) {
    sodiumReq = requireFinitePositiveNumber('sodium.requirementMmolPerKgPerDay', input.sodium.requirementMmolPerKgPerDay, errors)
    sodiumStrength = requireFinitePositiveNumber('sodium.stockStrengthMmolPerMl', input.sodium.stockStrengthMmolPerMl, errors)
  }

  let potassiumReq: number | null = null
  let potassiumStrength: number | null = null
  if (input.potassium.enabled) {
    potassiumReq = requireFinitePositiveNumber('potassium.requirementMmolPerKgPerDay', input.potassium.requirementMmolPerKgPerDay, errors)
    potassiumStrength = requireFinitePositiveNumber('potassium.stockStrengthMmolPerMl', input.potassium.stockStrengthMmolPerMl, errors)
  }

  if (errors.length > 0) return { ok: false, errors, warnings }

  // ── Phase 1 — Fluid calculations ─────────────────────────────────────────
  const w = d(patientWeightKg!)
  const rate = d(maintenanceRateMlPerHour!)
  const burette = d(buretteSizeMl!)
  const caMlPerBurette = d(calciumMlPerBurette!)

  const maintenanceFluidMlPerDay = rate.mul(24)
  const burettesPerDay = maintenanceFluidMlPerDay.div(burette)

  if (burettesPerDay.lte(0)) {
    return {
      ok: false,
      errors: [issue('burettesPerDay', 'Maintenance volume must produce > 0 burettes/day.')],
      warnings,
    }
  }

  const fd = formatExactForDisplay

  const phase1Steps: BreakdownStep[] = [
    {
      label: 'Phase 1.1 — Maintenance fluid per day',
      formula: 'maintenanceRateMlPerHour × 24',
      substitution: `${fd(rate)} × 24`,
      exact: maintenanceFluidMlPerDay,
      unit: 'mL/day',
      latexFormula: 'V_{\\text{maint/day}} = R_{\\text{rate}} \\times 24',
      latexSubstitution: `V_{\\text{maint/day}} = ${fd(rate)} \\times 24`,
    },
    {
      label: 'Phase 1.2 — Burettes per day',
      formula: 'maintenanceFluidMlPerDay ÷ buretteSizeMl',
      substitution: `${fd(maintenanceFluidMlPerDay)} ÷ ${fd(burette)}`,
      exact: burettesPerDay,
      unit: 'burettes/day',
      latexFormula: 'N_{\\text{burettes}} = \\dfrac{V_{\\text{maint/day}}}{V_{\\text{burette}}}',
      latexSubstitution: `N_{\\text{burettes}} = \\dfrac{${fd(maintenanceFluidMlPerDay)}}{${fd(burette)}}`,
    },
  ]

  // ── Phase 2 — Sodium ──────────────────────────────────────────────────────
  let sodiumExact: ElectrolyteExact | null = null
  const phase2Steps: BreakdownStep[] = []

  if (input.sodium.enabled && sodiumReq !== null && sodiumStrength !== null) {
    const req = d(sodiumReq)
    const strength = d(sodiumStrength)
    sodiumExact = deriveElectrolyte(w, req, strength, burettesPerDay)

    requireDecimalNonNegative('sodium.mlPerBurette', sodiumExact.mlPerBurette, errors)

    phase2Steps.push(
      {
        label: 'Phase 2.1 — Sodium mmol/day',
        formula: 'patientWeightKg × sodiumRequirementMmolPerKgPerDay',
        substitution: `${fd(w)} × ${fd(req)}`,
        exact: sodiumExact.mmolPerDay,
        unit: 'mmol/day',
        latexFormula: '\\text{Na}_{\\text{mmol/day}} = W \\times R_{\\text{Na}}',
        latexSubstitution: `\\text{Na}_{\\text{mmol/day}} = ${fd(w)} \\times ${fd(req)}`,
      },
      {
        label: 'Phase 2.2 — Sodium mL/day',
        formula: 'sodiumMmolPerDay ÷ sodiumStockStrengthMmolPerMl',
        substitution: `${fd(sodiumExact.mmolPerDay)} ÷ ${fd(strength)}`,
        exact: sodiumExact.mlPerDay,
        unit: 'mL/day',
        latexFormula: '\\text{Na}_{\\text{mL/day}} = \\dfrac{\\text{Na}_{\\text{mmol/day}}}{C_{\\text{Na}}}',
        latexSubstitution: `\\text{Na}_{\\text{mL/day}} = \\dfrac{${fd(sodiumExact.mmolPerDay)}}{${fd(strength)}}`,
      },
      {
        label: 'Phase 2.3 — Sodium mL/burette',
        formula: 'sodiumMlPerDay ÷ burettesPerDay',
        substitution: `${fd(sodiumExact.mlPerDay)} ÷ ${fd(burettesPerDay)}`,
        exact: sodiumExact.mlPerBurette,
        unit: 'mL/burette',
        latexFormula: '\\text{Na}_{\\text{mL/burette}} = \\dfrac{\\text{Na}_{\\text{mL/day}}}{N_{\\text{burettes}}}',
        latexSubstitution: `\\text{Na}_{\\text{mL/burette}} = \\dfrac{${fd(sodiumExact.mlPerDay)}}{${fd(burettesPerDay)}}`,
      },
    )
  }

  // ── Phase 3 — Potassium ───────────────────────────────────────────────────
  let potassiumExact: ElectrolyteExact | null = null
  const phase3Steps: BreakdownStep[] = []

  if (input.potassium.enabled && potassiumReq !== null && potassiumStrength !== null) {
    const req = d(potassiumReq)
    const strength = d(potassiumStrength)
    potassiumExact = deriveElectrolyte(w, req, strength, burettesPerDay)

    requireDecimalNonNegative('potassium.mlPerBurette', potassiumExact.mlPerBurette, errors)

    phase3Steps.push(
      {
        label: 'Phase 3.1 — Potassium mmol/day',
        formula: 'patientWeightKg × potassiumRequirementMmolPerKgPerDay',
        substitution: `${fd(w)} × ${fd(req)}`,
        exact: potassiumExact.mmolPerDay,
        unit: 'mmol/day',
        latexFormula: '\\text{K}_{\\text{mmol/day}} = W \\times R_{\\text{K}}',
        latexSubstitution: `\\text{K}_{\\text{mmol/day}} = ${fd(w)} \\times ${fd(req)}`,
      },
      {
        label: 'Phase 3.2 — Potassium mL/day',
        formula: 'potassiumMmolPerDay ÷ potassiumStockStrengthMmolPerMl',
        substitution: `${fd(potassiumExact.mmolPerDay)} ÷ ${fd(strength)}`,
        exact: potassiumExact.mlPerDay,
        unit: 'mL/day',
        latexFormula: '\\text{K}_{\\text{mL/day}} = \\dfrac{\\text{K}_{\\text{mmol/day}}}{C_{\\text{K}}}',
        latexSubstitution: `\\text{K}_{\\text{mL/day}} = \\dfrac{${fd(potassiumExact.mmolPerDay)}}{${fd(strength)}}`,
      },
      {
        label: 'Phase 3.3 — Potassium mL/burette',
        formula: 'potassiumMlPerDay ÷ burettesPerDay',
        substitution: `${fd(potassiumExact.mlPerDay)} ÷ ${fd(burettesPerDay)}`,
        exact: potassiumExact.mlPerBurette,
        unit: 'mL/burette',
        latexFormula: '\\text{K}_{\\text{mL/burette}} = \\dfrac{\\text{K}_{\\text{mL/day}}}{N_{\\text{burettes}}}',
        latexSubstitution: `\\text{K}_{\\text{mL/burette}} = \\dfrac{${fd(potassiumExact.mlPerDay)}}{${fd(burettesPerDay)}}`,
      },
    )
  }

  if (errors.length > 0) return { ok: false, errors, warnings }

  // ── Phase 4 — Reserved volume ─────────────────────────────────────────────
  const sodiumMlPerBurette = sodiumExact?.mlPerBurette ?? d(0)
  const potassiumMlPerBurette = potassiumExact?.mlPerBurette ?? d(0)
  const totalReservedMl = sodiumMlPerBurette.add(potassiumMlPerBurette).add(caMlPerBurette)

  if (totalReservedMl.gte(burette)) {
    errors.push(issue('totalReservedMl', 'Total reserved additives meet or exceed burette size.'))
    return { ok: false, errors, warnings }
  }

  const reservedParts: string[] = []
  if (sodiumExact) reservedParts.push(fd(sodiumMlPerBurette))
  if (potassiumExact) reservedParts.push(fd(potassiumMlPerBurette))
  if (caMlPerBurette.gt(0)) reservedParts.push(fd(caMlPerBurette))

  const phase4Steps: BreakdownStep[] = [
    {
      label: 'Phase 4 — Total reserved volume',
      formula: 'sodiumMlPerBurette + potassiumMlPerBurette + calciumMlPerBurette',
      substitution: reservedParts.length ? reservedParts.join(' + ') : '0',
      exact: totalReservedMl,
      unit: 'mL',
      latexFormula: 'V_{\\text{reserved}} = \\text{Na}_{\\text{mL/burette}} + \\text{K}_{\\text{mL/burette}} + \\text{Ca}_{\\text{mL/burette}}',
      latexSubstitution: reservedParts.length
        ? `V_{\\text{reserved}} = ${reservedParts.join(' + ')}`
        : `V_{\\text{reserved}} = 0`,
    },
  ]

  // ── Phase 5 — Glucose strengthening (hospital quota workflow) ─────────────
  const glucose = calculateGlucoseStrengthening(
    {
      targetGlucosePercent: input.targetGlucosePercent,
      baseGlucosePercent: input.baseGlucosePercent,
      additiveGlucosePercent: input.additiveGlucosePercent,
      buretteSizeMl: buretteSizeMl!,
      reservedAdditiveVolumeMl: totalReservedMl.toNumber(),
    },
    roundingDp,
  )

  if (!glucose.ok) {
    return {
      ok: false,
      errors: glucose.errors.map((e) => ({ path: `glucose.${e.path}`, message: e.message })),
      warnings,
    }
  }

  if (input.targetGlucosePercent > 12.5) {
    warnings.push(
      `Target glucose is ${input.targetGlucosePercent.toFixed(2)}%. This may exceed common peripheral dextrose limits (often 12.5%); verify local policy and line type.`,
    )
  }
  if (input.calciumGluconateMlPerBurette > 0) {
    warnings.push(
      'Calcium gluconate compatibility depends on full solution composition, concentration, and local policy. Verify independently.',
    )
  }

  const phase5Steps: BreakdownStep[] = glucose.breakdownSteps.map((s) => ({
    ...s,
    label: `Phase 5 — ${s.label}`,
  }))

  // ── Assemble result ───────────────────────────────────────────────────────
  const mixtureItems: CombinedMixtureItem[] = [
    ...(sodiumExact ? [{ name: 'Sodium chloride', volumeMl: sodiumExact.mlPerBurette }] : []),
    ...(potassiumExact ? [{ name: 'Potassium chloride', volumeMl: potassiumExact.mlPerBurette }] : []),
    ...(caMlPerBurette.gt(0) ? [{ name: 'Calcium gluconate', volumeMl: caMlPerBurette }] : []),
    { name: `${input.additiveGlucosePercent}% glucose`, volumeMl: glucose.exact.additiveGlucoseVolumeMl },
    { name: `${input.baseGlucosePercent}% glucose`, volumeMl: glucose.exact.baseGlucoseVolumeMl },
  ]

  const lines = mixtureItems.map(
    (m) => `- ${roundDecimalToString(m.volumeMl, { dp: roundingDp })} mL ${m.name}`,
  )

  const exact: CombinedBuretteExact = {
    maintenanceFluidMlPerDay,
    burettesPerDay,
    sodium: sodiumExact,
    potassium: potassiumExact,
    calciumGluconateMlPerBurette: caMlPerBurette,
    totalReservedMl,
    availableForGlucoseMl: glucose.exact.availableVolumeMl,
    glucoseAdditiveVolumeMl: glucose.exact.additiveGlucoseVolumeMl,
    glucoseBaseVolumeMl: glucose.exact.baseGlucoseVolumeMl,
    finalConcentrationCheckPercent: glucose.exact.finalConcentrationCheckPercent,
  }

  return {
    ok: true,
    exact,
    mixtureItems,
    breakdownSteps: [...phase1Steps, ...phase2Steps, ...phase3Steps, ...phase4Steps, ...phase5Steps],
    finalInstruction: `Add:\n${lines.join('\n')}`,
    warnings,
  }
}
