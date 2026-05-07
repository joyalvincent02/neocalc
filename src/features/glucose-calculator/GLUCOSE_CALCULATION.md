# Glucose Calculator — How It Works

## Inputs

| Field | Description |
|---|---|
| Target glucose % | Desired final glucose concentration in the completed burette |
| Base glucose % | Lower-strength stock solution (e.g. 10%) |
| Additive glucose % | Higher-strength stock solution (e.g. 50%) |
| Burette size (mL) | Total burette volume |
| Reserved additive volume (mL) | Volume already occupied by electrolytes / other additives |

---

## Algorithm — 8-Step Hospital Quota Workflow

### Step 1 — Available mixing volume

```
availableVolume = buretteSize − reservedAdditiveVolume
```

Example: 100 − 2 = **98 mL**

---

### Step 2 — Target glucose in grams per 100 mL

A glucose concentration of X% means X grams per 100 mL. Use the % value directly.

Example: 12% → **12 g per 100 mL**

---

### Step 3 — Required g/mL in the available mixing volume

To deliver the target grams across the *whole* burette (including reserved volume)
using only the *available* mixing space, the concentration must be scaled up:

```
requiredGramsPerMl = targetGramsPer100mL ÷ availableVolume
```

Example: 12 ÷ 98 = **0.1224 g/mL**

---

### Step 4 — Convert stock solutions to g/mL

```
baseGPerMl     = baseGlucosePercent ÷ 100
additiveGPerMl = additiveGlucosePercent ÷ 100
```

Example: 10% → 0.1 g/mL | 50% → 0.5 g/mL

---

### Step 5 — Calculate quotas

```
additiveQuota = requiredGramsPerMl − baseGPerMl
baseQuota     = additiveGPerMl − requiredGramsPerMl
```

Example:
- additiveQuota = 0.1224 − 0.1 = **0.0224**
- baseQuota = 0.5 − 0.1224 = **0.3776**

---

### Step 6 — Total quota

```
totalQuota = additiveQuota + baseQuota
```

Example: 0.0224 + 0.3776 = **0.4**

---

### Step 7 — Volume ratios

```
additiveRatio = additiveQuota ÷ totalQuota
baseRatio     = baseQuota ÷ totalQuota
```

Example:
- additiveRatio = 0.0224 / 0.4 = **0.0561**
- baseRatio = 0.3776 / 0.4 = **0.9439**

---

### Step 8 — Final volumes

```
additiveVolume = additiveRatio × availableVolume
baseVolume     = baseRatio     × availableVolume
```

Example:
- additiveVolume = 0.0561 × 98 = **5.5 mL** of 50% glucose
- baseVolume = 0.9439 × 98 = **92.5 mL** of 10% glucose

---

## Final Concentration Check

Verifies the completed burette (all `buretteSize` mL) delivers the target concentration:

```
totalGlucoseGrams      = (additiveVolume × additiveGPerMl) + (baseVolume × baseGPerMl)
finalConcentration (%) = totalGlucoseGrams ÷ buretteSize × 100
```

Example: (5.5 × 0.5) + (92.5 × 0.1) = 2.75 + 9.25 = 12 g → 12 g / 100 mL = **12%** ✓

---

## Implementation

**File:** `src/calculations/glucose/glucoseCalculator.ts`  
**Function:** `calculateGlucoseStrengthening(input, roundingDp)`
