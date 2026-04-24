import { Link } from 'react-router-dom'
import { FaqItem, FeatureCard, SectionHeading, WorkflowCard } from './components/marketing'

const topBarPoints = ['Image Prompt Optimizer', 'desktop-first, web-ready']

const benefits = [
  {
    title: 'Clarifies what materially changes the image',
    description:
      'The app asks follow-up questions only when missing scene, composition, device, lighting, or style details would change the final image.',
  },
  {
    title: 'Returns output you can actually use',
    description:
      'Each run produces an optimized prompt, a negative prompt, and concise model advice instead of one vague block of text.',
  },
  {
    title: 'Matches the real buying model',
    description:
      'This is designed as a local app you buy once and run with your own provider key, not a hosted credit meter disguised as a product.',
  },
]

const featureCards = [
  {
    title: 'From rough brief to model-ready prompt',
    description: 'Start with what you mean visually, not with prompt syntax. The workflow handles the translation.',
  },
  {
    title: 'Structured output, not prompt soup',
    description: 'Review the optimized prompt, negative prompt, and model notes as separate pieces you can scan and copy.',
  },
  {
    title: 'OpenAI and Gemini under one flow',
    description: 'Choose the provider you want without relearning the UI or changing the core optimization path.',
  },
  {
    title: 'Local-first desktop trust',
    description: 'On macOS, keys stay in Keychain and settings stay in the app shell instead of a browser-style storage layer.',
  },
]

const workflowSteps = [
  {
    step: '01',
    title: 'Describe the image you want',
    description: 'Start with a rough idea, mood, subject, or use case such as a thumbnail, ad visual, or concept shot.',
  },
  {
    step: '02',
    title: 'Answer only the questions that matter',
    description: 'The app narrows style, framing, orientation, lighting, and other missing details only when they affect the result.',
  },
  {
    step: '03',
    title: 'Copy the optimized result',
    description: 'Take the refined prompt, negative prompt, and model advice into the image tool you already use.',
  },
]

const testimonials = [
  {
    quote: 'Built for solo creators making thumbnails, social posts, ads, and concept visuals.',
    name: 'Target user',
    role: 'People who know the shot they want',
  },
  {
    quote: 'Buy the app once, then bring your own OpenAI or Gemini key.',
    name: 'Commercial model',
    role: 'No mandatory hosted inference layer',
  },
  {
    quote: 'Desktop mode keeps keys local and stays usable even when you fall back to mock mode.',
    name: 'Trust boundary',
    role: 'Local-first by default',
  },
]

const promptCards = [
  {
    title: 'Subject and action',
    description:
      'Make the main subject, pose, and action explicit so the model stops inventing the wrong focal point.',
  },
  {
    title: 'Setting and supporting objects',
    description:
      'Lock down room context, props, device placement, and surrounding objects before they drift or disappear.',
  },
  {
    title: 'Composition and framing',
    description:
      'Clarify camera distance, crop, orientation, and emphasis so the image reads closer to the intended layout.',
  },
  {
    title: 'Lighting and mood',
    description:
      'Turn broad taste words into more concrete atmosphere, color, texture, and lighting instructions.',
  },
  {
    title: 'What to avoid',
    description:
      'Use negative prompts and avoidance notes to reduce the most common failure modes before the first generation run.',
  },
  {
    title: 'Tool-specific advice',
    description:
      'Get concise guidance that helps you move the result into the image system you plan to use next.',
  },
]

const faqItems = [
  {
    question: 'Can I test it without a key?',
    answer: 'Yes. Mock mode keeps the full flow usable during development or evaluation even when no live provider key is available.',
  },
  {
    question: 'Where are desktop secrets stored?',
    answer: 'On macOS, provider keys are handled locally through the desktop shell and Keychain.',
  },
  {
    question: 'Is this an image generator?',
    answer:
      'No. It does not generate images itself. It refines your prompt so you can use it in the image tool or model workflow you already prefer.',
  },
  {
    question: 'Which providers are supported right now?',
    answer: 'The current implementation supports OpenAI and Google Gemini through the same optimization contract.',
  },
]

const resultStory = [
  {
    step: '01',
    title: 'Start with the rough idea',
    description:
      'Describe the image in plain language. You do not need a polished prompt to begin.',
    src: '/generated/Desktop editor workspace.png',
    alt: 'Desktop editor workspace',
    caption: 'The first screen captures the raw brief.',
  },
  {
    step: '02',
    title: 'The app asks the missing questions',
    description:
      'It narrows composition, subject details, lighting, and orientation only when those details change the image.',
    src: '/generated/Questionnaire stepper.png',
    alt: 'Questionnaire stepper',
    caption: 'Clarifying questions replace trial-and-error guessing.',
  },
  {
    step: '03',
    title: 'You get output that is ready to use',
    description:
      'Review the optimized prompt, negative prompt, and model advice as separate, scannable pieces.',
    src: '/generated/Output card showcase.png',
    alt: 'Output card showcase',
    caption: 'The final result is structured instead of buried in one block of text.',
  },
]

function App() {
  return (
    <main className="marketing-page" id="top">
      <div className="hero-floating-bar">
        <div className="hero-brand-lockup">
          <div className="hero-brand-mark" aria-hidden="true" />
          <div className="hero-brand-copy">
            <strong>{topBarPoints[0]}</strong>
            <span>{topBarPoints[1]}</span>
          </div>
        </div>
        <nav className="hero-nav" aria-label="Primary">
          <Link className="hero-buy-pill" to="/buy">
            Buy once or start local
          </Link>
        </nav>
      </div>

      <header className="hero-shell editorial-section">
        <div className="hero-stage">
          <div className="hero-kicker">Local-first prompt refinement for image generation</div>
          <h1 className="hero-title">
            Turn rough image intent into prompts you can actually run.
          </h1>
          <p className="hero-subtitle">
            Built for creators who know the shot they want but do not want to think like prompt engineers. Answer a few
            focused questions, then get an optimized prompt, a negative prompt, and model guidance you can use right away.
          </p>
          <figure className="hero-cinema-frame">
            <img src="/generated/Desktop editor workspace.png" alt="Desktop editor workspace" fetchPriority="high" decoding="async" />
          </figure>
        </div>
      </header>

      <section className="editorial-section testimonial-band">
        <div className="testimonial-stars" aria-hidden="true">
          <span>★ ★ ★ ★ ★</span>
        </div>
        <div className="testimonial-row">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <p>“{item.quote}”</p>
              <div className="testimonial-meta">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="hero-statement">
          <h2>A prompt optimizer, not a generic prompt generator.</h2>
          <p>
            It asks for detail only when the missing information would materially change the image, then returns
            structured output you can copy with less guesswork and less visual drift.
          </p>
        </div>
      </section>

      <section className="editorial-section split-layout feature-layout" id="what-it-does">
        <div>
          <SectionHeading
            eyebrow="What it does"
            title="It closes the gap between what you mean and what the model draws."
            description="The product is for people who can describe the image they want, but need help making that visual intent legible to the model."
          />
          <div className="feature-benefits">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="feature-grid">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
      </section>

      <section className="editorial-section gallery-section" id="results">
        <SectionHeading
          eyebrow="Results"
          title="This is the core promise in one pass."
          description="You start with a rough image idea. The app asks for the missing details. Then it returns a prompt package you can actually use."
        />
        <div className="results-storyboard">
          {resultStory.map((item, index) => (
            <article className="results-step-card" key={item.step}>
              <div className="results-step-copy">
                <span className="results-step-number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <figure className="results-step-figure">
                <img src={item.src} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>
        <div className="results-summary-note">
          <strong>What this section means:</strong> the product is not showing random mockups here. It is showing the
          actual sequence from idea, to clarification, to usable output.
        </div>
      </section>

      <section className="editorial-section prompt-gallery-section">
        <SectionHeading
          eyebrow="What gets clarified"
          title="It makes the vague parts of the brief explicit before you generate."
          description="Instead of guessing, the optimizer turns the unstable parts of an image request into concrete visual constraints."
        />
        <div className="prompt-grid">
          {promptCards.map((card, index) => (
            <article className="prompt-card" key={card.title}>
              <span className="prompt-card__label">Prompt 0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section workflow-layout" id="faq">
        <SectionHeading
          eyebrow="How it flows"
          title="A short path from rough idea to usable prompt."
          description="No prompt library, no batch pipeline, and no tuning maze. Just one guided sequence."
        />
        <div className="workflow-list">
          {workflowSteps.map((item) => (
            <WorkflowCard key={item.step} step={item.step} title={item.title} description={item.description} />
          ))}
        </div>
      </section>

      <section className="editorial-section split-layout reversed desktop-layout">
        <div className="settings-card">
          <div className="settings-chip">Desktop settings</div>
          <h2>Local where it counts.</h2>
          <ul>
            <li>Choose OpenAI or Gemini inside the app.</li>
            <li>On macOS, provider keys live in Keychain.</li>
            <li>Mock mode keeps the flow testable without a live key.</li>
            <li>Desktop and web stay aligned around the same optimizer contract.</li>
          </ul>
        </div>
        <div className="sidebar-stack">
          <div className="sidebar-panel">
            <div className="eyebrow">Model guidance</div>
            <p>Each result includes concise notes that help you move into the image workflow you plan to use next.</p>
          </div>
          <div className="sidebar-panel">
            <div className="eyebrow">Buyout model</div>
            <p>Designed for a buy-once desktop workflow where users install locally and bring their own provider key.</p>
          </div>
        </div>
      </section>

      <section className="editorial-section split-layout reversed provider-layout">
        <div className="sidebar-stack">
          <div className="sidebar-panel">
            <div className="eyebrow">Provider support</div>
            <p>
              One optimizer core supports multiple providers, so users can choose their own model vendor without learning a new flow.
            </p>
          </div>
        </div>
        <div className="sidebar-stack sidebar-stack--images">
          <figure className="image-frame image-frame--wide">
            <img src="/generated/Provider settings panel.png" alt="Provider settings panel" loading="lazy" decoding="async" />
            <figcaption>Desktop provider management stays clean and local.</figcaption>
          </figure>
          <figure className="image-frame image-frame--portrait-card">
            <img src="/generated/Mobile companion view.png" alt="Mobile companion view" loading="lazy" decoding="async" />
            <figcaption>Mobile companion keeps the same visual language without collapsing the flow.</figcaption>
          </figure>
        </div>
      </section>

      <section className="editorial-section" id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="A few direct answers."
          description="Short, clear, and grounded in how the product actually works."
        />
        <div className="faq-list">
          {faqItems.map((item) => (
            <FaqItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      <section className="final-cta editorial-section" id="buy">
        <div>
          <div className="hero-kicker">Buy once. Bring your own model key.</div>
          <h2>Install locally and make the next image prompt easier to trust.</h2>
        </div>
        <a className="btn btn-primary" href="#top">
          Return to overview
        </a>
      </section>
    </main>
  )
}

export default App
