import { FeatureCard, SectionHeading } from '../marketing'

interface FeatureGridProps {
  eyebrow: string
  title: string
  cards: Array<{ title: string; description: string }>
}

export function FeatureGrid({ eyebrow, title, cards }: FeatureGridProps) {
  return (
    <section className="story-grid">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="feature-grid">
        {cards.map((card) => (
          <FeatureCard key={card.title} title={card.title} description={card.description} />
        ))}
      </div>
    </section>
  )
}
