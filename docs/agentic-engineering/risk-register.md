# Risk Register

Last updated: 2026-04-23

## R1: Platform ToS and crawler risk

Risk:

- Research agents may be tempted to scrape platforms aggressively or use login-only data.

Impact:

- Account bans, legal exposure, unreliable data, unusable research artifacts.

Mitigation:

- Prefer public web pages, official APIs, manual review, and low-volume research.
- Record only links, short excerpts, and paraphrases.
- Require human approval before any logged-in browser automation.
- Do not store cookies, tokens, or private user data.

Status:

- Active.

## R2: Unsupported payment geography

Risk:

- The product may be positioned for users or sellers in regions where Stripe cannot support account onboarding.

Impact:

- Payment validation becomes blocked or misleading.

Mitigation:

- First validation cycle targets overseas creators in Stripe-supported seller regions.
- Mainland China payment flows are explicitly out of scope.
- Use Stripe Checkout only after confirming the seller account geography and business setup.

Status:

- Active.

## R3: Prompt safety bypass

Risk:

- Users may ask the product to make restricted image prompts work by evading model policies.

Impact:

- Safety violations, platform risk, brand risk.

Mitigation:

- Product positioning is prompt clarity and controllability, not bypass.
- Refuse requests involving illegal, sexual, exploitative, hateful, or other disallowed content.
- Provide safe alternatives only when they preserve benign intent.
- Governance Reviewer must block bypass-oriented features.

Status:

- Active.

## R4: Overbuilding before demand validation

Risk:

- The project may drift into a full prompt marketplace, image generator, batch workflow, or team SaaS before demand is proven.

Impact:

- Slow delivery, unclear user value, wasted implementation effort.

Mitigation:

- Keep the first loop to rough image idea -> optimized prompt -> copy/save/pay intent.
- Do not scaffold production app until research acceptance criteria are met.
- Require every MVP feature to map to source-backed evidence or be labeled as an assumption.

Status:

- Active.

## R5: Model output quality uncertainty

Risk:

- Better prompts may still fail because image models vary and can ignore constraints.

Impact:

- User disappointment and refund risk.

Mitigation:

- Avoid guarantees.
- Frame output as prompt improvement and troubleshooting guidance.
- Record model-specific caveats.
- Consider later evaluation using generated image samples only after product demand is validated.

Status:

- Active.

## R6: Competitor saturation

Risk:

- Prompt generators and AI image tools may already cover enough of the workflow.

Impact:

- Weak differentiation and low willingness to pay.

Mitigation:

- Research must include competitors, pricing, and counter-signals.
- Look for a narrow wedge around prompt diagnosis, missing visual constraints, and model-specific troubleshooting.
- Reject the idea or pivot if research shows users are satisfied with free tools.

Status:

- Open.

## R7: Sensitive data in prompts

Risk:

- Users may paste personal, client, brand, or confidential content into prompts.

Impact:

- Privacy and compliance concerns.

Mitigation:

- Avoid storing raw prompts unless needed for a paid feature.
- If storage is added later, provide deletion and retention rules.
- Keep secrets and model calls server-side.
- Add a user-facing privacy note before production launch.

Status:

- Open.

