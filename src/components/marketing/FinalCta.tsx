interface FinalCtaProps {
  eyebrow: string
  title: string
  actionLabel: string
}

export function FinalCta({ eyebrow, title, actionLabel }: FinalCtaProps) {
  return (
    <section className="final-cta">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <a className="btn btn-primary" href="#top">
        {actionLabel}
      </a>
    </section>
  )
}
