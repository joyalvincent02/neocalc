import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { DISCLAIMER_TEXT } from '../config/safetyMessages'
import { ThemeProvider } from '../hooks/useTheme'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { AdditiveCalculatorPage } from '../features/additive-calculator/AdditiveCalculatorPage'
import { GlucoseCalculatorPage } from '../features/glucose-calculator/GlucoseCalculatorPage'
import { CombinedBurettePage } from '../features/combined-burette/CombinedBurettePage'

const testRoutes: RouteObject[] = [
  { path: '/', element: <DashboardPage /> },
  { path: '/additives', element: <AdditiveCalculatorPage /> },
  { path: '/glucose', element: <GlucoseCalculatorPage /> },
  { path: '/combined', element: <CombinedBurettePage /> },
]

function renderAt(path: string) {
  window.localStorage.removeItem('neocalc.theme')
  const router = createMemoryRouter(testRoutes, { initialEntries: [path] })
  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  )
}

describe('app routing + safety banner', () => {
  it('shows disclaimer banner on additive page', async () => {
    renderAt('/additives')
    // Routes are lazily loaded — wait for Suspense to resolve
    expect(await screen.findByText(DISCLAIMER_TEXT)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /additive calculator/i })).toBeInTheDocument()
  })

  it('navigates to glucose page', async () => {
    const user = userEvent.setup()
    renderAt('/additives')
    await user.click(
      await screen.findByRole('link', { name: /glucose strengthening/i }),
    )
    expect(
      await screen.findByRole('heading', { name: /glucose strengthening/i }),
    ).toBeInTheDocument()
  })

  it('can run a default additive calculation and shows a result', async () => {
    const user = userEvent.setup()
    renderAt('/additives')
    await user.click(await screen.findByRole('button', { name: /calculate/i }))
    expect(
      await screen.findByText(/Final instruction/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Per 100 mL burette/i)).toBeInTheDocument()
  })

  it('cycles theme via the toggle switch', async () => {
    const user = userEvent.setup()
    renderAt('/additives')

    const root = document.documentElement

    // Default: system (light in tests per matchMedia mock)
    expect(root.classList.contains('dark')).toBe(false)

    const toggles = await screen.findAllByRole('button', { name: /switch to light mode/i })
    const toggle = toggles[0]!

    await user.click(toggle) // system → light
    expect(root.classList.contains('dark')).toBe(false)

    await user.click(toggle) // light → dark
    expect(root.classList.contains('dark')).toBe(true)

    await user.click(toggle) // dark → system (light in tests)
    expect(root.classList.contains('dark')).toBe(false)
  })
})
