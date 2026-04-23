# Market Validation Backlog

Last updated: 2026-04-23

## Phase 1: Research

### Task R1: Run `AI image prompt optimizer` research round

Success criteria:

- At least 8 usable evidence items.
- At least 3 source classes.
- At least 2 counter-signals.
- Output follows `research-protocol.md`.

Out of scope:

- Building an app.
- Running paid ads.
- Scraping private or login-only data.

### Task R2: Run `Midjourney prompt helper` research round

Success criteria:

- Identify whether users want prompt rewriting, parameter help, style help, or troubleshooting.
- Capture at least 3 competitor/workaround examples.
- Include payment evidence if available.

Out of scope:

- Building Midjourney-specific automation.
- Using Discord automation or logged-in scraping.

### Task R3: Run `Flux prompt generator` research round

Success criteria:

- Identify Flux-specific prompt pain points.
- Compare whether demand differs from Midjourney and Stable Diffusion users.
- Capture model-specific terminology users actually use.

Out of scope:

- Training or hosting image models.
- Generating images in bulk.

### Task R4: Run `image prompt safety` research round

Success criteria:

- Distinguish benign safety needs from attempts to bypass safety systems.
- Identify language users use for accidental unwanted/sensitive outputs.
- Produce clear product safety boundaries.

Out of scope:

- Any bypass, jailbreak, or policy-evasion guidance.

### Task R5: Run `prompt to image troubleshooting` research round

Success criteria:

- Identify the most common failure modes: missing details, composition drift, object orientation, text rendering, hands/faces, lighting, style mismatch, or unwanted elements.
- Rank which failures are most suitable for a prompt-only product.

Out of scope:

- Image editing, ControlNet, inpainting, or model fine-tuning.

## Phase 2: Hypothesis

### Task H1: Build evidence matrix

Success criteria:

- Each candidate feature maps to at least one source-backed pain point or is labeled as an assumption.
- Counter-signals are placed next to positive signals.
- No feature enters MVP scope only because it is technically interesting.

Out of scope:

- UI design.
- Engineering implementation.

### Task H2: Select one MVP wedge

Default candidate:

- Rough image idea -> clarifying questions -> optimized prompt -> negative prompt notes -> copy.

Success criteria:

- The wedge solves a repeated, source-backed pain point.
- The wedge can be tested without image generation or model hosting.
- The wedge can plausibly support Stripe Checkout as a paid upgrade later.

Out of scope:

- Prompt marketplace.
- Team workspace.
- Asset library.
- Browser extension.

## Phase 3: Prototype

### Task P1: Create non-production prototype spec

Success criteria:

- Defines one user flow.
- Defines input and output schema.
- Defines safety refusal behavior.
- Defines what counts as a successful prompt rewrite.

Out of scope:

- Production code.
- Billing implementation.
- User accounts.

### Task P2: Create 10 test scenarios

Success criteria:

- Covers gaming room, product thumbnail, YouTube thumbnail, game asset, fashion shot, food photo, interior design, ad creative, character concept, and social post.
- Includes expected clarification questions and expected optimized prompt qualities.
- Includes disallowed or borderline examples for safety review.

Out of scope:

- Model benchmarking.
- Image quality scoring from generated outputs.

## Phase 4: Payment Validation

### Task V1: Define Stripe-friendly paid offer

Default offer:

- Free: limited prompt checks.
- Paid: saved prompt versions, model-specific rewrite variants, and export formats.

Success criteria:

- Offer can be delivered without manual fulfillment.
- Offer does not require China mainland payment support.
- Pricing hypothesis is sourced from competitor pricing or adjacent creator-tool pricing.

Out of scope:

- Subscription complexity before demand is proven.
- Marketplace payouts.
- Team billing.

### Task V2: Define landing-page validation

Success criteria:

- One clear promise.
- One example before/after prompt.
- One email capture or checkout intent action.
- Analytics events for visits, prompt attempts, copy actions, and checkout clicks.

Out of scope:

- SEO content engine.
- Affiliate program.
- Multi-language localization.

