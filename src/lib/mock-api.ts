import type { Connect } from 'vite'
import type { ClarificationAnswer } from './types'
import { checkServerSafety } from './safety.server'
import { runMockOptimizer } from './mock-optimizer'

/**
 * Deterministic mock API middleware for local Vite development.
 * Returns realistic-looking placeholder responses that follow the same schema
 * as the real API, so the UI flow can be tested end-to-end without an OpenAI key.
 */

interface MockOptimizeRequest {
  prompt: string
  answers: ClarificationAnswer[]
}

interface MockOptimizeResponse {
  statusCode: number
  body: Record<string, unknown>
}

function isClarificationAnswer(value: unknown): value is ClarificationAnswer {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ClarificationAnswer).question === 'string' &&
    typeof (value as ClarificationAnswer).answer === 'string'
  )
}

function isMockOptimizeRequest(body: unknown): body is MockOptimizeRequest {
  if (typeof body !== 'object' || body === null) {
    return false
  }

  const candidate = body as Record<string, unknown>

  return (
    typeof candidate.prompt === 'string' &&
    Array.isArray(candidate.answers) &&
    candidate.answers.every(isClarificationAnswer)
  )
}

export function createMockOptimizeResponse(body: unknown): MockOptimizeResponse {
  if (!isMockOptimizeRequest(body)) {
    return {
      statusCode: 400,
      body: { error: 'Invalid request body. Expected { prompt: string, answers: array }.' },
    }
  }

  const { prompt, answers } = body
  const fullText = `${prompt} ${answers.map((answer) => answer.answer).join(' ')}`
  const safetyResult = checkServerSafety(fullText)

  if (!safetyResult.safe) {
    return {
      statusCode: 422,
      body: { error: safetyResult.reason ?? 'Request rejected by safety policy.' },
    }
  }

  const result = runMockOptimizer(prompt, answers)

  return {
    statusCode: 200,
    body: result as unknown as Record<string, unknown>,
  }
}

export function mockApiMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.url !== '/api/optimize' || req.method !== 'POST') {
      return next()
    }

    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        const result = createMockOptimizeResponse(parsed)

        res.setHeader('Content-Type', 'application/json')
        res.statusCode = result.statusCode
        res.end(JSON.stringify(result.body))
      } catch {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Invalid JSON body.' }))
      }
    })
  }
}
