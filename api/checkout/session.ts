import type { VercelRequest, VercelResponse } from '@vercel/node'
import { retrieveCheckoutSession, serializeCheckoutSession } from '../../src/lib/checkout-server'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : ''
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing required query parameter: session_id.' })
  }

  try {
    const session = await retrieveCheckoutSession(sessionId, process.env)
    return res.status(200).json(serializeCheckoutSession(session))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load Stripe checkout session.'
    return res.status(500).json({ error: message })
  }
}
