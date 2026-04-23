# Image Prompt Optimizer

A Vite + React + TypeScript application that helps transform rough image ideas into optimized prompts for AI image generators (Midjourney, DALL-E, Stable Diffusion, etc.).

## Features

- Simple single-page flow: describe your idea → answer clarification questions → get optimized prompts
- Generates positive prompt, negative prompt, and model recommendations
- Copy-to-clipboard for easy use in any AI image tool
- Safety checks to refuse disallowed content

## Tech Stack

- Vite + React + TypeScript
- OpenAI API for prompt optimization
- Vercel serverless functions for API
- Deployed on Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and add your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env`:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

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
│   │   ├── prompt-optimizer.ts
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

## Safety

The application includes both client-side and server-side safety checks to refuse requests containing:

- Illegal content
- Sexual/exploitative content
- Hateful content
- Attempts to bypass AI safety systems

## License

MIT
