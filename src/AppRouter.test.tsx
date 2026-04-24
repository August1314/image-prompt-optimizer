import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './AppRouter'

function renderRouter(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRouter />
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  it('renders the buy page route', () => {
    renderRouter(['/buy'])
    expect(screen.getByRole('heading', { name: /Image Prompt Optimizer/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Buy now/i })).toBeInTheDocument()
  })

  it('navigates from the floating buy button to the buy page', async () => {
    const user = userEvent.setup()
    renderRouter(['/'])
    await user.click(screen.getByRole('link', { name: /Buy once or start local/i }))
    expect(screen.getByRole('button', { name: /Buy now/i })).toBeInTheDocument()
  })

  it('renders the success page route', () => {
    renderRouter(['/buy/success?session_id=test-session'])
    expect(screen.getByRole('heading', { name: /Your desktop license is ready/i })).toBeInTheDocument()
  })

  it('renders the cancel page route', () => {
    renderRouter(['/buy/cancel'])
    expect(screen.getByRole('heading', { name: /No charge was completed/i })).toBeInTheDocument()
  })
})
