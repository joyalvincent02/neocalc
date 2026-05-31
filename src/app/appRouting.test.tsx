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

  it('switches theme via the segmented theme control', async () => {
    const user = userEvent.setup()
    renderAt('/additives')

    const root = document.documentElement

    // Default: system (light in tests per matchMedia mock)
    expect(root.classList.contains('dark')).toBe(false)

    // Wait for Suspense, then click "Dark mode" button
    const darkButton = await screen.findByRole('button', { name: /dark mode/i })
    await user.click(darkButton)
    expect(root.classList.contains('dark')).toBe(true)

    // Click "Light mode" button
    const lightButton = screen.getByRole('button', { name: /light mode/i })
    await user.click(lightButton)
    expect(root.classList.contains('dark')).toBe(false)
  })
})
