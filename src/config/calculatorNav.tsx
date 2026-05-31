import { Beaker, FlaskConical, TestTubes } from 'lucide-react'

export type CalculatorAccent = {
  iconBg: string
  cardBorder: string
  cardHoverBorder: string
  cta: string
  activeIndicator: string
  activeBg: string
}

export const calculatorNavItems = [
  {
    to: '/additives',
    label: 'Additive Calculator',
    description: 'NaCl / KCl per-burette',
    badge: 'NaCl / KCl',
    icon: TestTubes,
    accent: {
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      cardBorder: 'border-blue-200 dark:border-blue-900',
      cardHoverBorder: 'hover:border-blue-300 dark:hover:border-blue-800',
      cta: 'text-blue-700 dark:text-blue-300',
      activeIndicator: 'border-l-blue-500',
      activeBg: 'bg-blue-500/10',
    } satisfies CalculatorAccent,
    cardDescription:
      'Sodium chloride & potassium chloride per-burette additive calculations.',
    cardDetails:
      'Calculates the exact mL of electrolyte additive required per burette based on patient weight, daily requirement, stock strength, and maintenance rate.',
  },
  {
    to: '/glucose',
    label: 'Glucose Strengthening',
    description: 'Target GIR concentration',
    badge: 'GIR / GCS',
    icon: FlaskConical,
    accent: {
      iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
      cardBorder: 'border-teal-200 dark:border-teal-900',
      cardHoverBorder: 'hover:border-teal-300 dark:hover:border-teal-800',
      cta: 'text-teal-700 dark:text-teal-300',
      activeIndicator: 'border-l-teal-500',
      activeBg: 'bg-teal-500/10',
    } satisfies CalculatorAccent,
    cardDescription:
      'Calculate base + additive glucose volumes to reach a target concentration.',
    cardDetails:
      'Determines the optimal mix of base and additive glucose solutions to achieve the target glucose infusion rate (GIR) and concentration.',
  },
  {
    to: '/combined',
    label: 'Combined Burette',
    description: 'Electrolytes + glucose',
    badge: 'Full burette',
    icon: Beaker,
    accent: {
      iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
      cardBorder: 'border-violet-200 dark:border-violet-900',
      cardHoverBorder: 'hover:border-violet-300 dark:hover:border-violet-800',
      cta: 'text-violet-700 dark:text-violet-300',
      activeIndicator: 'border-l-violet-500',
      activeBg: 'bg-violet-500/10',
    } satisfies CalculatorAccent,
    cardDescription:
      'Reserve electrolyte volumes first, then calculate glucose strengthening.',
    cardDetails:
      'All-in-one burette calculator — reserves space for NaCl, KCl, and calcium gluconate additives, then solves glucose strengthening in the remaining volume.',
  },
] as const
