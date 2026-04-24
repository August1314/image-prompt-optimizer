import type { ClarificationAnswer, OptimizationResult, ProviderConfig } from './types'
import { readJsonSafely } from './http'

const API_BASE = '/api'

export async function optimizePrompt(
  prompt: string,
  answers: ClarificationAnswer[],
  providerConfig: ProviderConfig
): Promise<OptimizationResult> {
  const response = await fetch(`${API_BASE}/optimize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, answers, providerConfig }),
  })

  if (!response.ok) {
    const data = await readJsonSafely<Record<string, unknown>>(response, 'Request failed.')
    const message = typeof data.error === 'string' ? data.error : `Server error: ${response.status}`
    throw new Error(message)
  }

  return readJsonSafely<OptimizationResult>(response, 'Request failed.')
}
