import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COMMERCE_DELIVERY_STEPS,
  COMMERCE_PRICE_LABEL,
  COMMERCE_PRODUCT_NAME,
  COMMERCE_PURCHASE_BLURB,
} from '../lib/commerce'

export default function BuyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const payload = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Unable to start checkout right now.')
      }

      window.location.assign(payload.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start checkout right now.')
      setIsLoading(false)
    }
  }

  return (
    <main className="commerce-page">
      <section className="commerce-shell editorial-section">
        <div className="commerce-header">
          <div className="hero-kicker">Buy once. Run locally.</div>
          <h1>{COMMERCE_PRODUCT_NAME}</h1>
          <p className="commerce-subtitle">
            Pay once, keep using it, and bring your own OpenAI or Gemini key. No hosted credit balance required.
          </p>
        </div>

        <div className="purchase-layout">
          <article className="purchase-card">
            <div className="purchase-price-row">
              <div>
                <span className="purchase-label">Desktop buyout</span>
                <h2>{COMMERCE_PRICE_LABEL}</h2>
              </div>
              <span className="purchase-badge">Perpetual</span>
            </div>

            <p className="purchase-copy">{COMMERCE_PURCHASE_BLURB}</p>

            <ul className="purchase-points">
              <li>Local desktop workflow</li>
              <li>License file delivery after payment</li>
              <li>Works with your own provider credentials</li>
            </ul>

            <button className="btn btn-primary purchase-button" type="button" onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? 'Redirecting to checkout…' : `Buy now — ${COMMERCE_PRICE_LABEL}`}
            </button>

            {error ? <p className="purchase-error">{error}</p> : null}
          </article>

          <aside className="purchase-sidebar">
            <div className="sidebar-panel">
              <div className="eyebrow">What happens next</div>
              <ol className="purchase-steps">
                {COMMERCE_DELIVERY_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="sidebar-panel">
              <div className="eyebrow">Use case</div>
              <p>
                This is for creators who want better image prompts, not another hosted image generator account.
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
