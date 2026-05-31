import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from './routes'
import { DISCLAIMER_TEXT } from '../config/safetyMessages'
import { ThemeProvider } from '../hooks/useTheme'

function renderAt(path: string) {
  window.localStorage.removeItem('neocalc.theme')
  const router = createMemoryRouter(routes, { initialEntries: [path] })
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
    // Wait for Suspense to resolve, then click sidebar nav link
    await user.click(await screen.findByRole('link', { name: /glucose/i }))
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

    const toggle = await screen.findByRole('button', { name: /switch to light mode/i })

    await user.click(toggle) // system → light
    expect(root.classList.contains('dark')).toBe(false)

    await user.click(toggle) // light → dark
    expect(root.classList.contains('dark')).toBe(true)

    await user.click(toggle) // dark → system (light in tests)
    expect(root.classList.contains('dark')).toBe(false)
  })
})
