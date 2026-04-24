import Stripe from 'stripe'
import { COMMERCE_PLAN_ID, COMMERCE_PRICE_LABEL, COMMERCE_PRODUCT_NAME } from './commerce.js'

export class CheckoutConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CheckoutConfigError'
  }
}

function requireEnv(name: string, value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new CheckoutConfigError(`Missing required environment variable: ${name}`)
  }
  return trimmed
}

export function createStripeClient(env: NodeJS.ProcessEnv) {
  return new Stripe(requireEnv('STRIPE_SECRET_KEY', env.STRIPE_SECRET_KEY))
}

export function getCheckoutConfig(env: NodeJS.ProcessEnv) {
  const appBaseUrl = requireEnv('APP_BASE_URL', env.APP_BASE_URL).replace(/\/$/, '')
  const priceId = requireEnv('STRIPE_PRICE_ID', env.STRIPE_PRICE_ID)

  return {
    appBaseUrl,
    priceId,
    successUrl: `${appBaseUrl}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${appBaseUrl}/buy/cancel`,
  }
}

export function getLicenseSigningKey(env: NodeJS.ProcessEnv) {
  return requireEnv('IPO_LICENSE_PRIVATE_KEY_PEM', env.IPO_LICENSE_PRIVATE_KEY_PEM)
}

export async function createCheckoutSession(env: NodeJS.ProcessEnv) {
  const stripe = createStripeClient(env)
  const config = getCheckoutConfig(env)

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: config.priceId,
        quantity: 1,
      },
    ],
    success_url: config.successUrl,
    cancel_url: config.cancelUrl,
    billing_address_collection: 'auto',
    allow_promotion_codes: false,
    metadata: {
      plan: COMMERCE_PLAN_ID,
      product: COMMERCE_PRODUCT_NAME,
      priceLabel: COMMERCE_PRICE_LABEL,
    },
  })
}

export async function retrieveCheckoutSession(sessionId: string, env: NodeJS.ProcessEnv) {
  const stripe = createStripeClient(env)
  return stripe.checkout.sessions.retrieve(sessionId)
}

export function serializeCheckoutSession(session: {
  payment_status?: string | null
  customer_details?: { email?: string | null; name?: string | null } | null
}) {
  return {
    paymentStatus: session.payment_status || 'unpaid',
    customerEmail: session.customer_details?.email || undefined,
    customerName: session.customer_details?.name || undefined,
    priceLabel: COMMERCE_PRICE_LABEL,
    productLabel: COMMERCE_PRODUCT_NAME,
  }
}
