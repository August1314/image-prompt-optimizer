# Research Protocol

Last updated: 2026-04-23

## Purpose

This protocol prepares demand research for an overseas creator-focused image prompt optimizer. It borrows the useful parts of the `mvanhorn/last30days-skill` methodology: recency, multi-source evidence, engagement-aware scoring, source links, and durable research notes. It does not copy or depend on that repository's code.

## Market Boundary

Primary market:

- English-speaking or English-searchable creators.
- Stripe-supported seller geographies such as the United States, United Kingdom, European Union countries, Hong Kong, Singapore, Japan, Malaysia, and other regions listed by Stripe.
- Products deployable on Vercel, with static content served globally and functions configured near the data/payment stack when needed.

Out of scope for first-cycle research:

- Mainland China payment flows.
- China-only distribution channels.
- Platform scraping that violates terms of service or stores personal data beyond short research quotations.

## Research Keywords

Run at least three separate research rounds before product implementation:

1. `AI image prompt optimizer`
2. `Midjourney prompt helper`
3. `Flux prompt generator`
4. `image prompt safety`
5. `prompt to image troubleshooting`

Optional expansion terms:

- `DALL-E prompt rewrite`
- `Stable Diffusion negative prompt help`
- `AI image prompt not following instructions`
- `text to image prompt engineering`
- `AI thumbnail prompt generator`

## Source Classes

Each research round should cover at least three source classes:

- Community discussions: Reddit, Hacker News, Discord/Forum pages visible on the public web.
- Creator platforms: YouTube videos and comments, X posts, public newsletters, public creator blogs.
- Builder signals: GitHub repositories, issues, discussions, Product Hunt, indie-hacker posts.
- Web/SEO signals: review pages, comparison articles, tool landing pages, pricing pages.

Do not treat search snippets as final evidence when the underlying page can be opened. Prefer primary posts, comments, issues, product docs, and pricing pages.

## Evidence Requirements

Every research note must include:

- Query keyword.
- Date collected.
- Source URL.
- Source type.
- Short evidence excerpt or paraphrase.
- Signal type: pain point, workaround, competitor, pricing, adoption, complaint, or counter-signal.
- Confidence: high, medium, or low.

Use short quotes only when they are necessary to preserve user wording. Prefer concise paraphrase with links.

## Output Format Per Round

Each round should produce a markdown note with this structure:

```markdown
# Research Round: Keyword

Collected: YYYY-MM-DD
Target market: overseas creators, Stripe/Vercel-friendly regions

## Pain Points
- Claim text. Source: URL. Confidence: high, medium, or low.

## Existing Alternatives
- Tool or workflow. Source: URL. Pricing or positioning if available.

## User Language
- Short paraphrase or quote. Source: URL. Why it matters: reason.

## Payment Signals
- Evidence that users pay, subscribe, buy credits, buy prompts, or pay for related tools.

## Competitors
- Tool, category, observed feature, and pricing if public.

## MVP Opportunities
- Small product opportunity grounded in evidence.

## Counter-Signals
- Evidence that demand may be weak, solved, too crowded, too cheap, or risky.

## Decision Notes
- Continue, pivot, or reject this keyword for MVP planning.
```

## Scoring Rubric

Use a 0-100 score per evidence item:

- Relevance: 45 points. Does it directly relate to image prompt quality, prompt troubleshooting, or creator workflow?
- Recency: 25 points. Prefer the last 30 days, then the last 90 days if the topic is thin.
- Engagement: 20 points. Upvotes, comments, views, stars, replies, bookmarks, or product traction.
- Commercial signal: 10 points. Payment, pricing, subscriptions, paid prompts, credits, or buyer intent.

Do not average scores into a false-precision market size estimate. Use scores to rank what to read and cite first.

## Research Acceptance Criteria

- At least 3 keyword rounds completed before app implementation.
- Each round includes at least 8 usable evidence items.
- Each round covers at least 3 source classes.
- Each round includes at least 2 counter-signals.
- No product requirement is promoted from assumption to fact without a source link.
