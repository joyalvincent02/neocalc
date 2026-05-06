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
  it('shows disclaimer banner on additive page', () => {
    renderAt('/additives')
    expect(screen.getByText('Disclaimer')).toBeInTheDocument()
    expect(screen.getByText(DISCLAIMER_TEXT)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /additive calculator/i })).toBeInTheDocument()
  })

  it('navigates to glucose page', async () => {
    const user = userEvent.setup()
    renderAt('/additives')
    await user.click(screen.getByRole('link', { name: /glucose/i }))
    expect(
      await screen.findByRole('heading', { name: /glucose strengthening/i }),
    ).toBeInTheDocument()
  })

  it('can run a default additive calculation and shows a result', async () => {
    const user = userEvent.setup()
    renderAt('/additives')
    await user.click(screen.getByRole('button', { name: /calculate/i }))
    expect(
      await screen.findByText(/Final instruction/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Per 100 mL burette/i)).toBeInTheDocument()
  })

  it('cycles theme and toggles root dark class', async () => {
    const user = userEvent.setup()
    renderAt('/additives')

    const root = document.documentElement
    const toggle = screen.getByRole('button', { name: /theme:/i })

    // With our test setup: system=light initially, and cycle is system -> dark -> system -> dark ...
    expect(root.classList.contains('dark')).toBe(false)

    await user.click(toggle) // system -> dark
    expect(root.classList.contains('dark')).toBe(true)

    await user.click(toggle) // dark -> system (system light)
    expect(root.classList.contains('dark')).toBe(false)
  })
})

