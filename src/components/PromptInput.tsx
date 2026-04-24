import { useState } from 'react'
import { getProviderDefinition, PROVIDERS } from '../lib/providers'
import { checkSafety } from '../lib/safety'
import type { ProviderConfig } from '../lib/types'

interface Props {
  onSubmit: (prompt: string) => Promise<void>
  isLoading: boolean
  initialPrompt?: string
  mode?: 'web' | 'desktop'
  providerConfig?: ProviderConfig
  onProviderConfigChange?: (config: ProviderConfig) => void
}

function PromptInput({
  onSubmit,
  isLoading,
  initialPrompt = '',
  mode = 'web',
  providerConfig,
  onProviderConfigChange,
}: Props) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [error, setError] = useState<string | null>(null)
  const activeProvider = providerConfig ? getProviderDefinition(providerConfig.provider) : null

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
      {mode === 'web' && providerConfig && onProviderConfigChange && activeProvider && (
        <div className="provider-panel">
          <div className="provider-grid">
            <div>
              <label className="label" htmlFor="provider-select">
                AI Provider
              </label>
              <select
                id="provider-select"
                className="input select"
                value={providerConfig.provider}
                disabled={isLoading}
                onChange={(e) =>
                  onProviderConfigChange({
                    ...providerConfig,
                    provider: e.target.value as ProviderConfig['provider'],
                  })
                }
              >
                {Object.values(PROVIDERS).map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="model-override">
                Model Override (optional)
              </label>
              <input
                id="model-override"
                className="input"
                type="text"
                placeholder={activeProvider.modelPlaceholder}
                value={providerConfig.model || ''}
                disabled={isLoading}
                onChange={(e) =>
                  onProviderConfigChange({
                    ...providerConfig,
                    model: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="label" htmlFor="provider-api-key">
              API Key
            </label>
            <input
              id="provider-api-key"
              className="input"
              type="password"
              placeholder={activeProvider.keyPlaceholder}
              value={providerConfig.apiKey || ''}
              disabled={isLoading}
              autoComplete="off"
              onChange={(e) =>
                onProviderConfigChange({
                  ...providerConfig,
                  apiKey: e.target.value,
                })
              }
            />
          </div>

          <p className="provider-note">
            {activeProvider.description} The selected provider, API key, and optional model override are currently stored only in this browser for local use.
          </p>
        </div>
      )}

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
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {prompt.length} characters
          </span>
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
