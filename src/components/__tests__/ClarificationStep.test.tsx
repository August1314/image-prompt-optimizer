import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClarificationStep from '../ClarificationStep'
import type { ClarificationAnswer } from '../../lib/types'

const defaultQuestions = [
  'What is the primary lighting condition?',
  'Describe the art style you prefer.',
  'What color palette or mood are you aiming for?',
]

const defaultAnswers: ClarificationAnswer[] = defaultQuestions.map((q) => ({
  question: q,
  answer: '',
}))

function renderClarificationStep(overrides: Partial<Parameters<typeof ClarificationStep>[0]> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  const onBack = vi.fn()
  const props = {
    questions: defaultQuestions,
    answers: defaultAnswers,
    onSubmit,
    isLoading: false,
    onBack,
    ...overrides,
  }
  return { ...render(<ClarificationStep {...props} />), onSubmit, onBack }
}

describe('ClarificationStep', () => {
  it('renders all questions as textareas', () => {
    renderClarificationStep()
    defaultQuestions.forEach((q) => {
      expect(screen.getByText(q)).toBeInTheDocument()
    })
    const textareas = screen.getAllByPlaceholderText('Your answer...')
    expect(textareas).toHaveLength(defaultQuestions.length)
  })

  it('shows progress indicator for unanswered questions', () => {
    renderClarificationStep()
    expect(screen.getByText(`0/${defaultQuestions.length} answered`)).toBeInTheDocument()
  })

  it('disables submit button when not all questions are answered', () => {
    renderClarificationStep()
    const submitBtn = screen.getByRole('button', { name: /generate optimized prompt/i })
    expect(submitBtn).toBeDisabled()
  })

  it('enables submit button when all questions are answered', async () => {
    const user = userEvent.setup()
    renderClarificationStep()

    const textareas = screen.getAllByPlaceholderText('Your answer...')
    for (const textarea of textareas) {
      await user.type(textarea, 'some answer')
    }

    const submitBtn = screen.getByRole('button', { name: /generate optimized prompt/i })
    expect(submitBtn).not.toBeDisabled()
  })

  it('shows back button when onBack is provided', () => {
    renderClarificationStep()
    expect(screen.getByRole('button', { name: /← back/i })).toBeInTheDocument()
  })

  it('does not show back button when onBack is not provided', () => {
    renderClarificationStep({ onBack: undefined })
    expect(screen.queryByRole('button', { name: /← back/i })).not.toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    const { onBack } = renderClarificationStep()
    await user.click(screen.getByRole('button', { name: /← back/i }))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onSubmit with filled answers when form is submitted', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderClarificationStep()

    const textareas = screen.getAllByPlaceholderText('Your answer...')
    const answers = ['golden hour', 'oil painting', 'warm and vibrant']
    for (let i = 0; i < textareas.length; i++) {
      await user.type(textareas[i], answers[i])
    }

    const submitBtn = screen.getByRole('button', { name: /generate optimized prompt/i })
    await user.click(submitBtn)

    expect(onSubmit).toHaveBeenCalledOnce()
    const submittedAnswers = onSubmit.mock.calls[0][0] as ClarificationAnswer[]
    submittedAnswers.forEach((a, i) => {
      expect(a.answer).toBe(answers[i])
    })
  })

  it('shows error when submitting with empty fields', async () => {
    // Enable the button by setting all answers, then clear one
    const user = userEvent.setup()
    const filledAnswers = defaultQuestions.map((q, i) => ({
      question: q,
      answer: `answer ${i}`,
    }))
    renderClarificationStep({ answers: filledAnswers })

    // Clear one answer
    const textareas = screen.getAllByPlaceholderText('Your answer...')
    await user.clear(textareas[0])

    // Now try submitting - button should be disabled
    const submitBtn = screen.getByRole('button', { name: /generate optimized prompt/i })
    expect(submitBtn).toBeDisabled()
  })

  it('disables inputs when loading', () => {
    renderClarificationStep({ isLoading: true })
    const textareas = screen.getAllByPlaceholderText('Your answer...')
    textareas.forEach((t) => expect(t).toBeDisabled())
  })
})
