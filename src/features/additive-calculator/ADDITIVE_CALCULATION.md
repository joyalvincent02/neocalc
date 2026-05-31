# Additive Calculator — How It Works

## Overview

The Additive Calculator determines how many mL of an electrolyte additive (e.g. NaCl, KCl) to add per burette, based on the patient's weight-based daily requirement, the stock solution strength, and the maintenance IV rate.

---

## Inputs

| Field | Description |
|---|---|
| `patientWeightKg` | Patient weight in kg |
| `requiredMmolPerKgPerDay` | Electrolyte prescription (mmol/kg/day) |
| `stockStrengthMmolPerMl` | Concentration of the stock additive solution (mmol/mL) |
| `maintenanceRateMlPerHour` | IV maintenance rate (mL/hr) |
| `buretteSizeMl` | Total burette volume (mL) |
| `additiveName` | Label for the additive (e.g. "NaCl 30%") |
| `baseFluidName` | Label for the base fluid (e.g. "0.9% NaCl") |

---

## Algorithm — 6 Steps

### Step 1 — Total daily electrolyte requirement

```
totalRequirementMmolPerDay = patientWeightKg × requiredMmolPerKgPerDay
```

**Example:** 2.5 kg × 3 mmol/kg/day = **7.5 mmol/day**

---

### Step 2 — Additive volume per day

```
additiveMlPerDay = totalRequirementMmolPerDay ÷ stockStrengthMmolPerMl
```

**Example:** 7.5 mmol/day ÷ 0.9 mmol/mL = **8.33 mL/day**

---

### Step 3 — Maintenance fluid volume per day

```
maintenanceFluidMlPerDay = maintenanceRateMlPerHour × 24
```

**Example:** 12.5 mL/hr × 24 = **300 mL/day**

---

### Step 4 — Burettes per day

```
burettesPerDay = maintenanceFluidMlPerDay ÷ buretteSizeMl
```

**Example:** 300 mL/day ÷ 100 mL = **3 burettes/day**

---

### Step 5 — Additive volume per burette

```
additiveMlPerBurette = additiveMlPerDay ÷ burettesPerDay
```

**Example:** 8.33 mL/day ÷ 3 burettes/day = **2.78 mL/burette**

---

### Step 6 — Base fluid volume per burette

```
baseFluidMlPerBurette = buretteSizeMl − additiveMlPerBurette
```

**Example:** 100 − 2.78 = **97.22 mL/burette**

---

## Final Instruction

The result is expressed as a bedside instruction:

> Per `{buretteSizeMl}` mL burette: add `{additiveMlPerBurette}` mL `{additiveName}`, then add `{baseFluidMlPerBurette}` mL `{baseFluidName}`.

---

## Validation

| Condition | Outcome |
|---|---|
| Any required field ≤ 0 or missing | Error — calculation blocked |
| `additiveMlPerBurette > buretteSizeMl` | Error — additive volume exceeds burette size |

---

## Implementation

**Engine:** `src/calculations/additive/additiveCalculator.ts`  
**Function:** `calculateAdditive(input, roundingDp)`

This same logic is inlined inside `calculateCombinedBurette` for the Combined Burette calculator.
