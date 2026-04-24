import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createCheckoutSession } from '../../src/lib/checkout-server'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const session = await createCheckoutSession(process.env)
    if (!session.url) {
      return res.status(502).json({ error: 'Stripe checkout did not return a redirect URL.' })
    }

    return res.status(200).json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create Stripe checkout session.'
    return res.status(500).json({ error: message })
  }
}
