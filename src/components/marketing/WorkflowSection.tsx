import { SectionHeading, WorkflowCard } from '../marketing'

interface WorkflowSectionProps {
  eyebrow: string
  title: string
  steps: Array<{ step: string; title: string; description: string }>
}

export function WorkflowSection({ eyebrow, title, steps }: WorkflowSectionProps) {
  return (
    <section className="workflow-section" id="workflow">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="workflow-list">
        {steps.map((step) => (
          <WorkflowCard key={step.step} step={step.step} title={step.title} description={step.description} />
        ))}
      </div>
    </section>
  )
}
