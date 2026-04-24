import { describe, it, expect, vi } from 'vitest'
import { useState, type ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PromptInput from '../PromptInput'
import type { ProviderConfig } from '../../lib/types'

function createProviderConfig(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
  return {
    provider: 'openai',
    apiKey: '',
    model: '',
    ...overrides,
  }
}

function renderPromptInput(overrides: Partial<ComponentProps<typeof PromptInput>> = {}) {
  return render(
    <PromptInput
      onSubmit={vi.fn().mockResolvedValue(undefined)}
      isLoading={false}
      providerConfig={createProviderConfig()}
      onProviderConfigChange={vi.fn()}
      {...overrides}
    />
  )
}

describe('PromptInput', () => {
  it('renders textarea and submit button', () => {
    renderPromptInput()
    expect(screen.getByPlaceholderText(/cyberpunk cityscape/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /optimize prompt/i })).toBeInTheDocument()
  })

  it('shows character counter starting at 0', () => {
    renderPromptInput()
    expect(screen.getByText(/0 characters/)).toBeInTheDocument()
  })

  it('updates character counter when typing', async () => {
    const user = userEvent.setup()
    renderPromptInput()
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'hello world')
    expect(screen.getByText(/11 characters/)).toBeInTheDocument()
  })

  it('disables submit button when input is empty', () => {
    renderPromptInput()
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    expect(btn).toBeDisabled()
  })

  it('enables submit button after typing', async () => {
    const user = userEvent.setup()
    renderPromptInput()
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'a sunset')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    expect(btn).not.toBeDisabled()
  })

  it('calls onSubmit with prompt when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderPromptInput({ onSubmit })
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'a beautiful sunset')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    await user.click(btn)
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith('a beautiful sunset')
  })

  it('shows error for empty submission attempt', async () => {
    const user = userEvent.setup()
    renderPromptInput()
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    // Type then clear to trigger validation path
    await user.type(textarea, 'a')
    await user.clear(textarea)
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    expect(btn).toBeDisabled()
    // Force submit via form dispatch to test validation
    const form = btn.closest('form')
    if (form) {
      // Use fireEvent.submit to properly trigger React handlers
      const { fireEvent } = await import('@testing-library/react')
      fireEvent.submit(form)
    }
    expect(screen.getByText(/Please enter a description/i)).toBeInTheDocument()
  })

  it('shows safety error for disallowed content', async () => {
    const user = userEvent.setup()
    renderPromptInput()
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'how to make meth')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    await user.click(btn)
    expect(screen.getByText(/not allowed|Content policy/i)).toBeInTheDocument()
  })

  it('disables textarea and button when loading', () => {
    renderPromptInput({ isLoading: true })
    expect(screen.getByPlaceholderText(/cyberpunk cityscape/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /analyzing/i })).toBeDisabled()
  })

  it('uses initialPrompt when provided', () => {
    renderPromptInput({ initialPrompt: 'previous idea' })
    expect(screen.getByDisplayValue('previous idea')).toBeInTheDocument()
    expect(screen.getByText(/13 characters/)).toBeInTheDocument()
  })

  it('renders provider settings controls', () => {
    renderPromptInput({ providerConfig: createProviderConfig({ provider: 'gemini' }) })
    expect(screen.getByLabelText(/AI Provider/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Model Override/i)).toBeInTheDocument()
    expect((screen.getByRole('option', { name: /Google Gemini/i }) as HTMLOptionElement).selected).toBe(true)
  })

  it('notifies when provider changes', async () => {
    const user = userEvent.setup()
    const onProviderConfigChange = vi.fn()
    renderPromptInput({ onProviderConfigChange })
    await user.selectOptions(screen.getByLabelText(/AI Provider/i), 'gemini')
    expect(onProviderConfigChange).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'gemini' })
    )
  })

  it('notifies when api key changes', async () => {
    const user = userEvent.setup()
    const onProviderConfigChange = vi.fn()
    function Wrapper() {
      const [providerConfig, setProviderConfig] = useState(createProviderConfig())
      return (
        <PromptInput
          onSubmit={vi.fn().mockResolvedValue(undefined)}
          isLoading={false}
          providerConfig={providerConfig}
          onProviderConfigChange={(next) => {
            onProviderConfigChange(next)
            setProviderConfig(next)
          }}
        />
      )
    }

    render(<Wrapper />)
    await user.type(screen.getByLabelText(/API Key/i), 'AIza-test')
    expect(onProviderConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ apiKey: 'AIza-test' })
    )
  })
})
