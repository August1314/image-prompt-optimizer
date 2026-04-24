import { useState } from 'react'
import { getProviderDefinition, isAIProvider } from '../lib/providers'
import type { OptimizationResult } from '../lib/types'

interface ModelBadge {
  name: string
  color: string
  icon: string
}

const MODEL_BADGES: ModelBadge[] = [
  { name: 'Midjourney', color: '#5865F2', icon: '🎨' },
  { name: 'DALL·E', color: '#10A37F', icon: '🖼️' },
  { name: 'Stable Diffusion', color: '#9333EA', icon: '⚡' },
  { name: 'Flux', color: '#F97316', icon: '✨' },
]

function parseModelBadges(advice: string): ModelBadge[] {
  return MODEL_BADGES.filter((badge) =>
    advice.toLowerCase().includes(badge.name.toLowerCase())
  )
}

interface Props {
  result: OptimizationResult
  onReset: () => void
  onEditPrompt: () => void
}

function ResultStep({ result, onReset, onEditPrompt }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const matchedBadges = parseModelBadges(result.modelAdvice)
  const providerLabel = result._provider && isAIProvider(result._provider)
    ? getProviderDefinition(result._provider).label
    : null

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
      {/* Mock mode notice */}
      {result._mock && result._notice && (
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            color: '#92400e',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <span>⚠️</span>
            <span>Mock Mode</span>
          </div>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            {result._notice}
          </p>
        </div>
      )}

      <div className="success" style={{ marginBottom: '1.5rem' }}>
        Your optimized prompts are ready! Use them with your favorite AI image generator.
      </div>

      {(providerLabel || result._model) && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">Generation Context</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {providerLabel && <span className="badge badge-accent">Provider: {providerLabel}</span>}
            {result._model && <span className="badge">Model: {result._model}</span>}
          </div>
        </div>
      )}

      {/* Model recommendation badges */}
      {matchedBadges.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">Recommended Models</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {matchedBadges.map((badge) => (
              <span
                key={badge.name}
                className="badge"
                style={{
                  background: badge.color + '22',
                  color: badge.color,
                  border: `1px solid ${badge.color}55`,
                  fontSize: '0.875rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                }}
              >
                <span style={{ marginRight: '0.4rem' }}>{badge.icon}</span>
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}

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

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={onEditPrompt}>
          ✏️ Edit Prompt
        </button>
        <button className="btn btn-primary" onClick={onReset}>
          🔄 New Prompt
        </button>
      </div>
    </div>
  )
}

export default ResultStep
