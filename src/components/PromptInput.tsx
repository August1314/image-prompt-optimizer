import { useState } from 'react'
import { checkSafety } from '../lib/safety'

interface Props {
  onSubmit: (prompt: string) => Promise<void>
  isLoading: boolean
  initialPrompt?: string
}

function PromptInput({ onSubmit, isLoading, initialPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!prompt.trim()) {
      setError('Please enter a description of your image idea.')
      return
    }

    const safetyResult = checkSafety(prompt)
    if (!safetyResult.safe) {
      setError(safetyResult.reason || 'Content policy violation detected.')
      return
    }

    await onSubmit(prompt)
  }

  return (
    <div className="card">
      <div className="card-header">Describe Your Image Idea</div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cyberpunk cityscape at night with neon lights reflecting off wet streets, a lone figure walks through a crowded market..."
          disabled={isLoading}
          rows={6}
        />
        {error && (
          <div className="error" style={{ marginTop: '1rem', marginBottom: 0 }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Analyzing...
              </>
            ) : (
              'Optimize Prompt'
            )}
          </button>
        </div>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Tip: Be as descriptive as you'd like. The optimizer will help clarify any ambiguities.
      </p>
    </div>
  )
}

export default PromptInput
