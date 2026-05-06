import { createElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { AdditiveCalculatorPage } from '../features/additive-calculator/AdditiveCalculatorPage'
import { CombinedBurettePage } from '../features/combined-burette/CombinedBurettePage'
import { GlucoseCalculatorPage } from '../features/glucose-calculator/GlucoseCalculatorPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: createElement(DashboardPage),
  },
  {
    path: '/additives',
    element: createElement(AdditiveCalculatorPage),
  },
  {
    path: '/glucose',
    element: createElement(GlucoseCalculatorPage),
  },
  {
    path: '/combined',
    element: createElement(CombinedBurettePage),
  },
]
