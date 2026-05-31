/** Two-line substitution: symbolic form, then numeric values. */
export function latexSubstitutionMultiline(
  lhs: string,
  symbolicRhs: string,
  numericRhs: string,
): string {
  if (symbolicRhs === numericRhs) {
    return `${lhs} = ${symbolicRhs}`
  }
  return `\\begin{aligned} ${lhs} &= ${symbolicRhs} \\\\ &= ${numericRhs} \\end{aligned}`
}

/** Fraction substitution with optional trailing factor (e.g. × 100) on a second line. */
export function latexFractionMultiline(
  lhs: string,
  numerator: string,
  denominator: string,
  trailing = '',
): string {
  if (!trailing) {
    return `${lhs} = \\dfrac{${numerator}}{${denominator}}`
  }
  return `\\begin{aligned} ${lhs} &= \\dfrac{${numerator}}{${denominator}} \\\\ &\\quad ${trailing} \\end{aligned}`
}
