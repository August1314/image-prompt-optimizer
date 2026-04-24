import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from '../../../api/checkout/session'

const { mockRetrieve } = vi.hoisted(() => ({
  mockRetrieve: vi.fn(),
}))

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      checkout = {
        sessions: {
          retrieve: mockRetrieve,
        },
      }
    },
  }
})

function createRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    query: {
      session_id: 'cs_test_123',
    },
    ...overrides,
  } as VercelRequest
}

function createResponse() {
  const state = {
    statusCode: 200,
    jsonBody: null as unknown,
  }

  const res = {
    status(code: number) {
      state.statusCode = code
      return this
    },
    json(body: unknown) {
      state.jsonBody = body
      return this
    },
  } as VercelResponse

  return { res, state }
}

describe('api/checkout/session', () => {
  const originalStripeKey = process.env.STRIPE_SECRET_KEY

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
  })

  afterEach(() => {
    if (originalStripeKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY
    } else {
      process.env.STRIPE_SECRET_KEY = originalStripeKey
    }
  })

  it('returns a session summary', async () => {
    mockRetrieve.mockResolvedValueOnce({
      payment_status: 'paid',
      customer_details: {
        email: 'buyer@example.com',
        name: 'Buyer',
      },
    })
    const { res, state } = createResponse()

    await handler(createRequest(), res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toEqual({
      paymentStatus: 'paid',
      customerEmail: 'buyer@example.com',
      customerName: 'Buyer',
      priceLabel: '$19',
      productLabel: 'Image Prompt Optimizer',
    })
  })

  it('returns 400 when session_id is missing', async () => {
    const { res, state } = createResponse()
    await handler(createRequest({ query: {} }), res)
    expect(state.statusCode).toBe(400)
    expect(state.jsonBody).toEqual({
      error: 'Missing required query parameter: session_id.',
    })
  })
})
