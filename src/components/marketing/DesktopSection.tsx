interface DesktopSectionProps {
  eyebrow: string
  title: string
  items: Array<{ title: string; description: string }>
}

export function DesktopSection({ eyebrow, title, items }: DesktopSectionProps) {
  return (
    <section className="split-section">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      <div className="stack-list">
        {items.map((item) => (
          <div key={item.title} className="stack-item">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
