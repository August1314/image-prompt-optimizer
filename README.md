# Image Prompt Optimizer

A `Vite + React + TypeScript` Web MVP that helps transform rough image ideas into clearer, safer, and more controllable prompts for AI image generators.

## M1 Status

This repository is currently accepted as the `M1` baseline: the engineering skeleton is runnable.

`M1` means:

- the app installs, builds, and runs locally
- the UI exposes the core 3-step flow
- the Vercel function shape exists and is wired into the app
- local development can exercise the flow in a controlled way without requiring a real OpenAI API key

`M1` does **not** mean the product is complete, production-ready, or fully validated with a real LLM provider.

## Features

- Simple single-page flow: describe your idea → answer clarification questions → get optimized prompts
- Generates positive prompt, negative prompt, and model recommendations
- Copy-to-clipboard for easy use in any AI image tool
- Safety checks to refuse disallowed content
- Local mock API support for deterministic development without a real API key

## Tech Stack

- `Vite + React + TypeScript`
- `Vercel Functions` via `api/optimize.ts`
- Optional `OpenAI API` integration for real prompt optimization
- Local mock middleware during `vite` development

## Getting Started

### Prerequisites

- Node.js 18+
- npm

For local M1 development, `OPENAI_API_KEY` is optional because the Vite dev server mounts a deterministic mock `/api/optimize`.

For real provider-backed verification or Vercel deployment, `OPENAI_API_KEY` is required.

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

If you want to test against the real OpenAI-backed API, set:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

If you leave it empty during local `vite` development, the mock API will be used instead.

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

This produces the static client build in `dist/`. The repository does not treat build output as source of truth.

### Tests

```bash
npm test -- --run
```

### Deploy to Vercel

`M1` does not require a production deployment. When you do want to validate the real hosted path:

```bash
npx vercel --prod
```

Before that, configure `OPENAI_API_KEY` in Vercel project settings.

## Project Structure

```
├── api/
│   └── optimize.ts        # Vercel serverless function
├── src/
│   ├── components/
│   │   ├── PromptInput.tsx
│   │   ├── ClarificationStep.tsx
│   │   └── ResultStep.tsx
│   ├── lib/
│   │   ├── mock-api.ts
│   │   ├── prompt-optimizer.ts
│   │   ├── types.ts
│   │   ├── safety.ts
│   │   └── safety.server.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── vite.svg
├── .env.example
├── vercel.json
├── vite.config.ts
└── package.json
```

## API Contract

`POST /api/optimize`

Request body:

```json
{
  "prompt": "cinematic portrait of a violinist in heavy rain",
  "answers": [
    {
      "question": "What visual style do you want?",
      "answer": "dark editorial photography"
    }
  ]
}
```

Response shape:

```json
{
  "optimizedPrompt": "string",
  "negativePrompt": "string",
  "modelAdvice": "string",
  "clarificationQuestions": ["string"]
}
```

The wire shape above is part of the current M1 baseline and should stay stable until a later milestone explicitly changes it.

## Safety

The application includes both client-side and server-side safety checks to refuse requests containing:

- Illegal content
- Sexual/exploitative content
- Hateful content
- Attempts to bypass AI safety systems

## License

MIT
