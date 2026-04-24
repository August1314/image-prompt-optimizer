export const heroCopy = {
  eyebrow: 'Image Prompt Optimizer',
  title: 'Turn rough image ideas into production-ready prompts.',
  description:
    'A local-first prompt workflow for AI image generation with clarification questions, optimized prompt output, and desktop support for private provider management.',
  primaryCta: 'Start optimizing',
  secondaryCta: 'See how it works',
}

export const trustPoints = [
  'Local-first desktop support',
  'OpenAI and Gemini provider paths',
  'Mock mode for deterministic development',
  'Keychain-backed secret handling on macOS',
]

export const featureCards = [
  {
    title: 'Refine rough ideas fast',
    description:
      'Turn a loose concept into a structured prompt with one guided flow: idea in, clarification out, optimized result ready to use.',
  },
  {
    title: 'Works with OpenAI and Gemini',
    description:
      'Choose the provider that fits your workflow, with support for real keys, local fallback behavior, and a consistent request contract.',
  },
  {
    title: 'Built for local-first workflows',
    description:
      'Provider secrets stay local, desktop settings live in the app shell, and mock mode keeps development predictable when no key is available.',
  },
  {
    title: 'Clear outputs, not prompt soup',
    description:
      'Get an optimized prompt, a negative prompt, and model guidance designed to help you move directly into image generation.',
  },
]

export const workflowSteps = [
  {
    step: '01',
    title: 'Describe the image',
    description: 'Start with a rough concept, mood, or subject and let the app handle the structure.',
  },
  {
    step: '02',
    title: 'Answer a few focused questions',
    description: 'Clarification prompts help narrow style, lighting, composition, and important details.',
  },
  {
    step: '03',
    title: 'Generate the optimized prompt',
    description: 'The final result includes a prompt, a negative prompt, and practical model advice.',
  },
]

export const desktopHighlights = [
  {
    title: 'Provider secrets stay local',
    description:
      'Use the desktop runtime to manage keys and settings without exposing them in the renderer.',
  },
  {
    title: 'Graceful mock fallback',
    description:
      'Development stays usable even when a real provider key is unavailable.',
  },
  {
    title: 'Single shared optimization contract',
    description: 'Web and desktop flows align around the same request and response shape.',
  },
]

export const faqItems = [
  {
    question: 'Is my key stored remotely?',
    answer:
      'No. In desktop mode, provider secrets are handled locally through the app shell and macOS Keychain.',
  },
  {
    question: 'Can I test it without a provider key?',
    answer:
      'Yes. The app supports a mock path so you can exercise the flow during development even when no API key is available.',
  },
  {
    question: 'Which providers are supported?',
    answer:
      'The current implementation supports OpenAI and Google Gemini through a shared optimization contract.',
  },
]
