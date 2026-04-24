import type { ClarificationAnswer, OptimizationResult, ProviderConfig } from './types'

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
    const data = await response.json().catch(() => ({ error: 'Request failed.' }))
    throw new Error(data.error || `Server error: ${response.status}`)
  }

  return response.json()
}
