import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import BuyPage from './BuyPage'

describe('BuyPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('submits a real JSON body and shows a friendly error when the API returns plain text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('A server error has occurred', {
        status: 500,
        statusText: 'Internal Server Error',
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <BuyPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /buy now/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/checkout/create-session',
      expect.objectContaining({
        method: 'POST',
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    expect(
      await screen.findByText('Checkout is temporarily unavailable right now. Please try again in a moment.'),
    ).toBeInTheDocument()
  })
})
