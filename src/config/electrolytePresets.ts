export type ElectrolytePreset = {
  name: string
  stockStrengthMmolPerMl: number
}

export const ELECTROLYTE_PRESETS: ElectrolytePreset[] = [
  { name: 'Sodium chloride', stockStrengthMmolPerMl: 4 },
  { name: 'Potassium chloride', stockStrengthMmolPerMl: 2 }, // common example; adjust per local product
]

