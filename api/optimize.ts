import type { VercelRequest, VercelResponse } from '@vercel/node'
import { OptimizationCoreError, runOptimization } from '../src/lib/optimize-core.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const result = await runOptimization(req.body, {
      env: process.env,
      allowEnvKeyFallback: true,
    })

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof OptimizationCoreError) {
      return res.status(error.statusCode).json({ error: error.message })
    }

    console.error('Optimization error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' })
  }
}
