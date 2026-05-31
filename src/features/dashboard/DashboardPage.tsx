import { Link } from 'react-router-dom'
import { FlaskConical, Droplets, Layers, ArrowRight, Activity } from 'lucide-react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'

interface CalculatorCard {
  to: string
  title: string
  description: string
  details: string
  icon: React.ReactNode
  badge: string
}

const calculators: CalculatorCard[] = [
  {
    to: '/additives',
    title: 'Additive Calculator',
    description: 'Sodium chloride & potassium chloride per-burette additive calculations.',
    details: 'Calculates the exact mL of electrolyte additive required per burette based on patient weight, daily requirement, stock strength, and maintenance rate.',
    icon: <FlaskConical className="h-5 w-5" />,
    badge: 'NaCl / KCl',
  },
  {
    to: '/glucose',
    title: 'Glucose Strengthening',
    description: 'Calculate base + additive glucose volumes to reach a target concentration.',
    details: 'Determines the optimal mix of base and additive glucose solutions to achieve the target glucose infusion rate (GIR) and concentration.',
    icon: <Droplets className="h-5 w-5" />,
    badge: 'GIR / GCS',
  },
  {
    to: '/combined',
    title: 'Combined Burette',
    description: 'Reserve electrolyte volumes first, then calculate glucose strengthening.',
    details: 'All-in-one burette calculator — reserves space for NaCl, KCl, and calcium gluconate additives, then solves glucose strengthening in the remaining volume.',
    icon: <Layers className="h-5 w-5" />,
    badge: 'Full burette',
  },
]

export function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Neonatal Fluid Calculators
              </h1>
              <Badge
                variant="secondary"
                className="font-mono text-[11px] text-muted-foreground hidden sm:inline-flex"
              >
                Protocol 2024
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl">
              Evidence-based calculation tools for neonatal fluid, electrolyte, and glucose
              management. Select a calculator to get started.
            </p>
          </div>
        </div>

        {/* Calculator cards — single semantic links */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.to}
              to={calc.to}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open ${calc.title}`}
            >
              {/* Icon + badge row */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {calc.icon}
                </div>
                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground">
                  {calc.badge}
                </Badge>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h2 className="text-base font-semibold text-foreground mb-1">{calc.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {calc.description}
                </p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {calc.details}
                </p>
              </div>

              {/* CTA row */}
              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                Open Calculator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          All calculations are for decision-support only. Always verify results with an
          independent check and confirm against your local hospital formulary and policy.
        </div>
      </div>
    </AppLayout>
  )
}
