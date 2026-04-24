import { Link } from 'react-router-dom'
import { COMMERCE_PRICE_LABEL, COMMERCE_PRODUCT_NAME } from '../lib/commerce'

export default function BuyCancelPage() {
  return (
    <main className="commerce-page">
      <section className="commerce-shell editorial-section">
        <div className="commerce-header">
          <div className="hero-kicker">Checkout canceled</div>
          <h1>No charge was completed.</h1>
          <p className="commerce-subtitle">
            You can return to checkout any time when you are ready to buy the {COMMERCE_PRODUCT_NAME} desktop license.
          </p>
        </div>

        <div className="purchase-layout purchase-layout--single">
          <article className="purchase-card">
            <div className="purchase-price-row">
              <div>
                <span className="purchase-label">Desktop buyout</span>
                <h2>{COMMERCE_PRICE_LABEL}</h2>
              </div>
              <span className="purchase-badge">Canceled</span>
            </div>

            <p className="purchase-copy">
              Nothing was activated. If you still want the app, you can restart checkout from the purchase page.
            </p>

            <div className="purchase-links">
              <Link className="btn btn-primary" to="/buy">
                Return to checkout
              </Link>
              <Link className="btn btn-secondary" to="/">
                Back to homepage
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
