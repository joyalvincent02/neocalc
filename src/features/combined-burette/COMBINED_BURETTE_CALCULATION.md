# Combined Burette Calculator — How It Works

## Overview

The Combined Burette calculator builds a complete burette prescription in five phases:

1. Derive maintenance fluid volume and burettes per day
2. Derive sodium volume per burette from weight-based prescription
3. Derive potassium volume per burette from weight-based prescription
4. Sum all reserved (electrolyte) volumes
5. Strengthen glucose for the remaining volume using the hospital quota workflow

Patient weight is used **only** for weight-based electrolyte derivation. There is no GIR input.

---

## Inputs

| Field | Description |
|---|---|
| patientWeightKg | Patient weight in kg |
| maintenanceRateMlPerHour | IV maintenance rate |
| buretteSizeMl | Total burette volume |
| sodiumEnabled | Include sodium in calculation |
| sodiumRequirementMmolPerKgPerDay | Sodium prescription (mmol/kg/day) |
| sodiumStockStrengthMmolPerMl | Sodium stock concentration (mmol/mL) |
| potassiumEnabled | Include potassium in calculation |
| potassiumRequirementMmolPerKgPerDay | Potassium prescription (mmol/kg/day) |
| potassiumStockStrengthMmolPerMl | Potassium stock concentration (mmol/mL) |
| calciumGluconateMlPerBurette | Calcium gluconate volume (entered directly, mL/burette) |
| targetGlucosePercent | Desired final glucose concentration across the full burette |
| baseGlucosePercent | Lower-strength glucose stock (e.g. 10%) |
| additiveGlucosePercent | Higher-strength glucose stock (e.g. 50%) |

---

## Phase 1 — Fluid calculations

```
maintenanceFluidMlPerDay = maintenanceRateMlPerHour × 24
burettesPerDay           = maintenanceFluidMlPerDay ÷ buretteSizeMl
```

**Example:** 12.5 mL/hr × 24 = 300 mL/day → 300 ÷ 100 = **3 burettes/day**

---

## Phase 2 — Sodium (if enabled)

```
sodiumMmolPerDay   = patientWeightKg × sodiumRequirementMmolPerKgPerDay
sodiumMlPerDay     = sodiumMmolPerDay ÷ sodiumStockStrengthMmolPerMl
sodiumMlPerBurette = sodiumMlPerDay  ÷ burettesPerDay
```

**Example:** 2.5 kg × 3 mmol/kg/day = 7.5 mmol/day → 7.5 ÷ 0.9 = 8.33 mL/day → 8.33 ÷ 3 = **2.78 mL/burette**

---

## Phase 3 — Potassium (if enabled)

```
potassiumMmolPerDay   = patientWeightKg × potassiumRequirementMmolPerKgPerDay
potassiumMlPerDay     = potassiumMmolPerDay ÷ potassiumStockStrengthMmolPerMl
potassiumMlPerBurette = potassiumMlPerDay  ÷ burettesPerDay
```

**Example:** 2.5 kg × 2 mmol/kg/day = 5 mmol/day → 5 ÷ 0.6 = 8.33 mL/day → 8.33 ÷ 3 = **2.78 mL/burette**

---

## Phase 4 — Reserved volume

```
totalReservedMl = sodiumMlPerBurette + potassiumMlPerBurette + calciumGluconateMlPerBurette
```

Validated: `totalReservedMl < buretteSizeMl`

---

## Phase 5 — Glucose strengthening (hospital quota workflow)

The glucose engine receives `totalReservedMl` as the displaced volume and runs the
8-step hospital quota algorithm.

### Step 1 — Available glucose volume
```
availableVolume = buretteSizeMl − totalReservedMl
```

### Step 2 — Target glucose g per 100 mL
```
targetGramsPer100mL = targetGlucosePercent
```

### Step 3 — Required g/mL in the available volume
```
requiredGramsPerMl = targetGramsPer100mL ÷ availableVolume
```
This scales the concentration up to account for electrolyte displacement.

### Step 4 — Stock concentrations in g/mL
```
baseGPerMl     = baseGlucosePercent ÷ 100
additiveGPerMl = additiveGlucosePercent ÷ 100
```

### Step 5 — Quotas
```
additiveQuota = requiredGramsPerMl − baseGPerMl
baseQuota     = additiveGPerMl − requiredGramsPerMl
```

### Step 6 — Total quota
```
totalQuota = additiveQuota + baseQuota
```

### Step 7 — Ratios
```
additiveRatio = additiveQuota ÷ totalQuota
baseRatio     = baseQuota ÷ totalQuota
```

### Step 8 — Final glucose volumes
```
additiveGlucoseVolumeMl = additiveRatio × availableVolume
baseGlucoseVolumeMl     = baseRatio     × availableVolume
```

---

## Final concentration check

Verified over the **full burette** (including reserved volume):

```
totalGlucoseGrams      = (additiveGlucoseVolumeMl × additiveGPerMl) + (baseGlucoseVolumeMl × baseGPerMl)
finalConcentration (%) = totalGlucoseGrams ÷ buretteSizeMl × 100
```

---

## Warnings

| Condition | Warning |
|---|---|
| targetGlucosePercent > 12.5% | May exceed peripheral line limit — verify line type and policy |
| calciumGluconateMlPerBurette > 0 | Verify compatibility with full solution composition and policy |

---

## Implementation

**Engine:** `src/calculations/combined/combinedBuretteCalculator.ts`  
**Function:** `calculateCombinedBurette(input, roundingDp)`

Composes:
- Electrolyte derivation (inline, same logic as `calculateAdditive`)
- `calculateGlucoseStrengthening` from `src/calculations/glucose/glucoseCalculator.ts`
