import { FaqItem, SectionHeading } from '../marketing'

interface FaqSectionProps {
  eyebrow: string
  title: string
  items: Array<{ question: string; answer: string }>
}

export function FaqSection({ eyebrow, title, items }: FaqSectionProps) {
  return (
    <section className="faq-section" id="get-started">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="faq-list">
        {items.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  )
}
