import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DesktopControlPanel from '../DesktopControlPanel'

function renderPanel() {
  const onSaveSettings = vi.fn().mockResolvedValue(undefined)
  const onSetSecret = vi.fn().mockResolvedValue(undefined)
  const onClearSecret = vi.fn().mockResolvedValue(undefined)
  const onTestSecret = vi.fn().mockResolvedValue(undefined)
  const onImportLicense = vi.fn().mockResolvedValue(undefined)
  const onClearLicense = vi.fn().mockResolvedValue(undefined)

  render(
    <DesktopControlPanel
      settings={{ provider: 'openai', model: '' }}
      secretStatuses={[
        { provider: 'openai', hasKey: false },
        { provider: 'gemini', hasKey: true, lastCheckOk: true, lastCheckedAt: '2026-04-24T12:00:00.000Z' },
      ]}
      licenseStatus={{ licensed: false }}
      isLoading={false}
      onSaveSettings={onSaveSettings}
      onSetSecret={onSetSecret}
      onClearSecret={onClearSecret}
      onTestSecret={onTestSecret}
      onImportLicense={onImportLicense}
      onClearLicense={onClearLicense}
    />,
  )

  return {
    onSaveSettings,
    onSetSecret,
    onClearSecret,
    onTestSecret,
    onImportLicense,
    onClearLicense,
  }
}

describe('DesktopControlPanel', () => {
  it('renders desktop settings and keychain status', () => {
    renderPanel()
    expect(screen.getByText(/Desktop Configuration/)).toBeInTheDocument()
    expect(screen.getByText(/Key configured in Keychain/)).toBeInTheDocument()
    expect(screen.getByText(/No valid license imported yet/)).toBeInTheDocument()
  })

  it('submits provider key actions', async () => {
    const user = userEvent.setup()
    const { onSetSecret } = renderPanel()
    const inputs = screen.getAllByPlaceholderText(/your .* API key/i)
    await user.type(inputs[0], 'sk-desktop')
    await user.click(screen.getAllByRole('button', { name: /save key/i })[0])
    expect(onSetSecret).toHaveBeenCalledWith({ provider: 'openai', apiKey: 'sk-desktop' })
  })

  it('calls license import', async () => {
    const user = userEvent.setup()
    const { onImportLicense } = renderPanel()
    await user.click(screen.getByRole('button', { name: /import license/i }))
    expect(onImportLicense).toHaveBeenCalledOnce()
  })
})
