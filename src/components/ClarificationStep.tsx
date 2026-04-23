import { useState } from 'react'
import type { ClarificationAnswer } from '../lib/types'

interface Props {
  questions: string[]
  answers: ClarificationAnswer[]
  onSubmit: (answers: ClarificationAnswer[]) => Promise<void>
  isLoading: boolean
  onBack?: () => void
}

function ClarificationStep({ questions, answers, onSubmit, isLoading, onBack }: Props) {
  const [localAnswers, setLocalAnswers] = useState<ClarificationAnswer[]>(answers)
  const [error, setError] = useState<string | null>(null)

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...localAnswers]
    updated[index] = { ...updated[index], answer: value }
    setLocalAnswers(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emptyFields = localAnswers.some((a) => !a.answer.trim())
    if (emptyFields) {
      setError('Please answer all questions before continuing.')
      return
    }

    await onSubmit(localAnswers)
  }

  const allAnswered = localAnswers.every((a) => a.answer.trim())

  return (
    <div className="card">
      <div className="card-header">Help Us Understand Your Vision</div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Please answer a few quick questions to help us craft the perfect prompt for your image.
      </p>
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <label className="label" htmlFor={`q-${index}`}>
              {question}
            </label>
            <textarea
              id={`q-${index}`}
              className="textarea"
              value={localAnswers[index]?.answer || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder="Your answer..."
              disabled={isLoading}
              rows={3}
            />
          </div>
        ))}
        {error && (
          <div className="error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {onBack && (
              <button type="button" className="btn btn-secondary" onClick={onBack}>
                ← Back
              </button>
            )}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>
              {allAnswered
                ? 'All questions answered!'
                : `${localAnswers.filter((a) => a.answer.trim()).length}/${questions.length} answered`}
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !allAnswered}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Generating...
              </>
            ) : (
              'Generate Optimized Prompt'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClarificationStep
