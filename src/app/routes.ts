import { createElement, lazy, Suspense, type ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage }))
)
const AdditiveCalculatorPage = lazy(() =>
  import('../features/additive-calculator/AdditiveCalculatorPage').then(m => ({
    default: m.AdditiveCalculatorPage,
  }))
)
const CombinedBurettePage = lazy(() =>
  import('../features/combined-burette/CombinedBurettePage').then(m => ({
    default: m.CombinedBurettePage,
  }))
)
const GlucoseCalculatorPage = lazy(() =>
  import('../features/glucose-calculator/GlucoseCalculatorPage').then(m => ({
    default: m.GlucoseCalculatorPage,
  }))
)

const suspend = (component: ReactNode) =>
  createElement(Suspense, { fallback: null }, component)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: suspend(createElement(DashboardPage)),
  },
  {
    path: '/additives',
    element: suspend(createElement(AdditiveCalculatorPage)),
  },
  {
    path: '/glucose',
    element: suspend(createElement(GlucoseCalculatorPage)),
  },
  {
    path: '/combined',
    element: suspend(createElement(CombinedBurettePage)),
  },
]
