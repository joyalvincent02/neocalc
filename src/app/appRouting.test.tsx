import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from './routes'
import { DISCLAIMER_TEXT } from '../config/safetyMessages'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
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
})

