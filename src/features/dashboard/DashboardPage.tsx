import { Link } from 'react-router-dom'
import { Activity, ArrowRight } from 'lucide-react'
import { calculatorNavItems } from '../../config/calculatorNav'
import { AppLayout } from '../../components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-1.5">
              Neonatal Fluid Calculators
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Evidence-based calculation tools for neonatal fluid, electrolyte, and glucose
              management. Select a calculator to get started.
            </p>
          </div>
        </div>

        {/* Calculator cards — single semantic links */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {calculatorNavItems.map((calc) => {
            const Icon = calc.icon
            return (
              <Link
                key={calc.to}
                to={calc.to}
                className={cn(
                  'group flex flex-col rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  calc.accent.cardBorder,
                  calc.accent.cardHoverBorder,
                )}
                aria-label={`Open ${calc.label}`}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      calc.accent.iconBg,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {calc.badge}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-semibold text-foreground mb-1">{calc.label}</h2>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">
                    {calc.cardDescription}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {calc.cardDetails}
                  </p>
                </div>

                <div className={cn('mt-5 flex items-center gap-1.5 text-sm font-medium', calc.accent.cta)}>
                  Open Calculator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
