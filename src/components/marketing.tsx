interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

interface WorkflowCardProps {
  step: string
  title: string
  description: string
}

export function WorkflowCard({ step, title, description }: WorkflowCardProps) {
  return (
    <article className="workflow-card">
      <span className="workflow-step">{step}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

interface TrustPillsProps {
  items: string[]
}

export function TrustPills({ items }: TrustPillsProps) {
  return (
    <section className="trust-band">
      {items.map((item) => (
        <span key={item} className="trust-pill">
          {item}
        </span>
      ))}
    </section>
  )
}

interface FaqItemProps {
  question: string
  answer: string
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="faq-item">
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  )
}
