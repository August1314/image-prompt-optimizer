import { useState } from 'react'
import { OptimizationResult } from '../App'

interface Props {
  result: OptimizationResult
  onReset: () => void
}

function ResultStep({ result, onReset }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      setCopiedField(null)
    }
  }

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      className="btn btn-secondary copy-btn"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? 'Copied!' : 'Copy'}
    </button>
  )

  return (
    <div>
      <div className="success" style={{ marginBottom: '1.5rem' }}>
        Your optimized prompts are ready! Use them with your favorite AI image generator.
      </div>

      {/* Optimized Prompt */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Optimized Prompt</span>
          <span className="badge badge-accent">Positive</span>
        </div>
        <div className="prompt-block">
          <CopyButton text={result.optimizedPrompt} field="optimized" />
          <pre>{result.optimizedPrompt}</pre>
        </div>
      </div>

      {/* Negative Prompt */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Negative Prompt</span>
          <span className="badge">What to avoid</span>
        </div>
        <div className="prompt-block">
          <CopyButton text={result.negativePrompt} field="negative" />
          <pre>{result.negativePrompt}</pre>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Add this to exclude unwanted elements in your generated image.
        </p>
      </div>

      {/* Model Advice */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Model Recommendations</span>
          <span className="badge">Guidance</span>
        </div>
        <div className="prompt-block">
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result.modelAdvice}</pre>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Suggested settings and model for best results with this type of prompt.
        </p>
      </div>

      {/* Stripe placeholder */}
      <div className="card" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Want more features? Save and manage your prompts.
        </p>
        <button className="btn btn-primary" disabled>
          Premium (Coming Soon)
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Stripe integration placeholder
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onReset}>
          Create Another Prompt
        </button>
      </div>
    </div>
  )
}

export default ResultStep
