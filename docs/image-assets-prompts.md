# Image Asset Prompt Guide

## Purpose
This document tracks the text-to-image prompts used to generate marketing assets for the Image Prompt Optimizer website.

The site currently uses a clean, editorial, white-themed landing page. To keep the page visually rich without adding heavy illustrations, we will generate a small set of high-quality assets with `gpt-image-2` and reuse them across sections.

## Landing Page Asset Plan

### 1. Hero Section
**Recommended asset:** `hero-workspace.webp`

**Placement:**
- Place a large visual on the right side of the hero on desktop.
- Keep the left side open for the headline, copy, and buttons.
- On mobile, place it below the hero text as a full-width visual.

**Goal:**
- Make the product feel premium immediately.
- Suggest a calm, thoughtful creative workflow without looking like generic AI art.

**Best content direction:**
- elegant workspace
- laptop or tablet on a clean desk
- subtle prompt cards or paper surfaces
- soft daylight
- white, warm gray, graphite, beige accents

### 2. Feature / What It Does Section
**Recommended asset:** `prompt-results.webp`

**Placement:**
- Use as a side visual next to the feature grid, or as a floating image above the cards.
- It should support the explanation that the app transforms input into structured output.

**Goal:**
- Show the transformation from rough idea to refined result.
- Make the output feel useful and organized.

**Best content direction:**
- layered cards
- document-like prompt output panels
- clean typographic composition without readable product text
- subtle contrast and depth

### 3. Workflow Section
**Recommended asset:** `workflow-steps.webp`

**Placement:**
- Place above or beside the three-step workflow cards.
- It can act as a section opener or a visual divider.

**Goal:**
- Reinforce the step-by-step sequence.
- Make the app feel guided and controlled.

**Best content direction:**
- three connected surfaces or panels
- left-to-right structure
- rough idea → clarification → optimized prompt
- minimal, semi-realistic editorial styling

### 4. Desktop / Privacy Section
**Recommended asset:** `desktop-privacy.webp`

**Placement:**
- Place in the desktop settings section, ideally on the left side of the supporting copy.
- If the section becomes narrow, use it as a full-width block above the text.

**Goal:**
- Communicate local-first storage, privacy, and native desktop control.
- Make the desktop experience feel trustworthy.

**Best content direction:**
- macOS-inspired workspace abstraction
- clean settings panel concept
- local device cues and secure handling feel
- soft neutral lighting

### 5. Provider / Flexibility Callout
**Recommended asset:** `provider-support.webp`

**Placement:**
- Use near the provider support explanation or in a small feature card.
- This can be a smaller visual, not a hero-level asset.

**Goal:**
- Show that multiple providers work through one simple workflow.
- Keep it technical but approachable.

**Best content direction:**
- abstract connection points
- unified routing or bridge-like visual
- no real provider logos
- restrained, clean, minimal composition

## Generation Principles

When generating assets:

- Keep the visual language premium, restrained, and editorial.
- Match the website’s white-first aesthetic.
- Use soft shadows, subtle gradients, and minimal clutter.
- Avoid busy UI screenshots unless the asset is specifically a product mockup.
- Prefer wide compositions for hero and section dividers.
- Leave negative space so the assets can sit comfortably inside a landing page.
- Do not include readable product text unless explicitly required.
- Avoid watermarks, logos from other brands, and overly synthetic neon effects.

## Prompt Template Format
Use this template when writing new prompts:

```text
Create a [type of asset] for a premium landing page.
Style: [visual style keywords].
Subject: [what is shown].
Composition: [layout and framing].
Lighting: [lighting style].
Color palette: [specific palette].
Mood: [brand mood].
Requirements: [what must be visible].
Avoid: [what should not appear].
```

## Asset Prompt Library

### A. Hero Illustration — Creative Prompting Workspace
```text
Create a wide hero illustration for a premium software landing page.
Style: editorial, minimal, modern, photorealistic with subtle 3D depth.
Subject: a calm creative workspace with a laptop, a notebook, a pen, and soft floating prompt cards suggesting an idea-to-prompt workflow.
Composition: wide cinematic framing with strong negative space on the left for headline text, subject anchored on the right.
Lighting: soft daylight with gentle shadows and a refined studio feel.
Color palette: white, warm gray, graphite, soft beige, tiny accents of muted blue.
Mood: calm, premium, intelligent, trustworthy.
Requirements: elegant workspace objects, subtle product-story atmosphere, no readable text, no UI screenshots, no extra decorative clutter.
Avoid: neon colors, clutter, dark cyberpunk styling, busy backgrounds, watermarks, brand logos.
```

### B. Workflow Illustration — Idea to Prompt Transformation
```text
Create a horizontal editorial illustration that represents a three-step workflow for prompt refinement.
Style: clean product illustration, minimal, sophisticated, semi-realistic.
Subject: three connected cards or surfaces showing a rough idea, a clarification stage, and a polished prompt output.
Composition: left-to-right flow with generous spacing, clear visual rhythm, and room for adjacent copy.
Lighting: soft even lighting with delicate shadows and slight depth.
Color palette: white, soft stone, light gray, black text accents, one muted accent color only.
Mood: structured, calm, efficient, premium.
Requirements: clear sequence of three stages, visual rhythm, no complex symbols, no text-heavy UI.
Avoid: bright gradients, cartoon style, dense UI text, logos, watermarks, crowding, busy infographic styling.
```

### C. Desktop Privacy Visual — Local-First Secret Handling
```text
Create a premium desktop scene illustrating private local software settings.
Style: elegant, minimal, modern macOS-inspired workspace visualization.
Subject: a clean desktop computer setup with a settings panel concept, secure local storage cues, and a subtle sense of privacy.
Composition: centered composition with open negative space for later overlay text, balanced foreground and background.
Lighting: soft white ambient light with gentle contrast and polished reflections.
Color palette: white, light gray, charcoal, subtle metallic accents, no neon.
Mood: secure, calm, professional, trustworthy.
Requirements: local-device feeling, no cloud-first visuals, no exact app UI copy, no readable product text, no exaggerated security symbols.
Avoid: neon lighting, hacker imagery, dark terminal scenes, watermarks, logo marks, clutter.
```

### D. Result Visual — Prompt Output Preview
```text
Create a refined product visual showing prompt optimization results.
Style: editorial, clean, minimal, premium interface-inspired illustration.
Subject: layered cards suggesting an optimized prompt, a negative prompt, and model guidance, presented as a polished document system.
Composition: vertical or slightly angled layout with a clear focal hierarchy and enough negative space for text overlay.
Lighting: soft studio lighting, crisp shadows, high contrast between text areas and background.
Color palette: white, off-white, slate, graphite, subtle accent highlights.
Mood: precise, clear, polished, useful.
Requirements: document-like layout, sense of transformation, no actual copyrighted interface, no heavy decoration, no readable paragraphs.
Avoid: neon gradients, messy text blocks, random symbols, brand logos, watermarks, crowded composition.
```

### E. Secondary Feature Visual — Provider Support
```text
Create a simple premium illustration for a provider support section.
Style: minimal, editorial, tech product visual.
Subject: two or more abstract connection points representing multiple AI providers working through one unified workflow.
Composition: balanced and clean, suitable for a feature card or section side panel, with open space around the center.
Lighting: soft daylight, subtle depth, slightly reflective surfaces.
Color palette: white, gray, black, restrained accent colors.
Mood: flexible, modern, dependable.
Requirements: multi-provider concept, no real provider logos, no detailed UI, no text, no noisy background.
Avoid: neon tech aesthetic, overcomplicated network diagrams, watermarks, crowded background, brand-specific colors.
```

## Recommended Usage by Page Section

- Hero section: use `hero-workspace.webp`
- What-it-does / feature explanation: use `prompt-results.webp`
- Workflow section: use `workflow-steps.webp`
- Desktop/privacy section: use `desktop-privacy.webp`
- Provider callout: use `provider-support.webp`

## Naming Convention
Save assets with descriptive names such as:

- `hero-workspace.webp`
- `workflow-steps.webp`
- `desktop-privacy.webp`
- `prompt-results.webp`
- `provider-support.webp`

## Prompt Revision Rules
When refining prompts:

- Keep one asset per concept.
- If an image is too busy, simplify the composition first.
- If the website feels too empty, add a stronger focal object or clearer structure.
- Preserve the white landing-page aesthetic.
- Keep all generated assets stylistically consistent with one another.
- If a visual is intended for a side panel, keep more negative space in the composition.
- If a visual is intended for a hero, make the focal object larger and leave strong space for the headline.

## Quality Checklist
Before using an asset on the site, confirm:

- It matches the white-themed design system.
- It leaves room for headlines and overlays.
- It looks premium at desktop size.
- It does not rely on readable text.
- It can be reused across multiple sections.
- It feels like part of the same brand family.
