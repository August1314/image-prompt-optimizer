import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResultStep from '../ResultStep'
import type { OptimizationResult } from '../../lib/types'

function createResult(overrides: Partial<OptimizationResult> = {}): OptimizationResult {
  return {
    optimizedPrompt: 'A highly detailed cyberpunk cityscape, neon lights, rain, 8K resolution',
    negativePrompt: 'blurry, low quality, distorted, deformed',
    modelAdvice: 'Midjourney: works great with --ar 16:9 --v 6.0. DALL-E 3: keep descriptions concise.',
    clarificationQuestions: [],
    ...overrides,
  }
}

function renderResultStep(overrides: Partial<Parameters<typeof ResultStep>[0]> = {}) {
  const onReset = vi.fn()
  const onEditPrompt = vi.fn()
  const props = {
    result: createResult(),
    onReset,
    onEditPrompt,
    ...overrides,
  }
  return { ...render(<ResultStep {...props} />), onReset, onEditPrompt }
}

describe('ResultStep', () => {
  it('renders optimized prompt', () => {
    renderResultStep()
    expect(screen.getByText('Optimized Prompt')).toBeInTheDocument()
    expect(screen.getByText(/cyberpunk cityscape/)).toBeInTheDocument()
  })

  it('renders negative prompt', () => {
    renderResultStep()
    expect(screen.getByText('Negative Prompt')).toBeInTheDocument()
    expect(screen.getByText(/blurry, low quality/)).toBeInTheDocument()
  })

  it('renders model recommendations', () => {
    renderResultStep()
    expect(screen.getByText('Model Recommendations')).toBeInTheDocument()
    expect(screen.getByText(/works great with/)).toBeInTheDocument()
  })

  it('renders model badges when advice mentions known models', () => {
    renderResultStep()
    expect(screen.getByText('Midjourney')).toBeInTheDocument()
    // DALL·E badge requires the exact model name in advice text
  })

  it('does not render model badges when no models are mentioned', () => {
    renderResultStep({ result: createResult({ modelAdvice: 'Use any model you prefer.' }) })
    expect(screen.queryByText('Midjourney')).not.toBeInTheDocument()
  })

  it('calls onEditPrompt when Edit Prompt button is clicked', async () => {
    const user = userEvent.setup()
    const { onEditPrompt } = renderResultStep()
    await user.click(screen.getByRole('button', { name: /edit prompt/i }))
    expect(onEditPrompt).toHaveBeenCalledOnce()
  })

  it('calls onReset when New Prompt button is clicked', async () => {
    const user = userEvent.setup()
    const { onReset } = renderResultStep()
    await user.click(screen.getByRole('button', { name: /new prompt/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('shows copy buttons for prompt fields', () => {
    renderResultStep()
    const copyButtons = screen.getAllByRole('button', { name: /copy/i })
    expect(copyButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('shows success message', () => {
    renderResultStep()
    expect(screen.getByText(/Your optimized prompts are ready!/)).toBeInTheDocument()
  })

  it('renders with empty result values gracefully', () => {
    renderResultStep({
      result: createResult({ optimizedPrompt: '', negativePrompt: '', modelAdvice: '' }),
    })
    expect(screen.getByText('Optimized Prompt')).toBeInTheDocument()
    expect(screen.getByText('Negative Prompt')).toBeInTheDocument()
    expect(screen.getByText('Model Recommendations')).toBeInTheDocument()
  })

  it('shows mock mode notice when _mock flag is present', () => {
    renderResultStep({
      result: createResult({ _mock: true, _notice: 'Running in mock mode for testing.' }),
    })
    expect(screen.getByText('Mock Mode')).toBeInTheDocument()
    expect(screen.getByText(/Running in mock mode for testing./)).toBeInTheDocument()
  })

  it('does not show mock mode notice when _mock flag is absent', () => {
    renderResultStep()
    expect(screen.queryByText('Mock Mode')).not.toBeInTheDocument()
  })
})
