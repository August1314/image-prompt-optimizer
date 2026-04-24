interface HeroProps {
  eyebrow: string
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
}

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p className="hero-copy">{description}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href="#get-started">
          {primaryCta}
        </a>
        <a className="btn btn-secondary" href="#workflow">
          {secondaryCta}
        </a>
      </div>
      <div className="hero-meta">
        <span>OpenAI + Gemini</span>
        <span>Desktop + web</span>
        <span>Mock mode for development</span>
      </div>
    </section>
  )
}
