import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateKeyPairSync } from 'crypto'
import handler from './download'
import { parseLicenseDocument, verifyLicenseDocument } from '../../src/lib/license-core'

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
      session_id: 'cs_paid_123',
    },
    ...overrides,
  } as VercelRequest
}

function createResponse() {
  const state = {
    statusCode: 200,
    jsonBody: null as unknown,
    sentBody: '' as string,
    headers: {} as Record<string, string>,
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
    send(body: string) {
      state.sentBody = body
      return this
    },
    setHeader(name: string, value: string) {
      state.headers[name] = value
    },
  } as unknown as VercelResponse

  return { res, state }
}

describe('api/license/download', () => {
  const originalEnv = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    IPO_LICENSE_PRIVATE_KEY_PEM: process.env.IPO_LICENSE_PRIVATE_KEY_PEM,
  }
  const keyPair = generateKeyPairSync('rsa', { modulusLength: 2048 })
  const privateKeyPem = keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  const publicKeyPem = keyPair.publicKey.export({ type: 'spki', format: 'pem' }).toString()

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.IPO_LICENSE_PRIVATE_KEY_PEM = privateKeyPem
  })

  afterEach(() => {
    Object.assign(process.env, originalEnv)
  })

  it('returns a downloadable signed license for a paid session', async () => {
    mockRetrieve.mockResolvedValueOnce({
      id: 'cs_paid_123',
      created: 1777000000,
      payment_status: 'paid',
      customer_details: {
        email: 'buyer@example.com',
        name: 'Buyer',
      },
    })

    const { res, state } = createResponse()
    await handler(createRequest(), res)

    expect(state.statusCode).toBe(200)
    expect(state.headers['Content-Disposition']).toContain('Image-Prompt-Optimizer-license.lic')

    const document = parseLicenseDocument(state.sentBody)
    expect(verifyLicenseDocument(document, publicKeyPem)).toEqual({
      licensed: true,
      issuedTo: 'Buyer',
      plan: 'desktop-buyout',
      expiresAt: undefined,
      perpetual: true,
    })
  })

  it('rejects unpaid sessions', async () => {
    mockRetrieve.mockResolvedValueOnce({
      id: 'cs_open_123',
      created: 1777000000,
      payment_status: 'unpaid',
      customer_details: {
        email: 'buyer@example.com',
      },
    })

    const { res, state } = createResponse()
    await handler(createRequest(), res)

    expect(state.statusCode).toBe(403)
    expect(state.jsonBody).toEqual({
      error: 'Stripe session is not paid.',
    })
  })
})
