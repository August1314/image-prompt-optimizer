import type { VercelRequest, VercelResponse } from '@vercel/node'
import { COMMERCE_PLAN_ID, COMMERCE_PRODUCT_NAME } from '../../src/lib/commerce.js'
import { CheckoutConfigError, getLicenseSigningKey, retrieveCheckoutSession } from '../../src/lib/checkout-server.js'
import { signLicenseDocument } from '../../src/lib/license-core.js'

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

    if (session.payment_status !== 'paid') {
      return res.status(403).json({ error: 'Stripe session is not paid.' })
    }

    const issuedTo = session.customer_details?.name || session.customer_details?.email
    if (!issuedTo) {
      return res.status(409).json({ error: 'Paid session is missing customer identity.' })
    }

    const license = signLicenseDocument(
      {
        licenseId: `stripe-${session.id}`,
        issuedTo,
        plan: COMMERCE_PLAN_ID,
        issuedAt: new Date(session.created * 1000).toISOString(),
        perpetual: true,
      },
      getLicenseSigningKey(process.env),
    )

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${COMMERCE_PRODUCT_NAME.replace(/\s+/g, '-')}-license.lic"`)
    return res.status(200).send(JSON.stringify(license, null, 2))
  } catch (error) {
    if (error instanceof CheckoutConfigError) {
      return res.status(503).json({ error: 'License delivery is not configured yet. Please contact support.' })
    }

    const message = error instanceof Error ? error.message : 'Unable to generate license.'
    return res.status(500).json({ error: message })
  }
}
