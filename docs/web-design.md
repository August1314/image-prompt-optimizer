# Web Design Development Notes

## Purpose
This document describes how to build and maintain the promotional website for Image Prompt Optimizer.

## Reference Inspiration
Use the Bauhaus Clock site as a high-level inspiration for:
- premium editorial pacing
- strong typographic hierarchy
- calm, confident product storytelling
- long-form landing page structure
- subtle but deliberate visual polish

Do not copy the source site’s exact copy, layout, sections, or distinctive visual motifs.

## Implementation Strategy

### 1. Build the page in `src/App.tsx`
- Treat the existing app entry as the landing page shell.
- Replace the app-like flow emphasis with marketing-page sections.
- Keep the current product functionality available elsewhere later, but prioritize the public-facing narrative first.

### 2. Add reusable section blocks
Suggested sections:
- Hero
- Benefits / feature highlights
- Workflow
- Desktop + privacy explanation
- Provider support section
- FAQ
- Final CTA

### 3. Use CSS-first styling
- Extend `src/index.css` with a landing-page design system.
- Prefer variables for spacing, colors, and borders.
- Keep the look dark, premium, and minimal.
- Use large responsive type and spacious section padding.

### 4. Keep content aligned to product truth
The page must only claim features the app already supports:
- prompt refinement flow
- clarification questions
- optimized prompt generation
- OpenAI and Gemini provider support
- local-first / desktop support
- mock mode fallback during development
- desktop license and keychain handling

### 5. Prepare for future content iteration
- Section copy should be easy to edit.
- Layout should support adding testimonials, metrics, or screenshots later.
- Keep CTA areas modular.

## Suggested Component Structure
If the landing page grows, split it into components such as:
- `HeroSection`
- `FeatureGrid`
- `WorkflowSection`
- `TrustSection`
- `FaqSection`
- `FooterCta`

## Responsive Rules
- Desktop: generous max-width, multi-column feature grids, prominent hero spacing
- Tablet: collapse grids to 2 columns where appropriate
- Mobile: single-column flow, simplified nav/CTA, preserved readability

## Accessibility Requirements
- Maintain semantic heading order
- Ensure color contrast remains WCAG-friendly
- Use descriptive CTA labels
- Avoid content that depends only on color to communicate state

## Performance Notes
- Prefer CSS gradients and layout primitives instead of large media assets
- Avoid heavy animation libraries unless clearly needed
- Keep the initial bundle lean

## QA Checklist
Before shipping the marketing page:
- Verify hero, CTA, and feature sections render correctly
- Check mobile layout at narrow widths
- Confirm copy matches actual product behavior
- Verify no broken links or placeholder text remain
- Run build and tests after style or structure changes
