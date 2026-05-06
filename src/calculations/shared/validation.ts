import type Decimal from 'decimal.js'

export type ValidationIssue = {
  path: string
  message: string
}

export type BreakdownStep = {
  label: string
  formula: string
  substitution: string
  exact: Decimal
  unit?: string
}

export function issue(path: string, message: string): ValidationIssue {
  return { path, message }
}

export function requireFinitePositiveNumber(
  path: string,
  value: unknown,
  issues: ValidationIssue[],
): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push(issue(path, 'Must be a finite number.'))
    return null
  }
  if (value <= 0) {
    issues.push(issue(path, 'Must be greater than 0.'))
    return null
  }
  return value
}

export function requireFiniteNonNegativeNumber(
  path: string,
  value: unknown,
  issues: ValidationIssue[],
): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    issues.push(issue(path, 'Must be a finite number.'))
    return null
  }
  if (value < 0) {
    issues.push(issue(path, 'Must be 0 or greater.'))
    return null
  }
  return value
}

export function requireDecimalNonNegative(
  path: string,
  value: Decimal,
  issues: ValidationIssue[],
): void {
  if (value.isNeg()) {
    issues.push(issue(path, 'Must be 0 or greater.'))
  }
}

