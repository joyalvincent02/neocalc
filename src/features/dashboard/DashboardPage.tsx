import { useNavigate } from 'react-router-dom'
import { FlaskConical, Droplets, Layers, ArrowRight, Activity } from 'lucide-react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface CalculatorCard {
  to: string
  title: string
  description: string
  details: string
  icon: React.ReactNode
  badge?: string
  color: string
  iconBg: string
}

const calculators: CalculatorCard[] = [
  {
    to: '/additives',
    title: 'Additive Calculator',
    description: 'Sodium chloride & potassium chloride per-burette additive calculations.',
    details: 'Calculates the exact mL of electrolyte additive required per burette based on patient weight, daily requirement, stock strength, and maintenance rate.',
    icon: <FlaskConical className="h-6 w-6" />,
    badge: 'NaCl / KCl',
    color: 'border-blue-200 dark:border-blue-900',
    iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
  {
    to: '/glucose',
    title: 'Glucose Strengthening',
    description: 'Calculate base + additive glucose volumes to reach a target concentration.',
    details: 'Determines the optimal mix of base and additive glucose solutions to achieve the target glucose infusion rate (GIR) and concentration.',
    icon: <Droplets className="h-6 w-6" />,
    badge: 'GIR / GCS',
    color: 'border-teal-200 dark:border-teal-900',
    iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
  },
  {
    to: '/combined',
    title: 'Combined Burette',
    description: 'Reserve electrolyte volumes first, then calculate glucose strengthening.',
    details: 'All-in-one burette calculator — reserves space for NaCl, KCl, and calcium gluconate additives, then solves glucose strengthening in the remaining volume.',
    icon: <Layers className="h-6 w-6" />,
    badge: 'Full burette',
    color: 'border-violet-200 dark:border-violet-900',
    iconBg: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
  },
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Neonatal Fluid Calculators
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Evidence-based calculation tools for neonatal fluid, electrolyte, and glucose
              management. Select a calculator below to get started.
            </p>
          </div>
        </div>

        {/* Calculator cards */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Card
              key={calc.to}
              className={`group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${calc.color}`}
              onClick={() => navigate(calc.to)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${calc.iconBg}`}
                  >
                    {calc.icon}
                  </div>
                  {calc.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {calc.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-base">{calc.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {calc.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {calc.details}
                </p>
                <Button
                  size="sm"
                  className="w-full gap-2 group-hover:gap-3 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(calc.to)
                  }}
                >
                  Open Calculator
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info note */}
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note: </span>
          All calculations are for decision-support only. Always verify results with an
          independent check and confirm against your local hospital formulary and policy.
        </div>
      </div>
    </AppLayout>
  )
}
