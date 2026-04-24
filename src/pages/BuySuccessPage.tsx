import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { COMMERCE_PRICE_LABEL, COMMERCE_PRODUCT_NAME } from '../lib/commerce'
import { readJsonSafely } from '../lib/http'

interface CheckoutSessionSummary {
  paymentStatus: string
  customerEmail?: string
  customerName?: string
  priceLabel: string
  productLabel: string
}

export default function BuySuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [summary, setSummary] = useState<CheckoutSessionSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      if (!sessionId) {
        setError('Missing checkout session.')
        return
      }

      try {
        const response = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
        const payload = await readJsonSafely<CheckoutSessionSummary>(
          response,
          'Unable to verify checkout right now. Please reload this page in a moment.',
        )
        if (!response.ok) {
          throw new Error(payload.error || 'Unable to verify checkout session.')
        }

        if (!cancelled) {
          setSummary(payload)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to verify checkout session.')
        }
      }
    }

    void loadSession()

    return () => {
      cancelled = true
    }
  }, [sessionId])

  const downloadUrl = sessionId ? `/api/license/download?session_id=${encodeURIComponent(sessionId)}` : '#'

  return (
    <main className="commerce-page">
      <section className="commerce-shell editorial-section">
        <div className="commerce-header">
          <div className="hero-kicker">Payment complete</div>
          <h1>Your desktop license is ready.</h1>
          <p className="commerce-subtitle">
            Download the license file, then import it in the macOS app to unlock {COMMERCE_PRODUCT_NAME}.
          </p>
        </div>

        <div className="purchase-layout">
          <article className="purchase-card">
            {error ? (
              <p className="purchase-error">{error}</p>
            ) : summary ? (
              <>
                <div className="purchase-price-row">
                  <div>
                    <span className="purchase-label">{summary.productLabel}</span>
                    <h2>{summary.priceLabel}</h2>
                  </div>
                  <span className="purchase-badge">{summary.paymentStatus}</span>
                </div>

                <p className="purchase-copy">
                  Issued to {summary.customerName || summary.customerEmail || 'your checkout identity'}.
                </p>

                <a className="btn btn-primary purchase-button" href={downloadUrl}>
                  Download license
                </a>
              </>
            ) : (
              <p className="purchase-copy">Verifying your Stripe payment…</p>
            )}
          </article>

          <aside className="purchase-sidebar">
            <div className="sidebar-panel">
              <div className="eyebrow">Import in the desktop app</div>
              <ol className="purchase-steps">
                <li>Open the macOS app.</li>
                <li>Go to the License section.</li>
                <li>Choose “Import License”.</li>
                <li>Select the downloaded `.lic` file.</li>
              </ol>
            </div>

            <div className="sidebar-panel">
              <div className="eyebrow">Reference</div>
              <p>
                This purchase covers the {COMMERCE_PRODUCT_NAME} desktop buyout at {COMMERCE_PRICE_LABEL}.
              </p>
            </div>

            <div className="purchase-links">
              <Link className="btn btn-secondary" to="/">
                Return home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
