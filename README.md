# Image Prompt Optimizer

A `Vite + React + TypeScript` Web MVP that helps transform rough image ideas into clearer, safer, and more controllable prompts for AI image generators.

## M1 Status

This repository is currently accepted as the `M1` baseline: the engineering skeleton is runnable.

`M1` means:

- the app installs, builds, and runs locally
- the UI exposes the core 3-step flow
- the Vercel function shape exists and is wired into the app
- local development can exercise the flow in a controlled way without requiring a real provider API key

`M1` does **not** mean the product is complete, production-ready, or fully validated with a real LLM provider.

## Features

- Simple single-page flow: describe your idea → answer clarification questions → get optimized prompts
- Generates positive prompt, negative prompt, and model recommendations
- Copy-to-clipboard for easy use in any AI image tool
- Safety checks to refuse disallowed content
- Local mock API support for deterministic development without a real API key
- Multi-provider setup with user-selectable `OpenAI` or `Google Gemini`
- macOS desktop runtime via `Electron`
- Desktop API key storage in `macOS Keychain`
- Offline local license-file import for the first buyout flow

## Tech Stack

- `Vite + React + TypeScript`
- `Vercel Functions` via `api/optimize.ts`
- Optional real-provider integration via `OpenAI API` or `Google Gemini`
- Local mock middleware during `vite` development
- `Electron + electron-builder` for the macOS desktop shell

## Getting Started

### Prerequisites

- Node.js 18+
- npm

For local development, provider API keys are optional because the Vite dev server mounts a deterministic mock `/api/optimize`.

For real provider-backed verification or Vercel deployment, you need either:

- a user-entered key in the app UI, or
- a matching server-side fallback such as `OPENAI_API_KEY` or `GEMINI_API_KEY`

For the hosted buy flow, you also need:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `APP_BASE_URL`
- `IPO_LICENSE_PRIVATE_KEY_PEM`

## Runtime Modes

The app currently supports three runtime modes behind the same `POST /api/optimize` contract:

- Mock mode:
  - active when neither the selected provider key from the UI nor the matching server env key is available
  - returns deterministic placeholder data
  - includes `_mock: true` and `_notice`
  - the result page displays a visible mock-mode notice banner
- Real OpenAI mode:
  - active when the selected provider is `OpenAI` and a key is available
  - calls the real OpenAI chat completions API
- Real Gemini mode:
  - active when the selected provider is `Google Gemini` and a key is available
  - calls the official Gemini OpenAI-compatible endpoint
  - does not include `_mock`
  - the result page does not display the mock-mode notice

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

If you want server-managed fallback keys, set one or both of these:

```
OPENAI_API_KEY=sk-your-openai-key-here
GEMINI_API_KEY=AIza-your-gemini-key-here
```

If you want the hosted Stripe purchase flow and automatic desktop license download, also set:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PRICE_ID=price_your_stripe_price_id_here
APP_BASE_URL=https://image-prompt-optimizer.vercel.app
IPO_LICENSE_PRIVATE_KEY_PEM="-----BEGIN PRIVATE KEY-----..."
```

If you leave them empty during local `vite` development, the mock API will be used unless you enter a provider key in the app UI.

If you are testing the desktop runtime, provider keys should be entered inside the app and are stored in `macOS Keychain` instead of `.env`.

The desktop runtime now verifies hosted production licenses against an embedded production public key by default. For local desktop experiments you can still override that with `IPO_LICENSE_PUBLIC_KEY_PEM`.

### Development

```bash
npm run dev
```

Open http://localhost:3000

### Desktop Development

Start the Vite renderer, Electron main/preload build watch, and desktop shell together:

```bash
npm run dev:desktop
```

The desktop shell uses:

- `settings.json` under Electron `userData` for non-sensitive settings
- `macOS Keychain` for provider API keys
- `userData/licenses/current.lic` for the imported local license file

### Build

```bash
npm run build
```

This produces the static client build in `dist/`. The repository does not treat build output as source of truth.

### Desktop Build

Build the web renderer and Electron main/preload bundles:

```bash
npm run build:desktop
```

This produces:

- `dist/` for the renderer
- `dist-electron/` for the Electron runtime

### Desktop Packaging

Prewarm the `dmg-builder` helper cache:

```bash
npm run prepare:dmg-helper
```

This step:

- prefers the mirror configured by `ELECTRON_BUILDER_BINARIES_MIRROR`
- defaults to `https://mirrors.huaweicloud.com/electron-builder-binaries/`
- falls back to the official GitHub release if the mirror fails
- reuses the local Electron Builder cache after the first successful download

Package the macOS desktop app as a `.dmg`:

```bash
npm run pack:desktop
```

Expected output path:

- `release/ImagePromptOptimizer-<version>.dmg`

Expected packaging behavior:

- the app is configured for unsigned/ad-hoc macOS packaging
- notarization is intentionally not part of this first version
- `pack:desktop` now prewarms the `dmg-builder` helper before Electron Builder starts
- if the helper is already cached, the script prints `using cached dmg-builder helper`
- if mirror and official download both fail, the command exits with a structured error instead of a bare timeout
- if `.app` exists but `.dmg` does not, the terminal output will say so explicitly

For cache paths, mirror overrides, and retry workflow, see [docs/desktop-release-runbook.md](/Users/lianglihang/Documents/programs/image-prompt-optimizer/docs/desktop-release-runbook.md).

### Tests

```bash
npm test -- --run
```

Desktop-specific type validation:

```bash
npm run typecheck:desktop
```

### CI-Parity Verification

Before treating a change as ready, run the same three gates used by the current project workflow:

```bash
npx tsc -b --noEmit
npm run typecheck:desktop
npm run build
npm test -- --run
```

### Deploy to Vercel

`M1` does not require a production deployment. When you do want to validate the real hosted path:

```bash
npx vercel --prod
```

Before that, configure the required provider, Stripe, and license signing variables in Vercel project settings.

### Hosted Buy Flow

The marketing site now supports a basic buyout flow:

- `GET /buy` renders the hosted purchase page
- `POST /api/checkout/create-session` creates a Stripe Hosted Checkout session
- `GET /buy/success?session_id=...` verifies payment and offers a `.lic` download
- `GET /api/license/download?session_id=...` returns a signed desktop license for paid sessions
- `GET /buy/cancel` handles the canceled path

Current assumptions:

- single buyout SKU
- fixed public price label `$19`
- no webhook fulfillment
- no email delivery
- success-page download is the delivery path

## Local Verification

### Mock mode verification (no key)

1. Leave `OPENAI_API_KEY` unset in `.env`, or remove it entirely.
2. Run:

```bash
npm run dev
```

3. Open `http://localhost:3000`.
4. Submit a first-pass prompt and confirm the UI moves to clarification questions.
5. Submit clarification answers and confirm:
   - the flow reaches the result page
   - the result page shows the mock-mode notice banner
   - optimized prompt, negative prompt, and model advice are all present

### Real provider verification (local)

1. Start the app:

```bash
npm run dev
```

2. Open `http://localhost:3000`.
3. In the provider panel, choose one of:
   - `OpenAI`
   - `Google Gemini`
4. Enter a real API key in the local settings panel, or preconfigure the matching env variable in `.env`.
5. Optionally set a model override. If left blank, defaults are:
   - OpenAI: `gpt-4o-mini`
   - Gemini: `gemini-2.5-flash`
6. Submit a first-pass prompt and confirm the response contains clarification questions.
7. Submit clarification answers and confirm:
   - the result page renders optimized prompt, negative prompt, and model advice
   - the mock-mode notice banner is not shown
   - the result page shows provider/model metadata
8. If the provider returns an upstream error, confirm the UI shows the server error message instead of silently failing.

### Desktop verification (local)

1. Run:

```bash
npm run dev:desktop
```

2. Confirm the desktop app opens and shows the desktop configuration panel.
3. In the desktop configuration panel:
   - switch between `OpenAI` and `Google Gemini`
   - save a model override
   - confirm provider state persists after relaunch
4. Save a provider key and confirm:
   - the panel shows `Configured`
   - the renderer never displays the raw key again
5. Clear the provider key and confirm the status returns to `Not set`.
6. Run an optimization without a key and confirm the result page enters mock mode.
7. Save a valid provider key and confirm the optimization runs without the mock notice.
8. Generate a development license file if needed:

```bash
npm run license:generate-dev
```

9. Import the generated license in the desktop UI and confirm the app switches to `Licensed`.
10. Clear the license and confirm the app returns to `Unlicensed`.

### Desktop packaging verification

1. Prewarm the helper:

```bash
npm run prepare:dmg-helper
```

2. Confirm the command prints either:
   - `using cached dmg-builder helper`, or
   - `status=downloaded`
3. Package the desktop build:

```bash
npm run pack:desktop
```

4. Confirm both artifacts exist:
   - `release/mac-arm64/Image Prompt Optimizer.app`
   - `release/ImagePromptOptimizer-<version>.dmg`
5. If you intentionally set an invalid `ELECTRON_BUILDER_BINARIES_MIRROR`, confirm the output clearly distinguishes:
   - mirror failure
   - official fallback
   - final failure reason if both fail
6. Re-run `npm run pack:desktop` and confirm the helper is reused from cache instead of re-downloading.

### Real provider verification with env fallback (local)

1. Set one of the provider keys in `.env`:

```bash
OPENAI_API_KEY=sk-your-openai-key
# or
GEMINI_API_KEY=AIza-your-gemini-key
```

2. Restart the dev server.
3. Pick the matching provider in the UI without entering a local key.
4. Confirm the request still runs in real mode instead of mock mode.

## Vercel Verification

After configuring at least one provider key in the Vercel project:

1. Redeploy the project.
2. Open the hosted app.
3. Choose the provider that matches the configured env key.
4. Submit a first-pass prompt and confirm the hosted `/api/optimize` returns clarification questions.
5. Submit clarification answers and confirm the hosted flow returns:
   - `optimizedPrompt`
   - `negativePrompt`
   - `modelAdvice`
6. Confirm the hosted result page does not show the mock-mode notice.
7. If you intentionally remove the matching provider env key and redeploy later, the hosted app should either:
   - fall back to mock mode with a visible notice, or
   - fail in the documented way

Behavior must not become ambiguous.

## Project Structure

```
├── api/
│   └── optimize.ts        # Vercel serverless function
├── electron/
│   ├── main.ts
│   ├── preload.ts
│   ├── preload.api.ts
│   ├── ipc.ts
│   └── services/
├── src/
│   ├── components/
│   │   ├── DesktopControlPanel.tsx
│   │   ├── PromptInput.tsx
│   │   ├── ClarificationStep.tsx
│   │   └── ResultStep.tsx
│   ├── lib/
│   │   ├── mock-api.ts
│   │   ├── optimize-core.ts
│   │   ├── prompt-optimizer.ts
│   │   ├── runtime.ts
│   │   ├── desktop-types.ts
│   │   ├── provider-storage.ts
│   │   ├── providers.ts
│   │   ├── types.ts
│   │   ├── safety.ts
│   │   └── safety.server.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── vite.svg
├── scripts/
│   ├── generate-dev-license.mjs
│   ├── prepare-dmg-helper.mjs
│   ├── prepare-dmg-helper-lib.mjs
│   └── pack-desktop.mjs
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
  ],
  "providerConfig": {
    "provider": "gemini",
    "apiKey": "AIza-user-supplied-key",
    "model": "gemini-2.5-flash"
  }
}
```

Response shape:

```json
{
  "optimizedPrompt": "string",
  "negativePrompt": "string",
  "modelAdvice": "string",
  "clarificationQuestions": ["string"],
  "_mock": true,
  "_notice": "string",
  "_provider": "openai | gemini",
  "_model": "string"
}
```

`providerConfig` is optional. When omitted, the server defaults to `openai`.

`_mock`, `_notice`, `_provider`, and `_model` are optional extension fields. `_mock` and `_notice` are returned when the server intentionally falls back to mock mode because no key is available for the selected provider.

Desktop runtime note:

- the Electron renderer does not send raw API keys through `optimizer.run`
- provider keys are read by the main process from `macOS Keychain`
- desktop optimizations reuse the same optimization core as the web adapter

The request and primary response fields above are part of the current M1/M2 baseline and should stay stable until a later milestone explicitly changes them.

## Safety

The application includes both client-side and server-side safety checks to refuse requests containing:

- Illegal content
- Sexual/exploitative content
- Hateful content
- Attempts to bypass AI safety systems

## License

MIT
