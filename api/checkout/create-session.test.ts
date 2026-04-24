import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './create-session'

const { mockCreate, mockStripeConstructor } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockStripeConstructor: vi.fn(),
}))

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      constructor(options: unknown) {
        mockStripeConstructor(options)
      }

      checkout = {
        sessions: {
          create: mockCreate,
        },
      }
    },
  }
})

function createRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    body: {},
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

describe('api/checkout/create-session', () => {
  const originalEnv = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    APP_BASE_URL: process.env.APP_BASE_URL,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_PRICE_ID = 'price_123'
    process.env.APP_BASE_URL = 'https://image-prompt-optimizer.vercel.app'
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
  })

  it('returns a checkout url', async () => {
    mockCreate.mockResolvedValueOnce({ url: 'https://checkout.stripe.test/session' })
    const { res, state } = createResponse()

    await handler(createRequest(), res)

    expect(state.statusCode).toBe(200)
    expect(state.jsonBody).toEqual({ url: 'https://checkout.stripe.test/session' })
    expect(mockStripeConstructor).toHaveBeenCalledWith('sk_test_123')
  })

  it('returns a config error when required env is missing', async () => {
    delete process.env.STRIPE_PRICE_ID
    const { res, state } = createResponse()

    await handler(createRequest(), res)

    expect(state.statusCode).toBe(500)
    expect(state.jsonBody).toEqual({
      error: 'Missing required environment variable: STRIPE_PRICE_ID',
    })
  })
})
