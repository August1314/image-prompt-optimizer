import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PromptInput from '../PromptInput'

describe('PromptInput', () => {
  it('renders textarea and submit button', () => {
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    expect(screen.getByPlaceholderText(/cyberpunk cityscape/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /optimize prompt/i })).toBeInTheDocument()
  })

  it('shows character counter starting at 0', () => {
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    expect(screen.getByText(/0 characters/)).toBeInTheDocument()
  })

  it('updates character counter when typing', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'hello world')
    expect(screen.getByText(/11 characters/)).toBeInTheDocument()
  })

  it('disables submit button when input is empty', () => {
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    expect(btn).toBeDisabled()
  })

  it('enables submit button after typing', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'a sunset')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    expect(btn).not.toBeDisabled()
  })

  it('calls onSubmit with prompt when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<PromptInput onSubmit={onSubmit} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'a beautiful sunset')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    await user.click(btn)
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith('a beautiful sunset')
  })

  it('shows error for empty submission attempt', async () => {
    const user = userEvent.setup()
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
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
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} />)
    const textarea = screen.getByPlaceholderText(/cyberpunk cityscape/i)
    await user.type(textarea, 'how to make meth')
    const btn = screen.getByRole('button', { name: /optimize prompt/i })
    await user.click(btn)
    expect(screen.getByText(/not allowed|Content policy/i)).toBeInTheDocument()
  })

  it('disables textarea and button when loading', () => {
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={true} />)
    expect(screen.getByPlaceholderText(/cyberpunk cityscape/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /analyzing/i })).toBeDisabled()
  })

  it('uses initialPrompt when provided', () => {
    render(<PromptInput onSubmit={vi.fn().mockResolvedValue(undefined)} isLoading={false} initialPrompt="previous idea" />)
    expect(screen.getByDisplayValue('previous idea')).toBeInTheDocument()
    expect(screen.getByText(/13 characters/)).toBeInTheDocument()
  })
})
