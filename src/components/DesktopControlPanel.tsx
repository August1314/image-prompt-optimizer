import { useEffect, useMemo, useState } from 'react'
import { getProviderDefinition, PROVIDERS } from '../lib/providers'
import type { DesktopAppSettings, LicenseStatus, ProviderSecretStatus } from '../lib/desktop-types'
import type { AIProvider } from '../lib/types'

interface Props {
  settings: DesktopAppSettings
  secretStatuses: ProviderSecretStatus[]
  licenseStatus: LicenseStatus
  isLoading: boolean
  onSaveSettings: (settings: DesktopAppSettings) => Promise<void>
  onSetSecret: (input: { provider: AIProvider; apiKey: string }) => Promise<void>
  onClearSecret: (provider: AIProvider) => Promise<void>
  onTestSecret: (provider: AIProvider) => Promise<void>
  onImportLicense: () => Promise<void>
  onClearLicense: () => Promise<void>
}

function DesktopControlPanel({
  settings,
  secretStatuses,
  licenseStatus,
  isLoading,
  onSaveSettings,
  onSetSecret,
  onClearSecret,
  onTestSecret,
  onImportLicense,
  onClearLicense,
}: Props) {
  const [draftSettings, setDraftSettings] = useState(settings)
  const [apiKeyDrafts, setApiKeyDrafts] = useState<Record<AIProvider, string>>({
    openai: '',
    gemini: '',
  })
  const [busyAction, setBusyAction] = useState<string | null>(null)

  useEffect(() => {
    setDraftSettings(settings)
  }, [settings])

  const activeProvider = getProviderDefinition(draftSettings.provider)
  const statusByProvider = useMemo(
    () =>
      Object.fromEntries(secretStatuses.map((status) => [status.provider, status])) as Record<
        AIProvider,
        ProviderSecretStatus
      >,
    [secretStatuses],
  )

  async function withBusy<T>(action: string, fn: () => Promise<T>) {
    setBusyAction(action)
    try {
      await fn()
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <div className="card">
      <div className="card-header">Desktop Configuration</div>
      <div className="provider-grid">
        <div>
          <label className="label" htmlFor="desktop-provider-select">
            AI Provider
          </label>
          <select
            id="desktop-provider-select"
            className="input select"
            value={draftSettings.provider}
            disabled={isLoading || Boolean(busyAction)}
            onChange={(event) =>
              setDraftSettings((current) => ({
                ...current,
                provider: event.target.value as AIProvider,
              }))
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
          <label className="label" htmlFor="desktop-model-override">
            Model Override
          </label>
          <input
            id="desktop-model-override"
            className="input"
            type="text"
            placeholder={activeProvider.modelPlaceholder}
            value={draftSettings.model}
            disabled={isLoading || Boolean(busyAction)}
            onChange={(event) =>
              setDraftSettings((current) => ({
                ...current,
                model: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-secondary"
          disabled={isLoading || Boolean(busyAction)}
          onClick={() => withBusy('save-settings', () => onSaveSettings(draftSettings))}
        >
          Save Desktop Settings
        </button>
        <span className="provider-note">
          Active provider: {activeProvider.label}. API keys are stored in macOS Keychain.
        </span>
      </div>

      {(Object.keys(PROVIDERS) as AIProvider[]).map((provider) => {
        const providerDefinition = getProviderDefinition(provider)
        const status = statusByProvider[provider]
        return (
          <div key={provider} className="provider-secret-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
              <div>
                <strong>{providerDefinition.label}</strong>
                <p className="provider-note" style={{ marginTop: '0.35rem' }}>
                  {status?.hasKey ? 'Key configured in Keychain.' : 'No key stored yet.'}
                  {status?.lastCheckedAt
                    ? ` Last check: ${new Date(status.lastCheckedAt).toLocaleString()}${status.lastCheckOk ? ' (ok)' : ' (failed)'}`
                    : ''}
                </p>
                {status?.lastError && <p className="error-inline">{status.lastError}</p>}
              </div>
              <span className={`status-pill ${status?.hasKey ? 'status-pill--ok' : 'status-pill--idle'}`}>
                {status?.hasKey ? 'Configured' : 'Not set'}
              </span>
            </div>
            <div className="provider-grid" style={{ marginTop: '1rem' }}>
              <input
                className="input"
                type="password"
                placeholder={providerDefinition.keyPlaceholder}
                value={apiKeyDrafts[provider]}
                disabled={isLoading || Boolean(busyAction)}
                onChange={(event) =>
                  setApiKeyDrafts((current) => ({
                    ...current,
                    [provider]: event.target.value,
                  }))
                }
              />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  disabled={isLoading || Boolean(busyAction) || !apiKeyDrafts[provider].trim()}
                  onClick={() =>
                    withBusy(`save-secret-${provider}`, async () => {
                      await onSetSecret({ provider, apiKey: apiKeyDrafts[provider].trim() })
                      setApiKeyDrafts((current) => ({ ...current, [provider]: '' }))
                    })
                  }
                >
                  Save Key
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={isLoading || Boolean(busyAction)}
                  onClick={() => withBusy(`test-secret-${provider}`, () => onTestSecret(provider))}
                >
                  Test Key
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={isLoading || Boolean(busyAction)}
                  onClick={() => withBusy(`clear-secret-${provider}`, () => onClearSecret(provider))}
                >
                  Clear Key
                </button>
              </div>
            </div>
          </div>
        )
      })}

      <div className="provider-secret-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <div>
            <strong>License</strong>
            <p className="provider-note" style={{ marginTop: '0.35rem' }}>
              {licenseStatus.licensed
                ? `${licenseStatus.issuedTo ?? 'Licensed user'} · ${licenseStatus.perpetual ? 'Perpetual' : licenseStatus.expiresAt ?? 'Active'}`
                : 'No valid license imported yet.'}
            </p>
            {licenseStatus.error && <p className="error-inline">{licenseStatus.error}</p>}
          </div>
          <span className={`status-pill ${licenseStatus.licensed ? 'status-pill--ok' : 'status-pill--idle'}`}>
            {licenseStatus.licensed ? 'Licensed' : 'Unlicensed'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            disabled={isLoading || Boolean(busyAction)}
            onClick={() => withBusy('import-license', onImportLicense)}
          >
            Import License
          </button>
          <button
            className="btn btn-secondary"
            disabled={isLoading || Boolean(busyAction)}
            onClick={() => withBusy('clear-license', onClearLicense)}
          >
            Clear License
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesktopControlPanel
