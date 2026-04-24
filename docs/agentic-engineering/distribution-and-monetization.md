# Image Prompt Optimizer Distribution and Monetization

Last updated: 2026-04-24

## Decision

The product should be designed as a local-first desktop app that users install and run on their own machines.

Target packaging options can include:

- `.dmg` for macOS
- other native installers when Windows support becomes relevant

The app should not depend on a hosted cloud inference service owned by us for the core prompt optimization flow.

## Product Shape

The intended flow is:

1. The user buys the app once.
2. The user downloads and installs the app locally.
3. The user chooses a supported model provider in the app.
4. The user enters their own API key in the app.
5. The app calls the selected model provider on behalf of the user using that user-managed key.
6. Prompt processing happens in the local app instead of a vendor-hosted multi-tenant SaaS operated by us.

## Why This Direction

This direction is preferred because it reduces or removes several early-stage burdens:

- We do not need to fund ongoing cloud inference for every active user.
- We do not need to build a shared backend just to proxy model calls.
- We do not need to own user prompt history or cloud-side storage by default.
- We avoid turning usage growth directly into inference cost risk for us.
- The monetization story is simpler: a paid desktop tool with durable ownership.

## Monetization Model

Preferred monetization model:

- one-time purchase
- perpetual use after purchase

This is intentionally different from:

- usage-based credits
- subscription SaaS
- cloud-hosted team plans

Future paid upgrades are allowed, but they are not part of the current product requirement. The current default assumption is buy once, use continuously.

## Architecture Implications

The product and engineering plan should assume:

- local app shell instead of web-only delivery as the long-term product form
- user-supplied provider credentials instead of vendor-funded shared API usage
- a provider abstraction that can support multiple vendors without rewriting the core optimizer flow
- local settings storage for API key configuration and app preferences
- minimal or no mandatory cloud persistence for the core workflow
- macOS desktop key storage should prefer `Keychain`, not browser-like local storage
- the first buyout flow should use a local license file import instead of mandatory online activation

The first implementation does not need full offline inference. "Local-first" here means the app runs locally and the user brings their own remote model API credentials.

## Security and UX Requirements

Because the user enters their own API key, the app should eventually support:

- clear API key onboarding
- local secure storage where possible
- a visible provider status check
- explicit messaging that keys stay on the user's machine unless the user chooses a provider endpoint

The app should not require users to understand infrastructure concepts such as Vercel, serverless functions, or hosted proxy services.

## Non-Goals For This Direction

- Do not build a cloud account system just to make the MVP usable.
- Do not make our own hosted inference proxy the default commercial path.
- Do not assume recurring subscriptions are required for monetization.
- Do not introduce cloud storage as a default dependency for prompt history or results.

## Open Questions

These questions remain open for later product work:

- how license delivery and activation should work for a buy-once desktop app
- whether the first shipping target is macOS-only
- whether the app should support multiple providers at launch or start with one provider
- whether a lightweight local export/import feature is needed for saved prompt sessions
